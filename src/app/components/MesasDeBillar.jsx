import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MesasDeBillar = ({ ventaEditar, onSeleccion, onCancel }) => {
  const [modelo, setModelo] = useState(ventaEditar ? ventaEditar.modelo : '');
  const [tamaño, setTamaño] = useState(ventaEditar ? ventaEditar.tamaño : '');
  const [color, setColor] = useState(ventaEditar ? ventaEditar.color : '');
  const [acabado, setAcabado] = useState(ventaEditar ? ventaEditar.acabado : '');
  const [cliente, setCliente] = useState(ventaEditar ? ventaEditar.cliente : '');
  const [fechaEntrega, setFechaEntrega] = useState(ventaEditar ? ventaEditar.fechaEntrega.toDate() : new Date());
  const [detallesMesa, setDetallesMesa] = useState(ventaEditar ? ventaEditar.detallesMesa : '');
  const [pasosProduccion, setPasosProduccion] = useState(
    ventaEditar ? ventaEditar.pasosProduccion : [
      { nombre: 'Fabricar patas', estado: 'pendiente' },
      { nombre: 'Fabricar casco o estructura', estado: 'pendiente' },
      { nombre: 'Fabricar pizarra', estado: 'pendiente' },
      { nombre: 'Fabricar rieles', estado: 'pendiente' },
      { nombre: 'Fabricar esquineros', estado: 'pendiente' },
      { nombre: 'Aplicar pintura', estado: 'pendiente' },
      { nombre: 'Revisión de acabados', estado: 'pendiente' },
    ]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaVenta = {
      modelo,
      tamaño,
      color,
      acabado,
      cliente,
      fechaEntrega,
      detallesMesa,
      pasosProduccion,
    };
    onSeleccion(nuevaVenta);
  };

  const handlePasoChange = async (index, e) => {
    const updatedPasosProduccion = [...pasosProduccion];
    updatedPasosProduccion[index].estado = e.target.value;
    setPasosProduccion(updatedPasosProduccion);

    if (ventaEditar) {
      const ventaRef = doc(db, 'ventas', ventaEditar.id);
      await updateDoc(ventaRef, { pasosProduccion: updatedPasosProduccion });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Modelo:
        <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} />
      </label>
      <label>
        Tamaño:
        <input type="text" value={tamaño} onChange={(e) => setTamaño(e.target.value)} />
      </label>
      <label>
        Color:
        <input type="text" value={color} onChange={(e) => setColor(e.target.value)} />
      </label>
      <label>
        Acabado:
        <input type="text" value={acabado} onChange={(e) => setAcabado(e.target.value)} />
      </label>
      <label>
        Cliente:
        <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} />
      </label>
      <label>
        Fecha de Entrega:
        <DatePicker selected={fechaEntrega} onChange={(date) => setFechaEntrega(date)} />
      </label>
      <label>
        Detalles de la Mesa:
        <textarea value={detallesMesa} onChange={(e) => setDetallesMesa(e.target.value)} />
      </label>
     
      <button type="submit">{ventaEditar ? 'Actualizar' : 'Guardar'}</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default MesasDeBillar;
