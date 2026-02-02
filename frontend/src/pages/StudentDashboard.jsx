import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';

const API_URL = "http://localhost:8000";

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if(userId) {
        axios.get(`${API_URL}/student/dashboard/${userId}`)
             .then(res => setData(res.data))
             .catch(err => console.error(err));
    }
  }, [userId]);

  if (!data) return <div className="p-10 text-center">Loading Analytics...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Student Dashboard" />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* ML Prediction Card */}
        <div className="bg-white border-l-4 border-indigo-500 p-6 shadow-sm rounded mb-6">
          <h3 className="font-bold text-lg text-gray-800">AI Performance Prediction</h3>
          <p className="mt-2 text-gray-700">
            Predicted Next Rating: <strong className="text-indigo-600 text-2xl ml-2">{data.prediction.predicted_rating}</strong>
          </p>
          <p className="text-gray-500 italic mt-2 bg-indigo-50 p-2 rounded inline-block">
            💡 Suggestion: "{data.prediction.suggestion}"
          </p>
        </div>

        {/* Graph Section */}
        <div className="bg-white p-6 shadow-sm rounded mb-6">
          <h3 className="font-bold mb-4 text-gray-700">Rating History</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.history}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="contest_date" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="rating" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-500 text-white p-6 rounded-lg shadow hover:bg-green-600 cursor-pointer transition">
            <h3 className="font-bold text-lg">Log Contest</h3>
            <p className="opacity-90 text-sm mt-1">Update your latest contest performance.</p>
          </div>
          <div className="bg-yellow-500 text-white p-6 rounded-lg shadow hover:bg-yellow-600 cursor-pointer transition">
            <h3 className="font-bold text-lg">Study Materials</h3>
            <p className="opacity-90 text-sm mt-1">Download notes uploaded by staff.</p>
          </div>
          <div className="bg-purple-500 text-white p-6 rounded-lg shadow hover:bg-purple-600 cursor-pointer transition">
            <h3 className="font-bold text-lg">Hackathons</h3>
            <p className="opacity-90 text-sm mt-1">Check status of registered events.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;