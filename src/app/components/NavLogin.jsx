'use client'
import { useContext } from 'react';
import { AuthContext } from './auth-context';
import { useRouter } from 'next/navigation';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from './firebase';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../estilos/NavLogin.module.css';

function NavLogin() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const loginWithGoogle = () => {
    signInWithPopup(auth, googleAuthProvider)
      .then((result) => {
        const user = result.user;
        authContext.setUser(user);
        router.replace('/Dashboard');
      })
      .catch((error) => {
        console.log(error);
        // Mostrar una notificación o mensaje de error al usuario
      });
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        authContext.setUser(null);
        router.replace('/');
      })
      .catch((error) => {
        console.log(error);
        // Mostrar una notificación o mensaje de error al usuario
      });
  };

  return (
    <nav className={styles.navLogin}>
      {authContext && authContext.user ? (
        <div className={styles.userProfile}>
          <Link href="/Dashboard">
              <Image
                className={styles.profilePicture}
                loading="lazy" // Mejora la carga inicial de la imagen
                width={40}
                height={40}
                src={authContext.user.photoURL}
                alt="Profile Picture"
                onError={(e) => {
                  e.target.src = '/default-profile-picture.jpg'; // Manejo de errores de carga de la imagen
                }}
              />
          </Link>
          <div className={styles.userName}>{authContext.user.displayName}</div>
          <button className={styles.btn} onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      ) : (
        <button className={styles.btn} onClick={loginWithGoogle}>
          Iniciar sesión con Google
        </button>
      )}
    </nav>
  );
}

export default NavLogin;
