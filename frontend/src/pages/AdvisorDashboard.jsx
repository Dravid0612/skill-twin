import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_URL = "http://localhost:8000";
axios.get('${API_URL}/')

const AdvisorDashboard = () => {
  const [test, setTest] = useState([]);

  const generateTest = async () => {
    try {
      const res = await axios.get(`${API_URL}/advisor/generate-test`);
      setTest(res.data);
    } catch (error) {
      console.error("Error fetching test:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Class Advisor Portal" />
      
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white p-8 shadow-sm rounded-lg mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Assessment Generator</h2>
          <p className="mb-6 text-gray-600">Generate a randomized problem set for your students from the question bank.</p>
          
          <button 
            onClick={generateTest} 
            className="bg-red-500 text-white px-6 py-3 rounded font-bold hover:bg-red-600 transition shadow"
          >
            Generate Random Test
          </button>

          {test.length > 0 && (
            <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b font-bold text-gray-700">Generated Questions</div>
              <ul className="divide-y divide-gray-200 bg-white">
                {test.map((q) => (
                  <li key={q.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-gray-800 block">{q.title}</span>
                        <span className="text-sm text-gray-500">{q.platform}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold 
                        ${q.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 
                          q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {q.difficulty}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvisorDashboard;