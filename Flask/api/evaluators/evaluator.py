import logging
import sys

import gevent.monkey

from flask import request
from flask_restplus import Resource
from api.evaluators.serializers import (evaluator_submission,
                                        problem_evaluation, problem_creation,
                                        evaluator_result)
from api.restplus import api
import api.evaluators.services as services

from models import db, Problem, Case, Submission
from enums import SubmissionState, SubmissionResult

gevent.monkey.patch_all()

log = logging.getLogger(__name__)

nse = api.namespace('evaluator', description='Operations related to Evaluator')

# Route for problem evaluation, which returns the test cases' output
# of a problem to be created
@nse.route('/problem_evaluation')
class EvaluatorProblemEvaluation(Resource):
    @api.response(201, 'Problem successfully evaluated.')
    @api.expect(problem_evaluation)
    def post(self):
        """
        Returns evaluation results of problem to be created
        """
        data = request.json
        # Evaluate test cases in worker, and synchronously retrieve results
        result = services.request_evaluation(data)
        return result

# Route for problem creation, which uploads a problem to DB and
# creates the input/output files in the server's filesystem
@nse.route('/problem_creation')
class EvaluatorProblemCreation(Resource):
    @api.response(201, 'Problem successfully created.')
    @api.expect(problem_creation)
    def post(self):
        """
        Creates a problem
        """
        data = request.json
        
        #############
        # Update DB #
        #############
        
        # Create problem
        problem_name = data.get('name')
        description_english = data.get('description_english')
        description_spanish = data.get('description_spanish')
        memory_limit = data.get('memory_limit')
        time_limit = data.get('time_limit')
        language = data.get('language')
        author_id = data.get('author_id')
        difficulty = data.get('difficulty')
        code = data.get('code')
        test_cases = data['test_cases']

        new_problem = Problem(name=problem_name,
                              difficulty=difficulty, active=True,
                              language=language, code=code,
                              description_english=description_english,
                              description_spanish=description_spanish,
                              author_id=author_id)
        db.session.add(new_problem)
        db.session.commit()
        problem_id = new_problem.id
        
        # Create test cases
        for i in range(len(test_cases)):
            new_case = Case(input=test_cases[i]['content'],
                            feedback=test_cases[i]['feedback'],
                            output=test_cases[i]['output'],
                            time_limit=time_limit, memory_limit=memory_limit,
                            problem_id=problem_id)
            db.session.add(new_case)
            db.session.commit()

        # Add input and output files to filesystem
        json = {}
        json['test_cases'] = data['test_cases']
        json['problem_id'] = problem_id
         
        result = services.upload_problem(json)
        
        return result

# Route for submitting student code to the Evaluator
@nse.route('/problem_submission')
class EvaluatorAttemptSubmission(Resource):
    @api.response(202, 'Attempt succesfully submitted.')
    @api.expect(evaluator_submission)
    def post(self):
        """
        Puts student submitted code in an Evaluation queue
        """
        data = request.json

        #############
        # Update DB #
        code = data.get('code')
        language = data.get('language')
        problem_id = data.get('problem_id')
        student_id = data.get('user_id')
        new_submission = Submission(code=code, language=language,
                                    problem_id=problem_id,
                                    student_id=student_id,
                                    state=SubmissionState.pending)
        db.session.add(new_submission)
        db.session.commit()
        submission_id = new_submission.id
        #############

        # Evaluate submitted code in a worker
        # (caller won't receive evaluation results after the call, because
        # results will be posted to the DB by a worker after evaluation)
        data['submission_id'] = submission_id
        print(data)
        result = services.request_evaluation(data)

        return result

# Route for updating the submission status after evaluation
@nse.route('/problem_submission_result')
class EvaluatorProblemSubmissionResult(Resource):
    @api.response(202, 'Attempt succesfully evaluated.')
    @api.expect(evaluator_result)
    def post(self):
        """
        Updates problem submission
        """
        data = request.json

        #############
        # Update DB #
        submission_id = data.get('submission_id')
        submission = Submission.query.filter(Submission.id == submission_id).one()
        problem = submission.problem

        status = data.get('status')
        grade = 100
        feedback = []
        if status == 'error':
            grade = 0
        else:
            test_cases = data['test_cases']
            problem_test_cases = problem.cases
            missed_cases = 0
            for i in range(len(test_cases)):
                if test_cases[i] != 'accepted':
                    print(test_cases[i])
                    case = {'status': test_cases[i],
                            'feedback': problem_test_cases[i].feedback}
                    feedback.append(dict(case))
                    missed_cases += 1
            grade -= missed_cases*(100/len(test_cases))

        update_data = {'state': SubmissionState.evaluated, 'grade': grade,
                       'feedback_list': feedback}
        Submission.query.filter(Submission.id == submission_id).update(update_data)
        db.session.commit()
        #############
        
        # Print result  
        print(data)
        
        return data
