import logging

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from api.courses.serializers import (course as api_course, course_creation)
from api.restplus import api
from models import db, Course
from authorization import auth_required

log = logging.getLogger(__name__)

ns = api.namespace('courses', description='Operations related to courses')


@ns.route('/')
@api.header('Authorization', 'Auth token', required=True)
class CourseCollection(Resource):

    @api.marshal_list_with(api_course)
    @auth_required('professor')
    def get(self):
        """
        Returns list of courses.
        """
        courses = Course.query.order_by(Course.name).all()
        return courses


@ns.route('/create')
@api.header('Authorization', 'Auth token', required=True)
class CourseCreation(Resource):
    @api.response(201, 'User succesfully created')
    @api.expect(course_creation)
    @auth_required('admin')
    def post(self):
        """
        Creates course
        """
        name = request.json.get('name')
        new_course = Course(name=name)
        db.session.add(new_course)
        db.session.commit()
        return {'id': new_course.id, 'name': new_course.name}, 201


@ns.route('/<int:id>')
@api.response(404, 'Group not found.')
@api.header('Authorization', 'Auth token', required=True)
class CourseItem(Resource):

    @api.marshal_with(api_course)
    @auth_required('professor')
    def get(self, id):
        """
        Returns a course.
        """
        return Course.query.filter(Course.id == id).one()

    @api.expect(course_creation)
    @api.response(204, 'Group successfully updated.')
    @auth_required('admin')
    def put(self, id):
        """
        Updates a course.
        """
        data = request.json
        Course.query.filter(Course.id == id).update(data)
        db.session.commit()
        return None, 204

    @api.response(204, 'Group successfully deleted.')
    @auth_required('admin')
    def delete(self, id):
        """
        Deletes a user.
        """
        course = Course.query.filter(Course.id == id).one()
        db.session.delete(course)
        db.session.commit()
        return None, 204
