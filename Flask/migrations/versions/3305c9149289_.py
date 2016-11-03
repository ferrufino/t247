"""empty message

Revision ID: 3305c9149289
Revises: 4e8e2efbe395
Create Date: 2016-11-02 04:13:19.223224

"""

# revision identifiers, used by Alembic.
revision = '3305c9149289'
down_revision = '4e8e2efbe395'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('assignment', 'group_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('assignment', 'problem_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('case', 'problem_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('group', 'course_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('group', 'professor_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('problem', 'author_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('problem', 'description_english',
               existing_type=sa.TEXT(),
               nullable=False)
    op.add_column('submission', sa.Column('user_id', sa.Integer(), nullable=False))
    op.drop_constraint('submission_student_id_fkey', 'submission', type_='foreignkey')
    op.create_foreign_key(None, 'submission', 'user', ['user_id'], ['id'])
    op.drop_column('submission', 'student_id')
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('submission', sa.Column('student_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'submission', type_='foreignkey')
    op.create_foreign_key('submission_student_id_fkey', 'submission', 'user', ['student_id'], ['id'])
    op.drop_column('submission', 'user_id')
    op.alter_column('problem', 'description_english',
               existing_type=sa.TEXT(),
               nullable=True)
    op.alter_column('problem', 'author_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('group', 'professor_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('group', 'course_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('case', 'problem_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('assignment', 'problem_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('assignment', 'group_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    ### end Alembic commands ###