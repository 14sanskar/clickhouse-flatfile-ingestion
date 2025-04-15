# To be implemented for Flat File handling
import pandas as pd
import os

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def save_uploaded_file(file_storage, filename):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file_storage.save(file_path)
    return file_path

def get_file_columns(file_path, delimiter=','):
    try:
        df = pd.read_csv(file_path, delimiter=delimiter, nrows=1)  # Read just first row
        return list(df.columns)
    except Exception as e:
        raise Exception(f"Failed to read file: {str(e)}")

def preview_file_data(file_path, delimiter=',', num_rows=100):
    try:
        df = pd.read_csv(file_path, delimiter=delimiter, nrows=num_rows)
        return df.to_dict(orient='records')
    except Exception as e:
        raise Exception(f"Failed to preview file: {str(e)}")

def load_file_to_clickhouse(file_path, client, table_name, selected_columns, delimiter=','):
    try:
        df = pd.read_csv(file_path, delimiter=delimiter, usecols=selected_columns)
        client.insert_df(table_name, df)
        return len(df)
    except Exception as e:
        raise Exception(f"Ingestion failed: {str(e)}")
