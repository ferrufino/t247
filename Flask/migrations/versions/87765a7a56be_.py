"""empty message

Revision ID: 87765a7a56be
Revises: 4e2b325b10d3
Create Date: 2016-10-27 13:09:23.368550

"""

# revision identifiers, used by Alembic.
revision = '87765a7a56be'
down_revision = '4e2b325b10d3'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('problem', sa.Column('example_input', sa.Text(), nullable=True))
    op.add_column('problem', sa.Column('example_output', sa.Text(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('problem', 'example_output')
    op.drop_column('problem', 'example_input')
    ### end Alembic commands ###
