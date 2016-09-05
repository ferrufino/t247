import subprocess
import os

arr_src_file = ["a.cpp", "Main.java"]
arr_obj_file = ["a.out", "Main.class"]
arr_compilation = [ ["g++", "-o"], ["javac"] ]

def evaluate(code, lang_id, problem_id, time_limit, mem_limit, total_tests, judge_id):
    results = []
    evaluation = {}
    evaluation["status"] = ""
    working_dir = "/home/msf1013/Desktop/Evaluator/compilation/judge_" + str(judge_id) + "/"
    problem_dir = "/home/msf1013/Desktop/Evaluator/problems/" + str(problem_id) + "/"
    ctr_name = "judge_" + str(judge_id)
    src_file = ""
    obj_file = ""
    process = ""
    
    # 1) Compile
    src_file = open(working_dir + arr_src_file[lang_id], "w")
    src_file.write(code)
    src_file.close()
    
    if (lang_id == 0): # CPP
        process = subprocess.Popen(arr_compilation[lang_id] + [arr_obj_file[lang_id]] + [arr_src_file[lang_id]], cwd=working_dir)
    elif (lang_id == 1): # Java
        process = subprocess.Popen(arr_compilation[lang_id] + [arr_src_file[lang_id]], cwd=working_dir)
    
    process.wait()
    
    # Iterate over different test cases
    for test_no in range(total_tests):
    
        # 2) Create container
        process = subprocess.Popen(['sudo', 'docker', 'run', '-dit', '--name', ctr_name, 'judge', 'bash'])
        process.wait()
        
        # 3) Copy object file to container
        process = subprocess.Popen(['sudo', 'docker', 'cp', working_dir + arr_obj_file[lang_id], ctr_name+':/'+arr_obj_file[lang_id]])
        process.wait()
        
        # 4) Copy input file to container
        process = subprocess.Popen(['sudo', 'docker', 'cp',  problem_dir + 'input_' + str(test_no) + '.txt', ctr_name+':/std_in.txt'])
        process.wait()
        
        process = subprocess.Popen(['sudo', 'docker', 'cp', '/home/msf1013/Desktop/Evaluator/evaluator.py', ctr_name+':/evaluator.py'])
        process.wait()
            
        # 5) Execute  
        process = subprocess.Popen(['sudo', 'docker', 'exec', ctr_name, 'python3', 'evaluator.py', str(lang_id), str(time_limit), str(mem_limit)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
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
    os.remove(working_dir + arr_src_file[lang_id])
    os.remove(working_dir + arr_obj_file[lang_id]) 

    return results

