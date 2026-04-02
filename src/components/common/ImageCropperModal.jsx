import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';

const ImageCropperModal = ({ imageSrc, onCropDone, onCropCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    try {
      if (!croppedAreaPixels) return;
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      onCropDone(croppedImage);
    } catch (e) {
      console.error(e);
      onCropCancel();
    }
  };

  if (!imageSrc) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>Crop Image</h3>
          <button type="button" onClick={onCropCancel} style={closeBtnStyle}>&times;</button>
        </div>

        <div style={cropContainerStyle}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1} // 1:1 aspect ratio for profile picture
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropShape="round" // Circular crop shape
            showGrid={false}
          />
        </div>

        <div style={controlsStyle}>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => {
              setZoom(e.target.value);
            }}
            style={{ width: '60%' }}
          />
        </div>

        <div style={footerStyle}>
          <button onClick={onCropCancel} className="btn btn-secondary mr-2" style={{ borderRadius: '25px', padding: '8px 20px' }}>Cancel</button>
          <button onClick={handleDone} className="Save" style={{ borderRadius: '25px', padding: '8px 20px', background: '#00e6d2', color: '#fff', border: 'none', fontWeight: 'bold' }}>Done</button>
        </div>
      </div>
    </div>
  );
};

// Styles
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  zIndex: 9999,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalStyle = {
  background: '#fff',
  width: '100%',
  maxWidth: '500px',
  borderRadius: '15px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
};

const headerStyle = {
  padding: '15px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #ddd',
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: '28px',
  lineHeight: 1,
  cursor: 'pointer',
  color: '#888',
};

const cropContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '350px',
  background: '#333',
};

const controlsStyle = {
  padding: '15px 20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const footerStyle = {
  padding: '15px 20px',
  display: 'flex',
  justifyContent: 'flex-end',
  borderTop: '1px solid #ddd',
};

export default ImageCropperModal;
