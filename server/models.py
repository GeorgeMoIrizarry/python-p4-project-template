from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from flask_login import UserMixin
from config import db, bcrypt, login_manager

class User(db.Model, SerializerMixin, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    email = db.Column(db.String(), unique=True, nullable=False)
    _password_hash = db.Column(db.String(), nullable=False)
    profile_image = db.Column(db.String(), nullable=True)
    bio = db.Column(db.String(), nullable=True)
    feature_image = db.Column(db.String(), nullable=True)

    comments = db.relationship('Comment', back_populates='user', lazy=True, cascade='all, delete-orphan')
    bids = db.relationship('Bid', back_populates='user', lazy=True, cascade='all, delete-orphan')

    serialize_rules = ('-comments.user.bids', '-bids.user.comments', '-bids.auction.bids', '-comments.auction.comments', '-comments.user', '-bids.user')

    # Rest of the code
    
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

    comments = db.relationship('Comment', back_populates='auction')
    bids = db.relationship('Bid', back_populates='auction')

    serialize_rules = ('-comments.auction', '-bids.auction', '-bids.user', '-comments.user')
    # Rest of the code

class Bid(db.Model, SerializerMixin, UserMixin):
    __tablename__ = 'bids'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    auction_id = db.Column(db.Integer, db.ForeignKey('auctions.id'))
    amount = db.Column(db.Integer)

    user = db.relationship('User', back_populates='bids')
    auction = db.relationship('Auction', back_populates='bids')

    serialize_rules = ('-user.bids', '-auction.bids', '-user.comments.user', '-auction.comments.auction')

    # Rest of the code

class Comment(db.Model, SerializerMixin, UserMixin):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    auction_id = db.Column(db.Integer, db.ForeignKey('auctions.id'))
    body = db.Column(db.String)

    user = db.relationship('User', back_populates='comments')
    auction = db.relationship('Auction', back_populates='comments')

    serialize_rules = ('-user.comments', '-auction.comments', '-user.bids.user', '-auction.bids.auction')

    # Rest of the code

    