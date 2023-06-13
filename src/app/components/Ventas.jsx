import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import MesasDeBillar from './MesasDeBillar';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [mostrarMesasDeBillar, setMostrarMesasDeBillar] = useState(false);
  const [ventaEditar, setVentaEditar] = useState(null);

  useEffect(() => {
    const fetchVentas = async () => {
      const ventasCollection = collection(db, 'ventas');
      const ventasSnapshot = await getDocs(ventasCollection);
      const ventasData = ventasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setVentas(ventasData);
    };

    fetchVentas();
  }, []);

  useEffect(() => {
    const saveVentas = async () => {
      try {
        const ventasCollection = collection(db, 'ventas');
        await deleteDocs(ventasCollection); // Elimina todas las ventas existentes en Firebase antes de guardar las nuevas
        ventas.forEach(async (venta) => {
          await addDoc(ventasCollection, venta);
        });
      } catch (error) {
        console.error('Error saving ventas: ', error);
      }
    };

    saveVentas();
  }, [ventas]);

  const handleCrearVenta = async (nuevaVenta) => {
    if (ventaEditar) {
      const ventaRef = doc(db, 'ventas', ventaEditar.id);
      await updateDoc(ventaRef, nuevaVenta);
      setVentas((prevVentas) =>
        prevVentas.map((venta) =>
          venta.id === ventaEditar.id ? { ...venta, ...nuevaVenta } : venta
        )
      );
      setVentaEditar(null);
    } else {
      try {
        const docRef = await addDoc(collection(db, 'ventas'), nuevaVenta);
        setVentas((prevVentas) => [...prevVentas, { id: docRef.id, ...nuevaVenta }]);
      } catch (error) {
        console.error('Error creating venta: ', error);
      }
    }
    setMostrarMesasDeBillar(false);
  };

  const handleEditarVenta = (venta) => {
    setVentaEditar(venta);
    setMostrarMesasDeBillar(true);
  };

  const handleEliminarVenta = async (venta) => {
    try {
      const ventaRef = doc(db, 'ventas', venta.id);
      await deleteDoc(ventaRef);
      setVentas((prevVentas) => prevVentas.filter((v) => v.id !== venta.id));
    } catch (error) {
      console.error('Error deleting venta: ', error);
    }
  };

  const handleMostrarMesasDeBillar = () => {
    setVentaEditar(null);
    setMostrarMesasDeBillar(true);
  };

  const handleCancelarFormulario = () => {
    setVentaEditar(null);
    setMostrarMesasDeBillar(false);
  };

  return (
    <div>
      <h2>Ventas</h2>
      {!mostrarMesasDeBillar && (
        <button onClick={handleMostrarMesasDeBillar}>Crear Venta</button>
      )}
      {mostrarMesasDeBillar && (
        <div className="venta-card">
          <h3>{ventaEditar ? 'Editar Venta' : 'Nueva Venta'}</h3>
          <MesasDeBillar
            ventaEditar={ventaEditar}
            onSeleccion={handleCrearVenta}
            onCancel={handleCancelarFormulario}
          />
        </div>
      )}
      {ventas.map((venta) => (
        <div key={venta.id} className="venta-card">
          <h3>{venta.modelo}</h3>
          <p>Tamaño: {venta.tamaño}</p>
          <p>Color: {venta.color}</p>
          <p>Acabado: {venta.acabado}</p>
          <p>Cliente: {venta.cliente}</p>
          <button onClick={() => handleEditarVenta(venta)}>Editar</button>
          <button onClick={() => handleEliminarVenta(venta)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
};

export default Ventas;
