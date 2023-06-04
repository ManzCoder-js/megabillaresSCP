import styles from "../estilos/Sidebar.module.css"

const Sidebar = ({ setOpcionSeleccionada }) => {
    const handleOptionClick = (opcion) => {
      setOpcionSeleccionada(opcion);
    };
  
    return (
      <aside className={styles.Sidebar} >
        <button className={styles.opcion} onClick={() => handleOptionClick('inventario')}>Inventario</button>
        <button className={styles.opcion} onClick={() => handleOptionClick('calendario')}>Calendario</button>
        <button className={styles.opcion} onClick={() => handleOptionClick('compras')}>Compras</button>
        <button className={styles.opcion} onClick={() => handleOptionClick('ventas')}>Ventas</button>
        <button className={styles.opcion} onClick={() => handleOptionClick('produccion')}>Producción</button>
      </aside>
    );
  };
 export default Sidebar;