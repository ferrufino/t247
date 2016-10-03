"""empty message

Revision ID: 647291ea6ec7
Revises: 0e5e585ccb91
Create Date: 2016-10-02 23:20:46.358604

"""

# revision identifiers, used by Alembic.
revision = '647291ea6ec7'
down_revision = '0e5e585ccb91'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('enrollment', sa.String(length=255), nullable=True))
    op.create_unique_constraint(None, 'user', ['enrollment'])
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'user', type_='unique')
    op.drop_column('user', 'enrollment')
    ### end Alembic commands ###
