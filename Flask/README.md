#Install programs
install pip

run "pip install -r requirements.txt"

(verify all requirements are installed, perhaps when you run python app.py you'll realize some are missing)

install redis-server -    http://redis.io/topics/quickstart

install virtualenv   -    pip install virtualenv

#Activate Virtual Environment
source env/bin/activate
#Update Database
python manage.py db upgrade
#Run all programs
python manage.py runserver &

redis-server &

python app.py

#Stop server:
control-c

fg

control-c

fg

control-c

deactivate
