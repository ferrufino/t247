from rq import Queue
from redis import Redis

import subprocess
import json
import os
import api.evaluators.services
from enums import SubmissionState

import requests
import json
import time
import random

# Helper compilation settings for the available languages
arr_src_file = { "cpp" : "a.cpp", "java" : "Main.java" }
arr_obj_file = { "cpp" : "a.out", "java" : "Main.class"}
arr_compilation = { "cpp" : ["g++", "-o"], "java": ["javac"] }

# Directories
base_dir    = "/var/www/t247/Evaluator/"

# Method that returns custom response dictionary
def error_response(error, submission_id):
    response = { "status" : "error", "error" : error }
    print(response)
    if (submission_id != -1):
        submission_response = {}
        if (error == "Error while compiling code inside container"):
            submission_response["status"] = SubmissionState.compilation_error.value
        else:
            submission_response["status"] = SubmissionState.internal_server_error.value
        submission_response["submission_id"] = submission_id
        requests.post("http://localhost/api/evaluator/problem_submission_result", json=submission_response) 
    return response

# Method that destroys the Docker container with the given id
def remove_container(judge_name):
    process = subprocess.Popen(['docker', 'rm', judge_name, "-f"])
    process.wait()

# Method that returns a Boolean value indicating if the process execution
# was successful or not. It takes care of terminating the Docker container in case of failure
def wait_and_recover(process, timeout, judge_name):
    try:
        process.wait(timeout=timeout)
        if (process.returncode != 0):
            remove_container(judge_name)
            return False
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait()
        remove_container(judge_name)
        return False
    return True
   
