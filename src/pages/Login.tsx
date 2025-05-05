import React, { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(email, password);
      // перенаправляем после успешного логина
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed');
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="container">
      <div className="login-box">
        <h1>Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <button onClick={goToRegister}>register page</button>
      </div>
      <style>{`
        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #121212;
        }

        .login-box {
          background-color: #1e1e1e;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 90%;
          max-width: 400px;
        }

        h1 {
          color: #ffffff;
          font-size: 2rem;
          text-align: center;
          margin-bottom: 1rem;
        }

        input {
          padding: 0.75rem;
          border: none;
          border-radius: 10px;
          background-color: #2a2a2a;
          color: #fff;
          font-size: 1rem;
        }

        input::placeholder {
          color: #999;
        }

        button {
          padding: 0.75rem;
          background-color: #3b3b3b;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        button:hover {
          background-color: #555;
        }
      `}</style>
    </div>
  );
};

export default Login;