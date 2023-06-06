'use client'
import { useState } from "react";
const Ventas = () => {
  const [poolTable, setPoolTable] = useState({
    size: '',
    slateModel: '',
    clothColor: '',
  });

  // Función para manejar los cambios en las características de la mesa de billar
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPoolTable((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Función para guardar la nueva mesa de billar
  const handleSave = () => {
    // Aquí puedes realizar cualquier lógica adicional, como enviar los datos al servidor
    console.log(poolTable);
  };

  return (
    <div>
      <h2>Mesas de billar</h2>
      <div>
        <button>Crear nueva venta</button>
      </div>
      <div>
        {/* Aquí se mostrará la tarjeta para modificar las características */}
        <h3>Modificar características</h3>
        <form>
          <label>
            Tamaño:
            <input
              type="text"
              name="size"
              value={poolTable.size}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Modelo de pizarra:
            <input
              type="text"
              name="slateModel"
              value={poolTable.slateModel}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Color de paño:
            <input
              type="text"
              name="clothColor"
              value={poolTable.clothColor}
              onChange={handleInputChange}
            />
          </label>
        </form>
        <button onClick={handleSave}>Guardar</button>
      </div>
    </div>
  );
};

export default Ventas

