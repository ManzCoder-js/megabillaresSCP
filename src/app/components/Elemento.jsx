import React from 'react';

const Elemento = ({ elemento }) => {
  return (
    <div>
      {/* Mostrar los datos del elemento */}
      <p>Nombre: {elemento.nombre}</p>
      <p>Cantidad: {elemento.cantidad}</p>
      <p>Detalles: {elemento.detalles}</p>
    </div>
  );
};

export default Elemento;

