from flask_restplus import fields
from api.restplus import api

group = api.model('Group', {
    'id': fields.Integer(required=True, description='Group id'),
    'period': fields.String(required=True, description='Group period'),
    'professor_id': fields.Integer(required=True, description='Group professor id'),
    'course_id': fields.Integer(required=True, description='Group course id')
})

group_creation = api.model('Group', {
    'period': fields.String(required=True, description='Group period'),
    'professor_id': fields.Integer(required=True, description='Group professor id'),
    'course_id': fields.Integer(required=True, description='Group course id')
})