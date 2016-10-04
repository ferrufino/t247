#Install programs
install redis-server
install virtualenv   -    pip install virtualenv

#Activate Virtual Environment
source env/bin/activate

python manage.py db upgrade
#Run all programs
python manage.py runserver &
redis-server &
python app.py

#to stop server:
control-c
fg
control-c
fg
control-c

