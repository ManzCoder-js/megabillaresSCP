import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importa 'next/router' en lugar de 'next/navigation'
import { AuthContext } from './auth-context';

function PrivateRoute({ children }) {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!authContext.user) {
      router.replace('/');
    }
  }, [authContext.user, router]);

  if (!authContext.user) {
    return null;
  }

  return children;
}

export default PrivateRoute;
