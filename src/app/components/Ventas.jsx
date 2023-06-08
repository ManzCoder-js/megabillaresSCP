import React, { useState } from 'react';
import MesasDeBillar from './MesasDeBillar';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [mostrarMesasDeBillar, setMostrarMesasDeBillar] = useState(false);

  const handleCrearVenta = (nuevaVenta) => {
    setVentas([...ventas, nuevaVenta]);
    setMostrarMesasDeBillar(false); // Ocultar la tarjeta de MesasDeBillar después de crear la venta
  };

  const handleMostrarMesasDeBillar = () => {
    setMostrarMesasDeBillar(true);
  };

  return (
    <div>
      <h2>Ventas</h2>
      {!mostrarMesasDeBillar && (
        <button onClick={handleMostrarMesasDeBillar}>Crear Venta</button>
      )}
      {mostrarMesasDeBillar && (
        <div className="venta-card">
          <h3>Nueva Venta</h3>
          <MesasDeBillar onSeleccion={handleCrearVenta} />
        </div>
      )}
      {ventas.map((venta, index) => (
        <div key={index} className="venta-card">
          <h3>{venta.modelo}</h3>
          <p>Tamaño: {venta.tamaño}</p>
          <p>Color: {venta.color}</p>
          <p>Acabado: {venta.acabado}</p>
          <p>Cliente: {venta.cliente}</p>
        </div>
      ))}
    </div>
  );
};

export default Ventas;
