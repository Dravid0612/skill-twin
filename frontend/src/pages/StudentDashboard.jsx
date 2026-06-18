// frontend/src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { 
  BookOpen, 
  Code, 
  Calendar,
  ChevronRight,
  FileText,
  ShieldCheck,
  Trophy,
  Target,
  Clock
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : { name: 'Student', role: 'student' };
  });
  const [overview, setOverview] = useState(null);
  const [learningTime, setLearningTime] = useState('12h 40m');

  useEffect(() => {
    fetchStudentOverview(user?.id || 101);
  }, [user?.id]);

  const fetchStudentOverview = async (studentId) => {
    try {
      const response = await api.get(`/student/${studentId}/overview`);
      setOverview(response.data);
      setLearningTime(response.data?.coding?.learningTime || '12h 40m');
    } catch (error) {
      console.error('Failed to load student overview:', error);
    }
  };

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
    { topic: 'Database Indexing', difficulty: 'Easy', progress: 80 }
  ]);
  const [weakTopics] = useState(['Dynamic Programming', 'Database Indexing', 'Operating Systems']);
  const [focusSessions] = useState(18);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="app-container py-10">
        <section className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white p-10 shadow-lg overflow-hidden mb-10">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-slate-300">Student insights</span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight">Study smarter, not harder.</h1>
            <p className="mt-4 max-w-3xl text-slate-300 leading-8">A unified student dashboard for exam prep, personalized weak topic guidance, and a clean learning workflow.</p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[1.5rem] bg-white/10 border border-white/10 p-6 backdrop-blur-xl shadow-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Weak topics</p>
              <p className="mt-4 text-3xl font-semibold text-white">{weakTopics.length}</p>
              <p className="mt-2 text-sm text-slate-400">Areas to focus on this week.</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/10 border border-white/10 p-6 backdrop-blur-xl shadow-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Upcoming tasks</p>
              <p className="mt-4 text-3xl font-semibold text-white">{upcomingDeadlines.length}</p>
              <p className="mt-2 text-sm text-slate-400">Important deadlines ahead.</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/10 border border-white/10 p-6 backdrop-blur-xl shadow-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Recommended topics</p>
              <p className="mt-4 text-3xl font-semibold text-white">{recommendedTopics.length}</p>
              <p className="mt-2 text-sm text-slate-400">AI-driven study focus.</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/10 border border-white/10 p-6 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-300" />
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Time spent</p>
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">{learningTime}</p>
              <p className="mt-2 text-sm text-slate-400">Total learning hours.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.9fr_1fr] mb-8">
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <button
                onClick={() => navigate('/dashboard/student/question-upload')}
                className="group rounded-[1.75rem] bg-white p-7 shadow-2xl border border-slate-200 transition hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(15,23,42,0.12)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Exam prep</p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">Analyze Question Paper</h2>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600">Upload a paper to extract key topics, weak areas, and next-step recommendations.</p>
              </button>

              <button
                onClick={() => navigate('/dashboard/student/mock-test')}
                className="group rounded-[1.75rem] bg-slate-950 p-7 shadow-2xl border border-slate-900 transition hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(15,23,42,0.12)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Practice</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Start Adaptive Mock Test</h2>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-lg">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-400">Take a timed mock test that detects tab switches and adapts to your weak topics.</p>
              </button>
            </div>

            <div className="rounded-[1.75rem] bg-white p-7 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Focus areas</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">Weak Topics to Improve</h3>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {weakTopics.map((topic) => (
                  <div key={topic} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <p className="text-sm text-slate-500 uppercase tracking-[0.25em]">Topic</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">{topic}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-white p-7 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Activity</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">Recent progress</h3>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="rounded-3xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-slate-50">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-900">{activity.activity}</p>
                        <p className="mt-1 text-sm text-slate-500">{activity.time}</p>
                      </div>
                      <div className={`flex h-11 w-11 items-center justify-center rounded-3xl ${
                        activity.type === 'coding' ? 'bg-green-100 text-green-700' :
                        activity.type === 'academic' ? 'bg-blue-100 text-blue-700' :
                        activity.type === 'contest' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {activity.type === 'coding' && <Code className="h-5 w-5" />}
                        {activity.type === 'academic' && <BookOpen className="h-5 w-5" />}
                        {activity.type === 'contest' && <Trophy className="h-5 w-5" />}
                        {activity.type === 'placement' && <Target className="h-5 w-5" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[1.75rem] bg-white p-6 shadow-2xl border border-slate-200">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Deadlines</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">Upcoming deadlines</h3>
              </div>
              <div className="mt-6 space-y-3">
                {upcomingDeadlines.map(deadline => (
                  <div key={deadline.id} className="rounded-3xl border border-slate-200 p-4 hover:border-blue-300 transition">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{deadline.task}</p>
                        <p className="text-sm text-slate-500 mt-1">{deadline.date}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        deadline.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {deadline.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-white p-6 shadow-2xl border border-slate-200">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Focus list</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">Recommended topics</h3>
              </div>
              <div className="mt-6 space-y-4">
                {recommendedTopics.map((topic, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-900">{topic.topic}</span>
                      <span className="text-sm text-slate-500">{topic.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-full bg-sky-600" style={{ width: `${topic.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;