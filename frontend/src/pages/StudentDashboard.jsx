// frontend/src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { 
  BookOpen, 
  Code, 
  TrendingUp, 
  Award, 
  Clock, 
  Calendar,
  ChevronRight,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';

const StudentDashboard = () => {
  const [user, setUser] = useState({
    name: localStorage.getItem('userName') || 'Student',
    role: 'Student'
  });

  const [performanceData, setPerformanceData] = useState({
    cgpa: 8.7,
    codingScore: 85,
    problemsSolved: 347,
    contestRating: 1642,
    attendance: 92
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, activity: 'Completed DSA problem: "Binary Tree Level Order"', time: '2 hours ago', type: 'coding' },
    { id: 2, activity: 'Scored 92% in Database Management Systems test', time: '1 day ago', type: 'academic' },
    { id: 3, activity: 'Participated in Codeforces Round #789', time: '2 days ago', type: 'contest' },
    { id: 4, activity: 'Updated resume with new projects', time: '3 days ago', type: 'placement' },
  ]);

  const [upcomingDeadlines, setUpcomingDeadlines] = useState([
    { id: 1, task: 'Algorithm Assignment Submission', date: '2024-02-20', priority: 'high' },
    { id: 2, task: 'Mock Interview Session', date: '2024-02-22', priority: 'medium' },
    { id: 3, task: 'Google Coding Challenge', date: '2024-02-25', priority: 'high' },
  ]);

  const [recommendedTopics, setRecommendedTopics] = useState([
    { topic: 'Dynamic Programming', difficulty: 'Hard', progress: 45 },
    { topic: 'System Design', difficulty: 'Medium', progress: 30 },
    { topic: 'Database Indexing', difficulty: 'Easy', progress: 80 },
  ]);

  const handleLogout = () => {
    // Logout logic - will be redirected by ProtectedRoute
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user.name}! 👋</h1>
          <p className="text-gray-600 mt-2">Here's your learning progress and upcoming tasks</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current CGPA</p>
                <p className="text-2xl font-bold text-gray-800">{performanceData.cgpa}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Coding Score</p>
                <p className="text-2xl font-bold text-gray-800">{performanceData.codingScore}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Code className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Problems Solved</p>
                <p className="text-2xl font-bold text-gray-800">{performanceData.problemsSolved}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Contest Rating</p>
                <p className="text-2xl font-bold text-gray-800">{performanceData.contestRating}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Attendance</p>
                <p className="text-2xl font-bold text-gray-800">{performanceData.attendance}%</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Chart Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Performance Overview</h2>
                <BarChart3 className="h-5 w-5 text-gray-400" />
              </div>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-400">Performance chart visualization would go here</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'coding' ? 'bg-green-100' :
                      activity.type === 'academic' ? 'bg-blue-100' :
                      activity.type === 'contest' ? 'bg-purple-100' : 'bg-yellow-100'
                    }`}>
                      {activity.type === 'coding' && <Code className="h-4 w-4 text-green-600" />}
                      {activity.type === 'academic' && <BookOpen className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'contest' && <Trophy className="h-4 w-4 text-purple-600" />}
                      {activity.type === 'placement' && <Target className="h-4 w-4 text-yellow-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{activity.activity}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Deadlines</h2>
              <div className="space-y-3">
                {upcomingDeadlines.map(deadline => (
                  <div key={deadline.id} className="p-3 border border-gray-100 rounded-lg hover:border-blue-200 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{deadline.task}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          <Calendar className="inline h-3 w-3 mr-1" />
                          {deadline.date}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        deadline.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {deadline.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Topics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Topics</h2>
              <div className="space-y-4">
                {recommendedTopics.map((topic, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-800">{topic.topic}</span>
                      <span className="text-sm text-gray-500">{topic.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${topic.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;