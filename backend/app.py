from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.clickhouse_client import connect_to_clickhouse

app = Flask(__name__)
CORS(app)

@app.route('/api/connect', methods=['POST'])
def connect():
    data = request.get_json()
    try:
        client = connect_to_clickhouse(
            host=data['host'],
            port=data['port'],
            database=data['database'],
            user=data['user'],
            token=data['token']
        )
        return jsonify({"message": "Connection successful"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
