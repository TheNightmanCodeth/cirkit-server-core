from cirkit import app, db

class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	ip = db.Column(db.String(length=15), nullable=False)
	ip_hash = db.Column(db.String(length=64), nullable=False)

class StringPush(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_ip = db.Column(db.String(length=15), nullable=False)
    msg_body = db.Column(db.String(length=255), nullable=False)

    def __init__(self, ip, msg):
        self.sender_ip = ip
        self.msg_body = msg

    def __repr__(self):
        return '<StringPush %r>' % self.msg_body

class ImagePush(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	sender_ip = db.Column(db.String(length=15), nullable=False)
	img_path = db.Column(db.String(124), nullable=False)

	def __init__(self, ip, path):
		self.sender_ip = ip
		self.img_path = path

	def __repr__(self):
		return '<ImagePush %r>' % self.img_path