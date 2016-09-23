from datetime import datetime
from flask_security import UserMixin
from sqlalchemy.ext.declarative import declared_attr

from app import db


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
    email = db.Column(db.String(255), unique=True)
    password_hash = db.Column(db.String(255))
    active = db.Column(db.Boolean)
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    role = db.Column(db.String(20))

    __mapper_args__ = {
        'polymorphic_on': role,
        'polymorphic_identity': 'user'
    }

    def __repr__(self):
        return '<User(%s, %s)>' % (self.id, self.email)

    def __unicode__(self):
        return self.email


class Admin(User):
    """docstring for Admin"""
    __mapper_args__ = {
        'polymorphic_identity': 'admin'
    }


class Student(User):
    """docstring for Student"""
    groups = db.relationship("Group", secondary="enrollment",
                             back_populates="students")
    submissions = db.relationship("Submission", back_populates="student")

    __mapper_args__ = {
        'polymorphic_identity': 'student'
    }


class Teacher(User):
    """docstring for Teacher"""
    managed_groups = db.relationship("Group", back_populates="teacher")

    __mapper_args__ = {
        'polymorphic_identity': 'teacher'
    }


class Course(Base):
    """docstring for Course"""
    __tablename__ = 'course'
    name = db.Column(db.String(255))
    groups = db.relationship("Group", back_populates="course")
    topics = db.relationship("Topic", secondary="relevanttopics",
                             back_populates="courses")


class Topic(Base):
    """docstring for Course"""
    __tablename__ = 'topic'
    name = db.Column(db.String(255))
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
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    period = db.Column(db.String(255))
    students = db.relationship("Student", secondary="enrollment",
                               back_populates="groups")
    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    teacher = db.relationship("Teacher", back_populates="managed_groups")
    assignments = db.relationship("Assignment", back_populates="groups")


class Enrollment(Base):
    """docstring for Enrollment"""
    __tablename__ = 'enrollment'
    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'))
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
    name = db.Column(db.String(255), unique=True)
    difficulty = db.Column(db.Integer)
    active = db.Column(db.Boolean)
    language = db.Column(db.String(255))
    code = db.Column(db.Text)
    template = db.Column(db.Text)
    description = db.Column(db.Text)

    cases = db.relationship("Case", back_populates="problem")
    assignments = db.relationship("Assignment", back_populates="problem")
    submissions = db.relationship("Submission", back_populates="problem")
    topics = db.relationship("Topic", secondary="problemtopic",
                             back_populates="problem")


class Case(Base):
    """docstring for Case"""
    __tablename__ = 'case'
    input = db.Column(db.Text)
    time_limit = db.Column(db.Integer)
    memory_limit = db.Column(db.Integer)
    feedback = db.Column(db.Text)

    problem_id = db.Column(db.Integer, db.ForeignKey('problem.id'))
    problem = db.relationship("Problem", back_populates="cases")


class Submission(Base):
    """docstring for Submission"""
    __tablename__ = 'submission'
    code = db.Column(db.Text)
    language = db.Column(db.String(255))
    state = db.Column(db.Integer)
    feedback = db.Column(db.Text)
    result = db.Column(db.Integer)
    grade = db.Column(db.Integer)

    student_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    student = db.relationship("Student", back_populates="submissions")
    problem_id = db.Column(db.Integer, db.ForeignKey('problem.id'))
    problem = db.relationship("Problem", back_populates="problems")


class Assignment(Base):
    """docstring for Assignment"""
    __tablename__ = 'assignment'
    due_date = db.Column

    group_id = db.Column(db.Integer, db.ForeignKey('group.id'))
    group = db.relationship("Group", back_populates="assignments")
    problem_id = db.Column(db.Integer, db.ForeignKey('problem.id'))
    problem = db.relationship("Problem", back_populates="assignments")
