
const Sidebar = ({ setOpcionSeleccionada }) => {
    const handleOptionClick = (opcion) => {
      setOpcionSeleccionada(opcion);
    };
  
    return (
      <aside >
        <button onClick={() => handleOptionClick('inventario')}>Inventario</button>
        <button onClick={() => handleOptionClick('calendario')}>Calendario</button>
        <button onClick={() => handleOptionClick('compras')}>Compras</button>
        <button onClick={() => handleOptionClick('ventas')}>Ventas</button>
        <button onClick={() => handleOptionClick('produccion')}>Producción</button>
      </aside>
    );
  };
 export default Sidebar;