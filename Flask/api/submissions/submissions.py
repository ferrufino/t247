import logging

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from api.submissions.serializers import (submission as api_submission, submission_creation)
from api.restplus import api
from models import db, Submission

log = logging.getLogger(__name__)

ns = api.namespace('submissions', description='Operations related to submissions')


@ns.route('/')
class SubmissionCollection(Resource):

    @api.marshal_list_with(api_course)
    def get(self):
        """
        Returns list of submissions.
        """
        submissions = Submission.query.all()
        return submissions


@ns.route('/create')
class SubmissionCreation(Resource):
    @api.response(201, 'Submission succesfully created')
    @api.expect(course_creation)
    def post(self):
        """
        Creates submission
        """
        # TODO: Stores submission in database and then sends it to evaluator
        pass


@ns.route('/<int:id>')
@api.response(404, 'Submission not found.')
class SubmissionItem(Resource):

    @api.marshal_with(api_course)
    def get(self, id):
        """
        Returns a submission.
        """
        return Submission.query.filter(Submission.id == id).one()
