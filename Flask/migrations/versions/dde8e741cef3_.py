"""empty message

Revision ID: dde8e741cef3
Revises: 0df9d50aa0ca
Create Date: 2016-11-02 19:07:36.232023

"""

# revision identifiers, used by Alembic.
revision = 'dde8e741cef3'
down_revision = '0df9d50aa0ca'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('case', 'time_limit')
    op.drop_column('case', 'memory_limit')
    op.add_column('problem', sa.Column('memory_limit', sa.Integer(), nullable=True))
    op.add_column('problem', sa.Column('time_limit', sa.Integer(), nullable=True))
    op.drop_column('problem', 'example_output')
    op.drop_column('problem', 'example_input')
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('problem', sa.Column('example_input', sa.TEXT(), autoincrement=False, nullable=True))
    op.add_column('problem', sa.Column('example_output', sa.TEXT(), autoincrement=False, nullable=True))
    op.drop_column('problem', 'time_limit')
    op.drop_column('problem', 'memory_limit')
    op.add_column('case', sa.Column('memory_limit', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('case', sa.Column('time_limit', sa.INTEGER(), autoincrement=False, nullable=True))
    ### end Alembic commands ###
