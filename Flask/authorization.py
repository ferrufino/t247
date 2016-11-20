from flask import current_app, request, jsonify, _request_ctx_stack, abort
from functools import wraps
from models import db, User


def auth_required(role='student'):
    """
    Route decorator that requires a valid token to be sent
    It also requires that the token's user has at least the specified role
    :param role: minimum role required for authentication
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            _auth_required(role)
            return fn(*args, **kwargs)
        return decorator
    return wrapper


def _auth_required(role):
    """
    Does the actual work of verifying token data
    """
    token = _get_request_token()
    if token is None:
        abort(400, {'error': 'No auth token provided'})

    print(token)
    user = User.verify_auth_token(token)
    if not user:
        print('none!')
        abort(400, {'error': 'Token is invalid or expired'})

    if user.role == 'student' and role == 'professor':
        abort(401, {'error': 'Unauthorized. This route is for ' + role})
    elif user.role == 'student' and role == 'admin':
        abort(401, {'error': 'Unauthorized. This route is for ' + role})
    elif user.role == 'professor' and role == 'admin':
        abort(401, {'error': 'Unauthorized. This route is for ' + role})


def _get_request_token():
    auth_header_value = request.headers.get('Authorization', None)
    return auth_header_value
