import os
import logging
from flask import Flask
from flask_httpauth import HTTPBasicAuth
from flask_sqlalchemy import SQLAlchemy
import logging

app = Flask(__name__)

auth = HTTPBasicAuth()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

#SQLite config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' +os.path.join(BASE_DIR, 'cirkit.db') + '?check_same_thread=False'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#Cirkit defaults
app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'received_test')
app.config['SECRET_KEY'] = '2&5*9$Y)O(*&5U_L*OS$#@T_/*#3T@!H3+E_G^#A)@52M(E'

db = SQLAlchemy(app)

from cirkit import router
