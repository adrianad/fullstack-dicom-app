import React, { useEffect, useRef } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import Hammer from 'hammerjs';
import cornerstoneMath from 'cornerstone-math';

// Initialisierung der externen Abhängigkeiten
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

// Initialisierung von CornerstoneTools
cornerstoneTools.init();

const DicomViewer: React.FC<{ imageId: string }> = ({ imageId }) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (element) {
            // Aktivieren des Elements
            cornerstone.enable(element);

            // Hinzufügen des Zoom-Tools mit optionaler Konfiguration
            cornerstoneTools.addToolForElement(element, cornerstoneTools.ZoomTool, {
                configuration: {
                    invert: false,
                    preventZoomOutsideImage: false,
                    minScale: 0.1,
                    maxScale: 20.0,
                },
            });

            // Aktivieren des Zoom-Tools für das spezifische Element
            cornerstoneTools.setToolActiveForElement(element, 'Zoom', { mouseButtonMask: 1 });

            // Laden und Anzeigen des Bildes
            cornerstone.loadImage(imageId).then(image => {
                cornerstone.displayImage(element, image);
            });

            // Bereinigung bei Demontage der Komponente
            return () => {
                cornerstone.disable(element);
            };
        }
    }, [imageId]);

    return <div ref={elementRef} style={{ width: '100%', height: '100%' }} />;
};

export default DicomViewer;
