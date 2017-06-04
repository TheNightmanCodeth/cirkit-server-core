import os
from flask import Flask, request, jsonify, g
from cirkit import app, db, auth
from cirkit import models, auth_routes
import gi
gi.require_version('Notify', '0.7')
from gi.repository import Notify

Notify.init("Cirkit")

def succeed_json(msg):
	return jsonify(response="SUCCESS", details=msg)

def error_json(msg):
	return jsonify(response="ERROR", details=msg)

def notify(title, body):
	noti = Notify.Notification.new(title, body, 'jockey')
	noti.show()

# Push Endpoints
@app.route('/msg', methods=['POST'])
def string_push():
	app.logger.info(request.json)
	new_push = models.StringPush(request.remote_addr, request.json['msg'])
	db.session.add(new_push)
	db.session.commit()
	notify("Cirkit", request.json['msg'])
	return succeed_json("Push received")

def is_img(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ['gif', 'png', 'jpg', 'jpeg', 'svg']

@app.route('/file', methods=['POST'])
def img_push():
	if 'file' not in request.files:
		return error_json("File was not received")
	file = request.files['file']
	if file:
		path = os.path.join(app.config['UPLOAD_FOLDER'], 'files', file.filename)
		file.save(path)
		new_push = models.FilePush(request.remote_addr, path)
		db.session.add(new_push)
		db.session.commit()
		notify("Cirkit", "File received: " +file.filename)
		return succeed_json("File push received from: " +request.remote_addr)
	else:
		return error_json("File invalid")
