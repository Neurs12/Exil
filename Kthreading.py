import sys, threading

#https://web.archive.org/web/20130503082442/http://mail.python.org/pipermail/python-list/2004-May/281943.html

class KThread(threading.Thread):
  def __init__(self, *args, **keywords):
    threading.Thread.__init__(self, *args, **keywords)
    self.killed = False

  def start(self):
    self.__run_backup = self.run
    self.run = self.__run
    threading.Thread.start(self)

  def __run(self):
    sys.settrace(self.globaltrace)
    self.__run_backup()
    self.run = self.__run_backup

  def globaltrace(self, frame, why, arg):
    if why == 'call':
      return self.localtrace
    else:
      return None

  def localtrace(self, frame, why, arg):
    if self.killed:
      if why == 'line':
        raise SystemExit()
    return self.localtrace

  def kill(self):
    self.killed = True