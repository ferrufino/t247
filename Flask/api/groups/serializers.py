from flask_restplus import fields
from api.restplus import api
from api.courses.serializers import course

group = api.model('Group', {
    'id': fields.Integer(required=True, description='Group id'),
    'period': fields.String(required=True, description='Group period'),
    'professor_id': fields.Integer(required=True, description='Group professor id'),
    'course': fields.Nested(course)
})

group_creation = api.model('Group', {
    'period': fields.String(required=True, description='Group period'),
    'professor_id': fields.Integer(required=True, description='Group professor id'),
    'course_id': fields.Integer(required=True, description='Group course id')
})