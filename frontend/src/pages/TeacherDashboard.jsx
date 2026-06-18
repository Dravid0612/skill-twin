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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your teacher dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <Navbar />

      <main className="app-container py-10">
        <section className="rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white shadow-2xl p-10 mb-10 border border-slate-800 overflow-hidden">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-slate-300">Teacher insights</span>
              <h1 className="mt-6 text-4xl font-semibold text-white">Welcome back, {teacher?.name}.</h1>
              <p className="mt-4 text-slate-300 leading-8">View classroom performance, student engagement, and priority topics in a polished analytics workspace designed for fast decisions.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-[1.75rem] bg-white/10 p-6 shadow-2xl border border-white/10">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Classes</p>
                <p className="mt-4 text-3xl font-semibold text-white">{overview?.classes?.length || 0}</p>
              </div>
              <div className="rounded-[1.75rem] bg-white/10 p-6 shadow-2xl border border-white/10">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Students</p>
                <p className="mt-4 text-3xl font-semibold text-white">{overview?.platformInsights?.totalStudents || 0}</p>
              </div>
              <div className="rounded-[1.75rem] bg-white/10 p-6 shadow-2xl border border-white/10">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Engagement</p>
                <p className="mt-4 text-3xl font-semibold text-white">{overview?.platformInsights?.averageEngagement || 'N/A'}</p>
              </div>
              <div className="rounded-[1.75rem] bg-white/10 p-6 shadow-2xl border border-white/10">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Department</p>
                <p className="mt-4 text-3xl font-semibold text-white">{overview?.teacher?.department || 'CSE'}</p>
              </div>
              <div className="rounded-[1.75rem] bg-white/10 p-6 shadow-2xl border border-white/10">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Teaching hours</p>
                <p className="mt-4 text-3xl font-semibold text-white">24h 15m</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.9fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-[1.75rem] bg-white p-7 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Class performance</h2>
                  <p className="mt-2 text-sm text-slate-500">Review average scores and engagement per class.</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {overview?.classes?.map((cls, idx) => (
                  <div key={idx} className="rounded-3xl border border-slate-200 p-5 hover:border-slate-300 transition shadow-sm bg-slate-50">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{cls.name}</h3>
                        <p className="text-sm text-slate-500">Students: {cls.students}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{cls.averageScore}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-white p-7 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Improvement pipeline</h2>
                  <p className="mt-2 text-sm text-slate-500">Topics to emphasize in the next revision cycle.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {overview?.weakTopicSummary?.map((topic, idx) => (
                  <span key={idx} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm">{topic}</span>
                ))}
              </div>
              <p className="mt-6 text-sm text-slate-500">Top improvement areas are based on classroom assessment and engagement trends.</p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[1.75rem] bg-white p-7 shadow-2xl border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900">Engagement summary</h2>
              <p className="mt-3 text-slate-600">Your classroom engagement is currently at <span className="font-semibold text-slate-900">{overview?.platformInsights?.averageEngagement || 'N/A'}</span>, suggesting strong participation in the latest cycle.</p>
              <div className="mt-6 space-y-3">
                {overview?.platformInsights?.topImprovementAreas?.map((area, idx) => (
                  <div key={idx} className="rounded-3xl bg-slate-50 p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Priority</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{area}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-white p-7 shadow-2xl border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900">Quick actions</h2>
              <p className="mt-3 text-slate-600">Use this dashboard to monitor classes and help students focus on the right topics.</p>
              <div className="mt-6 space-y-3">
                <div className="rounded-3xl bg-slate-50 p-4 shadow-sm">
                  <p className="text-sm text-slate-500">Review active classes</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 shadow-sm">
                  <p className="text-sm text-slate-500">Track weak topic summaries</p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default TeacherDashboard;
