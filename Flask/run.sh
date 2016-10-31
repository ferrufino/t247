#! /bin/bash

#Activates virtual environment
source env/bin/activate

#Runs server in background

nohup python app.py &


#Runs rq workers
nohup rq worker j_0 &
nohup rq worker j_1 &
nohup rq worker j_2 &
nohup rq worker j_3 &
nohup rq worker j_4 &

