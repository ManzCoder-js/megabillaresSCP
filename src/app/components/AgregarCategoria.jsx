import React, { useState } from 'react';

const AgregarCategoria = ({ agregarCategoria }) => {
  const [nuevaCategoria, setNuevaCategoria] = useState('');

  // Función para manejar el cambio en el input de nueva categoría
  const handleChange = (e) => {
    setNuevaCategoria(e.target.value);
  };

  // Función para manejar el envío del formulario de nueva categoría
  const handleSubmit = (e) => {
    e.preventDefault();
    agregarCategoria(nuevaCategoria);
    setNuevaCategoria('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nuevaCategoria}
          onChange={handleChange}
          placeholder="Nueva categoría"
        />
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
};

export default AgregarCategoria;
