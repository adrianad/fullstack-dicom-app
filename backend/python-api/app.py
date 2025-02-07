import numpy as np
import uuid
import os
import pydicom

from datetime import datetime
from PIL import Image
from numpy import maximum, ndarray
from pydicom import dcmread, FileDataset
from pydicom.multival import MultiValue
from pydicom.valuerep import PersonName
from flask import Flask, request, send_file, jsonify, url_for
from PIL import Image

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def get_unique_filename(filename):
    """Generates a unique filename using timestamp + UUID."""
    name, ext = os.path.splitext(filename)
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    unique_id = uuid.uuid4().hex[:6]  # Short unique identifier
    return f"{name}_{timestamp}_{unique_id}{ext}"

def get_dicom_value(ds, name):
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

def get_dicom_metadata(filepath):
    ds = dcmread(filepath)
        
    metadata = {
        "PatientName": get_dicom_value(ds, 'PatientName'),
        "PatientBirthDate": get_dicom_value(ds, 'PatientBirthDate'),
        "Modality": get_dicom_value(ds, 'Modality'),
        "StudyDate": get_dicom_value(ds, 'StudyDate'),
        "StudyTime": get_dicom_value(ds, 'StudyTime'),
        "StudyDescription": get_dicom_value(ds, 'StudyDescription'),
        "SeriesDate": get_dicom_value(ds, 'SeriesDate'),
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

        # Get Metadata
        metadata = get_dicom_metadata(dicom_path)

        results.append({
            "filename": unique_filename,
            "dicom_path": os.path.abspath(dicom_path),
            **metadata
        })

    return jsonify(results), 200


@app.route("/preview/<filename>", methods=["GET"])
def get_preview(filename):
    """Serves a previously generated PNG preview."""
    png_path = os.path.join(PREVIEW_FOLDER, filename)
    if not os.path.exists(png_path):
        return jsonify({"error": "File not found"}), 404
    return send_file(png_path, mimetype="image/png")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
