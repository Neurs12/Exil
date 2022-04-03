def detect(config: dict, main_file: str, main_file_path: str, output_path: str):
    #If the file extension is .pas, detect that file is Pascal
    if main_file.endswith(".pas"):
        #Check if pascal is supported or not.
        if "pascal" in config["support"]:
            #Check for command arguments.
            if config["langpath"]["pascal"] == "[environment variables]":
                cmd = f"fpc {main_file_path}"
            else:
                cmd = config["langpath"]["pascal"] + f"\\fpc.exe {main_file_path}"
        #If not supported, return "NOT_SUPPORTED"
        else:
            return "NOT SUPPORTED"

#-------- Apply the same algorithm to other files extensions --------#

    elif main_file.endswith(".c"):
        if "c" in config["support"]:
            if config["langpath"]["c"] == "[environment variables]":
                cmd = f"gcc {main_file_path} -o {output_path}.exe"
            else:
                cmd = config["langpath"]["c"] + f"\\gcc.exe {main_file_path} -o {output_path}.exe"
        else:
            return "NOT SUPPORTED"
    
    elif main_file.endswith(".cpp"):
        if "c" in config["support"]:
            if config["langpath"]["c"] == "[environment variables]":
                cmd = f"g++ {main_file_path} -o {output_path}.exe"
            else:
                cmd = config["langpath"]["c"] + f"\\g++.exe {main_file_path} -o {output_path}.exe"
        else:
            return "NOT SUPPORTED"

    elif main_file.endswith(".py"):
        if "python" in config["support"]:
            cmd = f"python {main_file_path}"
        else:
            return "NOT SUPPORTED"
    else:
        return False
    return cmd