import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdvisorDashboard from './pages/AdvisorDashboard';
import HodDashboard from './pages/HodDashboard';

function App() {
  // Simple check to prevent unauthorized access (Basic protection)
  const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem("userEmail");
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route 
          path="/student" 
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/advisor" 
          element={
            <ProtectedRoute>
              <AdvisorDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/hod" 
          element={
            <ProtectedRoute>
              <HodDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;