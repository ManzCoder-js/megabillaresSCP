'use client'
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from './auth-context';

function PrivateRoute({ children }) {
  const user = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return children;
}

export default PrivateRoute;
