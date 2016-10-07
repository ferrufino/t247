import logging
import sys

import gevent.monkey

from flask import request
from flask_restplus import Resource
# from rest_api_demo.api.blog.business import create_category, delete_category, update_category
from api.evaluators.serializers import evaluatorProblem
from api.evaluators.serializers import evaluatorSubmission
from api.evaluators.serializers import evaluatorResult
from api.restplus import api
import api.evaluators.services as services

from models import db, Problem, Case
from models import Submission

gevent.monkey.patch_all()

log = logging.getLogger(__name__)

nse = api.namespace('evaluator', description='Operations related to Evaluator')

@nse.route('/problem_creation')
class EvaluatorProblemCreation(Resource):
    @api.response(201, 'Problem successfully created.')
    @api.expect(evaluatorProblem)
    def post(self):
        """
        Receives Post From Evaluator of Problem Created
        """
        data = request.json
        print(data)
        # Send job to worker  
        result = services.request_evaluation(data)
        # result = {'status': 'compiled successfully',
        #           'test_cases':
        #           [{'status': 'successful run', 'output': '2'}]}
        return result


@nse.route('/problem_upload')
class EvaluatorProblemUpload(Resource):
    @api.response(201, 'Problem successfully uploaded.')
    @api.expect(evaluatorProblem)
    def post(self):
        """
        Receives Post From Evaluator of Problem Created
        """
        data = request.json
        print(data)
        #############
        # Update DB #
        problem_name = data.get('name')
        description = data.get('descriptionEnglish')
        memory_limit = data.get('memoryLimit')
        time_limit = data.get('timeLimit')
        language = data.get('language')
        # difficulty = data.get('difficulty')
        difficulty = 0
        code = data.get('code')
        test_cases = data['testCases']

        new_problem = Problem(name=problem_name,
                              difficulty=difficulty, active=True,
                              language=language, code=code,
                              description=description)
        db.session.add(new_problem)
        db.session.commit()
        problem_id = new_problem.id
        for i in range(len(test_cases)):
            new_case = Case(input=test_cases[i]['content'],
                            time_limit=time_limit, memory_limit=memory_limit,
                            problem_id=problem_id)
            db.session.add(new_case)
            db.session.commit()

        #############

        # problem_id = 56

        json = {}
        json['test_cases'] = data['testCases']
        json['problem_id'] = problem_id
                
        # Send job to worker  
        result = services.upload_problem(json)
        
        return result

@nse.route('/problem_submission')
class EvaluatorAttemptSubmission(Resource):
    @api.response(202, 'Attempt succesfully submitted.')
    @api.expect(evaluatorSubmission)
    def post(self):
        """
        Receives Post as an Attempt succesfully submitted.
        """     
        data = request.json
        
        # Send job to worker  
        result = services.request_evaluation(data)
        
        return result
        
@nse.route('/execution_result')
class EvaluatorExecutionResult(Resource):
    @api.response(202, 'Result successfuly sent.')
    @api.expect(evaluatorResult)
    def post(self):
        """
        Receives Post as an Execution result.
        """     
        data = request.json
        
        print(request)
        
        # Print result  
        print(data)
        
        return data
