from flask_restplus import fields
from api.restplus import api
from api.users.serializers import user
from api.topics.serializers import topic

test_case = api.model('Case', {
    'id': fields.Integer(required=True, description='Test case id'),
    'feedback': fields.String(required=True, description='Test case feedback'),
    'input': fields.String(required=True, description='Test case input'),
    'output': fields.String(required=True, description='Test case output'),
    'is_sample': fields.Boolean(required=True, description='Is test case sample?')
  })

problem = api.model('Problem', {
    'id': fields.Integer(required=True, description='Problem id'),
    'name': fields.String(required=True, description='Problem name'),
    'language': fields.String(required=True, description='Problem lang'),
    'code': fields.String(required=True, description='Problem code'),
    'template': fields.String(required=True, description='Problem template'),
    'difficulty': fields.Integer(required=True, description='Problem difficulty'),
    'active': fields.Boolean(required=True, description='Problem active'),
    'author': fields.Nested(user),
    'description_english': fields.String(required=True, description='Problem description in English'),
    'description_spanish': fields.String(required=True, description='Problem description in Spanish'),
    'cases': fields.List(fields.Nested(test_case)),
    'time_limit': fields.Integer(required=True,
                                 description='Test case time limit'),
    'memory_limit': fields.Integer(required=True,
                                  description='Test Case memory limit'),
    'topics': fields.List(fields.Nested(topic))
  })

problem_table = api.model('Problem', {
    'id': fields.Integer(required=True, description='Problem id'),
    'name': fields.String(required=True, description='Problem name'),
    'difficulty': fields.Integer(required=True, description='Problem difficulty'),
    'active': fields.Boolean(required=True, description='Problem active'),
    'topic': fields.String(required=True, description='Topic')
  })

simple_test_case = api.model('Case', {
    'input': fields.String(required=True, description='Test case input'),
    'output': fields.String(required=True, description='Test case output')
  })

problem_description = api.model('Problem', {
    'english': fields.String(required=True, description='Description in English'),
    'spanish': fields.String(required=True, description='Description in Spanish'),
    'title': fields.String(required=True, description='Problem title'),
    'test_cases': fields.List(fields.Nested(simple_test_case))
  })