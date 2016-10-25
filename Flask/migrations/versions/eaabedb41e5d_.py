"""empty message

Revision ID: eaabedb41e5d
Revises: d9c3f6ad5c1a
Create Date: 2016-10-20 20:42:28.104406

"""

# revision identifiers, used by Alembic.
revision = 'eaabedb41e5d'
down_revision = 'd9c3f6ad5c1a'

from alembic import op
import sqlalchemy as sa
import sqlalchemy.dialects.postgresql as postgresql


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    result_enum = postgresql.ENUM('accepted', 'wrong_answer', 'time_limit_exceeded', 'memory_limit_exceeded', 'compilation_error', 'execution_error', name='submissionresult')
    result_enum.create(op.get_bind(), checkfirst=True)
    op.add_column('submission', sa.Column('result', result_enum, nullable=True))

    state_enum = postgresql.ENUM('pending', 'evaluated', name='submissionstate')
    state_enum.create(op.get_bind(), checkfirst=True)
    op.add_column('submission', sa.Column('state', state_enum, nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('submission', 'state')
    op.drop_column('submission', 'result')
    ### end Alembic commands ###