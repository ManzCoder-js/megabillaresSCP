import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

const QrReader = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (typeof navigator.mediaDevices === 'undefined' || typeof navigator.mediaDevices.getUserMedia !== 'function') {
          throw new Error('getUserMedia is not supported');
        }
        const constraints = {
          facingMode: 'environment',
          video: true,
          audio: false
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (error) {
        console.error('Error accessing camera:', error);
        setErrorMessage('Failed to access camera');
      }
    };

    startCamera();

    return () => {
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const scanQRCode = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    // Establecer la resolución del lienzo para que coincida con la resolución de la cámara
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      setQrCodeData(code.data);
    } else {
      console.log('No QR Code found.');
    }
  };

  return (
    <div>
      {errorMessage && <p>{errorMessage}</p>}
      <video ref={videoRef} autoPlay />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button onClick={scanQRCode}>Scan QR Code</button>
      {qrCodeData && <h1>{qrCodeData}</h1>}
    </div>
  );
};

export default QrReader;
