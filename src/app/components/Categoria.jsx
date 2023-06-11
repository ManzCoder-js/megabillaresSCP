import React, { useState } from 'react';
import Elemento from './Elemento';
import AgregarElemento from './AgregarElemento';

const Categoria = ({ categoria, editarCategoria, eliminarCategoria }) => {
  const [categoriaEditada, setCategoriaEditada] = useState(categoria);
  const [editando, setEditando] = useState(false);
  const [elementos, setElementos] = useState([]);

  // Función para manejar los cambios en los campos de la categoría editada
  const handleChange = (e) => {
    setCategoriaEditada({
      ...categoriaEditada,
      [e.target.name]: e.target.value,
    });
  };

  // Función para guardar los cambios en la categoría editada
  const guardarCambios = () => {
    editarCategoria(categoria.id, categoriaEditada);
    setEditando(false);
  };

  // Función para agregar un nuevo elemento a la categoría
  const agregarElemento = (nuevoElemento) => {
    setElementos([...elementos, nuevoElemento]);
  };

  return (
    <div>
      {editando ? (
        <div>
          {/* Campos editables para cada propiedad de la categoría */}
          <input
            type="text"
            name="nombre"
            value={categoriaEditada.nombre}
            onChange={handleChange}
          />

          {/* Botón para guardar los cambios */}
          <button onClick={guardarCambios}>Guardar</button>
        </div>
      ) : (
        <div>
          {/* Mostrar el nombre de la categoría */}
          <h2>Categoria: {categoria.nombre}</h2>

          {/* Renderizar los elementos de la categoría */}
          <ul>
            {elementos.map((elemento, index) => (
              <Elemento key={index} elemento={elemento} />
            ))}
          </ul>

          {/* Componente para agregar un nuevo elemento */}
          <AgregarElemento agregarElemento={agregarElemento} />

          {/* Botones para editar y eliminar */}
          <button onClick={() => setEditando(true)}>Editar</button>
          <button onClick={() => eliminarCategoria(categoria.id)}>Eliminar</button>
        </div>
      )}
    </div>
  );
};

export default Categoria;
