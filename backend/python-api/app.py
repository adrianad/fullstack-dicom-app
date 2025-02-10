import numpy as np
import uuid
import os
import pydicom
import requests

from datetime import datetime
from pydicom.errors import InvalidDicomError
from pydicom.multival import MultiValue
from pydicom.valuerep import PersonName
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Define upload folder and GraphQL URL
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
graphql_url = "http://node-api:4000"

def get_unique_filename(filename):
    """Generates a unique filename using timestamp + UUID."""
    name, ext = os.path.splitext(filename)
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    unique_id = uuid.uuid4().hex[:6]  # Short unique identifier
    return f"{name}_{timestamp}_{unique_id}{ext}"

def get_dicom_value(ds, name):
    """Extracts and formats DICOM values."""
    value = ds.get(name)
    if value is None:
        return ""
    if isinstance(value, MultiValue):
        array = np.array(value)
        return array.tolist()
    if isinstance(value, PersonName):
        return value.formatted("%(given_name)s %(family_name)s").strip()  # Adjust as needed
    if isinstance(value, np.ndarray):
        return value.tolist()  # Convert NumPy arrays to lists
    if isinstance(value, (np.floating, np.integer)):
        return value.item()  # Convert NumPy scalar to native Python type

    return value

def get_dicom_metadata(ds):
    """Extracts metadata from a DICOM dataset."""
    SeriesDate = datetime.strptime(get_dicom_value(ds, 'SeriesDate'), "%Y%m%d").strftime("%m-%d-%Y")
    StudyDate = datetime.strptime(get_dicom_value(ds, 'StudyDate'), "%Y%m%d").strftime("%m-%d-%Y")
        
    metadata = {
        "PatientName": get_dicom_value(ds, 'PatientName'),
        "PatientBirthDate": get_dicom_value(ds, 'PatientBirthDate'),
        "Modality": get_dicom_value(ds, 'Modality'),
        "StudyInstanceUID": get_dicom_value(ds, 'StudyInstanceUID'),
        "StudyDate": StudyDate,
        "StudyTime": get_dicom_value(ds, 'StudyTime'),
        "StudyDescription": get_dicom_value(ds, 'StudyDescription'),
        "SeriesInstanceUID": get_dicom_value(ds, 'SeriesInstanceUID'),
        "SeriesDate": SeriesDate,
        "SeriesTime": get_dicom_value(ds, 'SeriesTime'),
        "SeriesDescription": get_dicom_value(ds, 'SeriesDescription')
    }
    return metadata

@app.route("/upload", methods=["POST"])
def upload_dicom():
    """Handles multiple DICOM file uploads and returns file paths and preview paths."""
    if "files" not in request.files:
        return jsonify({"error": "No files uploaded"}), 400

    files = request.files.getlist("files")
    if len(files) == 0:
        return jsonify({"error": "No selected files"}), 400

    results = []

    for file in files:
        if file.filename == "":
            continue

        unique_filename = get_unique_filename(file.filename)

        # Save uploaded DICOM
        dicom_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        file.save(dicom_path)

        try:
            # Try to read the file as a DICOM file from the saved path
            dicom = pydicom.dcmread(dicom_path)
        except InvalidDicomError:
            os.remove(dicom_path)
            return jsonify({"error": f"File {file.filename} is not a valid DICOM file"}), 400

        # Get Metadata
        metadata = get_dicom_metadata(dicom)

        results.append({
            "filename": unique_filename,
            "dicom_path": os.path.abspath(dicom_path),
            **metadata
        })

        # Define the GraphQL mutation query with a variable placeholder
        query = """
        mutation CreateFullRecord($input: CreateFullRecordInput!) {
            createFullRecord(input: $input) {
                idFile
            }
        }
        """

        # Define the variables as a Python dictionary
        variables = {
            "input": {
                "file": {
                    "filePath": results[-1]['filename']
                },
                "modality": {
                    "name": results[-1]['Modality']
                },
                "series": {
                    "idSeries": results[-1]['SeriesInstanceUID'],
                    "name": results[-1]['SeriesDescription'],
                    "date": results[-1]['SeriesDate'],
                    "study": {
                        "patient": {
                            "name": results[-1]['PatientName'],
                            "birthdate": results[-1]['PatientBirthDate']
                        },
                        "idStudy": results[-1]['StudyInstanceUID'],
                        "name": results[-1]['StudyDescription'],
                        "date": results[-1]['StudyDate']
                    }
                }
            }
        }

        # Create the payload that includes both the query and variables
        payload = {
            "query": query,
            "variables": variables
        }

        # Send the POST request
        response = requests.post(graphql_url, json=payload)

        print("response status code: ", response.status_code) 
        if response.status_code == 200: 
            print("response : ", response.content) 

        print(metadata)

        print(response.text)

    return jsonify(results), 200

@app.route("/download/<filename>", methods=["GET"])
def get_preview(filename):
    """Serves a Dicom File."""
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404
    return send_file(filepath, as_attachment=True, mimetype='application/dicom')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
