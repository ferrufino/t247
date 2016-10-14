from flask_restplus import fields
from api.restplus import api

course = api.model('Course', {
    'id': fields.Integer(required=True, description='Course id'),
    'name': fields.String(required=True, description='Course name'),
})

course_creation = api.model('CourseCreation', {
    'name': fields.String(required=True, description='Course period')
})
