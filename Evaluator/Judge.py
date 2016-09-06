import multiprocessing
import subprocess
import json
import socket
import os
import time
import random
from io import StringIO

# Judge Class in charge of compiling, executing, and evaluating
# student submitted code and updating the application's DB accordingly
class Judge(multiprocessing.Process):

    # Initialize instance 
    def __init__(self, judge_id, queue):
        multiprocessing.Process.__init__(self)
        self.judge_id = judge_id
        self.queue = queue
        # Web server's (destination) socket
        self.HOST = "localhost"
        self.PORT = 1013
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # Helper compilation settings for the available languages
        self.arr_src_file = ["a.cpp", "Main.java"]
        self.arr_obj_file = ["a.out", "Main.class"]
        self.arr_compilation = [ ["g++", "-o"], ["javac"] ]

    # Method that runs an evaluation request in a sandboxed environment (Docker container)
    # and returns the evaluation results
    def evaluate(self, request):
        results = []
        evaluation = {}
        evaluation["status"] = ""
        working_dir = "/home/msf1013/Desktop/t247/Evaluator/compilation/judge_" + str(self.judge_id) + "/"
        problem_dir = "/home/msf1013/Desktop/t247/Evaluator/problems/" + str(request["problem_id"]) + "/"
        ctr_name = "judge_" + str(self.judge_id)
        src_file = ""
        obj_file = ""
        process = ""
        
        # 1) Compile
        src_file = open(working_dir + self.arr_src_file[request["lang_id"]], "w")
        src_file.write(request["code"])
        src_file.close()
        
        if (request["lang_id"] == 0): # CPP
            process = subprocess.Popen(self.arr_compilation[request["lang_id"]] + [self.arr_obj_file[request["lang_id"]]] + [self.arr_src_file[request["lang_id"]]], cwd=working_dir)
        elif (request["lang_id"] == 1): # Java
            process = subprocess.Popen(self.arr_compilation[request["lang_id"]] + [self.arr_src_file[request["lang_id"]]], cwd=working_dir)
        
        process.wait()
        
        # Iterate over different test cases
        for test_no in range(request["total_tests"]):
        
            # 2) Create container
            process = subprocess.Popen(['sudo', 'docker', 'run', '-dit', '--name', ctr_name, 'judge', 'bash'])
            process.wait()
            
            # 3) Copy object file to container
            process = subprocess.Popen(['sudo', 'docker', 'cp', working_dir + self.arr_obj_file[request["lang_id"]], ctr_name+':/'+self.arr_obj_file[request["lang_id"]]])
            process.wait()
            
            # 4) Copy input file to container
            process = subprocess.Popen(['sudo', 'docker', 'cp',  problem_dir + 'input_' + str(test_no) + '.txt', ctr_name+':/std_in.txt'])
            process.wait()
            
            process = subprocess.Popen(['sudo', 'docker', 'cp', '/home/msf1013/Desktop/t247/Evaluator/evaluator.py', ctr_name+':/evaluator.py'])
            process.wait()
                
            # 5) Execute  
            process = subprocess.Popen(['sudo', 'docker', 'exec', ctr_name, 'python3', 'evaluator.py', str(request["lang_id"]), str(request["time_limit"]), str(request["mem_limit"])], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            status = process.stdout.read()
            process.wait()
            
            # 6) Stop container
            process = subprocess.Popen(['sudo', 'docker', 'stop', ctr_name])
            process.wait() 

            # 7) Retrieve stdout from container
            process = subprocess.Popen(['sudo', 'docker', 'cp', ctr_name+':/std_out.txt', working_dir + 'std_out.txt'])
            process.wait()
            file = open(working_dir + "std_out.txt", "r")
            output = file.read()
            os.remove(working_dir + "std_out.txt")

            # 8) Kill container
            process = subprocess.Popen(['sudo', 'docker', 'rm', ctr_name])
            process.wait()
            
            # 9) Insert test case entry in results array
            status = status.decode("UTF-8")
            if (status == "Successful Run"):
                results.append({ "status" : status, "output" : output})
            else:
                results.append({ "status" : status })
        
        # Remove src and obj files
        os.remove(working_dir + self.arr_src_file[request["lang_id"]])
        os.remove(working_dir + self.arr_obj_file[request["lang_id"]]) 

        return results

    # Infinite loop that listens for evaluation requests
    def run(self):
        while True:
            # Wait for element in the queue
            rawData = self.queue.get()
            if rawData is not None:
                # Transform to object
                request = json.load(StringIO(str(rawData, encoding="utf-8")))
                # Evaluate request
                result = self.evaluate(request)
                # Send results back to web server         
                self.socket.sendto(bytes(json.dumps(result), "utf-8"), (self.HOST, self.PORT))
        return
