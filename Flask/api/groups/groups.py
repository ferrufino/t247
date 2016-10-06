import logging

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from api.groups.serializers import group as api_group, group_id
from api.restplus import api
from models import db, Group

log = logging.getLogger(__name__)

ns = api.namespace('groups', description='Operations related to groups')


@ns.route('/')
class GroupCollection(Resource):

    @api.marshal_list_with(api_group)
    def get(self):
        """
        Returns list of users.
        """
        groups = Group.query.all()
        return groups


@ns.route('/create')
class GroupCreation(Resource):
    @api.response(201, 'User succesfully created')
    @api.expect(api_group)
    def post(self):
        """
        Creates group
        """
        # email = request.json.get('email')
        # password = request.json.get('password')

        # if email is None or password is None:
        #     abort(400)  # missing arguments
        # if User.query.filter_by(email=email).first() is not None:
        #     abort(400)  # existing user

        # new_user = User(email=email, role='admin')
        # new_user.hash_password(password)
        # db.session.add(new_user)
        # db.session.commit()
        # return {'email': new_user.email}, 201


@ns.route('/<int:id>')
@api.response(404, 'Group not found.')
class UserItem(Resource):

    @api.marshal_with(api_group)
    def get(self, id):
        """
        Returns a group.
        """
        return Group.query.filter(Group.id == id).one()

    @api.expect(api_group)
    @api.response(204, 'Group successfully updated.')
    def put(self, id):
        """
        Updates a user.
        Use this method to edit a user.
        """
        # data = request.json
        # User.query.filter(User.id == id).update(data)
        # db.session.commit()
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
