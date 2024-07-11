#!/usr/bin/env python3

# Standard library imports
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
# Remote library imports
from flask import request, make_response, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api, login_manager
# Add your model imports
from models import User, Auction, Bid, Comment

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

    @login_required
    def delete(self):
        user = User.query.get(current_user.id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return {"message": "User and associated records deleted successfully"}, 200
        else:
            return {"message": "User not found"}, 404

    






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
        returned_auction = Auction.query.get(new_auction.id)
        print(returned_auction)
        print("Hello")
        return returned_auction.to_dict(), 201

class AuctionCardDynamic(Resource):

    @login_required
    def get(self, id):
        auction_card = Auction.query.get(id)
        return auction_card.to_dict(), 200

    @login_required
    def patch(self, id):
        print("We're Here")
        new_bid = Auction.query.get(id)
        if new_bid:
            print("We're here 2")
            params = request.json
            for attr in params:
                setattr(new_bid, attr, params[attr])
            db.session.commit()
            bid_dict = new_bid.to_dict()
            return bid_dict, 200
        else:
            return make_response(jsonify({"msg": "Missing reserve"}), 409)

class AuctionCard(Resource):

    @login_required
    def get(self):
        all_auctions = []
        for auction in Auction.query.all():
            all_auctions.append(auction.to_dict())
        return make_response(all_auctions)

    



@login_manager.user_loader
def user_loader(user_id):
    print(user_id)
    return User.query.get(int(user_id))


class UserCardPatch(Resource):
    @login_required
    def patch(self, id):
        print("We're Here")
        user = User.query.get(id)
        if user:
            print("We're here 2")
            params = request.json
            for attr in params:
                setattr(user, attr, params[attr])
            db.session.commit()
            user_dict = user.to_dict()
            return user_dict, 200
        else:
            return make_response(jsonify({"msg": "Missing reserve"}), 409)

class BidResource(Resource):
    @login_required
    def post(self):
        user_id = request.json.get('user_id')
        auction_id = request.json.get('auction_id')
        amount = request.json.get('amount')
        print(user_id)
        print(auction_id)
        print(amount)

        old_bid = Bid(user_id=user_id, auction_id=auction_id, amount=amount)
        db.session.add(old_bid)
        db.session.commit()

        return make_response(jsonify({"old bid": old_bid.amount}), 201)

class BidResources(Resource):
    @login_required
    def get(self, id):
        auction = Auction.query.get(id)
        bids = auction.bids

        bids_with_user = []
        for bid in bids:
            bid_dict = bid.to_dict()  # Assuming you have implemented the to_dict() method using SerializerMixin
            bid_dict['user'] = bid.user.to_dict()  # Retrieve the associated user information
            bids_with_user.append(bid_dict)
        print(bids_with_user)
        return bids_with_user, 200

class CommentResource(Resource):
    @login_required
    def post(self):
        user_id = request.json.get('user_id')
        auction_id = request.json.get('auction_id')
        body = request.json.get('body')
        print(user_id)
        print(auction_id)
        print(body)

        comment = Comment(user_id=user_id, auction_id=auction_id, body=body)
        db.session.add(comment)
        db.session.commit()
        return make_response(jsonify({"comment": body}), 201)

class CommentResources(Resource):
    @login_required
    def get(self, id):
        auction = Auction.query.get(id)
        comments = auction.comments

        comments_with_user = []
        for comment in comments:
            comment_dict = comment.to_dict()  # Assuming you have implemented the to_dict() method using SerializerMixin
            comment_dict['user'] = comment.user.to_dict()  # Retrieve the associated user information
            comments_with_user.append(comment_dict)
        print(comments_with_user)
        return comments_with_user, 200

        

api.add_resource(UserRegister, '/signup', endpoint='signup')
api.add_resource(UserLogin, '/login', endpoint='login')
api.add_resource(UserLogout, '/logout', endpoint='logout')
api.add_resource(UserCard, '/usercard', endpoint='usercard')
api.add_resource(UserCardPatch, '/usercard/<int:id>', endpoint='usercardId')
api.add_resource(AuctionForm, '/auctionform', endpoint='auctionform')
api.add_resource(AuctionCardDynamic, '/auction-card/<int:id>', endpoint='auctioncardId')
api.add_resource(AuctionCard, '/auctioncards', endpoint='auctioncards')
api.add_resource(BidResource, '/bids', endpoint='bid')
api.add_resource(BidResources, '/bids/<int:id>', endpoint='bids')
api.add_resource(CommentResource, '/comments', endpoint='comment')
api.add_resource(CommentResources, '/comments/<int:id>', endpoint='comments')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

