import logging

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from api.groups.serializers import (group as api_group, group_creation,
                                    group_with_students, group_with_assignments)
from api.restplus import api
from models import db, Group, Student
from authorization import auth_required

log = logging.getLogger(__name__)

ns = api.namespace('groups', description='Operations related to groups')


@ns.route('/')
@api.header('Authorization', 'Auth token', required=True)
class GroupCollection(Resource):

    @api.marshal_list_with(api_group)
    @auth_required('professor')
    def get(self):
        """
        Returns list of groups.
        """
        groups = Group.query.order_by(Group.id).all()
        return groups


@ns.route('/create')
@api.header('Authorization', 'Auth token', required=True)
class GroupCreation(Resource):
    @api.response(201, 'Group succesfully created')
    @api.expect(group_creation)
    @api.marshal_with(group_with_students)
    @auth_required('professor')
    def post(self):
        """
        Creates group
        """
        data = request.json
        period = data.get('period')
        professor_id = data.get('professor_id')
        course_id = data.get('course_id')

        new_group = Group(period=period, professor_id=professor_id,
                          course_id=course_id)

        enrollments = data.get('enrollments')
        new_group = add_enrollments(enrollments, new_group)

        db.session.add(new_group)
        db.session.commit()

        return new_group, 201


@ns.route('/<int:id>')
@api.header('Authorization', 'Auth token', required=True)
@api.response(404, 'Group not found.')
class GroupItem(Resource):

    @api.marshal_with(api_group)
    @auth_required('professor')
    def get(self, id):
        """
        Returns a group.
        """
        return Group.query.filter(Group.id == id).one()

    @api.expect(group_creation)
    @api.response(204, 'Group successfully updated.')
    @api.marshal_with(group_with_students)
    @auth_required('professor')
    def put(self, id):
        """
        Updates a group.
        Use this method to edit a group.
        """
        data = request.json
        Group.query.filter(Group.id == id).update({'period': data.get('period'),
                 'professor_id': data.get('professor_id'),
                 'course_id': data.get('course_id')})
        group = Group.query.filter(Group.id == id).one()
        enrollments = data.get('enrollments')
        group = add_enrollments(enrollments, group)

        db.session.commit()
        return group, 204

    @api.response(204, 'Group successfully deleted.')
    @auth_required('admin')
    def delete(self, id):
        """
        Deletes a group.
        """
        group = Group.query.filter(Group.id == id).one()
        db.session.delete(group)
        db.session.commit()
        return None, 204


def add_enrollments(enrollments, group):
    for i in range(len(enrollments)):
        enrollment = enrollments[i].lower()
        new_student = Student.query.filter_by(enrollment=enrollment).first()
        if not new_student:
            new_student = Student(email=enrollment + '@itesm.mx',
                                  role='student', enrollment=enrollment)
            new_student.hash_password(enrollment)
        group.students.append(new_student)
    return group
