import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { serverTimestamp } from 'firebase/firestore';
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
        if (!nuevaVenta.fechaEntrega || nuevaVenta.cliente === '') {
          console.error('Error creating venta: Campos obligatorios no completados');
          return;
        }

        // Crear el evento en la colección "eventos"
        const newEvent = {
          activity: nuevaVenta.cliente,
          date: nuevaVenta.fechaEntrega,
          timestamp: serverTimestamp(),
        };

        const eventosCollection = collection(db, 'eventos');
        const eventDocRef = await addDoc(eventosCollection, newEvent);
        const eventId = eventDocRef.id;

        // Crear la venta en la colección "ventas"
        const newVenta = {
          modelo: nuevaVenta.modelo,
          tamaño: nuevaVenta.tamaño,
          color: nuevaVenta.color,
          acabado: nuevaVenta.acabado,
          cliente: nuevaVenta.cliente,
          fechaEntrega: nuevaVenta.fechaEntrega,
          detallesMesa: nuevaVenta.detallesMesa,
          pasosProduccion: nuevaVenta.pasosProduccion,
          eventoId: eventId,
        };

        const ventasCollection = collection(db, 'ventas');
        const ventaDocRef = await addDoc(ventasCollection, newVenta);
        setVentas((prevVentas) => [...prevVentas, { id: ventaDocRef.id, ...newVenta }]);
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
      await eliminarEvento(venta.eventoId); // Eliminar el evento asociado
    } catch (error) {
      console.error('Error deleting venta: ', error);
    }
  };
  
  const eliminarEvento = async (eventoId) => {
    try {
      const eventoRef = doc(db, 'eventos', eventoId);
      await deleteDoc(eventoRef);
    } catch (error) {
      console.error('Error deleting evento: ', error);
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
