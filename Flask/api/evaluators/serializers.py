from flask_restplus import fields
from api.restplus import api
#submission
#create a problem
evaluatorSubmission = api.model('Submission', {
    'request_type': fields.String(required=True, description='Evaluation type, must be \'submission\' in this case'),
    'submission_id': fields.Integer(required=True, description='The unique identifier of Problem Submission'),
    'problem_id': fields.Integer(required=True, description='The unique identifier of the Problem'),
    'code': fields.String(required=True, description='Student\'s code to be executed'),
    'language': fields.String(required=True, description='Language of the code to be executed'),
    'time_limit': fields.Integer(required=True, description='Number of seconds before TLE'),
    'memory_limit': fields.Integer(required=True, description='Number of KBs before MLE')
})

evaluatorProblem = api.model('Problem', {
    'request_type': fields.String(required=True, description='Evaluation type, must be \'upload\' in this case'),
    'code': fields.String(required=True, description='Student\'s code to be executed'),
    'language': fields.String(required=True, description='Language of the code to be executed'),
    'time_limit': fields.Integer(required=True, description='Number of seconds before TLE'),
    'memory_limit': fields.Integer(required=True, description='Number of KBs before MLE'),
    'test_cases': fields.List(cls_or_instance=fields.String, required=True, description='Array of strings containing the test cases\' input')
})
