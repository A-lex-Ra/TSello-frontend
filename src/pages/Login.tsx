import React, { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/board');
    } catch (err: any) {
      alert('Login failed: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: '100px auto' }}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
