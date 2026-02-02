import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import axios from 'axios';

const API_URL = "http://localhost:8000";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Sync with Backend
      const response = await axios.post(`${API_URL}/auth/sync`, {
        firebase_uid: user.uid,
        email: user.email,
        full_name: user.displayName,
        role: role
      });

      // Store Auth Data
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userId", response.data.user_id);

      // Redirect
      if (role === 'student') navigate('/student');
      else if (role === 'advisor') navigate('/advisor');
      else if (role === 'hod') navigate('/hod');
      
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login Failed. See console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', width: '384px', borderTop: '4px solid #2563eb' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center', color: '#1f2937' }}>Performance Dashboard</h1>
        
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Select Your Role:</label>
        <select 
          style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', marginBottom: '24px', backgroundColor: '#f9fafb' }}
          onChange={(e) => setRole(e.target.value)}
          value={role}
        >
          <option value="student">Student</option>
          <option value="advisor">Class Advisor</option>
          <option value="hod">Head of Department</option>
        </select>

        <button 
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '12px', borderRadius: '4px', fontWeight: '600', border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Syncing..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
};

export default Login;