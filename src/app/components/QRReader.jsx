import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

const QRReader = ({ onScan, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState('');
  const [stream, setStream] = useState(null);
  const [codeDetected, setCodeDetected] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setStream(stream);
    } catch (error) {
      setError('Failed to access the camera');
    }
  };

  const scanQRCode = () => {
    if (!scanning) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: false });

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      onScan(code.data);
      setScanning(false);
      setCodeDetected(true);
    } else {
      setError('No QR Code found');
    }
  };

  useEffect(() => {
    const startScanning = async () => {
      if (!stream) {
        await startCamera();
      }
      setScanning(true);
    };

    startScanning();

    const interval = setInterval(scanQRCode, 200);

    return () => {
      clearInterval(interval);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onScan, stream]);

  const toggleScanning = () => {
    setScanning(!scanning);
  };

  const handleLoadedData = () => {
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <button onClick={onClose} style={{ padding: '10px 20px', fontSize: '16px', fontWeight: 'bold' }}>
          Cerrar
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ position: 'relative', maxWidth: '90%' }}>
          {error && (
            <div
              style={{
                background: 'rgba(255, 0, 0, 0.8)',
                padding: '10px',
                color: '#fff',
                marginBottom: '10px',
                borderRadius: '4px',
                textAlign: 'center',
              }}
            >
              <p>{error}</p>
            </div>
          )}
          <video
            ref={videoRef}
            style={{ width: '100%', height: 'auto', borderRadius: '4px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)' }}
            onLoadedData={handleLoadedData}
            onPause={() => setCodeDetected(false)}
            autoPlay
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {codeDetected && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(0, 255, 0, 0.6)',
                padding: '10px',
                color: '#fff',
                borderRadius: '4px',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>QR Code detected!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRReader;
