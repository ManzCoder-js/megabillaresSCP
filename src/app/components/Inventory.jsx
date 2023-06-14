import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from './firebase';
import styles from '../estilos/Inventario.module.css';

export default function Inventory() {
  const [newMaterialCategory, setNewMaterialCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [materials, setMaterials] = useState([]);
  const [editMaterial, setEditMaterial] = useState({
    id: '',
    nombre: '',
    cantidad: '',
    detalles: ''
  });
  const [editingInventory, setEditingInventory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: ''
  });
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    quantity: '',
    details: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(db, 'categorias');
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesData = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (selectedCategory) {
        const materialsCollection = collection(
          db,
          'categorias',
          selectedCategory,
          'materiales'
        );
        const materialsSnapshot = await getDocs(materialsCollection);
        const materialsData = materialsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setMaterials(materialsData);
      } else {
        setMaterials([]);
      }
    };

    fetchMaterials();
  }, [selectedCategory]);

  const handleEditMaterial = (material) => {
    setEditMaterial(material);
  };

  const handleUpdateMaterial = async (
    materialId,
    updatedName,
    updatedQuantity,
    updatedDetails
  ) => {
    try {
      const materialRef = doc(
        db,
        'categorias',
        selectedCategory,
        'materiales',
        materialId
      );
      await updateDoc(materialRef, {
        nombre: updatedName,
        cantidad: updatedQuantity,
        detalles: updatedDetails
      });
      setMaterials((prevMaterials) =>
        prevMaterials.map((material) =>
          material.id === materialId
            ? {
                ...material,
                nombre: updatedName,
                cantidad: updatedQuantity,
                detalles: updatedDetails
              }
            : material
        )
      );
      setEditMaterial(null);
    } catch (error) {
      console.error('Error updating material: ', error);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    try {
      await deleteDoc(
        doc(db, 'categorias', selectedCategory, 'materiales', materialId)
      );
      setMaterials((prevMaterials) =>
        prevMaterials.filter((material) => material.id !== materialId)
      );
    } catch (error) {
      console.error('Error deleting material: ', error);
    }
  };

  const handleEditInventory = () => {
    setEditingInventory(true);
  };

  const handleCancelEditInventory = () => {
    setEditingInventory(false);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (newCategory.name.trim() === '') {
      return;
    }

    const category = {
      nombre: newCategory.name
    };

    try {
      const docRef = await addDoc(collection(db, 'categorias'), category);
      setCategories((prevCategories) => [
        ...prevCategories,
        { id: docRef.id, ...category }
      ]);
      setNewCategory({ name: '' });
    } catch (error) {
      console.error('Error adding category: ', error);
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();

    if (newMaterial.name.trim() === '' || newMaterial.quantity.trim() === '') {
      return;
    }

    const material = {
      nombre: newMaterial.name,
      cantidad: newMaterial.quantity,
      detalles: newMaterial.details
    };

    try {
      const docRef = await addDoc(
        collection(db, 'categorias', selectedCategory, 'materiales'),
        material
      );

      const qrCodeContent = `${material.nombre}, ${selectedCategory}`;
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeContent);

      setMaterials((prevMaterials) => [
        ...prevMaterials,
        { id: docRef.id, ...material, qrCodeDataURL }
      ]);
      setNewMaterial({ name: '', quantity: '', details: '' });
    } catch (error) {
      console.error('Error adding material: ', error);
    }
  };

  return (
    <div className={styles.Inventory}>
      <h1>Inventario</h1>
      <div className={styles.barraCategorias}>
      <h2>Categorías</h2>
      {categories.map((category) => (
        
          <button key={category.id} onClick={() => setSelectedCategory(category.id)}>
            {category.nombre}
           </button>
      ))}
     
      {editingInventory ? (
        <form onSubmit={handleAddCategory}>
          <input
            type="text"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
          />
          <button type="submit">Agregar Categoría</button>
          <button onClick={handleCancelEditInventory}>Cancelar</button>
        </form>
      ) : (
        <button onClick={handleEditInventory}>Editar Inventario</button>
      )}
      </div>
      <h2>Materiales</h2>
      <div >
          <form onSubmit={handleAddMaterial}>
            <input
              type="text"
              placeholder="Nombre del material"
              value={newMaterial.name}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Cantidad"
              value={newMaterial.quantity}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, quantity: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Detalles"
              value={newMaterial.details}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, details: e.target.value })
              }
            />
            <button type="submit">Agregar Material</button>
          </form>
          </div>

      {selectedCategory && (
        <div className={styles.materiales}>

          {(
            materials.map((material) =>
              material.id === editMaterial?.id ? (
                <div key={material.id}>
                  <input
                    type="text"
                    value={editMaterial.nombre}
                    onChange={(e) =>
                      setEditMaterial({
                        ...editMaterial,
                        nombre: e.target.value
                      })
                    }
                  />
                  <input
                    type="text"
                    value={editMaterial.cantidad}
                    onChange={(e) =>
                      setEditMaterial({
                        ...editMaterial,
                        cantidad: e.target.value
                      })
                    }
                  />
                  <input
                    type="text"
                    value={editMaterial.detalles}
                    onChange={(e) =>
                      setEditMaterial({
                        ...editMaterial,
                        detalles: e.target.value
                      })
                    }
                  />
                  <button
                    onClick={() =>
                      handleUpdateMaterial(
                        editMaterial.id,
                        editMaterial.nombre,
                        editMaterial.cantidad,
                        editMaterial.detalles
                      )
                    }
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <div className={styles.materialCard} key={material.id}>
                  <p>{material.nombre}</p>
                  <p>Cantidad: {material.cantidad}</p>
                  <p>Detalles: {material.detalles}</p>
                  <button onClick={() => handleEditMaterial(material)}>
                    Editar
                  </button>
                  <button onClick={() => handleDeleteMaterial(material.id)}>
                    Eliminar
                  </button>
                  <QRCode value={`${material.nombre}, ${selectedCategory}`} />
                </div>
              )
            )
          ) }
          
        </div>
      )}
      
    </div>
  );
            }