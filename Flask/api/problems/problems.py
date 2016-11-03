import logging

from flask import request, abort, jsonify, g
from flask_restplus import Resource
from api.problems.serializers import problem as api_problem
from api.problems.serializers import problem_table, problem_description
from api.restplus import api
from models import db, Problem, Topic, ProblemTopic, Case, Language
from sqlalchemy import join
from sqlalchemy.orm import Load

log = logging.getLogger(__name__)

ns = api.namespace('problems', description='Operations related to problems')

@ns.route('/')
class ProblemCollection(Resource):

    @api.marshal_list_with(api_problem)
    def get(self):
        """
        Returns list of problems.
        """
        problems = db.session.query(Problem).all()
        
        # Retrieve problem's language name
        for problem in problems:
            problem.language = Language.query.filter(Language.value == problem.language).one().name

        return problems


@ns.route('/<int:id>')
@api.response(404, 'Problem not found.')
class ProblemItem(Resource):

    @api.marshal_with(api_problem)
    def get(self, id):
        """
        Returns a problem.
        """
        problem = db.session.query(Problem).filter(Problem.id == id).first()
        
        if (problem is not None):
            problem.language = Language.query.filter(Language.value == problem.language).one().name            

        return problem
        
@ns.route('/description/<int:id>')
@api.response(404, 'Problem not found.')
class ProblemDescription(Resource):


    @api.marshal_with(problem_description)
    def get(self, id):
        """
        Returns the descriptions of a problem.
        """
        problem = Problem.query.filter(Problem.id == id).one()
        cases = db.engine.execute("""
            SELECT c.input, c.output
            FROM problem p, \"case\" c
            WHERE c.problem_id = p.id AND p.id = %d AND c.is_sample = TRUE""" % (id)).fetchall()

        descriptions = {}
        descriptions["english"]      = problem.description_english
        descriptions["spanish"]      = problem.description_spanish
        descriptions["title"]        = problem.name
        descriptions["test_cases"]   = cases
        
        print(descriptions)
        
        return descriptions

@ns.route('/listbytopic/<int:user_id>/<int:topic_id>')
@api.response(404, 'Problem not found.')
class ProblemsByTopic(Resource):

    def get(self, user_id, topic_id):
        """
        Returns list of problems by topic, indicating if the problem has been solved by user
        """
        
        # Retrieve raw list of problems by topic
        result = db.engine.execute("SELECT p.id, p.name, p.difficulty FROM Problem p, ProblemTopic pt WHERE p.id = pt.problem_id AND pt.topic_id = %d" % (topic_id))
        
        problems_list = []
        
        # Mark problem status (not attempted, attempted but wrong answer, or solved)
        for problem in result:
            # Problem not attempted
            if (len(db.engine.execute("SELECT p.id FROM Problem p WHERE p.id = %d AND NOT EXISTS (SELECT s.id FROM Submission s WHERE p.id = s.problem_id)" % (problem[0])).fetchall()) > 0):
                problems_list.append({'id' : problem[0], 'name' : problem[1], 'difficulty' : problem[2], 'status' : 'not_attempted'})
            # Problem attempted but not solved
            elif (len(db.engine.execute("SELECT p.id FROM Problem p WHERE p.id = %d AND NOT EXISTS (SELECT s.id FROM Submission s WHERE p.id = s.problem_id AND s.grade = 100)" % (problem[0])).fetchall()) > 0):
                problems_list.append({'id' : problem[0], 'name' : problem[1], 'difficulty' : problem[2], 'status' : 'wrong_answer'})
            # Problem solved
            else:
                problems_list.append({'id' : problem[0], 'name' : problem[1], 'difficulty' : problem[2], 'status' : 'accepted'})
        
        return problems_list


@ns.route('/list/')
class ProblemsList(Resource):

    @api.marshal_list_with(problem_table)
    def get(self):
        """
        Returns list of problems for table display
        """
        # Retrieve raw list of problems by topic
        result = db.engine.execute("SELECT p.id, p.name, p.difficulty, p.active FROM Problem p").fetchall()
        return result

