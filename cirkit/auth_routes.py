from cirkit import app, db, auth
from cirkit import models, auth_routes, router
from flask import Flask, request, jsonify, g

@auth.verify_password
def verify_password(ip_or_token, password):
	node = models.Node.verify_auth_token(ip_or_token)
	if not node:
		node = models.Node.query.filter_by(ip = request.remote_addr).first()
		if not node or not node.verify_ip(request.remote_addr):
			return False
	g.device = node
	return True

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
	node = models.Node(ip = ip, nickname = "")
	node.hash_ip(ip)
	db.session.add(node)
	db.session.commit()
	return succeed_json("New device registered")

@app.route('/auth/test_auth', methods=['GET'])
@auth.login_required
def test_auth():
	return router.succeed_json("Auth token valid")

@app.route('/auth/devices', methods=['GET'])
@auth.login_required
def get_devices():
	nodes = models.Node.query.all()
	return jsonify(nodes=nodes, response="SUCCESS")