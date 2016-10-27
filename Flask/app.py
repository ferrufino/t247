import logging.config
import gevent.wsgi
import werkzeug.serving
import config
import os

from flask import Flask, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security

from api.users.users import ns as users_namespace
from api.evaluators.evaluator import nse as evaluator_namespace
from api.courses.courses import ns as courses_namespace
from api.groups.groups import ns as groups_namespace
from api.topics.topics import ns as topics_namespace
from api.languages.languages import ns as languages_namespace
from api.submissions.submissions import ns as submissions_namespace
from api.problems.problems import ns as problems_namespace
from api.assignments.assignments import ns as assignments_namespace

from api.restplus import api
from models import db, User

from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config.from_object(config.DevelopmentConfig)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

security = Security(app)

CORS(app)

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
    api.add_namespace(courses_namespace)
    api.add_namespace(groups_namespace)
    api.add_namespace(topics_namespace)
    api.add_namespace(languages_namespace)
    api.add_namespace(submissions_namespace)
    api.add_namespace(problems_namespace)
    api.add_namespace(assignments_namespace)
    flask_app.register_blueprint(blueprint)

    db.init_app(flask_app)


# @werkzeug.serving.run_with_reloader
def main():
    initialize_app(app)
    #log.info('>>>>> Starting development server at http://{}/api/ <<<<<'.format(app.config['SERVER_NAME']))
    gevent_server = gevent.wsgi.WSGIServer(('', 5000), app)
    gevent_server.serve_forever()
    #app.run(debug=app.config['DEBUG'])

if __name__ == '__main__':
    main()
