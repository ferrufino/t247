#!/usr/bin/python
import sys
import logging
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0,"/root/t247/Flask/")

from Flask import app as application
application.secret_key = '123'
