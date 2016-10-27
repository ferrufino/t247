from flask_restplus import fields
from api.restplus import api

language = api.model('Language', {
    'id': fields.Integer(required=True, description='Language id'),
    'name': fields.String(required=True, description='Language Name'),
    'value': fields.String(required=True, description='Internal value used to identify language'),
    'extension': fields.String(required=True, description='Language filename extension')
})

language_creation = api.model('LanguageCreation', {
    'name': fields.String(required=True, description='Language name'),
    'value': fields.String(required=True, description='Internal value used to identify language'),
    'extension': fields.String(required=True, description='Language filename extension')
})
