import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

const QrReader = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [isCameraStarted, setIsCameraStarted] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (typeof navigator.mediaDevices === 'undefined' || typeof navigator.mediaDevices.getUserMedia !== 'function') {
          throw new Error('getUserMedia is not supported');
        }
        const constraints = {
          video: true,
          audio: false
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        videoRef.current.srcObject = stream;
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

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleVideoLoadedMetadata = () => {
      setIsCameraStarted(true);
      videoElement.play();
    };

    videoElement.addEventListener('loadedmetadata', handleVideoLoadedMetadata);

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleVideoLoadedMetadata);
    };
  }, []);

  const scanQRCode = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    if (video && video.videoWidth && video.videoHeight) {
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
    }
  };

  return (
    <div>
      {errorMessage && <p>{errorMessage}</p>}
      {isCameraStarted ? (
        <>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <button onClick={scanQRCode}>Scan QR Code</button>
        </>
      ) : (
        <video ref={videoRef} autoPlay muted></video>
      )}
      {qrCodeData && <h1>{qrCodeData}</h1>}
    </div>
  );
};

export default QrReader;
