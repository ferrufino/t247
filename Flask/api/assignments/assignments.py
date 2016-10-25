import logging

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from api.assignments.serializers import (assignment as api_assignment,
                                         assignment_creation)
from api.restplus import api
from models import db, Assignment

log = logging.getLogger(__name__)

ns = api.namespace('assignments',
                   description='Operations related to assignments')


@ns.route('/')
class AssignmentCollection(Resource):

    @api.marshal_list_with(api_assignment)
    def get(self):
        """
        Returns list of assignments.
        """
        assignments = Assignment.query.all()
        return assignments


@ns.route('/create')
class AssignmentCreation(Resource):
    @api.response(201, 'Assignment succesfully created')
    @api.expect(assignment_creation)
    @api.marshal_list_with(api_assignment)
    def post(self):
        """
        Creates an assignment
        """
        data = request.json
        title = data.get('title')
        start_date = data.get('start_date')
        due_date = data.get('due_date')
        group_id = data.get('group_id')
        problem_id = data.get('problem_id')

        new_assignment = Assignment(title=title, start_date=start_date,
                                    due_date=due_date, group_id=group_id,
                                    problem_id=problem_id)
        db.session.add(new_assignment)
        db.session.commit()
        return new_assignment, 201


@ns.route('/<int:id>')
@api.response(404, 'Assignment not found.')
class AssignmentItem(Resource):

    @api.marshal_with(api_assignment)
    def get(self, id):
        """
        Returns an assignment.
        """
        return Assignment.query.filter(Assignment.id == id).one()

    @api.expect(assignment_creation)
    @api.response(204, 'Assignment successfully updated.')
    def put(self, id):
        """
        Updates an assignment.
        """
        data = request.json
        Assignment.query.filter(Assignment.id == id).update(data)
        db.session.commit()
        return None, 204

    @api.response(204, 'Assignment successfully deleted.')
    def delete(self, id):
        """
        Deletes an assignment.
        """
        assignment = Assignment.query.filter(Assignment.id == id).one()
        db.session.delete(assignment)
        db.session.commit()
        return None, 204


# @ns.route('/by_group/<int:id>')
# class AssignmentCollectionByGroup(Resource):
#     @api.marshal_with(api_assignment)
#     def get(self, id):
#         """
#         Returns a list of assignments.
#         """
#         group = Group.query.filter(Group.id == id).one()
#         return group.assignments
