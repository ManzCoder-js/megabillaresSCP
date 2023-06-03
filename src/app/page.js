import { AuthProvider } from './components/auth-context'
import styles from './page.module.css'

export default function Home() {
  return (
    <AuthProvider>
    <main className={styles.main}> 
      Hola mundo
    </main>
    </AuthProvider>
  )
}
