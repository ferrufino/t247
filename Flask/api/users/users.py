import logging
import redis

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from flask_security import auth_token_required, utils
from flask_httpauth import HTTPBasicAuth
from api.users.serializers import user as api_user, user_auth, user_token, user_creation
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
        Returns list of users.
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
    @api.expect(user_creation)
    def post(self):
        """
        Creates user
        """
        email = request.json.get('email')
        name = request.json.get('first_name')
        last_name = request.json.get('last_name')
        password = request.json.get('password')
        enrollment = request.json.get('enrollment')
        role = request.json.get('role')

        if email is None or password is None:
            return {'error': 'Missing arguments'}, 400
        if User.query.filter_by(email=email).first() is not None:
            return {'error': 'Email already exists'}, 400

        new_user = User(email=email, name=first_name, last_name=last_name,
                        role=role, enrollment=enrollment)
        new_user.hash_password(password)
        db.session.add(new_user)
        db.session.commit()
        return {'email': new_user.email, 'id': new_user.id}, 201


@ns.route('/login')
class UserAuthentication(Resource):
    @api.response(200, 'User succesfully logged')
    @api.expect(user_auth)
    def post(self):
        """
        Logs user
        """
        email = request.json.get('email')
        password = request.json.get('password')
        if verify_password(email, password):
            token = g.user.generate_auth_token()
            role = g.user.role
            name = g.user.first_name
            last_name = g.user.last_name
            enrollment = g.user.enrollment
            print("User logged with token: " + token.decode('ascii'))
            return {'token': token.decode('ascii'), 'id': g.user.id,
                    'role': role, 'name': name, 'lastName': last_name,
                    'enrollment': enrollment}, 200
        abort(401)


@ns.route('/logout')
class UserLogout(Resource):
    @api.response(200, 'User succesfully logged out')
    @api.expect(user_token)
    def post(self):
        """
        Logs out user
        """
        print("Logging out user")
        token = request.json.get('token')
        if verify_password(token, None):
            delete_user_token(g.user.id)
            return 'User succesfully logged out', 200
        abort(401)


@ns.route('/role')
class UserAuthorization(Resource):
    @api.response(200, 'User authorized')
    @api.expect(user_token)
    def post(self):
        """
        Verifies that token is valid and returns user role if true
        """
        token = request.json.get('token')
        if verify_password(token, None):
            role = g.user.role
            return {'role': role}, 200
        abort(401)


@ns.route('/<int:id>')
@api.response(404, 'User not found.')
class UserItem(Resource):

    @api.marshal_with(api_user)
    def get(self, id):
        """
        Returns a user.
        """
        return User.query.filter(User.id == id).one()

    @api.expect(user_creation)
    @api.response(204, 'User successfully updated.')
    def put(self, id):
        """
        Updates a user.
        Use this method to edit a user.
        """
        data = request.json
        User.query.filter(User.id == id).update(data)
        db.session.commit()
        return None, 204

    @api.response(204, 'User successfully deleted.')
    def delete(self, id):
        """
        Deletes a user.
        """
        user = User.query.filter(User.id == id).one()
        db.session.delete(user)
        db.session.commit()
        return None, 204


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


def store_user_token(user_id, token):
    redis_store = redis.StrictRedis(host='localhost', port=6379, db=0)
    redis_store.set(user_id, token)


def delete_user_token(user_id):
    redis_store = redis.StrictRedis(host='localhost', port=6379, db=0)
    redis_store.delete(user_id)
