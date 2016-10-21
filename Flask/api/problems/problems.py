import logging

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from api.problems.serializers import problem as api_problem
from api.restplus import api
from models import db, Problem

log = logging.getLogger(__name__)

ns = api.namespace('problems', description='Operations related to problems')


@ns.route('/')
class ProblemCollection(Resource):

    @api.marshal_list_with(api_problem)
    def get(self):
        """
        Returns list of problems.
        """
        problems = Problem.query.all()
        return problems


@ns.route('/<int:id>')
@api.response(404, 'Problem not found.')
class ProblemItem(Resource):

    @api.marshal_with(api_problem)
    def get(self, id):
        """
        Returns a problem.
        """
        return Problem.query.filter(Problem.id == id).one()
