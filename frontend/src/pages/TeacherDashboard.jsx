import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    setTeacher(user);
    fetchTeacherOverview(user.id);
  }, [navigate]);

  const fetchTeacherOverview = async (teacherId) => {
    try {
      const response = await api.get(`/teacher/${teacherId}/overview`);
      setOverview(response.data);
    } catch (error) {
      console.error('Failed to load teacher overview:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome, {teacher?.name}! 👩‍🏫
          </h1>
          <p className="text-gray-600">Monitor your classes and student performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Classes</p>
                <p className="text-2xl font-bold text-gray-800">{overview?.classes?.length || 0}</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Students</p>
                <p className="text-2xl font-bold text-gray-800">{overview?.platformInsights?.totalStudents || 0}</p>
              </div>
              <div className="text-4xl">👨‍🎓</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg Engagement</p>
                <p className="text-2xl font-bold text-gray-800">{overview?.platformInsights?.averageEngagement || 'N/A'}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Department</p>
                <p className="text-2xl font-bold text-gray-800">{overview?.teacher?.department || 'CSE'}</p>
              </div>
              <div className="text-4xl">🏢</div>
            </div>
          </div>
        </div>

        {/* Classes Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overview?.classes?.map((cls, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition">
                <h3 className="text-lg font-semibold text-gray-800">{cls.name}</h3>
                <p className="text-sm text-gray-600">Students: {cls.students}</p>
                <p className="text-sm text-gray-600">Avg Score: {cls.averageScore}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Areas Needing Improvement</h2>
          <div className="flex flex-wrap gap-2">
            {overview?.weakTopicSummary?.map((topic, idx) => (
              <span key={idx} className="bg-red-100 text-red-700 px-3 py-2 rounded-full text-sm font-medium">
                {topic}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Top improvement areas: {overview?.platformInsights?.topImprovementAreas?.join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
