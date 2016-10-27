from flask_restplus import fields
from api.restplus import api
from api.courses.serializers import course
from api.users.serializers import user
from api.assignments.serializers import assignment

group = api.model('Group', {
    'id': fields.Integer(required=True, description='Group id'),
    'period': fields.String(required=True, description='Group period'),
    'professor_id': fields.Integer(required=True, description='Group professor id'),
    'course': fields.Nested(course)
})

group_with_students = api.model('GroupWithStudents', {
    'id': fields.Integer(required=True, description='Group id'),
    'period': fields.String(required=True, description='Group period'),
    'professor_id': fields.Integer(required=True, description='Group professor id'),
    'course': fields.Nested(course),
    'students': fields.List(fields.Nested(user))
})

group_with_assignments = api.model('GroupWithAssignments', {
    'id': fields.Integer(required=True, description='Group id'),
    'period': fields.String(required=True, description='Group period'),
    'professor_id': fields.Integer(required=True, description='Group professor id'),
    'course': fields.Nested(course),
    'assignments': fields.Nested(assignment)
})

group_creation = api.model('GroupCreation', {
    'period': fields.String(required=True, description='Group period'),
    'professor_id': fields.Integer(required=True, description='Group professor id'),
    'course_id': fields.Integer(required=True, description='Group course id'),
    'enrollments': fields.List(
        fields.String(required=True, description='Student id'))
})
