import logging

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from api.languages.serializers import (language as api_language,
                                       language_creation)
from api.restplus import api
from models import db, Language
from authorization import auth_required

log = logging.getLogger(__name__)

ns = api.namespace('languages', description='Operations related to languages')


@ns.route('/')
@api.header('Authorization', 'Auth token', required=True)
class LanguageCollection(Resource):

    @api.marshal_list_with(api_language)
    @auth_required('student')
    def get(self):
        """
        Returns list of languages.
        """
        languages = Language.query.order_by(Language.id).all()
        return languages


@ns.route('/create')
@api.header('Authorization', 'Auth token', required=True)
class LanguageCreation(Resource):
    @api.response(201, 'Language succesfully created')
    @api.expect(language_creation)
    @auth_required('admin')
    def post(self):
        """
        Creates language
        """
        name = request.json.get('name')
        value = request.json.get('value')
        extension = request.json.get('extension')
        new_language = Language(name=name, value=value, extension=extension)
        db.session.add(new_language)
        db.session.commit()
        return {'id': new_language.id, 'name': new_language.name,
                'value': new_language.value,
                'extension': new_language.extension}, 201


@ns.route('/<int:id>')
@api.header('Authorization', 'Auth token', required=True)
@api.response(404, 'Language not found.')
class LanguageItem(Resource):

    @api.marshal_with(api_language)
    @auth_required('student')
    def get(self, id):
        """
        Returns a language.
        """
        return Language.query.filter(Language.id == id).one()

    @api.response(204, 'Language successfully deleted.')
    @auth_required('admin')
    def delete(self, id):
        """
        Deletes a language.
        """
        language = Language.query.filter(Language.id == id).one()
        db.session.delete(language)
        db.session.commit()
        return None, 204
