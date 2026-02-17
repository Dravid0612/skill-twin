// frontend/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, User, Bell } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    if (onLogout) onLogout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8" />
            <span className="font-bold text-xl">SkillTwin</span>
          </Link>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-white/10 rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="text-sm">
                <p className="font-medium">{user?.name || 'User'}</p>
                <p className="text-xs opacity-75">{user?.role || 'Student'}</p>
              </div>
              <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-full"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;