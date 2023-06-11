import React, { useState } from 'react';

const AgregarElemento = ({ agregarElemento }) => {
  const [nuevoElemento, setNuevoElemento] = useState({
    nombre: '',
    cantidad: '',
    detalles: ''
  });

  // Función para manejar los cambios en los campos del nuevo elemento
  const handleChange = (e) => {
    setNuevoElemento({
      ...nuevoElemento,
      [e.target.name]: e.target.value,
    });
  };

  // Función para manejar el envío del formulario de nuevo elemento
  const handleSubmit = (e) => {
    e.preventDefault();
    agregarElemento(nuevoElemento);
    setNuevoElemento({
      nombre: '',
      cantidad: '',
      detalles: ''
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          value={nuevoElemento.nombre}
          onChange={handleChange}
          placeholder="Nombre"
        />
        <input
          type="number"
          name="cantidad"
          value={nuevoElemento.cantidad}
          onChange={handleChange}
          placeholder="Cantidad"
        />
        <input
          type="text"
          name="detalles"
          value={nuevoElemento.detalles}
          onChange={handleChange}
          placeholder="Detalles"
        />
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
};

export default AgregarElemento;
