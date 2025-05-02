import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import BoardPage from './pages/Board';
import useAuth from './hooks/useAuth';
import RegisterPage from './pages/Register';

function App() {
  // const { token } = useAuth();
  return (
    <Routes>
      <Route path="/reg" element={<RegisterPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/board" element={<BoardPage />} />
      <Route index element={<Navigate to="/board" />} />
    </Routes>
  );
}

export default App;
