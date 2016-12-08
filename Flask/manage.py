import os
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from create_admin import CreateAdmin
from app import app, db
import config


app.config.from_object(config.DevelopmentConfig)

migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)
manager.add_command('create_admin', CreateAdmin)

if __name__ == '__main__':
    manager.run()
