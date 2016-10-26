import logging

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from api.groups.serializers import (group as api_group, group_creation,
                                    group_with_students, group_with_assignments)
from api.restplus import api
from models import db, Group, Student

log = logging.getLogger(__name__)

ns = api.namespace('groups', description='Operations related to groups')


@ns.route('/')
class GroupCollection(Resource):

    @api.marshal_list_with(api_group)
    def get(self):
        """
        Returns list of groups.
        """
        groups = Group.query.all()
        return groups


@ns.route('/create')
class GroupCreation(Resource):
    @api.response(201, 'Group succesfully created')
    @api.expect(group_creation)
    @api.marshal_list_with(group_with_students)
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
        for i in range(len(enrollments)):
            enrollment = enrollments[i].lower()
            new_student = Student.query.filter_by(enrollment=enrollment).first()
            if not new_student:
                new_student = Student(email=enrollment + '@itesm.mx',
                                      role='student', enrollment=enrollment)
                new_student.hash_password(enrollment)
            new_group.students.append(new_student)

        db.session.add(new_group)
        db.session.commit()

        return new_group, 201


@ns.route('/<int:id>')
@api.response(404, 'Group not found.')
class GroupItem(Resource):

    @api.marshal_with(group_with_students)
    def get(self, id):
        """
        Returns a group.
        """
        return Group.query.filter(Group.id == id).one()

    @api.expect(group_creation)
    @api.response(204, 'Group successfully updated.')
    def put(self, id):
        """
        Updates a group.
        Use this method to edit a group.
        """
        data = request.json
        Group.query.filter(Group.id == id).update(data)
        db.session.commit()
        return None, 204

    @api.response(204, 'Group successfully deleted.')
    def delete(self, id):
        """
        Deletes a group.
        """
        group = Group.query.filter(Group.id == id).one()
        db.session.delete(group)
        db.session.commit()
        return None, 204
