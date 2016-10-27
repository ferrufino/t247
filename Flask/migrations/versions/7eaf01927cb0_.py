"""empty message

Revision ID: 7eaf01927cb0
Revises: 68d2bcfe12a3
Create Date: 2016-10-24 22:07:49.427578

"""

# revision identifiers, used by Alembic.
revision = '7eaf01927cb0'
down_revision = '68d2bcfe12a3'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('case', sa.Column('output', sa.Text(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('case', 'output')
    ### end Alembic commands ###