from flask_restplus import fields
from api.restplus import api

topic = api.model('Topic', {
    'id': fields.Integer(required=True, description='Topic id'),
    'name': fields.String(required=True, description='Topic name'),
})

topic_creation = api.model('TopicCreation', {
    'name': fields.String(required=True, description='Topic name')
})
