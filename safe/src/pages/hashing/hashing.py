from flask import Flask, request, jsonify
from flask_cors import CORS
from cryptography.fernet import Fernet
import json

app = Flask(__name__)
CORS(app)

# Generate a secure encryption key
key = Fernet.generate_key()
fernet = Fernet(key)

@app.route('/hashing', methods=['POST'])
def encrypt_data():
    try:
        data = request.json.get("data")  # Get data from POST request
        enc_data = fernet.encrypt(data.encode()).decode()  # Encrypt & decode to string
        return jsonify({"encrypted": enc_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/unhashing', methods=['POST'])
def decrypt_data():
    try:
        enc_data = request.json.get("encrypted")  # Get encrypted data
        dec_data = fernet.decrypt(enc_data.encode()).decode()  # Decrypt
        return jsonify({"decrypted": dec_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5001)
