"""empty message

Revision ID: 11b519e9e44c
Revises: 87765a7a56be
Create Date: 2016-10-27 13:16:08.333394

"""

# revision identifiers, used by Alembic.
revision = '11b519e9e44c'
down_revision = '87765a7a56be'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('assignment', 'due_date',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False)
    op.alter_column('assignment', 'start_date',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False)
    op.alter_column('assignment', 'title',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    op.alter_column('case', 'input',
               existing_type=sa.TEXT(),
               nullable=False)
    op.alter_column('course', 'name',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    op.alter_column('group', 'period',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    op.alter_column('language', 'extension',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    op.alter_column('language', 'name',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    op.alter_column('language', 'value',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    op.create_unique_constraint(None, 'language', ['value'])
    op.alter_column('problem', 'code',
               existing_type=sa.TEXT(),
               nullable=False)
    op.alter_column('problem', 'language',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    op.alter_column('problem', 'name',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    op.alter_column('submission', 'code',
               existing_type=sa.TEXT(),
               nullable=False)
    op.alter_column('submission', 'language',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    op.alter_column('topic', 'name',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    op.alter_column('user', 'email',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    op.alter_column('user', 'enrollment',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('user', 'enrollment',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.alter_column('user', 'email',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.alter_column('topic', 'name',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.alter_column('submission', 'language',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.alter_column('submission', 'code',
               existing_type=sa.TEXT(),
               nullable=True)
    op.alter_column('problem', 'name',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.alter_column('problem', 'language',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.alter_column('problem', 'code',
               existing_type=sa.TEXT(),
               nullable=True)
    op.drop_constraint(None, 'language', type_='unique')
    op.alter_column('language', 'value',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.alter_column('language', 'name',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.alter_column('language', 'extension',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.alter_column('group', 'period',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.alter_column('course', 'name',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.alter_column('case', 'input',
               existing_type=sa.TEXT(),
               nullable=True)
    op.alter_column('assignment', 'title',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.alter_column('assignment', 'start_date',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True)
    op.alter_column('assignment', 'due_date',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True)
    ### end Alembic commands ###