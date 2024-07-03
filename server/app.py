#!/usr/bin/env python3

# Standard library imports
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
# Remote library imports
from flask import request, make_response, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api, login_manager
# Add your model imports
from models import User, Auction

# Views go here!

class UserRegister(Resource):
    
    def post(self):
        username = request.json.get('username')
        email = request.json.get('email')
        password = request.json.get('password')

        if not username or not email or not password:
            return make_response(jsonify({"msg": "Missing username, email, or password"}), 409)

        if User.query.filter_by(username=username).first():
            return make_response(jsonify({"msg": "Username or email already exists"}), 409)

        new_user = User(username=username, email=email)
        new_user.password_hash = password
        db.session.add(new_user)
        db.session.commit()

        return make_response(jsonify({"username": new_user.username}), 201)

class UserLogin(Resource):
    
    
    def post(self):
        username = request.json.get('username')
        email = request.json.get('email')
        password = request.json.get('password')
        
        check_username = User.query.filter_by(username=username).first()
        check_email = User.query.filter_by(email=email).first()
        if not check_username:
            print(username)
            print(check_username)
            return make_response(jsonify({"msg": "Invalid Username"}), 401)
        if not check_email:
            return make_response(jsonify({"msg": "Invalid Email"}), 401)
        if check_username.authenticate(password):
            login_user(check_username)
            return make_response(jsonify({"username": "Successful"}), 200)

class UserLogout(Resource):


    @login_required
    def post(self):
        print(self)
        logout_user()
        return {'message': 'Logout successful'}, 200

class UserCard(Resource):
    @login_required
    def get(self):
        user = current_user.to_dict()
        return user, 200

class AuctionForm(Resource):
    @login_required
    def get(self):
        return make_response(jsonify({"User Is Logged In": current_user.username}), 200)
    @login_required
    def post(self):
        brand = request.json.get('brand')
        model = request.json.get('model')
        drivetrain = request.json.get('drivetrain')
        transmission = request.json.get('transmission')
        reserve = request.json.get('reserve')
        image_one = request.json.get('image_one')
        image_two = request.json.get('image_two')
        image_three = request.json.get('image_three')
        image_four = request.json.get('image_four')
        image_five = request.json.get('image_five')

        if not brand:
            return make_response(jsonify({"msg": "Missing brand"}), 409)
        if not model:
            return make_response(jsonify({"msg": "Missing model"}), 409)
        if not drivetrain:
            return make_response(jsonify({"msg": "Missing drivetrain"}), 409)
        if not transmission:
            return make_response(jsonify({"msg": "Missing transmission"}), 409)
        if not reserve:
            return make_response(jsonify({"msg": "Missing reserve"}), 409)
        
        new_auction = Auction(brand=brand, model=model, drivetrain=drivetrain, transmission=transmission,
         reserve=reserve, image_one=image_one, image_two=image_two, image_three=image_three, image_four=image_four, image_five=image_five)
        new_auction.user_id = current_user.id
        db.session.add(new_auction)
        db.session.commit()
        return make_response(jsonify({"username": new_auction.brand}), 201)

@login_manager.user_loader
def user_loader(user_id):
    print(user_id)
    return User.query.get(int(user_id))




api.add_resource(UserRegister, '/signup', endpoint='signup')
api.add_resource(UserLogin, '/login', endpoint='login')
api.add_resource(UserLogout, '/logout', endpoint='logout')
api.add_resource(UserCard, '/usercard', endpoint='usercard')
api.add_resource(AuctionForm, '/auctionform', endpoint='auctionform')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

