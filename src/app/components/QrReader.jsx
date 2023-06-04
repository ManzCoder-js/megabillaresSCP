import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

const QRReader = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(true);
  const [qrCodeData, setQRCodeData] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();
      } catch (error) {
        console.error('Failed to access the camera:', error);
      }
    };

    const scanQRCode = () => {
      if (!scanning) {
        return; // Si no se está escaneando, no hacer nada
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        console.log('QR Code:', code.data);
        setQRCodeData(code.data); // Guardar los datos del QR leído
        setScanning(false); // Detener el escaneo
      } else {
        console.log('No QR Code found.');
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

  return (
    <div>
      <video ref={videoRef} width={640} height={480} />
      <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />
      {qrCodeData && <h1>{qrCodeData}</h1>}
      <button onClick={() => setScanning(false)}>Toggle Scanning</button> {/* Agregar un botón para activar/desactivar el escaneo */}
    </div>
  );
};

export default QRReader;
