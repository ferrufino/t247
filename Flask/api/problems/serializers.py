from flask_restplus import fields
from api.restplus import api
from api.users.serializers import user

test_case = api.model('Case', {
    'id': fields.Integer(required=True, description='Test case id'),
    'time_limit': fields.Integer(required=True,
                                 description='Test case time limit'),
    'memory_limit': fields.Integer(required=True,
                                  description='Test Case memory limit'),
    'feedback': fields.String(required=True, description='Test case feedback')
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
    'cases': fields.List(fields.Nested(test_case))
  })

problem_table = api.model('Problem', {
    'id': fields.Integer(required=True, description='Problem id'),
    'name': fields.String(required=True, description='Problem name'),
    'difficulty': fields.Integer(required=True, description='Problem difficulty'),
    'active': fields.Boolean(required=True, description='Problem active')
  })