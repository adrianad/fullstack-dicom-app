# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt ./

# Install dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code into the container
COPY . .

# Expose port 5000 for the Flask app
EXPOSE 5000

# Command to run your application
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]

