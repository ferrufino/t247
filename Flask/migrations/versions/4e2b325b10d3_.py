"""empty message

Revision ID: 4e2b325b10d3
Revises: 7eaf01927cb0
Create Date: 2016-10-25 18:04:36.320837

"""

# revision identifiers, used by Alembic.
revision = '4e2b325b10d3'
down_revision = '7eaf01927cb0'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('assignment', sa.Column('due_date', sa.DateTime(), nullable=True))
    op.add_column('assignment', sa.Column('start_date', sa.DateTime(), nullable=True))
    op.add_column('assignment', sa.Column('title', sa.String(length=255), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('assignment', 'title')
    op.drop_column('assignment', 'start_date')
    op.drop_column('assignment', 'due_date')
    ### end Alembic commands ###
