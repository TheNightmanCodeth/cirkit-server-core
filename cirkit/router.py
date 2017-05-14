import os
from flask import Flask, request, jsonify
from cirkit import app, db, auth
from cirkit import models

def succeed_json(msg):
	return jsonify(response="SUCCESS", details=msg)

def error_json(msg):
	return jsonify(response="ERROR", details=msg)

# Push Endpoints
@app.route('/msg', methods=['POST'])
def string_push():
    new_push = models.StringPush(request.remote_addr, request.json['msg'])
    db.session.add(new_push)
    db.session.commit()
    return succeed_json("Push received")

def is_img(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ['gif', 'png', 'jpg', 'jpeg', 'svg']

@app.route('/img', methods=['POST'])
def img_push():
	if 'img' not in request.files:
		return error_json("Image was not received")
	file = request.files['img']
	if file and is_img(file.filename):
		path = os.path.join(app.config['UPLOAD_FOLDER'], 'images', file.filename)
		file.save(path)
		new_push = models.ImagePush(request.remote_addr, path)
		db.session.add(new_push)
		db.session.commit()
		return succeed_json("Image push received from: " +request.remote_addr)
	else:
		return error_json("File invalid")

# Auth Endpoints
