from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from app.services.user_service import UserService

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'message': 'Missing information'}), 400

    hashed_password = generate_password_hash(password)
    new_user = UserService.add_user(username, email, hashed_password)

    if new_user:
        return jsonify({'message': 'User created successfully', 'user': {'username': username, 'email': email}}), 201
    else:
        return jsonify({'message': 'User creation failed'}), 500
