import os
import resource
import signal
import psutil
import subprocess
import sys

'''
    psutil has to be installed since it isn't a native Python library
        - Download from: https://pypi.python.org/pypi/psutil
'''

language = sys.argv[1]
time_limit = int(sys.argv[2]) # seconds
mem_limit = int(sys.argv[3])  # megabytes

mem_limit = mem_limit * 1000000 # bytes

# Get memory usage
def getMemoryUsage(pid):
    # Put file contents in string
    try:
        with open("/proc/%d/status" % (pid), "r") as file:
            lines = file.read()
    except:
        return(-1)

    stack = 0
    data = 0

    # Get stack memory size
    for line in lines.split("\n"):
        if ("VmStk" in line):
            stack = int(line.split()[1])

    # Get data memory size
    for line in lines.split("\n"):
        if ("VmData" in line):
            data = int(line.split()[1])
    return (stack + data)

# Set resource limits
def set_limits():
    global time_limit 

    print("time")
    # Time 
    resource.setrlimit(resource.RLIMIT_CPU, (time_limit, 5))

    print("data")
    # Data
    resource.setrlimit(resource.RLIMIT_DATA, (mem_limit, 256000000))

    print("stack")
    # Stack
    resource.setrlimit(resource.RLIMIT_STACK, (mem_limit, 256000000))

    print("nproc")
    # Number of processes the current process may create
    resource.setrlimit(resource.RLIMIT_NPROC, (0, 0))
    
    print("stdin")
    # Redirect STDIN
    redirectionSTDIN = os.open("std_in.txt", os.O_RDONLY)
    os.dup2(redirectionSTDIN,0)
    
    print("stdout")
    # Redirect STDOUT
    redirectionSTDOUT = os.open("std_out.txt", os.O_RDWR|os.O_CREAT)
    os.dup2(redirectionSTDOUT,1)

    print("stderr")
    # Redirect STDERROR
    redirectionSTDERROR = os.open('std_err.txt', os.O_RDWR|os.O_CREAT)
    os.dup2(redirectionSTDERROR, 2)

# Spawn child process
pro = ""
if (language == "cpp"): # CPP
    pro = subprocess.Popen(["./a.out"], preexec_fn=set_limits)
elif (language == "java"): # Java
    pro = subprocess.Popen(["java", "Main"], preexec_fn=set_limits)

pid = pro.pid
p = psutil.Process(pid)
status = None

# Monitor child process
while (p.status() == psutil.STATUS_RUNNING):
    # Check memory exceeded
    mem = getMemoryUsage(pid)
    #print(mem)
    if (mem > mem_limit or mem < 0):
        status = "MLE"
        os.kill(pid,0)
        break
   
pro.wait()

# Check termination by timeout
if (pro.returncode == -24):
    print("time limit exceeded", end="")
# Check termination by memory limit exceeded
elif (status == "MLE"):
     print("memory limit exceeded", end="")
# Check proper termination
elif (pro.returncode == 0):
     print("successful run", end="")
# Check termination by any other condition (runtime error)
else:
     print("runtime error", end="")




