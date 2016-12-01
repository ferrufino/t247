from flask_restplus import fields
from api.restplus import api

user_auth = api.model('UserAuth', {
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password')
})

user_token = api.model('UserToken', {
    'token': fields.String(required=True, description='User auth token')
})

user = api.model('User', {
    'id': fields.Integer(required=True, description='User id'),
    'email': fields.String(required=True, description='User email'),
    'first_name': fields.String(required=True, description='User name'),
    'last_name': fields.String(required=True, description='User last name'),
    'role': fields.String(required=True, description='User role'),
    'enrollment': fields.String(required=True, description='User enrollment number')
})

user_creation = api.model('UserCreation', {
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password'),
    'first_name': fields.String(required=True, description='User name'),
    'last_name': fields.String(required=True, description='User last name'),
    'enrollment': fields.String(required=True, description='User enrollment number'),
    'role': fields.String(required=True, description='User role')
})

user_edit = api.model('UserEdit', {
    'password': fields.String(required=True, description='User password'),
    'first_name': fields.String(required=True, description='User name'),
    'last_name': fields.String(required=True, description='User last name'),
    'email': fields.String(required=True, description='User email'),
})
