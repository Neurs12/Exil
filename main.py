import os.path
from tkinter import *
from json import dumps, loads

from flask import Flask, send_file, request

from tkinter import Tk
from tkinter.ttk import *

from gradeTest import Test

global table
table = {}

app = Flask("ui")

global config

config = None

with open("main.json", "r") as o:
  config = o.read()

config = loads(config)
if "\\" not in config["profiles-location"]:
  config["profiles-location"] = os.getcwd()+"\\"+config["profiles-location"]
  with open("main.json", "w") as save:
    save.write(dumps(config, indent=2))

if "\\" not in config["test-cases-location"]:
  config["test-cases-location"] = os.getcwd()+"\\"+config["test-cases-location"]
  with open("main.json", "w") as save:
    save.write(dumps(config, indent=2))



@app.route("/")
def home():
    return send_file("index.html")

@app.route("/styles/style.css")
def css():
  return send_file("styles/style.css")

@app.route("/scripts/main.js")
def js():
  return send_file("scripts/main.js")

@app.route("/styles/materialize.css")
def materializecss():
  return send_file("styles/materialize.css")

@app.route("/scripts/materialize.js")
def materializejs():
  return send_file("scripts/materialize.js")

@app.route("/scripts/passive-events.js")
def passive():
  return send_file("scripts/passive-events.js")

@app.route("/fonts/MaterialIcons.css")
def mi():
  return send_file("fonts/MaterialIcons.css")

@app.route("/fonts/MaterialIconsOutlined.css")
def mio():
  return send_file("fonts/MaterialIconsOutlined.css")

@app.route("/fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2")
def idk():
  return send_file("fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2")

@app.route("/fonts/gok-H7zzDkdnRel8-DQ6KAXJ69wP1tGnf4ZGhUce.woff2")
def idk2():
  return send_file("fonts/gok-H7zzDkdnRel8-DQ6KAXJ69wP1tGnf4ZGhUce.woff2")

@app.route("/favicon.ico")
def favicon():
  return ""
  




@app.route("/gettable")
def geetTable():
  global table

  table = {}

  table["profiles"] = []
  for i in os.listdir(config["profiles-location"]):
    if os.path.isdir(config["profiles-location"]+f"\\{i}"):
      table["profiles"].append(i)

  table["problems"] = []
  table["IOtype"] = {}
  for i in os.listdir(config["test-cases-location"]):
    if os.path.isdir(config["test-cases-location"]+"\\"+i):
      table["problems"].append(i)
      table["IOtype"][i] = "STDIN/OUT"
  
  with open("problem_config.json", "r") as o:
    table["IOtype"].update(loads(o.read()))

  with open("problem_config.json", "w") as o:
    o.write(dumps(table["IOtype"], indent=2))
  
  table["scores"] = {}
  for i in table["problems"]:
    table["scores"][i] = {}
    for j in table["profiles"]:
      table["scores"][i][j] = 0.0
  

  return dumps(table)



@app.route("/getuser")
def getuser():
  return os.getlogin()

@app.route("/services-location")
def slocation():
  return dumps([config["test-cases-location"], config["profiles-location"]])

@app.route("/supported-language")
def getsupported():
  return dumps(config["support"])

@app.route("/langpath")
def langpath():
  return dumps(config["langpath"])

in_settings = False

@app.route("/disable/<lang>")
def disable_s_lang(lang):
  if lang in config["support"]:
    config["support"].remove(lang)
    with open("main.json", "w") as save:
      save.write(dumps(config, indent=2))
  return ""

@app.route("/enable/<lang>")
def enable_s_lang(lang):
  if lang not in config["support"]:
    config["support"].append(lang)
    with open("main.json", "w") as save:
      save.write(dumps(config, indent=2))
  return ""

@app.route("/set-theme/<mode>")
def set_theme(mode):
  config["theme"] = mode
  with open("main.json", "w") as save:
    save.write(dumps(config, indent=2))
  return ""

@app.route("/change-location/<what>/<where>")
def changelocation(what, where):

  if where != "[environment variables]":
    if not os.path.isdir(where):
      return f"{what}"
  else:
    config["langpath"][what] = where
    with open("main.json", "w") as save:
      save.write(dumps(config, indent=2))

    return "done"
  
  if what in ["python", "c", "pascal"]:
    config["langpath"][what] = where

  if what in ["profiles-location", "test-cases-location"]:
    config[what] = where

  with open("main.json", "w") as save:
    save.write(dumps(config, indent=2))

  return f"done"

@app.route("/change-io-type/<problem>/<IOtype>")
def change_io_type(problem, IOtype):
  if IOtype == "STDIN-STDOUT":
    IOtype = "STDIN/OUT"

  table["IOtype"][problem] = IOtype

  with open("problem_config.json", "w") as o:
    o.write(dumps(table["IOtype"], indent=2))
  return ""

global test_result
test_result = {}

@app.route("/start", methods=["POST"])
def start():
  global test_result

  if request.method == "POST":
    print(request.get_json())
    test_user = request.get_json()
    for profile in test_user["profiles"]:
      test_result[profile] = {}
      for problem in test_user["problems"]:
        test_result[profile][problem] = Test(config, problem, profile, table["IOtype"][problem], 1)
    return ""

@app.route("/get-result")
def among():
  return dumps(test_result)

app.run("0.0.0.0", config["port"])

