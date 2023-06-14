import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

const QrReader = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(true);
  const [qrCodeData, setQRCodeData] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d',  { willReadFrequently: true });

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        video.play();
      } catch (error) {
        setError('Failed to access the camera');
      }
    };

    const scanQRCode = () => {
      if (!scanning) {
        return; // Si no se está escaneando, no hacer nada
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height,);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setQRCodeData(code.data); // Guardar los datos del QR leído
        setScanning(false); // Detener el escaneo
      } else {
        setError('No QR Code found');
      }
    };

    const startScanning = async () => {
      await startCamera();
      setScanning(true);
    };

    startScanning(); // Iniciar el escaneo al montar el componente

    const interval = setInterval(scanQRCode, 200); // Realiza la decodificación cada 200ms (ajusta el intervalo según tus necesidades)

    return () => {
      clearInterval(interval); // Limpiar el intervalo al desmontar el componente
      const stream = video.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop()); // Detener la cámara
      }
    };
  }, []); // Eliminar 'scanning' como dependencia

  const toggleScanning = () => {
    setScanning(!scanning);
  };

  const handleLoadedData = () => {
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
  };

  return (
    <div>
      <video ref={videoRef} width='100%' height='100%' onLoadedData={handleLoadedData} autoPlay/>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {qrCodeData && (
        <div>
          <h1>{qrCodeData}</h1>
        </div>
      )}
    </div>
  );
};

export default QrReader;
