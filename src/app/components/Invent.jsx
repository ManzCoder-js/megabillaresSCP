import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import styles from '../estilos/Inventario.module.css';
import QRReader from './QRReader';

const InventoryApp = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 0,
    qrCode: '',
    comment: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showQRReader, setShowQRReader] = useState(false);
  const [scannedItemName, setScannedItemName] = useState('');
  const [scannedItemCategory, setScannedItemCategory] = useState('');
  const canvasRefs = useRef([]);
  const [editItemIndex, setEditItemIndex] = useState(null);

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem('categories'));
    if (storedCategories) {
      setCategories(storedCategories);
    }
  }, []);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items'));
    if (storedItems) {
      setItems(storedItems);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    items.forEach((item, index) => {
      generateQRCode(item.name, item.category, index);
    });
  }, [items]);

  const addNewCategory = () => {
    if (selectedCategory.trim() !== '') {
      setCategories([...categories, selectedCategory]);
      setSelectedCategory('');
    }
  };

  const deleteCategory = (categoryToDelete) => {
    const updatedCategories = categories.filter(
      (category) => category !== categoryToDelete
    );
    setCategories(updatedCategories);

    const updatedItems = items.filter(
      (item) => item.category !== categoryToDelete
    );
    setItems(updatedItems);
  };

  const addItem = (category) => {
    if (newItem.name.trim() !== '') {
      const updatedItem = { ...newItem, category };
      setItems([...items, updatedItem]);
      setNewItem({
        name: '',
        quantity: 0,
        qrCode: '',
        comment: ''
      });
    }
  };

  const deleteItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const generateQRCode = (itemName, category, index) => {
    const canvasRef = canvasRefs.current[index];
    if (canvasRef) {
      const canvasId = `qr-code-${itemName}`;
      const qrCodeValue = `Item: ${itemName} Categoría: ${category}`;
      QRCode.toCanvas(canvasRef, qrCodeValue, (error) => {
        if (error) {
          console.error(error);
        }
      });

      const updatedItem = { ...items[index], qrCode: qrCodeValue };
      setItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index] = updatedItem;
        return updatedItems;
      });
    }
  };

  const parseQRCodeData = (data) => {
    const regex = /Item: (.+) Categoría: (.+)/;
    const match = data.match(regex);
    if (match && match.length === 3) {
      return {
        name: match[1],
        category: match[2]
      };
    }
    return {
      name: '',
      category: ''
    };
  };

  const searchItems = () => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter((item) => {
      if (scannedItemName !== '') {
        return item.name.toLowerCase().includes(scannedItemName.toLowerCase());
      }
      return true;
    });
  };

  const handleScan = (data) => {
    if (data) {
      const parsedData = parseQRCodeData(data);
      setScannedItemName(parsedData.name);
      setScannedItemCategory(parsedData.category);
      setShowQRReader(false);
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

  const handleCommentChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].comment = value;
    setItems(updatedItems);
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevNewItem) => ({
      ...prevNewItem,
      [name]: value
    }));
  };

  const handleEditItem = (index) => {
    setEditItemIndex(index);
  };

  return (
    <div className={styles.invent}>
      <div className={styles.crearInvent}>
        <div className={styles.input}>
          <input
            type="text"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            placeholder="Nombre de la categoría"
          />
          <button className={styles.btnAgregar} onClick={addNewCategory}>
            Agregar Categoría
          </button>
        </div>
      </div>
      <div className={styles.ContenedorInv}>
        <button className={styles.btnQRSearch} onClick={() => setShowQRReader(true)}>
          Buscar por código QR
        </button>
        {showQRReader && <QRReader onScan={handleScan} />}
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h2>{category}</h2>
            <div className={styles.ItemCard}>
              {searchItems().map((item, itemIndex) => {
                if (item.category === category) {
                  return (
                    <li key={itemIndex} className={styles.ItemCont}>
                      <p>Material: {item.name}</p>
                      <p>Categoría: {item.category}</p>
                      <p>Cantidad: {item.quantity}</p>
                      <QRCodeComponent
                        qrCodeValue={`Item: ${item.name} Categoría: ${item.category}`}
                      />
                      {editItemIndex === itemIndex ? (
                        <>
                          <input
                            type="number"
                            name="quantity"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(e, itemIndex)}
                          />
                          <textarea
                            value={item.comment}
                            onChange={(e) => handleCommentChange(itemIndex, e.target.value)}
                          />
                          <button
                            className={styles.btnGuardar}
                            onClick={() => setEditItemIndex(null)}
                          >
                            Guardar
                          </button>
                        </>
                      ) : (
                        <>
                          <p>Comentario: {item.comment}</p>
                          <button
                            className={styles.btnEditar}
                            onClick={() => handleEditItem(itemIndex)}
                          >
                            Editar
                          </button>
                          <button
                            className={styles.btnEliminar}
                            onClick={() => deleteItem(itemIndex)}
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </li>
                  );
                }
                return null;
              })}
            </div>
            <button
              className={styles.btnEliminarCategoria}
              onClick={() => deleteCategory(category)}
            >
              Eliminar Categoría
            </button>
            <div className={styles.input}>
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleItemChange}
                placeholder="Nombre del material"
              />
              <input
                type="number"
                name="quantity"
                value={newItem.quantity}
                onChange={handleItemChange}
                placeholder="Cantidad"
              />
              <textarea
                name="comment"
                value={newItem.comment}
                onChange={handleItemChange}
                placeholder="Comentario"
              />
              <button className={styles.btnAgregar} onClick={() => addItem(category)}>
                Agregar Material
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryApp;
