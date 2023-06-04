'use client'
import { useContext } from 'react';
import { AuthContext } from './auth-context';
import { useRouter } from 'next/navigation';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from './Firebase';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../estilos/NavLogin.module.css'

function NavLogin() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const handleLoginWithGoogle = () => {
    signInWithPopup(auth, googleAuthProvider)
      .then((result) => {
        const user = result.user;
        authContext.setUser(user);
        router.replace('/Dashboard');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        authContext.setUser(null);
        router.replace('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <nav>
        {authContext && authContext.user ? (
            <div className={styles.userProfile}>
              <Link href='/Dashboard'>
                <div className={styles.profilePicture}>
                  <Image priority width={40} height={40} src={authContext.user.photoURL} alt="Profile Picture" />
                </div>
              </Link>
              <div className={styles.userName}>{authContext.user.displayName}</div>
              <button className={styles.btn} onClick={handleLogout}>Cerrar sesión</button>
            </div>
        ) : (
            <button className={styles.btn}  onClick={handleLoginWithGoogle}>Iniciar sesión con Google</button>
        )}
    </nav>
  );
}

export default NavLogin;
