import React, { useState, useEffect } from 'react';

const Produccion = () => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    // Cargar las ventas almacenadas en el localStorage cuando el componente se monta
    const ventasAlmacenadas = JSON.parse(localStorage.getItem('ventas'));
    if (ventasAlmacenadas) {
      setVentas(ventasAlmacenadas);
    }
  }, []);

  const marcarPaso = (ventaId, pasoIndex, estado) => {
    // Actualiza el estado del paso en la venta correspondiente
    const nuevasVentas = ventas.map((venta) => {
      if (venta.id === ventaId) {
        const nuevosPasos = venta.pasos.map((paso, index) => {
          if (index === pasoIndex) {
            return { ...paso, estado };
          }
          return paso;
        });
        return { ...venta, pasos: nuevosPasos };
      }
      return venta;
    });

    setVentas(nuevasVentas);
    // Almacenar las ventas actualizadas en el localStorage
    localStorage.setItem('ventas', JSON.stringify(nuevasVentas));
  };

  return (
    <div>
      <h2>Producción</h2>
      {ventas.map((venta) => (
        <div key={venta.id} className="venta-card">
          <h3>{venta.modelo}</h3>
          <h4>Pasos de fabricación:</h4>
          <ul>
            {venta.pasos.map((paso, index) => (
              <li key={index}>
                {paso.nombre} - {paso.estado}
                <div>
                  <button onClick={() => marcarPaso(venta.id, index, 'pendiente')}>Pendiente</button>
                  <button onClick={() => marcarPaso(venta.id, index, 'en proceso')}>En Proceso</button>
                  <button onClick={() => marcarPaso(venta.id, index, 'acabado')}>Acabado</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Produccion;
