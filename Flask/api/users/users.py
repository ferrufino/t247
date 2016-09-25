import logging

from flask import request
from flask_restplus import Resource
# from rest_api_demo.api.blog.business import create_category, delete_category, update_category
from api.users.serializers import user
from api.restplus import api
from models import User

log = logging.getLogger(__name__)

ns = api.namespace('users', description='Operations related to users')


@ns.route('/')
class UserCollection(Resource):

    @api.marshal_list_with(user)
    def get(self):
        """
        Returns list of blog categories.
        """
        users = User.query.all()
        return users

    @api.response(201, 'Category successfully created.')
    @api.expect(user)
    def post(self):
        """
        Creates a new blog category.
        """
        data = request.json
        create_category(data)
        return None, 201
