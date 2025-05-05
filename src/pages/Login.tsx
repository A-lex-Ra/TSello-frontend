import React, { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/board');
    } catch (err: any) {
      alert('Login failed: ' + (err.message || 'Unknown error'));
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="centering-container">
      <form className="gapped-column" onSubmit={handleLogin}>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      <button type="button" onClick={goToRegister} className='minor'>Go to register page</button>
      </form>
    </div>
  );
};

export default LoginPage;