# Method that runs submitted code in a sandboxed environment (Docker container)
# and returns the evaluation results
def evaluate(request):

    # Base parameters     
    request_type   = request["request_type"]
    code           = request["code"]
    language       = request["language"]
    time_limit     = request["time_limit"]
    memory_limit   = request["memory_limit"]
    judge_id       = request["judge_id"]
    
    problem_id    = -1
    submission_id = -1
    test_cases    = []
    ctr_name      = "judge_" + str(judge_id)
    working_dir   = base_dir + "compilation/" + ctr_name  + "/"
    
    # Student submission parameters
    if (request_type == "submission"):
        problem_id    = request["problem_id"]
        submission_id = request["submission_id"]
        problem_dir = base_dir + "problems/" + str(problem_id) + "/"
    # Problem creation parameters
    elif (request_type == "creation"):
        test_cases = request["test_cases"]          

    results = []
          
    src_file = ""
    obj_file = ""
    compilation_status = "compilation error"  
       
    input_files  = []
    output_files = []
    total_tests  = -1
    
    # Retrieve input/output files' names
    if (request_type == "submission"):
        # Get input file names
        for file in os.listdir(problem_dir + "input/"):
            input_files.append(file)
        
        input_files.sort()
            
        # Get output file names
        for file in os.listdir(problem_dir + "output/"):
            output_files.append(file)
        
        output_files.sort()
    
        total_tests = len(input_files)
    
    # Calculate total of incoming test cases
    elif (request_type == "creation"):
        total_tests = len(test_cases)
    
    # 1) Compile code
    
    # Write code to file
    src_file = open(working_dir + arr_src_file[language], "w")
    src_file.write(code)
    src_file.close()
    
    # 1.1) Start container
    process = subprocess.Popen(['docker', 'run', '--security-opt', 'no-new-privileges', '--cap-drop', 'all', '--network', 'none', '-m', '500m', '-dit', '--name', ctr_name, 't247', 'bash'])
    
    # Capture errors while running Docker
    execution_status = wait_and_recover(process, 3, ctr_name)
    
    if (execution_status == False):
        return error_response("Error while starting container for code compilation", submission_id)
    
    # 1.2) Copy source file to container
    process = subprocess.Popen(['docker', 'cp', working_dir + arr_src_file[language], ctr_name+':/home/prisoner/'+arr_src_file[language]])
    
    # Capture errors while running Docker
    execution_status = wait_and_recover(process, 3, ctr_name)
    
    if (execution_status == False):
        return error_response("Error while copying source file to container for code compilation", submission_id)
    
    # 1.3) Compile source file
    if (language == 'cpp'):
        process = subprocess.Popen(['docker', 'exec', ctr_name, 'g++', '-std=c++11', 'a.cpp', '-o', 'a.out'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    elif (language == 'java'):
        process = subprocess.Popen(['docker', 'exec', ctr_name, 'javac', 'Main.java'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
    try:
        stdout, stderr = process.communicate(timeout=20)
        if (process.returncode != 0):
            remove_container(ctr_name)
            return error_response("Error while compiling code inside container", submission_id)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait()
        remove_container(ctr_name)
        return error_response("Error while compiling code inside container", submission_id)
          
    # Verify proper compilation    
    stdout = str(stdout, 'utf-8')
    stderr = str(stderr, 'utf-8')
    
    if (stdout is "" and stderr is ""):
    
        compilation_status = "compiled successfully"

        # Iterate over different test cases
        for test_no in range(total_tests):                           
                       
            # 4) Copy input file to container
            
            # a) Problem creation: create file from string and copy it
            if (request_type == "creation"):
                with open(working_dir + "std_in.txt", "w+") as text_file:
                    print(test_cases[test_no], file=text_file, end="")
                process = subprocess.Popen(['docker', 'cp', working_dir + "std_in.txt", ctr_name+':/home/prisoner/std_in.txt'])
            
            # b) Code submission: copy file from problem folder
            elif (request_type == "submission"):
                 process = subprocess.Popen(['docker', 'cp', problem_dir + "input/" + input_files[test_no], ctr_name+':/home/prisoner/std_in.txt'])   
            
            # Capture errors while running Docker
            execution_status = wait_and_recover(process, 3, ctr_name)
            
            if (execution_status == False):
                return error_response("Error while copying input to container", submission_id)

            # 5) Copy monitor.py to container
            
            # a) Problem creation: create file from string and copy it
            process = subprocess.Popen(['docker', 'cp', base_dir + 'monitor.py', ctr_name+':/home/prisoner/monitor.py'])   
            
            # Capture errors while running Docker
            execution_status = wait_and_recover(process, 3, ctr_name)
            
            if (execution_status == False):
                return error_response("Error while copying monitor.py to container", submission_id)
                
            # 6) Execute  
            process = subprocess.Popen(['docker', 'exec', ctr_name, 'python3', 'monitor.py', str(language), str(time_limit), str(memory_limit)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

            try:
                status, placeholder = process.communicate(timeout=5)
                if (process.returncode != 0):
                    remove_container(ctr_name)
                    return error_response("Error while executing code inside container", submission_id)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()
                remove_container(ctr_name)
                return error_response("Error while executing code inside container", submission_id) 
            
            # 7) Retrieve stdout from container
            process = subprocess.Popen(['docker', 'cp', ctr_name+':/home/prisoner/std_out.txt', working_dir + 'std_out.txt'])
            
            # Capture errors while running Docker
            execution_status = wait_and_recover(process, 3, ctr_name)
            
            if (execution_status == False):
                return error_response("Error while retrieving output from container", submission_id)
           
            # Remove files
            file = open(working_dir + "std_out.txt", "r")
            output = file.read()
            os.remove(working_dir + "std_out.txt")

            # 8.1) Clear stdout contents in container
            process = subprocess.Popen(['docker', 'exec', '--user', 'prisoner', ctr_name, 'cp', '/dev/null', '/home/prisoner/std_out.txt'])
            
            # Capture errors while running Docker
            execution_status = wait_and_recover(process, 3, ctr_name)

            if (execution_status == False):
                return error_response("Error while clearing stdout contents in container", submission_id)

            # 8.2) Clear stderr contents in container
            process = subprocess.Popen(['docker', 'exec', '--user', 'prisoner', ctr_name, 'cp', '/dev/null', '/home/prisoner/std_err.txt'])
            
            # Capture errors while running Docker
            execution_status = wait_and_recover(process, 3, ctr_name)

            if (execution_status == False):
                return error_response("Error while clearing stderr contents in container", submission_id)
                        
            # Get expected output
            if (request_type == "submission"):
                file = open(problem_dir + "output/" + output_files[test_no], "r")
                expected_output = file.read()
                expected_output = expected_output[:-1]
           
            # 9) Insert test case entry in results array
            status = status.decode("UTF-8")
                        
            # Compare actual vs expected output
            if (request_type == "submission"):
                if (status == "successful run"):
                    results.append("accepted" if (output == expected_output) else "wrong answer")
                else:
                    results.append(status)
            # Return output as is
            elif (request_type == "creation"):
                if (status == "successful run"):
                    results.append({ "status" : status, "output" : output })
                else:
                    results.append({ "status" : status })

        # 10) Kill container
        #process = subprocess.Popen(['docker', 'rm', ctr_name, '-f'])
        #process.wait()      
              
    # Remove src file
    os.remove(working_dir + arr_src_file[language])
                        
    # Prepare returned object
    return_obj = {}
    return_obj["status"] = compilation_status
    if (compilation_status == "compiled successfully"):
        return_obj["test_cases"] = results
       
    if (request_type == "submission"):
        return_obj["status"] = SubmissionState.evaluated.value
        return_obj["submission_id"] = submission_id
        requests.post("http://localhost/api/evaluator/problem_submission_result", json=return_obj) 
    
    return return_obj 
        

# Method that runs an evaluation request using least busy worker
def request_evaluation(data):
    # Get most free queue
    q, judge_id = get_least_busy_queue()
    
    data["judge_id"] = judge_id
    
    job = q.enqueue_call(func=api.evaluators.services.evaluate, args=(data,), ttl=10000, timeout=60000000)
    
    # Immediate return after problem submission
    if (data["request_type"] == "submission"):
        return { "status" : "ok" }
    
    # Check job status in case of problem creation
    while (job.result is None and not job.is_failed):
        time.sleep(3)
    
    # Return result
    if (job.is_failed):
        response = { "status" : "error", "error" : "Internal evaluation error" }
    else:
        response = job.result
    
    print(response)

    #requests.post("http://localhost/execution_result", data=response)
    return response   
    
# Method that returns the least busy worker queue
def get_least_busy_queue():
       
    arr_queues = []
    redis_conn = Redis()
    
    size  = 999999
    potential_queues = []
    
    # Connect to queue
    for i in range(5):
         
        q = Queue("j_" + str(i), connection=redis_conn)
        if (len(q) < size):
            size = len(q)
            potential_queues.clear()
            potential_queues.append([q, i])
        elif (len(q) == size):
            potential_queues.append([q, i])

    pair = random.choice(potential_queues)

    queue = pair[0]
    index = pair[1]

    return queue, index

# Method that creates the 
def upload_problem(data):
    test_cases  = data['test_cases']

    # Create problem directory
    problem_dir = base_dir + 'problems/' + str(data['problem_id']) + '/'
    os.mkdir(problem_dir)

    # Create input and output folders
    input_dir  = problem_dir + 'input/'
    output_dir = problem_dir + 'output/'

    os.mkdir(input_dir)
    os.mkdir(output_dir)

    # Create input and output files
    for i in range(len(test_cases)):
        # Input
        with open(input_dir + str(i), "w+") as text_file:
            print(test_cases[i]['input'], file=text_file)

        # Output
        with open(output_dir + str(i), "w+") as text_file:
            print(test_cases[i]['output'], file=text_file)

    return { 'status' : 'ok' }   
   

