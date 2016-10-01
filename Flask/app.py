import logging.config
import gevent.wsgi

from flask import Flask, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security
import config
import os
from api.users.users import ns as users_namespace
from api.evaluators.evaluator import nse as evaluator_namespace

from api.restplus import api
from models import db, User

app = Flask(__name__)
app.config.from_object(config.DevelopmentConfig)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

security = Security(app)


@app.route('/')
def hello():
    return "Hello World!"


@app.route('/<name>')
def hello_name(name):
    return "Hello {}!".format(name)


def initialize_app(flask_app):
    # configure_app(flask_app)

    blueprint = Blueprint('api', __name__, url_prefix='/api')
    api.init_app(blueprint)
    api.add_namespace(users_namespace)
    api.add_namespace(evaluator_namespace)
    flask_app.register_blueprint(blueprint)

    db.init_app(flask_app)


def main():
    initialize_app(app)
    #log.info('>>>>> Starting development server at http://{}/api/ <<<<<'.format(app.config['SERVER_NAME']))
    gevent_server = gevent.wsgi.WSGIServer(('', 5000), app)
    gevent_server.serve_forever()
    #app.run(debug=app.config['DEBUG'])

if __name__ == '__main__':
    main()
