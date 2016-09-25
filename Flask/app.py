import logging.config

from flask import Flask, Blueprint
from flask_sqlalchemy import SQLAlchemy
import config
import os
from api.users.users import ns as users_namespace
from api.evaluators.evaluator import nse as evaluator_namespace

from api.restplus import api
from models import db


app = Flask(__name__)
app.config.from_object(config.DevelopmentConfig)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


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
    app.run(debug=app.config['DEBUG'])

if __name__ == '__main__':
    main()