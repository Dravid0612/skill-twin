import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

// Your backend API should be on a different port (not 5173)
// 5173 is your frontend Vite server
const API_URL = "http://localhost:5000";  // or 3000, 8000, etc.

const HodDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/hod/overview`);
        setOverview(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load department data. Make sure backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar title="Department Overview (HOD)" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar title="Department Overview (HOD)" />
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
            <p className="text-sm text-gray-600 mt-2">
              Try running: <code className="bg-gray-100 px-2 py-1 rounded">npm run server</code> in your backend directory
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!overview) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Department Overview (HOD)" />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500 hover:shadow-md transition">
            <h2 className="text-sm uppercase tracking-wide text-gray-500 font-bold">Total Students</h2>
            <p className="text-4xl font-extrabold text-gray-800 mt-2">{overview.total_students || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-green-500 hover:shadow-md transition">
            <h2 className="text-sm uppercase tracking-wide text-gray-500 font-bold">Problems Solved</h2>
            <p className="text-4xl font-extrabold text-gray-800 mt-2">{overview.total_submissions || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-purple-500 hover:shadow-md transition">
            <h2 className="text-sm uppercase tracking-wide text-gray-500 font-bold">Active Platforms</h2>
            <p className="text-4xl font-extrabold text-gray-800 mt-2">3</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-amber-500 hover:shadow-md transition">
            <h2 className="text-sm uppercase tracking-wide text-gray-500 font-bold">Avg Rating</h2>
            <p className="text-4xl font-extrabold text-gray-800 mt-2">1542</p>
          </div>
        </div>
        
        {/* Recent Activities Table */}
        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-700">Recent Student Activities</h3>
            <span className="text-xs text-gray-500">Last 10 entries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="p-4 font-semibold">Student ID</th>
                  <th className="p-4 font-semibold">Platform</th>
                  <th className="p-4 font-semibold">Rating</th>
                  <th className="p-4 font-semibold">Problems Solved</th>
                  <th className="p-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {overview.raw_data && overview.raw_data.slice(0, 10).map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-600 font-mono text-xs">
                      {row.user_id ? row.user_id.substring(0, 8) + '...' : 'N/A'}
                    </td>
                    <td className="p-4 capitalize">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.platform === 'leetcode' ? 'bg-orange-100 text-orange-800' :
                        row.platform === 'codeforces' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {row.platform || 'Unknown'}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-blue-600">{row.rating || 0}</td>
                    <td className="p-4">{row.problems_solved || 0}</td>
                    <td className="p-4 text-gray-500">
                      {row.contest_date ? new Date(row.contest_date).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Section */}
        {overview.summary_stats && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(overview.summary_stats).map(([platform, stats]) => (
              <div key={platform} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border">
                <h4 className="font-bold text-lg capitalize mb-4">{platform}</h4>
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Total Students:</span>
                    <span className="font-bold">{stats.total_students}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Avg Rating:</span>
                    <span className="font-bold">{stats.avg_rating}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Total Solved:</span>
                    <span className="font-bold">{stats.total_solved}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HodDashboard;