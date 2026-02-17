// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdvisorDashboard from './pages/AdvisorDashboard';
import HodDashboard from './pages/HodDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/student-dashboard" 
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/advisor-dashboard" 
          element={
            <ProtectedRoute>
              <AdvisorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/hod-dashboard" 
          element={
            <ProtectedRoute>
              <HodDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;