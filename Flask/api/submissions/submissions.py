import logging

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from api.submissions.serializers import submission as api_submission
from api.submissions.serializers import last_submission
from api.submission.serializers import submission_to_a_problem
from api.restplus import api
from models import db, Submission, Problem
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
            response = Submission.query.filter(
                and_(Submission.student_id == student_id, Submission.problem_id == problem_id)).order_by(
                Submission.id.desc()).all()
        else:
            response = Submission.query.filter(
                and_(Submission.student_id == student_id, Submission.problem_id == problem_id)).order_by(
                Submission.id.desc()).limit(3).all()

        return response


@ns.route('/attempts/<int:student_id>/<int:problem_id>/')
@api.response(404, 'Submission not found.')
class SubmissionAttempts(Resource):
    @api.marshal_list_with(submission_to_a_problem)
    def get(self, student_id, problem_id):
        """
         Returns number of attempts and status of a submission
        """
        result = db.engine.execute("SELECT p.name, COUNT(p.name) as no_of_attempts, MAX(s.grade) as max_grade FROM Problem p, Submission s, \"user\" u WHERE p.id = s.problem_id AND s.student_id = u.id AND u.id = %d GROUP BY p.name;" % (student_id))

        return result
