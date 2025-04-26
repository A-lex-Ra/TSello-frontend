import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import BoardPage from './pages/Board';
import useAuth from './hooks/useAuth';

function App() {
  const { token } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/board" element={token ? <BoardPage /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={token ? "/board" : "/login"} />} />
    </Routes>
  );
}

export default App;
