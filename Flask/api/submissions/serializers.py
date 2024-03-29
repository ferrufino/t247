from flask_restplus import fields
from api.restplus import api
from api.problems.serializers import problem
from api.users.serializers import user

submission_feedback = api.model('SubmissionFeedback', {
    'status': fields.String(required=True, description='Feedback status'),
    'feedback': fields.String(required=True, description='Feedback')
  })

submission = api.model('Submission', {
    'id': fields.Integer(required=True, description='Submission id'),
    'language': fields.String(required=True, description='Submission lang'),
    'code': fields.String(required=True, description='Submission code'),
    'grade': fields.String(required=True, description='Submission grade'),
    'feedback_list': fields.List(fields.Nested(submission_feedback)),
    'problem': fields.Nested(problem),
    'created': fields.DateTime(required=True, description='Date of last submission'),
    'user': fields.Nested(user),
    'no_of_attempt': fields.Integer(required=True, description='Number of attempt')
  })

simple_submission = api.model('SimpleSubmission', {
    'id': fields.Integer(required=True, description='Submission id'),
    'language': fields.String(required=True, description='Submission lang'),
    'code': fields.String(required=True, description='Submission code'),
    'grade': fields.String(required=True, description='Submission grade'),
    'feedback_list': fields.List(fields.Nested(submission_feedback)),
    'student_id': fields.Integer(required=True, description='Id of the submitting user'),
    'created': fields.DateTime(required=True, description='Date of last submission'),
    'user': fields.Nested(user),
    'no_of_attempt': fields.Integer(required=True, description='Number of attempt')
  })

last_submission = api.model('LastSubmission', {
    'id': fields.Integer(required=True, description='Submission id'),
    'language': fields.String(required=True, description='Submission lang'),
    'code': fields.String(required=True, description='Submission code'),
    'grade': fields.String(required=True, description='Submission grade'),
    'state': fields.String(required=True, description='Submission state'),
    'feedback_list': fields.List(fields.Nested(submission_feedback)),
    'no_of_attempt': fields.Integer(required=True, description='Number of attempt')
  })

submission_to_a_problem = api.model('SubmissionToAProblem', {
    'name': fields.String(required=True, description='Name of Problem'),
    'no_of_attempts': fields.Integer(required=True, description='Number of Attempts to a Problem'),
    'max_grade': fields.Integer(required=True, description='Maximum Grade')
})