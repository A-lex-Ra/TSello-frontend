import jwtDecode from 'jwt-decode';

interface TokenPayload { 
  userId: number;
  email: string;
 }

export default function useAuth() {
  const token = localStorage.getItem('token');
  let userId: number | null = (() => {
    const val = localStorage.getItem('userId');
    return val !== null && !isNaN(+val) ? +val : null;
  })();;
  if (token) {
    try {
      const payload = jwtDecode<TokenPayload>(token) as any;
      console.log('[useAuth] decoded payload =', payload);
    } catch (e) {
      console.error('[useAuth] jwtDecode error', e);
    }
  }
  return { token, userId };
}