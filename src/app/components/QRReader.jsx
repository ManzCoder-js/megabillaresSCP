import React, { useEffect, useRef, useState } from 'react';
import { getDocs, query, collection, doc, getDoc, where, updateDoc } from 'firebase/firestore';
import jsQR from 'jsqr';
import { db } from './firebase';

const QRReader = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(true);
  const [qrCodeData, setQRCodeData] = useState('');
  const [error, setError] = useState('');
  const [materialData, setMaterialData] = useState([]);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });

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
        return;
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setQRCodeData(code.data);
        setScanning(false);

        searchQRCodeData(code.data);
      } else {
        setError('No QR Code found');
      }
    };

    const startScanning = async () => {
      await startCamera();
      setScanning(true);
    };

    startScanning();

    const interval = setInterval(scanQRCode, 200);

    return () => {
      clearInterval(interval);
      const stream = video.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const searchQRCodeData = async (qrCodeData) => {
    try {
      const [materialName, categoryId] = qrCodeData.split(', ');

      const categoryRef = doc(db, 'categorias', categoryId);
      const categoryDoc = await getDoc(categoryRef);

      if (!categoryDoc.exists()) {
        setError('Category not found');
        return;
      }

      const categoryData = categoryDoc.data();

      const materialsCollection = collection(db, 'categorias', categoryId, 'materiales');
      const q = query(materialsCollection, where('nombre', '==', materialName));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Material not found');
        return;
      }

      const materials = querySnapshot.docs.map((doc) => doc.data());
      setMaterialData(materials);
    } catch (error) {
      setError('Error searching QR Code data');
      console.error(error);
    }
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    setOpenEditModal(true);
  };

  const handleSaveMaterial = async () => {
    try {
      // Actualizar el material en la base de datos
      const materialRef = doc(
        db,
        'categorias',
        editingMaterial.categoryId,
        'materiales',
        editingMaterial.id
      );
      await updateDoc(materialRef, editingMaterial); // Utiliza directamente el objeto editingMaterial para actualizar todos los campos

      // Actualizar los datos del material en el estado
      setMaterialData((prevData) =>
        prevData.map((material) => (material.id === editingMaterial.id ? editingMaterial : material))
      );

      setOpenEditModal(false);
      setEditingMaterial(null);
    } catch (error) {
      setError('Error saving material');
      console.error(error);
    }
  };

  const handleLoadedData = () => {
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
  };

  return (
    <div>
      <video ref={videoRef} width='100%' height='100%' onLoadedData={handleLoadedData} autoPlay />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {qrCodeData && (
        <div>
          <h1>{qrCodeData}</h1>
        </div>
      )}
      {materialData.length > 0 && (
        <div>
          <h2>Material Data:</h2>
          <ul>
            {materialData.map((material, index) => (
              <li key={index}>
                <h3>{material.nombre}</h3>
                <h3>{material.cantidad}</h3>
                <p>{material.detalles}</p>
                <button onClick={() => handleEditMaterial(material)}>Editar</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {editingMaterial && openEditModal && (
        <div>
          <h2>Edit Material:</h2>
          <input
            type="text"
            value={editingMaterial.nombre}
            onChange={(e) =>
              setEditingMaterial({
                ...editingMaterial,
                nombre: e.target.value
              })
            }
          />
          <input
            type="number"
            value={editingMaterial.cantidad}
            onChange={(e) =>
              setEditingMaterial({
                ...editingMaterial,
                cantidad: e.target.value
              })
            }
          />
          
          <textarea
            value={editingMaterial.detalles}
            onChange={(e) =>
              setEditingMaterial({
                ...editingMaterial,
                detalles: e.target.value
              })
            }
          />
          <button onClick={handleSaveMaterial}>Save</button>
        </div>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default QRReader;
