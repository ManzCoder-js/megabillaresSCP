import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

const QRReader = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(true);
  const [qrCodeData, setQRCodeData] = useState('');
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const scanQRCode = () => {
      if (paused || !scanning) {
        return; // Si está en pausa o no se está escaneando, no hacer nada
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        console.log('QR Code:', code.data);
        setQRCodeData(code.data); // Guardar los datos del QR leído
        setScanning(false); // Detener el escaneo

        // Detener la cámara
        video.srcObject.getTracks().forEach((track) => track.stop());
      } else {
        console.log('No QR Code found.');
      }
    };

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.play();

        const interval = setInterval(scanQRCode, 200); // Realiza la decodificación cada 200ms (ajusta el intervalo según tus necesidades)

        return () => {
          clearInterval(interval); // Limpiar el intervalo al desmontar el componente
        };
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });
  }, []);

  const togglePause = () => {
    setPaused((prevPaused) => !prevPaused); // Cambiar el estado de pausa
  };

  return (
    <div>
      <video ref={videoRef} width={640} height={480} />
      <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />
      {qrCodeData && <h1>{qrCodeData}</h1>}
      <button onClick={togglePause}>{paused ? 'Resume' : 'Pause'}</button>
    </div>
  );
};

export default QRReader;
