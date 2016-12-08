from flask_script import Command
from models import db, User

class CreateAdmin(Command):
    "creates admin"

    def run(self):
        new_user = User(email='admin@admin.com', first_name='Admin', last_name='admin',
                        role='admin', enrollment='l00admin')
        new_user.hash_password('admin')
        db.session.add(new_user)
        db.session.commit()

