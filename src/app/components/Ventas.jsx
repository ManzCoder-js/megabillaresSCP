import React, { useState } from 'react';

const Ventas = () => {
  const [nuevaVenta, setNuevaVenta] = useState({
    modelo: '',
    tamaño: '',
    color: '',
    acabado: '',
    cliente: '',
  });
  const [ventas, setVentas] = useState([]);

  const handleChange = (e) => {
    setNuevaVenta({
      ...nuevaVenta,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setVentas([...ventas, nuevaVenta]);
    setNuevaVenta({
      modelo: '',
      tamaño: '',
      color: '',
      acabado: '',
      cliente: '',
    });
  };

  return (
    <div>
      <h2>Ventas</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Modelo:
          <input
            type="text"
            name="modelo"
            value={nuevaVenta.modelo}
            onChange={handleChange}
          />
        </label>
        <label>
          Tamaño:
          <input
            type="text"
            name="tamaño"
            value={nuevaVenta.tamaño}
            onChange={handleChange}
          />
        </label>
        <label>
          Color:
          <input
            type="text"
            name="color"
            value={nuevaVenta.color}
            onChange={handleChange}
          />
        </label>
        <label>
          Acabado:
          <input
            type="text"
            name="acabado"
            value={nuevaVenta.acabado}
            onChange={handleChange}
          />
        </label>
        <label>
          Cliente:
          <input
            type="text"
            name="cliente"
            value={nuevaVenta.cliente}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Crear Venta</button>
      </form>
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
