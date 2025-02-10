import React, { useState } from 'react';
import './App.css';
import DicomFileDropzone from './components/DicomFileDropzone';
import DicomViewer from './components/DicomViewer';
import DataDisplay from './components/DataDisplay';
import { Tabs, Tab, Box } from '@mui/material';

function App() {
  const [updateDataDisplay, setUpdateDataDisplay] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const handleUploadSuccess = () => {
    console.log('Upload successful');
    setUpdateDataDisplay((prev) => !prev); // Toggle the state to trigger rerender
  };

  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleViewImage = (imageId: string) => {
    setSelectedImageId(imageId);
    setSelectedTab(1); // Switch to the DicomViewer tab
  };

  return (
    <>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Upload DICOM Files" />
        <Tab label="View DICOM Files" />
      </Tabs>
      <Box p={3} style={{ height: '400px', overflow: 'auto' }}>
        {selectedTab === 0 && <DicomFileDropzone onUploadSuccess={handleUploadSuccess} />}
        {selectedTab === 1 && selectedImageId && <DicomViewer imageId={selectedImageId} />}
      </Box>
      <DataDisplay updateTrigger={updateDataDisplay} onViewImage={handleViewImage} />
    </>
  );
}

export default App;
