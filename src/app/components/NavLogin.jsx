// NavLogin.jsx
'use client'
import { useContext } from 'react';
import { AuthContext } from './auth-context';
import { useRouter } from 'next/navigation';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from './Firebase';

function NavLogin() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const handleLoginWithGoogle = () => {
    signInWithPopup(auth, googleAuthProvider)
      .then((result) => {
        const user = result.user;
        // Aquí puedes realizar acciones adicionales, como guardar el usuario en tu base de datos
        authContext.setUser(user); // Guarda el usuario en el estado de AuthContext
        router.replace('/Dashboard');
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        authContext.setUser(null); // Elimina el usuario del estado de AuthContext al cerrar sesión
        router.replace('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <nav>
      <ul>
        <li>
          <a href="/">Inicio</a>
        </li>
        {authContext && authContext.user ? (
          <li>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </li>
        ) : (
          <li>
            <button onClick={handleLoginWithGoogle}>Iniciar sesión con Google</button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavLogin;
