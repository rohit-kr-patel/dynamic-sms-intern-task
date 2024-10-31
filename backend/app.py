from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from pymongo import MongoClient
from flask_cors import CORS 
import pymysql, subprocess, jwt, requests, os
from datetime import timedelta
from werkzeug.security import generate_password_hash

app = Flask(__name__)
CORS(app)  
app.config['SECRET_KEY'] = 'your_jwt_secret'

# JWT manager setup
jwt = JWTManager(app)

# In-memory user database (temporary for testing)
users_db = {}

# Database connections
mongo_client = MongoClient('mongodb://localhost:27017/')
mongo_db = mongo_client['sms_management_db']  # MongoDB database
mysql_db = pymysql.connect(host='localhost', user='rohit', password='Rp7999145427', db='sms_db')

# Test route
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"message": "Backend is running!"})

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400

    if username in users_db:
        return jsonify({"msg": "Username already exists"}), 400

    users_db[username] = generate_password_hash(password)
    return jsonify({"msg": "User registered successfully"}), 201

# Endpoint to authenticate users
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    # Basic validation logic
    if username == 'admin' and password == 'password':
        # Create the JWT token
        token = create_access_token(identity=username, expires_delta=timedelta(hours=1))

        # Ensure token is a string (in case it's bytes)
        if isinstance(token, bytes):
            token = token.decode('utf-8')  # Decode to string

        return jsonify(token=token), 200

    return jsonify({"msg": "Invalid credentials"}), 401

# Manage SMS processes (start/stop/restart)
@app.route('/process/<string:action>', methods=['POST'])
@jwt_required()
def manage_process(action):
    country_operator = request.json.get('country_operator')

    if action == 'start':
        subprocess.Popen(["screen", "-dmS", f"{country_operator}", "python3", f"{country_operator}.py"])
    elif action == 'stop':
        subprocess.call(["screen", "-S", f"{country_operator}", "-X", "quit"])
    elif action == 'restart':
        subprocess.call(["screen", "-S", f"{country_operator}", "-X", "quit"])
        subprocess.Popen(["screen", "-dmS", f"{country_operator}", "python3", f"{country_operator}.py"])

    return jsonify({"status": f"{action} operation executed for {country_operator}"}), 200

# Real-time SMS metrics
@app.route('/metrics', methods=['GET'])
@jwt_required()
def get_metrics():
    cursor = mysql_db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM sms_metrics")
    metrics = cursor.fetchall()
    cursor.close()
    return jsonify(metrics), 200

# Manage country-operator pairs (CRUD)
@app.route('/country_operator', methods=['POST', 'PUT', 'DELETE'])
@jwt_required()
def manage_country_operator():
    data = request.json

    if request.method == 'POST':
        mongo_db.country_operator.insert_one(data)
    elif request.method == 'PUT':
        mongo_db.country_operator.update_one({'_id': data['_id']}, {"$set": data})
    elif request.method == 'DELETE':
        mongo_db.country_operator.delete_one({'_id': data['_id']})

    return jsonify({"status": "operation successful"}), 200

# Send alerts on critical errors or low success rates
def send_alert(message):
    telegram_bot_token = "your_telegram_bot_token"
    telegram_chat_id = "your_chat_id"

    requests.post(
        f"https://api.telegram.org/bot{telegram_bot_token}/sendMessage",
        data={"chat_id": telegram_chat_id, "text": message}
    )

@app.route('/alert', methods=['POST'])
@jwt_required()
def alert():
    message = request.json.get('message')
    send_alert(message)
    return jsonify({"status": "alert sent"}), 200


@app.route('/api/country-operators/reg-c-operator', methods=['POST'])
@jwt_required()
def register_country_operator():
    data = request.json
    if not data.get('country') or not data.get('operator'):
        return jsonify({"error": "Country and operator are required"}), 400

    result = mongo_db.country_operator.insert_one({
        "country": data['country'],
        "operator": data['operator'],
        "isHighPriority": data.get('isHighPriority', False)
    })
    return jsonify({"status": "Country-operator pair registered successfully", "id": str(result.inserted_id)}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)
