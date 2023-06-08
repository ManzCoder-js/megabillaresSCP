import React, { useState } from 'react';
import MesasDeBillar from './MesasDeBillar';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [mostrarMesasDeBillar, setMostrarMesasDeBillar] = useState(false);
  const [ventaEditar, setVentaEditar] = useState(null); // Estado para almacenar la venta actualmente seleccionada para su edición

  const handleCrearVenta = (nuevaVenta) => {
    if (ventaEditar) {
      // Si hay una venta seleccionada para editar, actualizamos la venta existente
      const ventasActualizadas = ventas.map((venta) =>
        venta === ventaEditar ? nuevaVenta : venta
      );
      setVentas(ventasActualizadas);
      setVentaEditar(null); // Limpiamos el estado de la venta a editar
    } else {
      // Si no hay venta seleccionada para editar, agregamos una nueva venta
      setVentas([...ventas, nuevaVenta]);
    }
    setMostrarMesasDeBillar(false); // Ocultar el formulario de MesasDeBillar después de crear/editar la venta
  };

  const handleEditarVenta = (venta) => {
    setVentaEditar(venta); // Establecer la venta seleccionada para editar
    setMostrarMesasDeBillar(true); // Mostrar el formulario de MesasDeBillar para editar la venta
  };

  const handleEliminarVenta = (venta) => {
    const ventasActualizadas = ventas.filter((v) => v !== venta);
    setVentas(ventasActualizadas);
  };

  const handleMostrarMesasDeBillar = () => {
    setVentaEditar(null); // Limpiamos el estado de la venta a editar
    setMostrarMesasDeBillar(true);
  };

  const handleCancelarFormulario = () => {
    setVentaEditar(null); // Limpiamos el estado de la venta a editar
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
            ventaEditar={ventaEditar} // Pasamos la venta a editar como prop
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
          <button onClick={() => handleEditarVenta(venta)}>Editar</button> {/* Agregamos el botón de Editar */}
          <button onClick={() => handleEliminarVenta(venta)}>Eliminar</button> {/* Agregamos el botón de Eliminar */}
        </div>
      ))}
    </div>
  );
};

export default Ventas;
