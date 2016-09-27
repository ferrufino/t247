import logging
import sys

from flask import request
from flask_restplus import Resource
# from rest_api_demo.api.blog.business import create_category, delete_category, update_category
from api.evaluators.serializers import evaluatorProblem
from api.evaluators.serializers import evaluatorSubmission
from api.restplus import api
import api.evaluators.services as services

from models import Problem
from models import Submission

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
        
        # Send job to worker  
        result = services.request_evaluation(data)
        
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
