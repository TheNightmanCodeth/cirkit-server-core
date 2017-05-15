import os
from flask import Flask, request, jsonify, g
from cirkit import app, db, auth
from cirkit import models

@auth.verify_password
def verify_password(ip_or_token, password):
	node = models.Node.verify_auth_token(ip_or_token)
	if not node:
		node = models.Node.query.filter_by(ip = request.remote_addr).first()
		if not node or not node.verify_ip(request.remote_addr):
			return False
	g.device = node
	return True

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
@app.route('/auth/token', methods=['GET'])
@auth.login_required
def get_auth_token():
	token = g.device.gen_auth_token()
	return jsonify({ 'token': token.decode('ascii') })

@app.route('/auth/register', methods=['POST'])
def register_device():
	ip = request.remote_addr
	nickname = request.json['nickname']
	if models.Node.query.filter_by(ip = ip).first() is not None:
		return error_json("Duplicate IP")
	node = models.Node(ip = ip, nickname="")
	node.hash_ip(ip)
	db.session.add(node)
	db.session.commit()
	return succeed_json("New device registered")

@app.route('/auth/test_auth', methods=['GET'])
@auth.login_required
def is_token():
	return succeed_json("Token is valid")