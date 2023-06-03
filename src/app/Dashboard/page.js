import PrivateRoute from "../components/PrivateRoute";
import styles from "./styles.module.css"
export default function Dashboard(){
    return(
        <PrivateRoute>
        <div className={styles.dashboard}>
            hola mundo
        </div>
        </PrivateRoute>
    )
}