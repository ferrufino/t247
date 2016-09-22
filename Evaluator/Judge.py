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
        self.ctr_name = "judge_" + str(self.judge_id)
        self.queue = queue
        # Web server's (destination) socket
        self.HOST = "localhost"
        self.PORT = 1013
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # Helper compilation settings for the available languages
        self.arr_src_file = { "cpp" : "a.cpp", "java" : "Main.java" }
        self.arr_obj_file = { "cpp" : "a.out", "java" : "Main.class"}
        self.arr_compilation = { "cpp" : ["g++", "-o"], "java": ["javac"] }
        # Directories
        self.base_dir    = "/home/msf1013/Desktop/t247/Evaluator/"
        self.working_dir = self.base_dir + "/compilation/judge_" + str(self.judge_id) + "/"

    # Method that runs submitted code in a sandboxed environment (Docker container)
    # and returns the evaluation results
    def evaluate(self, request):
               
        # Base parameters     
        request_type  = request["request_type"]       
        angular_id    = request["angular_id"]
        code          = request["code"]
        language      = request["language"]
        time_limit    = request["time_limit"]
        memory_limit  = request["memory_limit"]
        problem_id    = -1
        submission_id = -1
        test_cases    = []
        
        # Student submission parameters
        if (request_type == "submission"):
            problem_id    = request["problem_id"]
            submission_id = request["submission_id"]
            problem_dir = self.base_dir + "problems/" + str(problem_id) + "/"
        # Problem upload parameters
        elif (request_type == "upload"):
            problem_id = request["temporary_problem_id"]
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
        elif (request_type == "upload"):
            total_tests = len(test_cases)
        
        # 1) Compile
        src_file = open(self.working_dir + self.arr_src_file[language], "w")
        src_file.write(code)
        src_file.close()
        
        if (language == "cpp"): # CPP
            process = subprocess.Popen(self.arr_compilation[language] + [self.arr_obj_file[language]] + [self.arr_src_file[language]], cwd=self.working_dir, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        elif (language == "java"): # Java
            process = subprocess.Popen(self.arr_compilation[language] + [self.arr_src_file[language]], cwd=self.working_dir, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        stdout, stderr = process.communicate()
        
        stdout = str(stdout, 'utf-8')
        stderr = str(stderr, 'utf-8')
        
        if (stdout is "" and stderr is ""):
            compilation_status = "compiled successfully"
        
            # Iterate over different test cases
            for test_no in range(total_tests):
            
                # 2) Create container
                process = subprocess.Popen(['sudo', 'docker', 'run', '-dit', '--name', self.ctr_name, 'judge', 'bash'])
                process.wait()
                
                # 3) Copy object file to container
                process = subprocess.Popen(['sudo', 'docker', 'cp', self.working_dir + self.arr_obj_file[language], self.ctr_name+':/'+self.arr_obj_file[language]])
                process.wait()
                               
                
                # 4) Copy input file to container
                
                # a) Problem upload: create file from string and copy it
                if (request_type == "upload"):
                    with open(self.working_dir + "std_in.txt", "w+") as text_file:
                        print(test_cases[test_no], file=text_file, end="")
                    process = subprocess.Popen(['sudo', 'docker', 'cp', self.working_dir + "std_in.txt", self.ctr_name+':/std_in.txt'])
                
                # b) Code submission: copy file from problem folder
                elif (request_type == "submission"):
                     process = subprocess.Popen(['sudo', 'docker', 'cp', problem_dir + "input/" + input_files[test_no], self.ctr_name+':/std_in.txt'])   
                
                process.wait()
                
                # Delete input file
                if (request_type == "upload"):
                    os.remove(self.working_dir + 'std_in.txt')
                
                # Copy evaluator script to container
                # TODO: Copy script to container during image creation 
                # (currently copying script in runtime in order to allow quick changes)
                process = subprocess.Popen(['sudo', 'docker', 'cp', self.base_dir + 'evaluator.py', self.ctr_name+':/evaluator.py'])
                process.wait()
                    
                # 5) Execute  
                process = subprocess.Popen(['sudo', 'docker', 'exec', self.ctr_name, 'python3', 'evaluator.py', str(language), str(time_limit), str(memory_limit)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                #status = process.stdout.read()
                status, placeholder = process.communicate()
                print("MALO" + str(process.returncode))
                print(str(status))                
                
                # 6) Stop container
                process = subprocess.Popen(['sudo', 'docker', 'stop', self.ctr_name])
                process.wait() 

                # 7) Retrieve stdout from container
                process = subprocess.Popen(['sudo', 'docker', 'cp', self.ctr_name+':/std_out.txt', self.working_dir + 'std_out.txt'])
                process.wait()
                file = open(self.working_dir + "std_out.txt", "r")
                output = file.read()
                os.remove(self.working_dir + "std_out.txt")

                # 8) Kill container
                process = subprocess.Popen(['sudo', 'docker', 'rm', self.ctr_name])
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
                elif (request_type == "upload"):
                    if (status == "Successful Run"):
                        results.append({ "status" : status, "output" : output })
                    else:
                        results.append({ "status" : status })
            
            # Remove obj file
            os.remove(self.working_dir + self.arr_obj_file[language])
        else:
            compilation_status = "compilation error"
        
        # Remove src file
        os.remove(self.working_dir + self.arr_src_file[language])
                
        # Prepare returned object
        return_obj = {}
        return_obj["angular_id"]    = angular_id
        return_obj["status"]        = compilation_status
        if (compilation_status == "compiled successfully"):
            return_obj["test_cases"] = results
        
        if (request_type == "submission"):
            return_obj["submission_id"] = submission_id
        elif (request_type == "upload"):
            return_obj["temporary_problem_id"] = problem_id
        
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
                
                result = self.evaluate(request)
                
                # Send results back to web server         
                self.socket.sendto(bytes(json.dumps(result), "utf-8"), (self.HOST, self.PORT))
        return
