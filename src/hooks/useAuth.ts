import jwtDecode from 'jwt-decode';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface TokenPayload { 
  userId: number;
  email: string;
 }

export default function useAuth() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const val = localStorage.getItem('userId');
  const userId: number | null = (val != null && !isNaN(+val)) ? +val : null;

  // if (token) {
  //   try {
  //     const payload = jwtDecode<TokenPayload>(token) as any;
  //     console.log('[useAuth] decoded payload =', payload);
  //   } catch (e) {
  //     console.error('[useAuth] jwtDecode error', e);
  //   }
  // }

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const payload = jwtDecode<TokenPayload>(token) as any;

      const currentTime = Math.floor(Date.now() / 1000); // текущая дата в секундах
      if (payload.exp && payload.exp < currentTime) {
        console.warn('Token expired');
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.error('Invalid token', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  return { token, userId };
}