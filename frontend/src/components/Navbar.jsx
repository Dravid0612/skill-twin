// frontend/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, User, Bell } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) onLogout();
    navigate('/login');
  };

  const dashboardPath = user?.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student';

  return (
    <nav className="bg-white/6 backdrop-blur-sm border-b border-slate-200 fixed w-full z-40">
      <div className="app-container h-16 flex items-center justify-between">
        <Link to={dashboardPath} className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-lg leading-4">SkillTwin</div>
            <div className="text-xs text-slate-500">Student • Teacher</div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-lg relative">
            <Bell className="h-5 w-5 text-slate-700" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full -mt-1 -mr-1"></span>
          </button>

          <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-lg shadow-sm">
            <div className="text-sm">
              <p className="font-medium text-slate-800">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500">{user?.role || 'Student'}</p>
            </div>
            <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-slate-700" />
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;