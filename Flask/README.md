#Install programs

install pip

run "pip install -r requirements.txt"

(verify all requirements are installed, perhaps when you run python app.py you'll realize some are missing)

pip install psycopg2==2.6.1 Flask-SQLAlchemy===2.1 Flask-Migrate==1.8.0

###install psql - postgreSQL
CREATE DATABASE t247_dev;

\q

###install redis-server -    http://redis.io/topics/quickstart

install virtualenv   -    pip install virtualenv

export DATABASE_URL="postgresql://localhost/t247_dev"

#Activate Virtual Environment
source env/bin/activate
#Update Database
python manage.py db upgrade
#Run all programs
python manage.py runserver &

redis-server &

python app.py

#Create a User

Once you have everything running, go to localhost:5000/api 

Go to the tab of user and create a new user admin of your choice.

#Stop server:
control-c

fg

control-c

fg

control-c

deactivate
