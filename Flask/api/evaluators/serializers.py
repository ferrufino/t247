from flask_restplus import fields
from api.restplus import api
#submission
#create a problem
evaluatorSubmission = api.model('Submission', {
    'submission_id': fields.Integer(readOnly=True, description='The unique identifier of Problem Submission'),
    'angular_id': fields.Integer(required=True, description='Id used for maintaining communication with frontend'),
    'status': fields.String(required=True, description='Status of the Problem - Compilation error or Compiled successfully'),
    'test_cases': fields.Raw(required=True, description='Test Cases')
})

evaluatorProblem = api.model('Problem', {
    'temporary_problem_id': fields.Integer(readOnly=True, description='The unique identifier of a blog post'),
    'angular_id': fields.Integer(required=True, description='Article title'),
    'status': fields.String(required=True, description='Article content'),
    'test_cases': fields.Raw(required=True, description='Test Cases')
})
