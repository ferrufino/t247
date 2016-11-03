from flask_restplus import fields
from api.restplus import api
#submission
#create a problem
evaluator_submission = api.model('SubmissionCreation', {
    'request_type': fields.String(required=True,description='Evaluation type, must be \'submission\' in this case'),
    'problem_id': fields.Integer(required=True, description='The unique identifier of the Problem'),
    'code': fields.String(required=True, description='Student\'s code to be executed'),
    'language': fields.String(required=True, description='Language of the code to be executed'),
    'user_id': fields.Integer(required=True, description='Id of the submitting user')
})

problem_evaluation = api.model('ProblemEvalution', {
    'name': fields.String(required=True, description='Problem name, required to verify uniqueness'),
    'request_type': fields.String(required=True, description='Evaluation type, must be \'upload\' in this case'),
    'code': fields.String(required=True, description='Student\'s code to be executed'),
    'language': fields.String(required=True, description='Language of the code to be executed'),
    'time_limit': fields.Integer(required=True, description='Number of seconds before TLE'),
    'memory_limit': fields.Integer(required=True, description='Number of KBs before MLE'),
    'test_cases': fields.List(cls_or_instance=fields.String, required=True, description='Array of strings containing the test cases\' input')
})

case_creation = api.model('CaseCreation', {
    'input': fields.String(required=True, description='Test case input'),
    'feedback': fields.String(required=True, description='Test case feedback'),
    'output': fields.String(required=True, description='Test case expected output')
  })

problem_creation = api.model('ProblemCreation', {
    'author_id': fields.Integer(required=True, description='Id of the submitting user'),
    'name': fields.String(required=True, description='Problem name'),
    'description_english': fields.String(required=True, description='Problem description in English'),
    'description_spanish': fields.String(required=True, description='Problem description in Spanish'),
    'code': fields.String(required=True, description='Student\'s code to be executed'),
    'language': fields.String(required=True, description='Language of the code to be executed'),
    'difficulty': fields.Integer(required=True, description='Problem difficulty'),
    'time_limit': fields.Integer(required=True, description='Number of seconds before TLE'),
    'memory_limit': fields.Integer(required=True, description='Number of KBs before MLE'),
    'topic_id': fields.Integer(required=True, description='Problem\'s topic'),
    'type': fields.String(required=True, description='Problem type'),
    'test_cases': fields.List(fields.Nested(case_creation), required=True, description='Array of strings containing the test cases\' input')
})

evaluator_result = api.model('Result', {
    'status': fields.String(required=True, description='Compilation status'),
    'test_cases': fields.List(cls_or_instance=fields.String, required=True, description='Array of strings containing the test cases\' results')
})
