// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Mail, Lock } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', {
        email,
        password,
        role
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        if (response.data.user.role === 'teacher') {
          navigate('/dashboard/teacher');
        } else {
          navigate('/dashboard/student');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = () => {
    const demos = {
      student: { email: 'student@example.com', password: 'password' },
      teacher: { email: 'teacher@example.com', password: 'password' }
    };
    setEmail(demos[role].email);
    setPassword(demos[role].password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
      <div className="app-container grid gap-8 lg:grid-cols-2 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl shadow-lg">
              <Building className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">SkillTwin</h1>
              <p className="text-slate-500">Learn smarter. Prepare better.</p>
            </div>
          </div>

          <p className="text-slate-700 max-w-2xl">Choose a role to continue — we present tailored dashboards and metrics for students and teachers. Use demo credentials if you want to explore quickly.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setRole('student')}
              className={`cursor-pointer p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 ${role === 'student' ? 'ring-2 ring-blue-500 bg-white' : 'bg-white/90'}`}>
              <h3 className="text-lg font-semibold text-slate-900">Student</h3>
              <p className="text-sm text-slate-500 mt-2">Personalized study plans, mocks and progress tracking.</p>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-[0.25em]">Learning time</p>
                  <p className="text-lg font-semibold text-slate-900">12h 40m</p>
                </div>
                <div className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">Active</div>
              </div>
            </div>

            <div
              onClick={() => setRole('teacher')}
              className={`cursor-pointer p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 ${role === 'teacher' ? 'ring-2 ring-emerald-500 bg-white' : 'bg-white/90'}`}>
              <h3 className="text-lg font-semibold text-slate-900">Teacher</h3>
              <p className="text-sm text-slate-500 mt-2">Class analytics, engagement metrics, and improvement suggestions.</p>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-[0.25em]">Active classes</p>
                  <p className="text-lg font-semibold text-slate-900">2</p>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">Manage</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-sm text-slate-600">Tip: Click the role box to auto-select it in the form on the right. Demo credentials fill the form for a quick preview.</p>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Role</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${role === 'student' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${role === 'teacher' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                    Teacher
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Lock className="inline w-4 h-4 mr-1" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={setDemoCredentials}
                className="w-full py-2 px-4 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors text-sm">
                🔑 Use Demo Credentials
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;