import logging

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from api.submissions.serializers import submission as api_submission
from api.submissions.serializers import last_submission
from api.restplus import api
from models import db, Submission
from sqlalchemy import and_

log = logging.getLogger(__name__)

ns = api.namespace('submissions', description='Operations related to submissions')


@ns.route('/')
class SubmissionCollection(Resource):

    @api.marshal_list_with(api_submission)
    def get(self):
        """
        Returns list of submissions.
        """
        submissions = Submission.query.all()
        return submissions


@ns.route('/<int:id>')
@api.response(404, 'Submission not found.')
class SubmissionItem(Resource):

    @api.marshal_with(api_submission)
    def get(self, id):
        """
        Returns a submission.
        """
        return Submission.query.filter(Submission.id == id).one()
        
@ns.route('/last/<int:student_id>/<int:problem_id>/<int:all_submissions>')
@api.response(404, 'Submission not found.')
class LastSubmissions(Resource):

    @api.marshal_list_with(last_submission)
    def get(self, student_id, problem_id, all_submissions):
        """
        Returns last submissions of a problem by user
        """
        if (all_submissions == 1):
            response = Submission.query.filter(and_(Submission.student_id == student_id, Submission.problem_id == problem_id)).order_by(Submission.id.desc()).all()
        else:
            response = Submission.query.filter(and_(Submission.student_id == student_id, Submission.problem_id == problem_id)).order_by(Submission.id.desc()).limit(3).all()
        
        return response
        
