'use client'
import Sidebar from "../components/BarraLateral";
import PrivateRoute from "../components/PrivateRoute";
import styles from "./styles.module.css"
import React, { useState } from 'react';
import Inventario from "../components/Inventario";
import Calendario from "../components/Calendario";
import Compras from "../components/Compras";
import Ventas from "../components/Ventas";
import Produccion from "../components/Produccion";


export default function Dashboard(){
    const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);

    const opciones = {
        inventario: <Inventario />,
        calendario: <Calendario />,
        compras: <Compras />,
        ventas: <Ventas />,
        produccion: <Produccion />,
      };
    return(
        <PrivateRoute>
          <main className={styles.main}>
          <nav>
        <Sidebar setOpcionSeleccionada={setOpcionSeleccionada} />
        </nav>
        <div className={styles.dashboard}>

            hola mundo
        </div>
        <div className={styles.content}>
          {opcionSeleccionada && opciones[opcionSeleccionada]}
        </div>
        </main>
        </PrivateRoute>
    )
}