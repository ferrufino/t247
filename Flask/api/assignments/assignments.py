import logging

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from api.assignments.serializers import (assignment as api_assignment,
                                         assignment_creation, simple_submission,
                                         assignment_submission_summary,
                                         student_submission, student_assignment)
from api.restplus import api
from models import db, Assignment, Submission
from sqlalchemy import and_

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


@ns.route('/<int:assignment_id>/submissions')
@api.response(404, 'Submission not found.')
class AssignmentSubmissionSummary(Resource):
    @api.marshal_list_with(assignment_submission_summary)
    def get(self, assignment_id):
        """
        Returns number of attempts and status of a submission for an assignment
        Returns the assignment status for each student of the assignment's
        group. Telling the number of attempts, as well as the best grade for
        the assignment so far
        """
        # assignment = Assignment.query.filter(Assignment.id == id).one()
        # problem = assignment.problem
        # start_date = assignment.start_date
        # due_date = assignment.due_date
        # students = assignment.group.students

        # submissions = []
        # for student in students:
        #     print(str(student.id))
        #     submission = Submission.query.filter(
        #         and_(Submission.problem_id == problem.id,
        #              Submission.student_id == student.id,
        #              Submission.created >= start_date,
        #              Submission.created <= due_date)).order_by(
        #         Submission.created.desc()).first()
        #     submissions.append(submission)

        # return submissions

        result = db.engine.execute("SELECT u.id as student_id, (u.first_name || ' ' || u.last_name) as student_name, u.enrollment, COUNT(u.enrollment) as no_of_attempts, MAX(s.created) as date, MAX(s.grade) as grade FROM \"user\" u, submission s, enrollment e, assignment a WHERE s.problem_id = a.problem_id AND a.id = %d AND u.id = e.student_id AND e.group_id = a.group_id AND s.student_id = u.id AND a.start_date <= s.created AND s.created <= a.due_date GROUP BY u.id, u.enrollment;" % (assignment_id)).fetchall()

        return result

# @ns.route('/submissionslist/<int:assignment_id>/')
# @api.response(404, 'Submission not found.')
# class AssignmentSubmissionSummary(Resource):
#     @api.marshal_list_with(assignment_submission_summary)
#     def get(self, assignment_id):
#         """
#         Returns number of attempts and status of a submission
#         """
#         result = db.engine.execute("SELECT u.id as student_id, (u.first_name || ' ' || u.last_name) as student_name, u.enrollment, COUNT(u.enrollment) as no_of_attempts, MAX(s.created) as date, MAX(s.grade) as grade FROM \"user\" u, submission s, enrollment e, assignment a WHERE s.problem_id = a.problem_id AND a.id = %d AND u.id = e.student_id AND e.group_id = a.group_id AND s.student_id = u.id AND a.start_date <= s.created AND s.created <= a.due_date GROUP BY u.id, u.enrollment;" % (assignment_id)).fetchall()

#         return result

@ns.route('/studentsubmissionscode/<int:assignment_id>/<int:student_id>')
@api.response(404, 'Submission not found.')
class AssignmentSubmissionCodeByStudent(Resource):
    @api.marshal_list_with(student_submission)
    def get(self, assignment_id, student_id):
        """
         Returns code of attempts made by user to assignment
        """
        result = db.engine.execute("SELECT s.created as date, s.grade, s.code FROM submission s, enrollment e, assignment a WHERE s.problem_id = a.problem_id AND a.id = %d AND e.student_id = s.student_id AND s.student_id = %d AND e.group_id = a.group_id AND a.start_date <= s.created AND s.created <= a.due_date ORDER BY s.created;" % (assignment_id, student_id)).fetchall()

        return result

@ns.route('/bystudent/<int:student_id>')
@api.response(404, 'Submission not found.')
class AssignmentSubmissionCodeByStudent(Resource):
    @api.marshal_list_with(student_assignment)
    def get(self, student_id):
        """
         Returns current assignments of student
        """
        result = db.engine.execute("SELECT a.title, p.name as problem_name, p.difficulty, c.name as course_name, a.due_date, MAX(s.grade) as grade FROM problem p, course c, submission s, assignment a, \"group\" g, enrollment e WHERE p.id = a.problem_id AND p.id = s.problem_id AND a.group_id = g.id AND g.course_id = c.id AND a.start_date <= NOW() AND NOW() <= a.due_date AND e.group_id = a.group_id AND e.student_id = s.student_id AND s.student_id = %d GROUP BY a.title, p.name, p.difficulty, c.name, a.due_date ORDER BY a.due_date;" % (student_id)).fetchall()

        return result