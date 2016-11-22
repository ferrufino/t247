from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
from sqlalchemy.ext.declarative import declared_attr
from enums import SubmissionState, SubmissionResult

db = SQLAlchemy()


class Base(db.Model):

    """A base class that automatically creates the table name and
    primary key.
    """

    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    updated = db.Column(db.DateTime, default=datetime.utcnow)

    # @declared_attr
    # def __tablename__(cls):
    #     return cls.__name__.lower()

    def readable_date(self, date, format='%H:%M on %-d %B'):
        """Format the given date using the given format."""
        return date.strftime(format)


class User(Base, UserMixin):

    """
    A forum user. `UserMixin` provides the following methods:
        `is_active(self)`
            Returns ``True`` if the user is active.
        `is_authenticated(self)`
            Always returns ``True``.
        `is_anonymous(self)`
            Always returns ``False``.
        `get_auth_token(self)`
            Returns the user's authentication token.
        `has_role(self, role)`
            Returns ``True`` if the user identifies with the specified role.
        `get_id(self)`
            Returns ``self.id``.
        `__eq__(self, other)`
            Returns ``True`` if the two users have the same id.
        `__ne__(self, other)`
            Returns the opposite of `__eq__`.
    """
    __tablename__ = 'user'
    email = db.Column(db.String(255), unique=True, nullable=False)
    enrollment = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255))
    active = db.Column(db.Boolean)
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    role = db.Column(db.String(20))
    problems = db.relationship("Problem", back_populates="author", cascade="save-update, merge, delete")
    submissions = db.relationship("Submission", back_populates="user", cascade="save-update, merge, delete")

    __mapper_args__ = {
        'polymorphic_on': role,
        'polymorphic_identity': 'user'
    }

    def __repr__(self):
        return '<User(%s, %s)>' % (self.id, self.email)

    def __unicode__(self):
        return self.email

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def generate_auth_token(self, expiration=60*60*24*30):
        s = Serializer('this-really-needs-to-be-changed', expires_in=7200)
        return s.dumps({'id': self.id, 'role': self.role})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer('this-really-needs-to-be-changed')
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None  # valid token, but expired
        except BadSignature:
            return None  # invalid token
        user = User.query.get(data['id'])
        return user


class Admin(User):
    """docstring for Admin"""
    __mapper_args__ = {
        'polymorphic_identity': 'admin'
    }


class Student(User):
    """docstring for Student"""
    groups = db.relationship("Group", secondary="enrollment",
                             back_populates="students")

    __mapper_args__ = {
        'polymorphic_identity': 'student'
    }


class Professor(User):
    """docstring for Professor"""
    managed_groups = db.relationship("Group", back_populates="professor", cascade="save-update, merge, delete")

    __mapper_args__ = {
        'polymorphic_identity': 'professor'
    }


class Course(Base):
    """docstring for Course"""
    __tablename__ = 'course'
    name = db.Column(db.String(255), nullable=False)
    groups = db.relationship("Group", back_populates="course", cascade="save-update, merge, delete")
    topics = db.relationship("Topic", secondary="relevanttopic",
                             back_populates="courses")


class Topic(Base):
    """docstring for Course"""
    __tablename__ = 'topic'
    name = db.Column(db.String(255), nullable=False)
    courses = db.relationship("Course", secondary="relevanttopic",
                              back_populates="topics")
    problems = db.relationship("Problem", secondary="problemtopic",
                               back_populates="topics")


class RelevantTopic(Base):
    """docstring for Course"""
    __tablename__ = 'relevanttopic'
    name = db.Column(db.String(255))
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'))


class Group(Base):
    """docstring for Group"""
    __tablename__ = 'group'
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    course = db.relationship("Course", back_populates="groups")
    period = db.Column(db.String(255), nullable=False)
    students = db.relationship("Student", secondary="enrollment",
                               back_populates="groups")
    professor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    professor = db.relationship("Professor", back_populates="managed_groups")
    assignments = db.relationship("Assignment", back_populates="group", cascade="save-update, merge, delete")


class Enrollment(Base):
    """docstring for Enrollment"""
    __tablename__ = 'enrollment'
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'))
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'))


class ProblemTopic(Base):
    """docstring for Course"""
    __tablename__ = 'problemtopic'
    name = db.Column(db.String(255))
    problem_id = db.Column(db.Integer, db.ForeignKey('problem.id'))
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'))


class Problem(Base):
    """docstring for Problem"""
    __tablename__ = 'problem'
    name = db.Column(db.String(255), unique=True, nullable=False)
    difficulty = db.Column(db.Integer)
    active = db.Column(db.Boolean)
    language = db.Column(db.String(255), nullable=False)
    code = db.Column(db.Text, nullable=False)
    template = db.Column(db.Text)
    signature = db.Column(db.Text)
    description_english = db.Column(db.Text, nullable=False)
    description_spanish = db.Column(db.Text)
    time_limit = db.Column(db.Integer)
    memory_limit = db.Column(db.Integer)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    author = db.relationship("User", back_populates="problems")

    cases = db.relationship("Case", back_populates="problem",
                            order_by="Case.id", cascade="save-update, merge, delete, delete-orphan")
    assignments = db.relationship("Assignment", back_populates="problem", cascade="save-update, merge, delete")
    submissions = db.relationship("Submission", back_populates="problem", cascade="save-update, merge, delete")
    topics = db.relationship("Topic", secondary="problemtopic",
                             back_populates="problems")


class Case(Base):
    """docstring for Case"""
    __tablename__ = 'case'
    input = db.Column(db.Text, nullable=False)
    feedback = db.Column(db.Text)
    output = db.Column(db.Text)
    is_sample = db.Column(db.Boolean)

    problem_id = db.Column(db.Integer, db.ForeignKey('problem.id'), nullable=False)
    problem = db.relationship("Problem", back_populates="cases")


class Submission(Base):
    """docstring for Submission"""
    __tablename__ = 'submission'
    code = db.Column(db.Text, nullable=False)
    language = db.Column(db.String(255), nullable=False)
    feedback_list = db.Column(db.JSON)
    grade = db.Column(db.Integer)
    state = db.Column(db.Enum(SubmissionState))
    result = db.Column(db.Enum(SubmissionResult))

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship("User", back_populates="submissions")
    problem_id = db.Column(db.Integer, db.ForeignKey('problem.id'))
    problem = db.relationship("Problem", back_populates="submissions")


class Assignment(Base):
    """docstring for Assignment"""
    __tablename__ = 'assignment'
    title = db.Column(db.String(255), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    due_date = db.Column(db.DateTime, nullable=False)

    group_id = db.Column(db.Integer, db.ForeignKey('group.id'), nullable=False)
    group = db.relationship("Group", back_populates="assignments")
    problem_id = db.Column(db.Integer, db.ForeignKey('problem.id'), nullable=False)
    problem = db.relationship("Problem", back_populates="assignments")


class Language(Base):
    """docstring for Assignment"""
    __tablename__ = 'language'

    name = db.Column(db.String(255), nullable=False)
    value = db.Column(db.String(255), nullable=False, unique=True)
    extension = db.Column(db.String(255), nullable=False)
