from flask_restplus import fields
from api.restplus import api
from api.problems.serializers import problem
from api.groups.serializers import group

assignment = api.model('Assignment', {
    'id': fields.Integer(required=True, description='Assignment id'),
    'title': fields.String(required=True, description='Assignment title'),
    'start_date': fields.DateTime(required=True, description='Assignment start date'),
    'due_date': fields.DateTime(required=True, description='Assignment due date'),
    'problem': fields.Nested(problem)
})

assignment_with_group = api.model('Assignment', {
    'id': fields.Integer(required=True, description='Assignment id'),
    'title': fields.String(required=True, description='Assignment title'),
    'start_date': fields.DateTime(required=True, description='Assignment start date'),
    'due_date': fields.DateTime(required=True, description='Assignment due date'),
    'group': fields.Nested(group),
    'problem': fields.Nested(problem)
})

assignment_creation = api.model('AssignmentCreation', {
    'title': fields.String(required=True, description='Assignment title'),
    'start_date': fields.DateTime(required=True, description='Assignment start date'),
    'due_date': fields.DateTime(required=True, description='Assignment due date'),
    'group_id': fields.Integer(required=True, description='Id of the group where the assignment is due'),
    'problem_id': fields.Integer(required=True, description='Id of the assigned problem')
})