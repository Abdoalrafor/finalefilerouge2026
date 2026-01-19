
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DashboardTeacher from './components/DashboardTeacher';
import DashboardStudent from './components/DashboardStudent';

function App() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard-teacher" element={
          token && userRole === 'teacher' ? <DashboardTeacher /> : <Navigate to="/login" />
        } />
        <Route path="/dashboard-student" element={
          token && userRole === 'student' ? <DashboardStudent /> : <Navigate to="/login" />
        } />
        <Route path="/" element={<Navigate to={token ? (userRole === 'teacher' ? '/dashboard-teacher' : '/dashboard-student') : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;