import sys
from rq import Connection, Worker

import api.evaluators.services

# Provide queue names to listen to as arguments to this script,
# similar to rq worker
with Connection():

    total = int(sys.argv[1])
    queue_names = []    
    
    for num in range(total):
        queue_names.append("judge_" + str(num))    
    
    w = Worker(queue_names)
    w.work()

