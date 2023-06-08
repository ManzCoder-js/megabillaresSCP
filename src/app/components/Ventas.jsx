import React, { useState, useEffect } from 'react';
import MesasDeBillar from './MesasDeBillar';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [mostrarMesasDeBillar, setMostrarMesasDeBillar] = useState(false);
  const [ventaEditar, setVentaEditar] = useState(null);

  useEffect(() => {
    const ventasAlmacenadas = JSON.parse(localStorage.getItem('ventas'));
    if (ventasAlmacenadas) {
      setVentas(ventasAlmacenadas);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ventas', JSON.stringify(ventas));
  }, [ventas]);

  const handleCrearVenta = (nuevaVenta) => {
    const ventaConPasos = {
      ...nuevaVenta,
      pasos: [
        { nombre: 'Fabricar patas', estado: 'pendiente' },
        { nombre: 'Fabricar casco o estructura', estado: 'pendiente' },
        { nombre: 'Fabricar pizarra', estado: 'pendiente' },
        { nombre: 'Fabricar rieles', estado: 'pendiente' },
        { nombre: 'Fabricar esquineros', estado: 'pendiente' },
        { nombre: 'Aplicar pintura', estado: 'pendiente' },
        { nombre: 'Revisión de acabados', estado: 'pendiente' },
      ],
    };

    if (ventaEditar) {
      const ventasActualizadas = ventas.map((venta) =>
        venta === ventaEditar ? ventaConPasos : venta
      );
      setVentas(ventasActualizadas);
      setVentaEditar(null);
    } else {
      setVentas([...ventas, ventaConPasos]);
    }
    setMostrarMesasDeBillar(false);
  };

  const handleEditarVenta = (venta) => {
    setVentaEditar(venta);
    setMostrarMesasDeBillar(true);
  };

  const handleEliminarVenta = (venta) => {
    const ventasActualizadas = ventas.filter((v) => v !== venta);
    setVentas(ventasActualizadas);
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
      {ventas.map((venta, index) => (
        <div key={index} className="venta-card">
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
