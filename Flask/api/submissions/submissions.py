import logging

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from api.submissions.serializers import submission as api_submission
from api.submissions.serializers import last_submission
from api.submissions.serializers import submission_to_a_problem
from api.restplus import api
from models import db, Submission, Problem
from sqlalchemy import and_
from authorization import auth_required

log = logging.getLogger(__name__)

ns = api.namespace('submissions', description='Operations related to submissions')


@ns.route('/')
@api.header('Authorization', 'Auth token', required=True)
class SubmissionCollection(Resource):
    @api.marshal_list_with(api_submission)
    @auth_required('student')
    def get(self):
        """
        Returns list of submissions.
        """
        submissions = Submission.query.all()
        return submissions


@ns.route('/<int:id>')
@api.header('Authorization', 'Auth token', required=True)
@api.response(404, 'Submission not found.')
class SubmissionItem(Resource):
    @api.marshal_with(api_submission)
    @auth_required('student')
    def get(self, id):
        """
        Returns a submission.
        """
        result = Submission.query.filter(Submission.id == id).one()
        print("result from query: "+result);
        return Submission.query.filter(Submission.id == id).one()


@ns.route('/last/<int:student_id>/<int:problem_id>/<int:all_submissions>')
@api.header('Authorization', 'Auth token', required=True)
@api.response(404, 'Submission not found.')
class LastSubmissions(Resource):
    @api.marshal_list_with(last_submission)
    @auth_required('student')
    def get(self, student_id, problem_id, all_submissions):
        """
        Returns last submissions of a problem by user
        """
        if (all_submissions == 1):
            response = Submission.query.filter(
                and_(Submission.user_id == student_id, Submission.problem_id == problem_id)).order_by(
                Submission.id.desc()).all()
        else:
            response = Submission.query.filter(
                and_(Submission.user_id == student_id, Submission.problem_id == problem_id)).order_by(
                Submission.id.desc()).limit(3).all()

        return response


@ns.route('/attempts/bystudent/<int:student_id>/')
@api.header('Authorization', 'Auth token', required=True)
@api.response(404, 'Submission not found.')
class SubmissionAttempts(Resource):
    @api.marshal_list_with(submission_to_a_problem)
    @auth_required('student')
    def get(self, student_id):
        """
         Returns number of attempts and status of a submission
        """
        result = db.engine.execute("SELECT p.name, COUNT(p.name) as no_of_attempts, MAX(s.grade) as max_grade FROM Problem p, Submission s, \"user\" u WHERE p.id = s.problem_id AND s.user_id = u.id AND u.id = %d GROUP BY p.name;" % (student_id)).fetchall()

        return result
