from flask_restplus import fields
from api.restplus import api

group_id = api.model('GroupId', {
    'id': fields.Integer(required=True, description='Group id')
})

group = api.model('Group', {
    'id': fields.Integer(required=True, description='Group id')
    'period': fields.String(required=True, description='Group period'),
    'professor': fields.String(required=True, description='Group professor'),
    'course': fields.String(required=True, description='Group course')
})