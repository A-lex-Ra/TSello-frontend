import React, { useState } from 'react';
import { register } from '../api/auth'; // Подключаем функцию регистрации
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Проверка на совпадение паролей
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(email, password); // Регистрация пользователя
      navigate('/login'); // Перенаправление на страницу логина
    } catch (err: any) {
      setError('Registration failed: ' + (err.message || 'Unknown error')); // Обработка ошибок
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="centering-container">
    <form onSubmit={handleSubmit} className="gapped-column">
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Выводим ошибки */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
      <button type="button" onClick={goToLogin} className='minor'>Go to login page</button>
    </form>
    </div>
  );
};

export default RegisterPage;
