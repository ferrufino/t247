from rq import Queue
from redis import Redis

import subprocess
import json
import os
import api.evaluators.services

# Helper compilation settings for the available languages
arr_src_file = { "cpp" : "a.cpp", "java" : "Main.java" }
arr_obj_file = { "cpp" : "a.out", "java" : "Main.class"}
arr_compilation = { "cpp" : ["g++", "-o"], "java": ["javac"] }

# Directories
base_dir    = "/home/msf1013/Desktop/t247/Evaluator/"

# Method that returns custom response dictionary
def error_response(error):
    response = { "error" : error }
    print(response) 
    return { "error" : error }

# Method that destroys the Docker container with the given id
def remove_container(judge_name):
    process = subprocess.Popen(['sudo', 'docker', 'rm', judge_name, "-f"])
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
        os.system("sudo kill %s" % (process.pid,))
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
    test_cases    = []
    ctr_name      = "judge_" + str(judge_id)
    working_dir   = base_dir + "compilation/" + ctr_name  + "/"
    
    # Student submission parameters
    if (request_type == "submission"):
        problem_id    = request["problem_id"]
        problem_dir = base_dir + "problems/" + str(problem_id) + "/"
    # Problem creation parameters
    elif (request_type == "creation"):
        test_cases = request["test_cases"]          

    results = []
          
    src_file = ""
    obj_file = ""
    compilation_status = ""  
       
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
    
    # 1) Compile
    src_file = open(working_dir + arr_src_file[language], "w")
    src_file.write(code)
    src_file.close()
    
    if (language == "cpp"): # CPP
        process = subprocess.Popen(arr_compilation[language] + [arr_obj_file[language]] + [arr_src_file[language]], cwd=working_dir, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    elif (language == "java"): # Java
        process = subprocess.Popen(arr_compilation[language] + [arr_src_file[language]], cwd=working_dir, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    stdout, stderr = process.communicate()
    
    stdout = str(stdout, 'utf-8')
    stderr = str(stderr, 'utf-8')
    
    if (stdout is "" and stderr is ""):
        compilation_status = "compiled successfully"
    
        # Iterate over different test cases
        for test_no in range(total_tests):
        
            # 2) Create container
            process = subprocess.Popen(['sudo', 'docker', 'run', '-dit', '--name', ctr_name, 't247', 'bash'])
            
            # Capture errors while running Docker
            execution_status = wait_and_recover(process, 3, ctr_name)
            
            if (execution_status == False):
                return error_response("Error during container creation")
            
            # 3) Copy object file to container
            process = subprocess.Popen(['sudo', 'docker', 'cp', working_dir + arr_obj_file[language], ctr_name+':/'+arr_obj_file[language]])
            
            # Capture errors while running Docker
            execution_status = wait_and_recover(process, 3, ctr_name)
            
            if (execution_status == False):
                return error_response("Error while copying object code to container")            
            
            # 4) Copy input file to container
            
            # a) Problem creation: create file from string and copy it
            if (request_type == "creation"):
                with open(working_dir + "std_in.txt", "w+") as text_file:
                    print(test_cases[test_no], file=text_file, end="")
                process = subprocess.Popen(['sudo', 'docker', 'cp', working_dir + "std_in.txt", ctr_name+':/std_in.txt'])
            
            # b) Code submission: copy file from problem folder
            elif (request_type == "submission"):
                 process = subprocess.Popen(['sudo', 'docker', 'cp', problem_dir + "input/" + input_files[test_no], ctr_name+':/std_in.txt'])   
            
            # Capture errors while running Docker
            execution_status = wait_and_recover(process, 3, ctr_name)
            
            if (execution_status == False):
                return error_response("Error while copying input to container")
            
            # Delete input file
            if (request_type == "creation"):
                os.remove(working_dir + 'std_in.txt')
            
            # 5) Execute  
            process = subprocess.Popen(['sudo', 'docker', 'exec', ctr_name, 'python3', 'monitor.py', str(language), str(time_limit), str(memory_limit)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            try:
                status, placeholder = process.communicate(timeout=20)
                if (process.returncode != 0):
                    remove_container(ctr_name)
                    return error_response("Error while executing code inside container")
            except subprocess.TimeoutExpired:
                os.system("sudo kill %s" % (process.pid,))
                process.wait()
                remove_container(ctr_name)
                return error_response("Error while executing code inside container")            
            
            # 6) Stop container
            process = subprocess.Popen(['sudo', 'docker', 'stop', ctr_name])
            
            # Capture errors while running Docker
            execution_status = wait_and_recover(process, 3, ctr_name)
            
            if (execution_status == False):
                return error_response("Error while stopping container")

            # 7) Retrieve stdout from container
            process = subprocess.Popen(['sudo', 'docker', 'cp', ctr_name+':/std_out.txt', working_dir + 'std_out.txt'])
            
            # Capture errors while running Docker
            execution_status = wait_and_recover(process, 3, ctr_name)
            
            if (execution_status == False):
                return error_response("Error while retrieving output from container")
            
            # Remove files
            file = open(working_dir + "std_out.txt", "r")
            output = file.read()
            os.remove(working_dir + "std_out.txt")

            # 8) Kill container
            process = subprocess.Popen(['sudo', 'docker', 'rm', ctr_name, '-f'])
            process.wait()
            
            # Get expected output
            if (request_type == "submission"):
                file = open(problem_dir + "output/" + output_files[test_no], "r")
                expected_output = file.read()
                expected_output = expected_output[:-1]
            
            # 9) Insert test case entry in results array
            status = status.decode("UTF-8")
            
            # Compare actual vs expected output
            if (request_type == "submission"):
                if (status == "Successful Run"):
                    results.append("accepted" if (output == expected_output) else "wrong answer")
                else:
                    results.append(status)
            # Return output as is
            elif (request_type == "creation"):
                if (status == "Successful Run"):
                    results.append({ "status" : status, "output" : output })
                else:
                    results.append({ "status" : status })
        
        # Remove obj file
        os.remove(working_dir + arr_obj_file[language])
    else:
        compilation_status = "compilation error"
    
    # Remove src file
    os.remove(working_dir + arr_src_file[language])
            
    # Prepare returned object
    return_obj = {}
    return_obj["status"] = compilation_status
    if (compilation_status == "compiled successfully"):
        return_obj["test_cases"] = results
    
    print(return_obj)
    return return_obj  

# Method that runs an evaluation request using least busy worker
def request_evaluation(data):
    # Get most free queue
    q, judge_id = get_least_busy_queue()
    
    data["judge_id"] = judge_id
    
    job = q.enqueue_call(func=api.evaluators.services.evaluate, args=(data,), ttl=10000, timeout=60000000)
    
    # Immediate return after problem submission
    if (data["request_type"] == "submission"):
        return { "message" : "successful problem submission" }
    
    # Check job status in case of problem creation
    while (job.result is None and not job.is_failed):
        pass
    
    # Return result
    if (job.is_failed):
        return { "error" : "Internal evaluation error" }
    else:
        return job.result
    
# Method that returns the least busy worker queue
def get_least_busy_queue():
       
    arr_queues = []
    redis_conn = Redis()
    
    size  = 999999
    index = -1
    queue = None
    
    # Connect to queue
    for i in range(5):
         
        q = Queue("j_" + str(i), connection=redis_conn)
        if (len(q) < size):
            size  = len(q)
            index = i
            queue = q
    
    return queue, index

   

