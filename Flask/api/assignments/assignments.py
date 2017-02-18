import logging

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from api.assignments.serializers import (assignment as api_assignment,
                                         assignment_creation, simple_submission,
                                         assignment_submission_summary,
                                         student_submission, student_assignment)
from api.restplus import api
from models import db, Assignment, Submission, Enrollment, User
from sqlalchemy import and_
from authorization import auth_required

log = logging.getLogger(__name__)

ns = api.namespace('assignments',
                   description='Operations related to assignments')


@ns.route('/')
@api.header('Authorization', 'Auth token', required=True)
class AssignmentCollection(Resource):

    @api.marshal_list_with(api_assignment)
    @auth_required('admin')
    def get(self):
        """
        Returns list of assignments.
        """
        assignments = Assignment.query.order_by(Assignment.id).all()
        return assignments


@ns.route('/create')
@api.header('Authorization', 'Auth token', required=True)
class AssignmentCreation(Resource):
    @api.response(201, 'Assignment succesfully created')
    @api.expect(assignment_creation)
    @api.marshal_list_with(api_assignment)
    @auth_required('professor')
    def post(self):
        """
        Creates an assignment
        """
        data = request.json
        title = data.get('title')
        start_date = data.get('start_date')[:10] + " 00:00:00"
        due_date = data.get('due_date')[:10] + " 23:59:59"
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
@api.header('Authorization', 'Auth token', required=True)
class AssignmentItem(Resource):

    @api.marshal_with(api_assignment)
    @auth_required('professor')
    def get(self, id):
        """
        Returns an assignment.
        """
        return Assignment.query.filter(Assignment.id == id).one()

    @api.expect(assignment_creation)
    @api.response(204, 'Assignment successfully updated.')
    @auth_required('professor')
    def put(self, id):
        """
        Updates an assignment.
        """
        data = request.json
        Assignment.query.filter(Assignment.id == id).update(data)
        db.session.commit()
        return None, 204

    @api.response(204, 'Assignment successfully deleted.')
    @auth_required('professor')
    def delete(self, id):
        """
        Deletes an assignment.
        """
        assignment = Assignment.query.filter(Assignment.id == id).one()
        db.session.delete(assignment)
        db.session.commit()
        return None, 204

@ns.route('/student/<int:assignment_id>/<int:student_id>')
@api.response(404, 'Submission not found.')
@api.header('Authorization', 'Auth token', required=True)
class SubmissionsToAssignmentByStudent(Resource):
    @auth_required('professor')
    def get(self, assignment_id, student_id):
        """
        Returns 1 if assignment has been assigned to student
        """

        # Check if parameters are valid
        try:
            student_id = int(student_id)
            assignment_id = int(assignment_id)
        except ValueError:
            return None, 404

        # Check if assignment exists
        assignment = Assignment.query.filter(Assignment.id == assignment_id).first()

        if (assignment is None):
            return None, 404


        # If user is professor, check that professor belongs to assignment's group
        # Get user
        token = request.headers.get('Authorization', None)
        user = User.verify_auth_token(token)
        if (user.role == 'professor' and assignment.group.professor_id != user.id):
            return None, 404

        # Check if student belongs to group
        result = db.session.query(Enrollment).filter(Enrollment.group_id == assignment.group_id).filter(Enrollment.student_id == student_id).first()
        
        if (result is None):
            return None, 404 

        return { 'status' : 1 }

@ns.route('/<int:assignment_id>/submissions')
@api.response(404, 'Submission not found.')
@api.header('Authorization', 'Auth token', required=True)
class AssignmentSubmissionSummary(Resource):
    @api.marshal_list_with(assignment_submission_summary)
    @auth_required('professor')
    def get(self, assignment_id):
        """
        Returns number of attempts and status of a submission for an assignment
        Returns the assignment status for each student of the assignment's
        group. Telling the number of attempts, as well as the best grade for
        the assignment so far
        """
        result = db.engine.execute("""
            SELECT u.id as student_id, (u.first_name || ' ' || u.last_name) as student_name, u.enrollment, COUNT(s.id) as no_of_attempts, to_char(MAX(s.created), 'dd/mm/yyyy hh12:mi AM') as date, MAX(s.grade) as grade
            from "user" u
            join enrollment e on u.id = e.student_id
            join assignment a ON a.id = %d AND e.group_id = a.group_id
            left join submission s on s.problem_id = a.problem_id AND s.user_id = u.id AND a.start_date <= s.created AND s.created <= a.due_date
            group by u.id, student_name, u.enrollment
            order by u.enrollment
            """ % (assignment_id)).fetchall()

        return result


@ns.route('/studentsubmissionscode/<int:assignment_id>/<int:student_id>')
@api.response(404, 'Submission not found.')
@api.header('Authorization', 'Auth token', required=True)
class AssignmentSubmissionCodeByStudent(Resource):
    @api.marshal_list_with(student_submission)
    @auth_required('professor')
    def get(self, assignment_id, student_id):
        """
         Returns code of attempts made by user to assignment
        """
        result = db.engine.execute("""
            SELECT to_char(s.created, 'dd/mm/yyyy hh12:mi AM') as date, s.grade, s.code, s.language
            FROM submission s, enrollment e, assignment a
            WHERE s.problem_id = a.problem_id AND a.id = %d AND e.student_id = s.user_id AND s.user_id = %d AND e.group_id = a.group_id AND a.start_date <= s.created AND s.created <= a.due_date
            ORDER BY s.created;""" % (assignment_id, student_id)).fetchall()

        return result

@ns.route('/bystudent/<int:student_id>')
@api.response(404, 'Submission not found.')
@api.header('Authorization', 'Auth token', required=True)
class AssignmentSubmissionCodeByStudent(Resource):
    @api.marshal_list_with(student_assignment)
    @auth_required('student')
    def get(self, student_id):
        """
         Returns current assignments of student
        """
        result = db.engine.execute("""
            SELECT a.title, p.name as problem_name, p.id as problem_id, p.difficulty, c.name as course_name, to_char(a.due_date, 'dd/mm/yyyy') as due_date, MAX(s.grade) as grade
            FROM assignment a
            JOIN problem p ON p.id = a.problem_id
            JOIN "group" g ON g.id = a.group_id
            JOIN course c ON c.id = g.course_id
            JOIN enrollment e ON e.group_id = a.group_id AND e.student_id = %d
            LEFT JOIN submission s ON p.id = s.problem_id AND e.student_id = s.user_id AND a.start_date <= s.created AND s.created <= a.due_date
            WHERE a.start_date <= NOW() AND NOW() <= a.due_date
            GROUP BY a.title, p.name, p.id, p.difficulty, c.name, a.due_date
            ORDER BY a.due_date;
            """ % (student_id)).fetchall()

        return result
