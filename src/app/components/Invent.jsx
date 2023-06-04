import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import styles from '../estilos/Inventario.module.css'

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
    const storedInventory = JSON.parse(localStorage.getItem('inventory'));
    if (storedInventory) {
      setInventory(storedInventory);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

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

    return <canvas ref={qrCodeRef} width={100} height={100} />;
  };

  return (
    <div className={styles.ContenedorInv}>
      <h1>Inventario</h1>
      <div className={styles.input} >
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
      </div>
        {inventory.map((item, index) => (
          <li key={index} className={styles.ItemCont}>
            <p>Material:<br/>{item.name}</p>
            <p>Categoria:<br/>{item.category}</p>
            <p>Cantidad:<br/>{item.quantity}</p>
            <QRCodeComponent qrCodeValue={`Item: ${item.name} Categoria: ${item.category}`} />
            <button onClick={() => deleteItem(index)}>Eliminar</button>
            
          </li>
        ))}
    </div>
  );
};

export default InventoryApp;
