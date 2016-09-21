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
        self.arr_src_file = { "cpp" : "a.cpp", "java" : "Main.java" }
        self.arr_obj_file = { "cpp" : "a.out", "java" : "Main.class"}
        self.arr_compilation = { "cpp" : ["g++", "-o"], "java": ["javac"] }

    # Method that runs student submitted code in a sandboxed environment (Docker container)
    # and returns the evaluation results
    def evaluate_submission(self, request):
        # Request elements
        submission_id = request["submission_id"]
        problem_id    = request["problem_id"]
        angular_id    = request["angular_id"]
        code          = request["code"]
        language      = request["language"]
        time_limit    = request["time_limit"]
        memory_limit  = request["memory_limit"]
    
        results = []
        evaluation = {}
        evaluation["status"] = ""
        working_dir = "/home/msf1013/Desktop/t247/Evaluator/compilation/judge_" + str(self.judge_id) + "/"
        problem_dir = "/home/msf1013/Desktop/t247/Evaluator/problems/" + str(problem_id) + "/"
        ctr_name = "judge_" + str(self.judge_id)
        src_file = ""
        obj_file = ""
        process = ""
        compilation_status = ""
        
        input_files = []
        output_files = []
        
        # Get input file names
        for file in os.listdir(problem_dir + "input/"):
            input_files.append(file)
        
        input_files.sort()
            
        # Get output file names
        for file in os.listdir(problem_dir + "output/"):
            output_files.append(file)
            print(file)
        
        output_files.sort()
        
        total_tests = len(input_files)
        
        # 1) Compile
        src_file = open(working_dir + self.arr_src_file[language], "w")
        src_file.write(code)
        src_file.close()
        
        if (language == "cpp"): # CPP
            process = subprocess.Popen(self.arr_compilation[language] + [self.arr_obj_file[language]] + [self.arr_src_file[language]], cwd=working_dir)
        elif (language == "java"): # Java
            process = subprocess.Popen(self.arr_compilation[language] + [self.arr_src_file[language]], cwd=working_dir)
        
        stdout, stderr = process.communicate()
        
        if (stdout is None and stderr is None):
            compilation_status = "compiled successfully"
        
            # Iterate over different test cases
            for test_no in range(total_tests):
            
                # 2) Create container
                process = subprocess.Popen(['sudo', 'docker', 'run', '-dit', '--name', ctr_name, 'judge', 'bash'])
                process.wait()
                
                # 3) Copy object file to container
                process = subprocess.Popen(['sudo', 'docker', 'cp', working_dir + self.arr_obj_file[language], ctr_name+':/'+self.arr_obj_file[language]])
                process.wait()
                
                # 4) Copy input file to container
                process = subprocess.Popen(['sudo', 'docker', 'cp', problem_dir + "input/" + input_files[test_no], ctr_name+':/std_in.txt'])
                process.wait()
                
                process = subprocess.Popen(['sudo', 'docker', 'cp', '/home/msf1013/Desktop/t247/Evaluator/evaluator.py', ctr_name+':/evaluator.py'])
                process.wait()
                    
                # 5) Execute  
                process = subprocess.Popen(['sudo', 'docker', 'exec', ctr_name, 'python3', 'evaluator.py', str(language), str(time_limit), str(memory_limit)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
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
                
                # Get expected output
                file = open(problem_dir + "output/" + output_files[test_no], "r")
                expected_output = file.read()
                expected_output = expected_output[:-1]
                
                # 9) Insert test case entry in results array
                status = status.decode("UTF-8")
                print("ACTUAL")
                print(output)
                print("EXPECTED")
                print(expected_output)
                print("---")
                if (status == "Successful Run"):
                    results.append("accepted" if (output == expected_output) else "wrong answer")
                else:
                    results.append(status)
        
            # Remove src and obj files
            os.remove(working_dir + self.arr_src_file[language])
            os.remove(working_dir + self.arr_obj_file[language]) 
        
        else:
            compilation_status = "compilation error"
        
        return_obj = {}
        return_obj["submission_id"] = submission_id
        return_obj["angular_id"]    = angular_id
        return_obj["status"]        = compilation_status
        if (compilation_status == "compiled successfully"):
            return_obj["test_cases"] = results
            
        return return_obj
    
    # Method that runs the code associated with a problem upload in a sandboxed environment (Docker container)
    # and returns the evaluation results
    def evaluate_upload(self, request):
        # Request elements
        problem_id    = request["temporary_problem_id"]
        angular_id    = request["angular_id"]
        code          = request["code"]
        language      = request["language"]
        time_limit    = request["time_limit"]
        memory_limit  = request["memory_limit"]
        test_cases    = request["test_cases"]
    
        results = []
        working_dir = "/home/msf1013/Desktop/t247/Evaluator/compilation/judge_" + str(self.judge_id) + "/"
        problem_dir = "/home/msf1013/Desktop/t247/Evaluator/problems/" + str(problem_id) + "/"
        ctr_name = "judge_" + str(self.judge_id)
        src_file = ""
        obj_file = ""
        process = ""
        compilation_status = ""
                       
        total_tests = len(test_cases)
        
        # 1) Compile
        src_file = open(working_dir + self.arr_src_file[language], "w")
        src_file.write(code)
        src_file.close()
        
        if (language == "cpp"): # CPP
            process = subprocess.Popen(self.arr_compilation[language] + [self.arr_obj_file[language]] + [self.arr_src_file[language]], cwd=working_dir)
        elif (language == "java"): # Java
            process = subprocess.Popen(self.arr_compilation[language] + [self.arr_src_file[language]], cwd=working_dir)
        
        stdout, stderr = process.communicate()
        
        if (stdout is None and stderr is None):
            compilation_status = "compiled successfully"
        
            # Iterate over different test cases
            for test_no in range(total_tests):
            
                # 2) Create container
                process = subprocess.Popen(['sudo', 'docker', 'run', '-dit', '--name', ctr_name, 'judge', 'bash'])
                process.wait()
                
                # 3) Copy object file to container
                process = subprocess.Popen(['sudo', 'docker', 'cp', working_dir + self.arr_obj_file[language], ctr_name+':/'+self.arr_obj_file[language]])
                process.wait()
                
                # 4) Create input file from string
                with open(working_dir + "std_in.txt", "w+") as text_file:
                    print(test_cases[test_no], file=text_file, end="")
                
                # Copy input file to container
                process = subprocess.Popen(['sudo', 'docker', 'cp', working_dir + "std_in.txt", ctr_name+':/std_in.txt'])
                process.wait()
                
                process = subprocess.Popen(['sudo', 'docker', 'cp', '/home/msf1013/Desktop/t247/Evaluator/evaluator.py', ctr_name+':/evaluator.py'])
                process.wait()
                
                os.remove(working_dir + "std_in.txt")
                    
                # 5) Execute  
                process = subprocess.Popen(['sudo', 'docker', 'exec', ctr_name, 'python3', 'evaluator.py', str(language), str(time_limit), str(memory_limit)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
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
                    results.append({ "status" : status, "output" : output })
                else:
                    results.append({ "status" : status })
        
            # Remove src and obj files
            os.remove(working_dir + self.arr_src_file[language])
            os.remove(working_dir + self.arr_obj_file[language]) 
        
        else:
            compilation_status = "compilation error"
        
        return_obj = {}
        return_obj["temporary_problem_id"] = problem_id
        return_obj["angular_id"]    = angular_id
        return_obj["status"]        = compilation_status
        if (compilation_status == "compiled successfully"):
            return_obj["test_cases"] = results
            
        return return_obj            

    # Infinite loop that listens for evaluation requests
    def run(self):
        while True:
            # Wait for element in the queue
            rawData = self.queue.get()
            
            if rawData is not None:
                # Transform to object
                request = json.load(StringIO(str(rawData, encoding="utf-8")))
                
                request_type = request["request_type"]
                
                if (request_type == "submission"):
                    result = self.evaluate_submission(request)
                elif (request_type == "upload"):
                    result = self.evaluate_upload(request)
                
                # Send results back to web server         
                self.socket.sendto(bytes(json.dumps(result), "utf-8"), (self.HOST, self.PORT))
        return
