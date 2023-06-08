import React, { useState } from 'react';

const Produccion = () => {
  const [ventas, setVentas] = useState([
    {
      id: 1,
      modelo: 'Mesa de billar 1',
      pasos: [
        { nombre: 'Fabricar patas', estado: 'pendiente' },
        { nombre: 'Fabricar casco o estructura', estado: 'pendiente' },
        { nombre: 'Fabricar pizarra', estado: 'pendiente' },
        { nombre: 'Fabricar rieles', estado: 'pendiente' },
        { nombre: 'Fabricar esquineros', estado: 'pendiente' },
        { nombre: 'Aplicar pintura', estado: 'pendiente' },
        { nombre: 'Revisión de acabados', estado: 'pendiente' },
      ],
    },
    // Agrega más objetos de ventas con sus respectivos pasos
  ]);

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
