import logging

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from flask_security import auth_token_required, utils
from flask.ext.httpauth import HTTPBasicAuth
from api.users.serializers import user as api_user
from api.restplus import api
from models import db, User

log = logging.getLogger(__name__)

auth = HTTPBasicAuth()

ns = api.namespace('users', description='Operations related to users')


@ns.route('/')
class UserCollection(Resource):

    @api.marshal_list_with(api_user)
    def get(self):
        """
        Returns list of blog categories.
        """
        users = User.query.all()
        return users

    # @api.response(201, 'Category successfully created.')
    # @api.expect(user)
    # def post(self):
    #     """
    #     Creates a new blog category.
    #     """
    #     data = request.json
    #     create_category(data)
    #     return None, 201


@ns.route('/create')
class UserCreation(Resource):
    @api.response(201, 'User succesfully created')
    @api.expect(api_user)
    def post(self):
        email = request.json.get('email')
        password = request.json.get('password')

        if email is None or password is None:
            abort(400)  # missing arguments
        if User.query.filter_by(email=email).first() is not None:
            abort(400)  # existing user

        new_user = User(email=email)
        new_user.hash_password(password)
        db.session.add(new_user)
        db.session.commit()
        return {'email': new_user.email}, 201


@ns.route('/login')
class UserAuth(Resource):
    @api.response(201, 'User succesfully logged')
    @api.expect(api_user)
    def post(self):
        """
        Logs user
        """
        print (request)
        email = request.json.get('email')
        password = request.json.get('password')
        if verify_password(email, password):
            token = g.user.generate_auth_token()
            return {'token': token.decode('ascii')}, 201
        abort(401)


@auth.verify_password
def verify_password(email_or_token, password):
    # first try to authenticate by token
    user = User.verify_auth_token(email_or_token)
    if not user:
        # try to authenticate with username/password
        user = User.query.filter_by(email=email_or_token).first()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True
