import logging

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from api.problems.serializers import problem as api_problem
from api.problems.serializers import problem_table, problem_description, problem_edition
from api.restplus import api
from models import db, Problem, Topic, ProblemTopic, Case, Language, User
from sqlalchemy import join
from sqlalchemy.orm import Load
from authorization import auth_required

log = logging.getLogger(__name__)

ns = api.namespace('problems', description='Operations related to problems')

@ns.route('/')
@api.header('Authorization', 'Auth token', required=True)
class ProblemCollection(Resource):

    @api.marshal_list_with(api_problem)
    @auth_required('professor')
    def get(self):
        """
        Returns list of problems.
        """
        problems = db.session.query(Problem).order_by(Problem.id).all()

        # Get user
        token = request.headers.get('Authorization', None)
        user = User.verify_auth_token(token)
        
        # Retrieve problem's language name
        for problem in problems:
            problem.language = Language.query.filter(Language.value == problem.language).one().name
            if (user.role == 'admin'):
                problem.can_edit = True
            elif (user.role == 'professor' and problem.author_id == user.id):
                problem.can_edit = True
            else:
                problem.can_edit = False

        return problems

@ns.route('/changestatus/<int:problem_id>/<int:status>')
@api.header('Authorization', 'Auth token', required=True)
@api.response(404, 'Problem not found.')
class ProblemStatus(Resource):

    @api.response(204, 'Problem successfully updated.')
    @auth_required('professor')
    def put(self, problem_id, status):
        """
        Updates a problem's status.
        """
        if (status == 0):
            active = False
        else:
            active = True

        Problem.query.filter(Problem.id == problem_id).update({'active' : active})
        
        db.session.commit()

        return None, 204

@ns.route('/<int:id>')
@api.header('Authorization', 'Auth token', required=True)
@api.response(404, 'Problem not found.')
class ProblemItem(Resource):

    @api.marshal_with(api_problem)
    @auth_required('professor')
    def get(self, id):
        """
        Returns a problem.
        """

        # Check if id is valid
        try:
            id = int(id)
        except ValueError:
            return None, 404

        # Check if problem exists
        problem = db.session.query(Problem).filter(Problem.id == id).first()
        
        if (problem is not None):
            problem.language = Language.query.filter(Language.value == problem.language).one().name
        else:
            return None, 404

        return problem

    @api.response(204, 'Problem successfully deleted.')
    @auth_required('admin')
    def delete(self, id):
        """
        Deletes a problem.
        """
        problem = Problem.query.filter(Problem.id == id).one()
        db.session.delete(problem)
        db.session.commit()

        return None, 204

    @api.expect(problem_edition)
    @api.response(204, 'Problem successfully updated.')
    @auth_required('professor')
    def put(self, id):
        """
        Updates a problem.
        """
        data = request.json
        
        topics = data['topics']
        #cases  = data.get('cases')

        del data['topics']
        #del data['cases']

        # Update problem's common fields
        Problem.query.filter(Problem.id == id).update(data)
        db.session.commit()

        # Delete problem's topics
        ProblemTopic.query.filter(ProblemTopic.problem_id == id).delete()
        db.session.commit()

        # Create new problem's topics
        for topic_id in topics:
            new_problemtopic = ProblemTopic(problem_id=id,
                                        topic_id=topic_id)
            db.session.add(new_problemtopic)
            db.session.commit()

        # Update test cases
        #for case in cases:
        #    Case.query.filter(Case.id == case['id']).update({'is_sample' : case['is_sample']})
        #    db.session.commit()

        return None, 204
        
