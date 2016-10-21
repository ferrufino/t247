import logging
import sys

import gevent.monkey

from flask import request
from flask_restplus import Resource
from api.evaluators.serializers import evaluatorProblem
from api.evaluators.serializers import evaluatorSubmission
from api.evaluators.serializers import evaluatorResult
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
    @api.expect(evaluatorProblem)
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
    @api.expect(evaluatorProblem)
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
        description = data.get('description_english')
        memory_limit = data.get('memory_limit')
        time_limit = data.get('time_limit')
        language = data.get('language')
        # difficulty = data.get('difficulty')
        difficulty = 0
        code = data.get('code')
        test_cases = data['test_cases']

        new_problem = Problem(name=problem_name,
                              difficulty=difficulty, active=True,
                              language=language, code=code,
                              description=description)
        db.session.add(new_problem)
        db.session.commit()
        problem_id = new_problem.id
        
        # Create test cases
        for i in range(len(test_cases)):
            new_case = Case(input=test_cases[i]['content'],
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
    @api.expect(evaluatorSubmission)
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
        result = services.request_evaluation(data)

        return result

# Route for updating the submission status after evaluation
@nse.route('/problem_submission_result')
class EvaluatorProblemSubmissionResult(Resource):
    @api.response(202, 'Attempt succesfully evaluated.')
    @api.expect(evaluatorResult)
    def post(self):
        """
        Updates problem submission
        """
        data = request.json

        #############
        # Update DB #
        submission_id = data.get('submission_id')
        status = data.get('status')
        if status == 'error':
            result = 'execution_error'
        else:
            result = 'accepted'

        print(result)
        #############
        
        # Print result  
        print(data)
        
        return data
