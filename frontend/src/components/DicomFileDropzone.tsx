// DicomFileDropzone.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { DropzoneArea } from 'mui-file-dropzone';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';

// Define the props for the DicomFileDropzone component
interface DicomFileDropzoneProps {
    onUploadSuccess: () => void;
}

const DicomFileDropzone: React.FC<DicomFileDropzoneProps> = ({ onUploadSuccess }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [dropzoneKey, setDropzoneKey] = useState(0); // Add a key state for DropzoneArea

    // Handle files dropped into the dropzone
    const handleDrop = (acceptedFiles: File[]) => {
        const dicomFiles = acceptedFiles.filter((file) => {
            const name = file.name.toLowerCase();
            return name.endsWith('.dcm') || name.endsWith('.dicom');
        });
        setFiles((prevFiles) => [...prevFiles, ...dicomFiles]);
    };

    // Handle file deletion from the dropzone
    const handleDelete = (file: File) => {
        setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
    };

    // Handle file upload to the server
    const handleUpload = () => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        axios
            .post('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(() => {
                setSnackbarMessage('Upload successful');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setFiles([]);
                setDropzoneKey((prevKey) => prevKey + 1);
                onUploadSuccess();
            })
            .catch((error) => {
                setSnackbarMessage('Error uploading files: ' + error.response.data.error);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    // Handle closing the snackbar
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Upload DICOM Files
            </Typography>
            <DropzoneArea
                key={dropzoneKey} // Add key prop to force re-render
                onDrop={(files) => handleDrop(files)}
                onDelete={(file) => {handleDelete(file)}}
                acceptedFiles={['.dcm', '.dicom']}
                fileObjects={files}
                filesLimit={100}
                showPreviews={true}
                showPreviewsInDropzone={false}
                useChipsForPreview={true}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={files.length === 0}
                sx={{ mt: 2 }} // Add margin-top of 2 units
            >
                Upload
            </Button>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DicomFileDropzone;
