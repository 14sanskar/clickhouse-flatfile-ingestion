import os
from utils.file_handler import (
    save_uploaded_file, get_file_columns,
    preview_file_data, load_file_to_clickhouse
)
from utils.clickhouse_client import connect_to_clickhouse
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/api/upload', methods=['POST'])
def upload_file():
    try:
        file = request.files['file']
        filename = file.filename
        path = save_uploaded_file(file, filename)
        return jsonify({'message': 'Upload successful', 'file_path': path})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/file-columns', methods=['POST'])
def file_columns():
    data = request.get_json()
    file_path = data['file_path']
    delimiter = data.get('delimiter', ',')
    try:
        columns = get_file_columns(file_path, delimiter)
        return jsonify({'columns': columns})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/file-preview', methods=['POST'])
def file_preview():
    data = request.get_json()
    file_path = data['file_path']
    delimiter = data.get('delimiter', ',')
    try:
        preview = preview_file_data(file_path, delimiter)
        return jsonify({'preview': preview})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/ingest-to-clickhouse', methods=['POST'])
def ingest_to_clickhouse():
    data = request.get_json()
    file_path = data['file_path']
    selected_columns = data['columns']
    table_name = data['table']
    delimiter = data.get('delimiter', ',')

    try:
        client = connect_to_clickhouse(
            host=data['host'],
            port=data['port'],
            database=data['database'],
            user=data['user'],
            token=data['token']
        )
        count = load_file_to_clickhouse(file_path, client, table_name, selected_columns, delimiter)
        return jsonify({'message': 'Ingestion successful', 'records': count})
    except Exception as e:
        return jsonify({'error': str(e)}), 400
