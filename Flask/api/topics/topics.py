import logging

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from api.topics.serializers import (topic as api_course, topic_creation)
from api.restplus import api
from models import db, Topic
from authorization import auth_required

log = logging.getLogger(__name__)

ns = api.namespace('topics', description='Operations related to topics')


@ns.route('/')
@api.header('Authorization', 'Auth token', required=True)
class TopicCollection(Resource):

    @api.marshal_list_with(api_course)
    @auth_required('student')
    def get(self):
        """
        Returns list of courses.
        """
        topics = Topic.query.order_by(Topic.name).all()
        return topics


@ns.route('/create')
@api.header('Authorization', 'Auth token', required=True)
class TopicCreation(Resource):
    @api.response(201, 'Topic succesfully created')
    @api.expect(topic_creation)
    @auth_required('professor')
    def post(self):
        """
        Creates topic
        """
        name = request.json.get('name')
        new_topic = Topic(name=name)
        db.session.add(new_topic)
        db.session.commit()
        return {'id': new_topic.id, 'name': new_topic.name}, 201


@ns.route('/<int:id>')
@api.header('Authorization', 'Auth token', required=True)
@api.response(404, 'Topic not found.')
class TopicItem(Resource):

    @api.marshal_with(api_course)
    @auth_required('student')
    def get(self, id):
        """
        Returns a topic.
        """
        if (id == 0):
            return { 'id' : 0, 'name' : 'All problems' }


        return Topic.query.filter(Topic.id == id).one()

    @api.expect(topic_creation)
    @api.response(204, 'Topic successfully updated.')
    @auth_required('professor')
    def put(self, id):
        """
        Updates a topic.
        """
        data = request.json
        Topic.query.filter(Topic.id == id).update(data)
        db.session.commit()
        return None, 204

    @api.response(204, 'Topic successfully deleted.')
    @auth_required('professor')
    def delete(self, id):
        """
        Deletes a topic.
        """
        topic = Topic.query.filter(Topic.id == id).one()
        db.session.delete(topic)
        db.session.commit()
        return None, 204
