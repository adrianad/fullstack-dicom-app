import React, { useState } from 'react';
import './App.css';
import DicomFileDropzone from './components/DicomFileDropzone';
import DicomViewer from './components/DicomViewer';
import DataDisplay from './components/DataDisplay';
import { Tabs, Tab, Box } from '@mui/material';

function App() {
  // State to trigger re-render of DataDisplay component
  const [updateDataDisplay, setUpdateDataDisplay] = useState(false);
  // State to manage the selected tab
  const [selectedTab, setSelectedTab] = useState(0);
  // State to manage the selected image ID for viewing
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  // Handle successful file upload
  const handleUploadSuccess = () => {
    console.log('Upload successful');
    setUpdateDataDisplay((prev) => !prev); // Toggle the state to trigger re-render
  };

  // Handle tab change
  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  // Handle viewing an image
  const handleViewImage = (imageId: string) => {
    setSelectedImageId(imageId);
    setSelectedTab(1); // Switch to the DicomViewer tab
  };

  return (
    <>
      {/* Tabs for switching between Upload and View */}
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Upload DICOM Files" />
        <Tab label="View DICOM Files" />
      </Tabs>
      <Box p={3} style={{ height: '420px', overflow: 'auto' }}>
        {/* Render DicomFileDropzone if the Upload tab is selected */}
        {selectedTab === 0 && <DicomFileDropzone onUploadSuccess={handleUploadSuccess} />}
        {/* Render DicomViewer if the View tab is selected and an image ID is set */}
        {selectedTab === 1 && selectedImageId && <DicomViewer imageId={selectedImageId} />}
      </Box>
      {/* DataDisplay component to list and manage DICOM files */}
      <DataDisplay updateTrigger={updateDataDisplay} onViewImage={handleViewImage} />
    </>
  );
}

export default App;
