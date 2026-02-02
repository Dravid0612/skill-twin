import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_URL = "http://localhost:8000";

const HodDashboard = () => {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/hod/overview`)
      .then(res => setOverview(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!overview) return <div className="p-10 text-center">Loading Department Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Department Overview (HOD)" />

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-blue-500">
            <h2 className="text-sm uppercase tracking-wide text-gray-500 font-bold">Total Active Students</h2>
            <p className="text-4xl font-extrabold text-gray-800 mt-2">{overview.total_students}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-green-500">
            <h2 className="text-sm uppercase tracking-wide text-gray-500 font-bold">Total Problems Solved</h2>
            <p className="text-4xl font-extrabold text-gray-800 mt-2">{overview.total_submissions}</p>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h3 className="font-bold text-gray-700">Recent Student Activities</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="p-4 font-semibold">User ID (UUID)</th>
                  <th className="p-4 font-semibold">Platform</th>
                  <th className="p-4 font-semibold">Rating</th>
                  <th className="p-4 font-semibold">Solved</th>
                  <th className="p-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {overview.raw_data.slice(0, 10).map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-600 font-mono text-xs">{row.user_id.split('-')[0]}...</td>
                    <td className="p-4 capitalize">{row.platform}</td>
                    <td className="p-4 font-bold text-blue-600">{row.rating}</td>
                    <td className="p-4">{row.problems_solved}</td>
                    <td className="p-4 text-gray-500">{new Date(row.contest_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HodDashboard;