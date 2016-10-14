import logging

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from api.groups.serializers import group as api_group, group_creation
from api.restplus import api
from models import db, Group

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
    @api.response(201, 'User succesfully created')
    @api.expect(group_creation)
    def post(self):
        """
        Creates group
        """
        period = request.json.get('period')
        professor_id = request.json.get('professor_id')
        course_id = request.json.get('course_id')

        new_group = Group(period=period, professor_id=professor_id,
                          course_id=course_id)

        db.session.add(new_group)
        db.session.commit()
        return {'id': new_group.id, 'period': new_group.period}, 201


@ns.route('/<int:id>')
@api.response(404, 'Group not found.')
class UserItem(Resource):

    @api.marshal_with(api_group)
    def get(self, id):
        """
        Returns a group.
        """
        return Group.query.filter(Group.id == id).one()

    @api.expect(group_creation)
    @api.response(204, 'Group successfully updated.')
    def put(self, id):
        """
        Updates a user.
        Use this method to edit a user.
        """
        data = request.json
        Group.query.filter(Group.id == id).update(data)
        db.session.commit()
        return None, 204

    @api.response(204, 'Group successfully deleted.')
    def delete(self, id):
        """
        Deletes a user.
        """
        group = Group.query.filter(Group.id == id).one()
        db.session.delete(group)
        db.session.commit()
        return None, 204
