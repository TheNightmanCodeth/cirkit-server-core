from cirkit import app, db
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)

class Node(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	nickname = db.Column(db.String(length=25), nullable=False)
	ip = db.Column(db.String(length=15), nullable=False)
	ip_hash = db.Column(db.String(length=64), nullable=False)

	def hash_ip(self, ip):
		self.ip_hash = pwd_context.encrypt(ip)

	def verify_ip(self, ip):
		return pwd_context.verify(ip, self.ip_hash)

	def gen_auth_token(self):
		s = Serializer(app.config['SECRET_KEY'])
		return s.dumps({ 'id': self.id })

	@staticmethod
	def verify_auth_token(token):
		s = Serializer(app.config['SECRET_KEY'])
		try:
			data = s.loads(token)
		except SignatureExpired:
			return None
		except BadSignature:
			return None
		node = Node.query.get(data['id'])
		return node

class StringPush(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_ip = db.Column(db.String(length=15), nullable=False)
    msg_body = db.Column(db.String(length=255), nullable=False)

    def __init__(self, ip, msg):
        self.sender_ip = ip
        self.msg_body = msg

    def __repr__(self):
        return '<StringPush %r>' % self.msg_body

class FilePush(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	sender_ip = db.Column(db.String(length=15), nullable=False)
	file_path = db.Column(db.String(124), nullable=False)

	def __init__(self, ip, path):
		self.sender_ip = ip
		self.file_path = path

	def __repr__(self):
		return '<ImagePush %r>' % self.file_path
