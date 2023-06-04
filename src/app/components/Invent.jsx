import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const InventoryApp = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: 0,
    qrCode: ''
  });
  const canvasRefs = useRef([]);

  useEffect(() => {
    inventory.forEach((item, index) => {
      generateQRCode(item.name, index);
    });
  }, [inventory]);

  const addNewItem = () => {
    if (newItem.name.trim() !== '') {
      const updatedItem = { ...newItem };
      setInventory([...inventory, updatedItem]);
      setNewItem({
        name: '',
        category: '',
        quantity: 0,
        qrCode: ''
      });
    }
  };

  const deleteItem = (index) => {
    const updatedInventory = [...inventory];
    updatedInventory.splice(index, 1);
    setInventory(updatedInventory);
  };

  const generateQRCode = (itemName, index) => {
    const canvasRef = canvasRefs.current[index];
    if (canvasRef) {
      const canvasId = `qr-code-${itemName}`;
      const qrCodeValue = `Item: ${itemName}`;
      QRCode.toCanvas(canvasRef, qrCodeValue, (error) => {
        if (error) {
          console.error(error);
        }
      });

      const updatedItem = { ...inventory[index], qrCode: qrCodeValue };
      setInventory((prevInventory) => {
        const updatedInventory = [...prevInventory];
        updatedInventory[index] = updatedItem;
        return updatedInventory;
      });
    }
  };

  const QRCodeComponent = ({ qrCodeValue }) => {
    const qrCodeRef = useRef(null);

    useEffect(() => {
      if (qrCodeRef.current) {
        QRCode.toCanvas(qrCodeRef.current, qrCodeValue, (error) => {
          if (error) {
            console.error(error);
          }
        });
      }
    }, [qrCodeValue]);

    return <canvas ref={qrCodeRef} />;
  };

  return (
    <div>
      <h1>Inventario</h1>
      <input
        type="text"
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        placeholder="Nombre del elemento"
      />
      <input
        type="text"
        value={newItem.category}
        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
        placeholder="Categoría"
      />
      <input
        type="number"
        value={newItem.quantity}
        onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
        placeholder="Cantidad"
      />
      <button onClick={addNewItem}>Agregar</button>
      <ul>
        {inventory.map((item, index) => (
          <li key={index}>
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{item.quantity}</p>
            <QRCodeComponent qrCodeValue={`Item: ${item.name} Categoria: ${item.category}`} />
            <p>{item.qrCode}</p>
            <button onClick={() => deleteItem(index)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryApp;