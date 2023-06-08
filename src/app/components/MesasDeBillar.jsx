import React, { useState, useEffect } from 'react';

const MesasDeBillar = ({ ventaEditar, onSeleccion, onCancel }) => {
  const [nuevaVenta, setNuevaVenta] = useState({
    modelo: '',
    tamaño: '',
    color: '',
    acabado: '',
    cliente: '',
  });

  useEffect(() => {
    if (ventaEditar) {
      setNuevaVenta(ventaEditar);
    }
  }, [ventaEditar]);

  const handleChange = (field, value) => {
    setNuevaVenta({
      ...nuevaVenta,
      [field]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSeleccion(nuevaVenta);
    setNuevaVenta({
      modelo: '',
      tamaño: '',
      color: '',
      acabado: '',
      cliente: '',
    });
  };

  const handleCancel = () => {
    setNuevaVenta({
      modelo: '',
      tamaño: '',
      color: '',
      acabado: '',
      cliente: '',
    });
    onCancel(); // Llamada a la función onCancel para cerrar el formulario
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Modelo:
          <select
            value={nuevaVenta.modelo}
            onChange={(e) => handleChange('modelo', e.target.value)}
          >
            <option value="">Seleccione un modelo</option>
            <option value="Modelo 1">Modelo 1</option>
            <option value="Modelo 2">Modelo 2</option>
            <option value="Modelo 3">Modelo 3</option>
            {/* Agrega más opciones de modelo aquí */}
          </select>
        </label>
        <label>
          Tamaño:
          <select
            value={nuevaVenta.tamaño}
            onChange={(e) => handleChange('tamaño', e.target.value)}
          >
            <option value="">Seleccione un tamaño</option>
            <option value="Tamaño 1">Tamaño 1</option>
            <option value="Tamaño 2">Tamaño 2</option>
            <option value="Tamaño 3">Tamaño 3</option>
            {/* Agrega más opciones de tamaño aquí */}
          </select>
        </label>
        <label>
          Color:
          <select
            value={nuevaVenta.color}
            onChange={(e) => handleChange('color', e.target.value)}
          >
            <option value="">Seleccione un color</option>
            <option value="Color 1">Color 1</option>
            <option value="Color 2">Color 2</option>
            <option value="Color 3">Color 3</option>
            {/* Agrega más opciones de color aquí */}
          </select>
        </label>
        <label>
          Acabado:
          <select
            value={nuevaVenta.acabado}
            onChange={(e) => handleChange('acabado', e.target.value)}
          >
            <option value="">Seleccione un acabado</option>
            <option value="Acabado 1">Acabado 1</option>
            <option value="Acabado 2">Acabado 2</option>
            <option value="Acabado 3">Acabado 3</option>
            {/* Agrega más opciones de acabado aquí */}
          </select>
        </label>
        <label>
          Cliente:
          <input
            type="text"
            name="cliente"
            value={nuevaVenta.cliente}
            onChange={(e) => handleChange('cliente', e.target.value)}
          />
        </label>
        <button type="submit">{ventaEditar ? 'Guardar Cambios' : 'Crear Venta'}</button>
        <button type="button" onClick={handleCancel}>Cancelar</button>
      </form>
    </div>
  );
};

export default MesasDeBillar;
