from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from flask_login import UserMixin
from config import db, bcrypt, login_manager

class User(db.Model, SerializerMixin, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    email = db.Column(db.String(),unique=True, nullable=False)
    _password_hash = db.Column(db.String(), nullable=False)
    bio = db.Column(db.String(), nullable=True)
    feature_image = db.Column(db.String(), nullable=True)

    serialize_rules = ('-email', '-_password_hash', 'auctions_made.user')
    
    auctions_made = db.relationship('Auction', back_populates="user")

    @property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)

    def __repr__(self):
        return f'<Player {self.username}>'

class Auction(db.Model, SerializerMixin, UserMixin):
    __tablename__ = 'auctions'

    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(), nullable=False) 
    model = db.Column(db.String(), nullable=False) 
    drivetrain = db.Column(db.String(), nullable=False) 
    transmission = db.Column(db.String(), nullable=False) 
    reserve = db.Column(db.Integer(), nullable=False)
    image_one = db.Column(db.String(), nullable=False) 
    image_two = db.Column(db.String(), nullable=False) 
    image_three = db.Column(db.String(), nullable=False) 
    image_four = db.Column(db.String(), nullable=False) 
    image_five = db.Column(db.String(), nullable=False) 
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates="auctions_made")