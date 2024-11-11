from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from ML_code import calorie
from pymongo.errors import DuplicateKeyError
# Initialize Flask app
app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['Calorie']  # Database name
collection = db['Health_data']  # Collection name

# Route to save data in MongoDB
@app.route('/save', methods=['POST'])
def save_data():
    data = request.json
    if data:
        collection.create_index("userId", unique=True)
        try:
            collection.insert_one(data)  # Insert data into MongoDB
            return jsonify({"message": "Data saved successfully!"}), 200
        except DuplicateKeyError:
            return jsonify({"message": "User ID already exists!"}), 400
    # else:
    #     return jsonify({"error": "Invalid data!"}), 400

# Route to get user input (userId)
@app.route('/input', methods=['POST'])
def get_input():
    user_input = request.json.get('input')  # Access request data
    if user_input:
        return jsonify({"input": user_input}), 200
    else:
        return jsonify({"error": "User input not provided!"}), 400

# Route to fetch data and calculate calories
@app.route('/res', methods=['GET'])
def fetch_data():
    user_id = request.args.get('userId')  # Get userId from request query params
    if not user_id:
        return jsonify({"error": "UserId is required"}), 400

    # Fetch document for the given userId
    doc = calorie.get_data(client, user_id)
    if doc == "No data found":
        return jsonify({"error": "No data found for the provided UserId"}), 404

    # Calculate calories
    res = calorie.calc(doc)
    return jsonify({"result": res})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000,debug=True)
