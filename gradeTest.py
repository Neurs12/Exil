import subprocess, time, os.path
from Kthreading import KThread
from detectLang import detect

global run_test, start_time

#Original directory for later
original_dir = os.getcwd()

def safe_remove(file):
    #This is just the safe remove file, stuff...
    try:
        os.remove(file)
    except:
        pass

def CheckLimit(time_limit):
    global run_test, start_time
    """
    Check for 2 things:
    - If the program is still running and does it exceeded the time limit.
    Reason for adding 0.5 second to time_limit:
    - To make sure that it's exceeded the limit.
    - This thread only kills the program when it's exceeded the time limit.
    """
    while True:
        try:
            if run_test.poll() == None and time.perf_counter() - start_time > time_limit + 0.5:
                run_test.kill()
        except:
            pass
        time.sleep(0.1)

def Test(config: dict, problem: str, profile: str, inp_out_type, time_limit: float):
    global run_test, start_time

    """
    How does it work:
    - Using the config, the profile name and the problem name.
    - config have a lot of things needed for this job.
    - First of all: Define subs to record scores.
    - Next: get insensitive_char_problem to remove all the possibility of wrong name or character sensitive.
    - Define has_file: In next lines, the program will look for the file, if not, has_file will stay False and the whole process will stop
    - detect(): A function in a custom package detectLang.py
        + Return False if cannot detect none of the three languages
        + Return "NOT SUPPORTED" if the program detected the language, but it's not supported.
    - Start a check time limit thread: If the program exceeded the time_limit, the thread will kill the process, and let the main thread finishes.
    - KThread(): A function in a custom package Kthreading.py
        + Added kill() function to terminate thread.
        + Source code (Internet Archive since the original link is unavailable): https://web.archive.org/web/20130503082442/http://mail.python.org/pipermail/python-list/2004-May/281943.html
    """

    subs = []
    #subs meaning:
    #1: Success
    #0: Failed
    #2: Time limit exceeded
    insensitive_char_problem = problem.lower()

    has_file = False

    #Check if the profile has the problem's file.
    for files in os.listdir(config["profiles-location"]+f"\\{profile}"):
        files = files.lower()
        if files.startswith(insensitive_char_problem):
            has_file = True
            main_file = files
            break

    #If not, return "NO FILE".
    if not has_file:
        return "NO FILE"

    #Come in handy later.
    main_file_path = config["profiles-location"]+f"\\{profile}\\{main_file}"
    output_path = config["profiles-location"]+f"\\{profile}\\{insensitive_char_problem}"
    
    #Find what language of the file.
    cmd = detect(config, main_file, main_file_path, output_path)

    #Check if the output.
    if cmd == False:
        return "CANNOT DETECT LANGUAGE"

    #Python is a interpreter language. C/C++ and Pascal need to be compiled.
    if not cmd.startswith("python"):
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE)
        proc.communicate()
        if not os.path.isfile(f"{output_path}.exe"):
            return {
                "score": 0,
                "reason": "Runtime error! Compile failed."
            }
    
    #Get the location of test cases,
    #if there isn't a folder, return "TEST CASES NOT FOUND".
    try:
        cases = os.listdir(config["test-cases-location"]+f"\\{problem}\\INP")
    except:
        return "TEST CASES NOT FOUND"

    #Start a check time limit thread.
    check_for_limit = KThread(target=CheckLimit, args=(time_limit, ))
    check_for_limit.start()

    #Go through the folder.
    for i in cases:

        #Looking for .inp file.
        if i.endswith(".inp"):

            #Check for 2 types of given input/output.
            #STDIN/STDOUT: Standard Input/ Output (Console).
            #FILE: File Input/Output.

            if inp_out_type == "FILE":

                #Read input from test cases folder.
                with open(config["test-cases-location"]+f"\\{problem}\\INP\\{i}", "r") as case_file:
                    #Write input to output path folder.
                    with open(f"{output_path}.inp", "w+") as inp:
                        inp.write(case_file.read())

                #Change directory to profile folder to execute.
                os.chdir(config["profiles-location"]+f"\\{profile}")
                
                #Execute program.
                if cmd.startswith("python"):
                    run_test = subprocess.Popen(cmd)
                else:
                    run_test = subprocess.Popen(f"{output_path}.exe")

                #Get execute time stamp.
                start_time = time.perf_counter()

                #While running, thread will start doing thier job.
                #Check if the running program exceeded time limit.
                #If yes, kill the process.
    
                #Communicate will wait for the program to finishes.
                run_test.communicate()

                #When finished, get time when it's finished.
                run_time = time.perf_counter() - start_time

                #Define function result variable to store output.
                result = ""
                
                #Check if there is a output file.
                #If not, return 0 (failed)
                #Also get the result. Delete all \n and \r, only plain text.
                try:
                    with open(f"{output_path}.out", "r") as out:
                        result = out.read().replace("\n", "").replace("\r", "")
                except:
                    subs.append(0)
                    continue

                #-- Process output --#
            

            if inp_out_type == "STDIN/OUT":

                #Read input from test cases folder to inp_text since this is stdin.
                inp_text = ""
                with open(config["test-cases-location"]+f"\\{problem}\\INP\\{i}", "r") as case_file:
                    inp_text = case_file.read()
                
                #Change directory to profile folder to execute.
                os.chdir(config["profiles-location"]+f"\\{profile}")

                #Execute program.
                if cmd.startswith("python"):
                    run_test = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
                else:
                    run_test = subprocess.Popen(f"{output_path}.exe", stdin=subprocess.PIPE, stdout=subprocess.PIPE)

                #Get execute time stamp.
                start_time = time.perf_counter()

                #While running, thread will start doing thier job.
                #Check if the running program exceeded time limit.
                #If yes, kill the process.
    
                #Write input to stdin.
                #Communicate will wait for the program to finishes.
                #Define result to catch stdout
                run_test.stdin.write(str.encode(inp_text))
                result = run_test.communicate()

                #When finished, get time when it's finished.
                run_time = time.perf_counter() - start_time

                #Get the result decoded. Delete all \n and \r, only plain text.
                result = str(result[0].decode()).replace("\n", "").replace("\r", "")

            #Main code to start
            with open(config["test-cases-location"]+f"\\{problem}\\OUT\\{i[0:len(i)-4]}.out", "r") as out_file:
                #Get the output. Delete all \n and \r, only plain text.
                final_out = out_file.read().replace("\n", "").replace("\r", "")
                
                #If run_time <= time_result
                #   + If output == result
                #        + Success!
                #   + If output != result
                #        + Failed.
                #Else: Time limit exceeded
                if run_time <= time_limit:
                    if final_out == result:
                        status_code = 1
                    else:
                        status_code = 0
                else:
                    status_code = 2

                #Append status_code to subs
                subs.append(status_code)

    #When's all done, kill the thread
    check_for_limit.kill()

    #Change directory to default
    os.chdir(original_dir)

    #Remove all component
    safe_remove(f"{output_path}.exe")
    safe_remove(f"{output_path}.o")
    safe_remove(f"{output_path}.inp")
    safe_remove(f"{output_path}.out")
    safe_remove(f"{os.getcwd()}\\{problem}.out")
    
    #And return subs
    return subs
