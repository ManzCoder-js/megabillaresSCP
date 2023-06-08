import React, { useState } from 'react';

const MesasDeBillar = ({ onSeleccion }) => {
  const [modelo, setModelo] = useState('');
  const [tamaño, setTamaño] = useState('');
  const [color, setColor] = useState('');
  const [acabado, setAcabado] = useState('');

  const handleSeleccion = () => {
    const nuevaVenta = {
      modelo,
      tamaño,
      color,
      acabado,
    };
    onSeleccion(nuevaVenta);
    setModelo('');
    setTamaño('');
    setColor('');
    setAcabado('');
  };

  return (
    <div>
      <h3>Seleccionar opciones de personalización</h3>
      <label>
        Modelo:
        <select value={modelo} onChange={(e) => setModelo(e.target.value)}>
          <option value="">Seleccione un modelo</option>
          <option value="Modelo 1">Modelo 1</option>
          <option value="Modelo 2">Modelo 2</option>
          <option value="Modelo 3">Modelo 3</option>
          {/* Agrega más opciones de modelo aquí */}
        </select>
      </label>
      <label>
        Tamaño:
        <select value={tamaño} onChange={(e) => setTamaño(e.target.value)}>
          <option value="">Seleccione un tamaño</option>
          <option value="Tamaño 1">Tamaño 1</option>
          <option value="Tamaño 2">Tamaño 2</option>
          <option value="Tamaño 3">Tamaño 3</option>
          {/* Agrega más opciones de tamaño aquí */}
        </select>
      </label>
      <label>
        Color:
        <select value={color} onChange={(e) => setColor(e.target.value)}>
          <option value="">Seleccione un color</option>
          <option value="Color 1">Color 1</option>
          <option value="Color 2">Color 2</option>
          <option value="Color 3">Color 3</option>
          {/* Agrega más opciones de color aquí */}
        </select>
      </label>
      <label>
        Acabado:
        <select value={acabado} onChange={(e) => setAcabado(e.target.value)}>
          <option value="">Seleccione un acabado</option>
          <option value="Acabado 1">Acabado 1</option>
          <option value="Acabado 2">Acabado 2</option>
          <option value="Acabado 3">Acabado 3</option>
          {/* Agrega más opciones de acabado aquí */}
        </select>
      </label>
      <button onClick={handleSeleccion}>Seleccionar</button>
    </div>
  );
};

export default MesasDeBillar;
