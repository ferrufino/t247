import logging

from flask import request
from flask_restplus import Resource
# from rest_api_demo.api.blog.business import create_category, delete_category, update_category
from api.evaluators.serializers import evaluatorProblem
from api.evaluators.serializers import evaluatorSubmission
from api.restplus import api

from models import Problem
from models import Submission

log = logging.getLogger(__name__)

nse = api.namespace('evaluator', description='Operations related to Evaluator')


@nse.route('/')
class EvaluatorProblemCreation(Resource):
    @api.response(201, 'Problem successfully created.')
    @api.expect(evaluatorProblem)
    def post(self):
        """
        Receives Post From Evaluator of Problem Created
        """
        data = request.json
        st = data.get('status')
        return None, 201

@nse.route('/<int:id>')
class EvaluatorAttemptSubmission(Resource):
    @api.response(202, 'Attempt succesfully submitted.')
    @api.expect(evaluatorSubmission)
    def post(self):
        """
        Receives Post as an Attempt succesfully submitted.
        """
        data = request.json
        st = data.get('status')
        return None, 202
