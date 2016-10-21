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
    'user': fields.Nested(user)
  })
