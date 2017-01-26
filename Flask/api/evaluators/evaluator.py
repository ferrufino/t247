import logging
import sys

import gevent.monkey

from flask import request
from flask_restplus import Resource
from api.evaluators.serializers import (evaluator_submission,
                                        problem_evaluation, problem_creation,
                                        evaluator_result, problem_submission)
from api.restplus import api
import api.evaluators.services as services

from models import db, Problem, Case, Submission, Student, User, ProblemTopic
from sqlalchemy import and_

from enums import SubmissionState, SubmissionResult
from authorization import auth_required

gevent.monkey.patch_all()

log = logging.getLogger(__name__)

nse = api.namespace('evaluator', description='Operations related to Evaluator')

# Route for problem evaluation, which returns the test cases' output
# of a problem to be created
@nse.route('/problem_evaluation')
@api.header('Authorization', 'Auth token', required=True)
class EvaluatorProblemEvaluation(Resource):
    @api.response(201, 'Problem successfully evaluated.')
    @api.expect(problem_evaluation)
    @auth_required('professor')
    def post(self):
        """
        Returns evaluation results of problem to be created
        """
        data = request.json

        # Verify that problem name is unique
        name = data.get('name')
        if Problem.query.filter_by(name=name).first() is not None:
            return {'error': 'A problem with that name already exists'}, 400

        # Evaluate test cases in worker, and synchronously retrieve results
        result = services.request_evaluation(data)
        return result

# Route for problem creation, which uploads a problem to DB and
# creates the input/output files in the server's filesystem
@nse.route('/problem_creation')
@api.header('Authorization', 'Auth token', required=True)
class EvaluatorProblemCreation(Resource):
    @api.response(201, 'Problem successfully created.')
    @api.expect(problem_creation)
    @auth_required('professor')
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
        template = data.get('template')
        signature = data.get('signature')
        test_cases = data['test_cases']
        topic_id = data['topic_id']

        new_problem = Problem(name=problem_name,
                              author_id=author_id,
                              difficulty=difficulty, active=True,
                              language=language, code=code, template=template, signature=signature,
                              description_english=description_english,
                              description_spanish=description_spanish,
                              time_limit=time_limit, memory_limit=memory_limit,)
        db.session.add(new_problem)
        db.session.commit()
        problem_id = new_problem.id

        # Create problem-topic entry
        new_problemtopic = ProblemTopic(problem_id=problem_id,
                                        topic_id=topic_id)
        db.session.add(new_problemtopic)
        db.session.commit()
        
        # Create test cases
        for i in range(len(test_cases)):
            new_case = Case(is_sample=test_cases[i]['is_sample'],
                            input=test_cases[i]['input'],
                            feedback=test_cases[i]['feedback'],
                            output=test_cases[i]['output'],
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
@api.header('Authorization', 'Auth token', required=True)
class EvaluatorAttemptSubmission(Resource):
    @api.response(202, 'Attempt succesfully submitted.')
    @api.marshal_with(problem_submission)
    @api.expect(evaluator_submission)
    @auth_required('student')
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
        user_id = data.get('user_id')

        # Get no. of last attempt
        result = db.engine.execute("""
            SELECT no_of_attempt
            FROM submission
            WHERE user_id = %d AND problem_id = %d
            ORDER BY created
            DESC
            LIMIT 1;
            """ % (user_id, problem_id)).fetchone()

        if (result is None):
            no_of_attempt = 1
        else:
            no_of_attempt = result['no_of_attempt'] + 1

        new_submission = Submission(code=code, language=language,
                                    problem_id=problem_id,
                                    user_id=user_id,
                                    state=SubmissionState.pending,
                                    no_of_attempt=no_of_attempt)
        db.session.add(new_submission)
        db.session.commit()
        submission_id = new_submission.id
        #############

        # Evaluate submitted code in a worker
        # (caller won't receive evaluation results after the call, because
        # results will be posted to the DB by a worker after evaluation)
        problem = Problem.query.filter(Problem.id == problem_id).one()
        data['submission_id'] = submission_id
        data['time_limit'] = problem.time_limit
        data['memory_limit'] = problem.memory_limit


        # Query if problem has template
        problem = db.engine.execute("""
            SELECT *
            FROM problem
            WHERE template IS NOT NULL AND id = %d;
            """ % (problem_id)).fetchone()

        # Check if result is not empty and insert student's code in template
        if (problem is not None):
            code = problem["template"]
            function = data["code"]
            code = code.replace("//&function", function + "\n")
            data["code"] = code

        result = services.request_evaluation(data)

        # Return last 3 attempts in response, so that front-end can re-render tabs
        attempts = Submission.query.filter(
                and_(Submission.user_id == user_id, Submission.problem_id == problem_id)).order_by(
                Submission.id.desc()).limit(3).all() 

        result['attempts'] = attempts

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
        
        print("EVALUADO")
        print(data)
        
        #############
        # Update DB #
        submission_id = data.get('submission_id')
        submission = Submission.query.filter(Submission.id == submission_id).one()
        problem = submission.problem

        status = data.get('status')
        grade = 100
        feedback = []
        if status != SubmissionState.evaluated.value:
            grade = 0
        else:
            test_cases = data['test_cases']
            problem_test_cases = problem.cases
            missed_cases = 0
            for i in range(len(test_cases)):
                if test_cases[i] != 'accepted':
                    case = {'status': test_cases[i],
                            'feedback': problem_test_cases[i].feedback}
                    feedback.append(dict(case))
                    missed_cases += 1
            grade -= missed_cases*(100/len(test_cases))

        update_data = {'state': SubmissionState(status), 'grade': grade,
                       'feedback_list': feedback}
                             
        Submission.query.filter(Submission.id == submission_id).update(update_data)
        db.session.commit()
        #############
        
        # Print result  
        print(data)
        
        return data