@ns.route('/description/<int:id>')
@api.header('Authorization', 'Auth token', required=True)
@api.response(404, 'Problem not found.')
class ProblemDescription(Resource):


    @api.marshal_with(problem_description)
    @auth_required('student')
    def get(self, id):
        """
        Returns the descriptions of a problem.
        """
        # Check if id is valid
        try:
            id = int(id)
        except ValueError:
            return None, 404

        problem = db.session.query(Problem).filter(Problem.id == id).first()
        
        if (problem is None):
            return None, 404          

        # If user is student, check that problem is activated
        # Get user
        token = request.headers.get('Authorization', None)
        user = User.verify_auth_token(token)
        if (user.role == 'student' and problem.active == False):
            return None, 404

        # Complete missing fields
        cases = db.engine.execute("""
            SELECT c.input, c.output
            FROM problem p, \"case\" c
            WHERE c.problem_id = p.id AND p.id = %d AND c.is_sample = TRUE""" % (id)).fetchall()

        descriptions = {}
        descriptions["english"]       = problem.description_english
        descriptions["spanish"]       = problem.description_spanish
        descriptions["title"]         = problem.name
        descriptions["test_cases"]    = cases
        descriptions["signature"]     = problem.signature
        descriptions["language_name"] = Language.query.filter(Language.value == problem.language).one().name
        descriptions["language_code"] = problem.language
        
        print(descriptions)
        
        return descriptions

@ns.route('/listbytopic/<int:user_id>/<int:topic_id>')
@api.header('Authorization', 'Auth token', required=True)
@api.response(404, 'Problem not found.')
class ProblemsByTopic(Resource):

    @auth_required('student')
    def get(self, user_id, topic_id):
        """
        Returns list of problems by topic, indicating if the problem has been solved by user
        """
        
        # Retrieve raw list of problems by topic
        result = db.engine.execute("SELECT p.id, p.name, p.difficulty FROM Problem p, ProblemTopic pt WHERE p.active=true AND p.id = pt.problem_id AND pt.topic_id = %d" % (topic_id))
        
        problems_list = []
        
        # Mark problem status (not attempted, attempted but wrong answer, or solved)
        for problem in result:
            # Problem not attempted
            if (len(db.engine.execute("SELECT p.id FROM Problem p WHERE p.id = %d AND NOT EXISTS (SELECT s.id FROM Submission s WHERE p.id = s.problem_id AND s.user_id = %d)" % (problem[0], user_id)).fetchall()) > 0):
                problems_list.append({'problem_id' : problem[0], 'name' : problem[1], 'difficulty' : problem[2], 'status' : 'not_attempted'})
            # Problem attempted but not solved
            elif (len(db.engine.execute("SELECT p.id FROM Problem p WHERE p.id = %d AND NOT EXISTS (SELECT s.id FROM Submission s WHERE p.id = s.problem_id AND s.grade = 100 AND s.user_id = %d)" % (problem[0], user_id)).fetchall()) > 0):
                problems_list.append({'problem_id' : problem[0], 'name' : problem[1], 'difficulty' : problem[2], 'status' : 'wrong_answer'})
            # Problem solved
            else:
                problems_list.append({'problem_id' : problem[0], 'name' : problem[1], 'difficulty' : problem[2], 'status' : 'accepted'})
        
        return problems_list


@ns.route('/list/')
@api.header('Authorization', 'Auth token', required=True)
class ProblemsList(Resource):

    @api.marshal_list_with(problem_table)
    @auth_required('professor')
    def get(self):
        """
        Returns list of problems for table display
        """

        # Retrieve raw list of problems by topic
        result = db.engine.execute("SELECT p.id, p.name, t.name as topic, p.difficulty, p.active, p.author_id FROM Problem p, Topic t, ProblemTopic pt WHERE p.id = pt.problem_id AND t.id = pt.topic_id").fetchall()
        
        # Get user
        token = request.headers.get('Authorization', None)
        user = User.verify_auth_token(token)
        
        problems = []

        # Retrieve problem's language name
        for row in result:
            problem = dict(row.items())
            if (user.role == 'admin'):
                problem["can_edit"] = True
            elif (user.role == 'professor' and row.author_id == user.id):
                problem["can_edit"] = True
            else:
                problem["can_edit"] = False
            problems.append(problem.copy())

        return problems


