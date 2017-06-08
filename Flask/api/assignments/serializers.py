from flask_restplus import fields
from api.restplus import api
from api.problems.serializers import problem
from api.submissions.serializers import simple_submission

assignment = api.model('Assignment', {
    'id': fields.Integer(required=True, description='Assignment id'),
    'title': fields.String(required=True, description='Assignment title'),
    'start_date': fields.DateTime(required=True, description='Assignment start date'),
    'due_date': fields.DateTime(required=True, description='Assignment due date'),
    'group_id': fields.Integer(required=True, description='Id of the group where the assignment is due'),
    'problem': fields.Nested(problem)
})

assignment_creation = api.model('AssignmentCreation', {
    'title': fields.String(required=True, description='Assignment title'),
    'start_date': fields.DateTime(required=True, description='Assignment start date'),
    'due_date': fields.DateTime(required=True, description='Assignment due date'),
    'group_id': fields.Integer(required=True, description='Id of the group where the assignment is due'),
    'problem_id': fields.Integer(required=True, description='Id of the assigned problem')
})

assignment_submission_summary = api.model('AssignmentSubmissionSummary', {
    'student_id': fields.Integer(required=True, description='Student ID'),
    'student_name': fields.String(required=True, description='Student name'),
    'enrollment': fields.String(required=True, description='Student enrollment'),
    'no_of_attempts': fields.Integer(required=True, description='Number of attempts'),
    'date': fields.String(required=True, description='Date of last submission'),
    'grade': fields.Integer(required=True, description='Maximum grade')
})

student_submission = api.model('StudentSubmission', {
    'first_name': fields.String(required=True, description='Student name'),
    'last_name': fields.String(required=True, description='Student last name'),
    'date': fields.String(required=True, description='Submission date'),
    'grade': fields.Integer(required=True, description='Submission grade'),
    'code': fields.String(required=True, description='Submission code'),
    'language': fields.String(required=True, description='Submission code language')
})

student_assignment = api.model('StudentAssignment', {
    'title': fields.String(required=True, description='Assignment title'),
    'problem_name': fields.String(required=True, description='Problem name'),
    'problem_id': fields.Integer(required=True, description='Problem id'),
    'difficulty': fields.Integer(required=True, description='Problem difficulty'),
    'course_name': fields.String(required=True, description='Course name'),
    'due_date': fields.String(required=True, description='Due date'),
    'grade': fields.Integer(required=True, description='Grade')
})