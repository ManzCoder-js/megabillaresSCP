import { useEffect, useRef } from 'react';
import jsQR from 'jsqr';

const QrReader = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = { video: true };

      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
        });
    }
  }, []);

  const scanQRCode = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      console.log('QR Code:', code.data);
    } else {
      console.log('No QR Code found.');
    }
  };

  return (
    <div>
      <video ref={videoRef} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button onClick={scanQRCode}>Scan QR Code</button>
    </div>
  );
};

export default QrReader;