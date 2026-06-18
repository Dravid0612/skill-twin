import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Sparkles, ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';

const QuestionUpload = () => {
  const [paperText, setPaperText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      setPaperText(text);
      setAnalysis(null);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Unable to read the selected file. Please upload a plain text file.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!paperText.trim()) {
      setError('Please paste the question paper text or upload a file first.');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const studentId = user?.id || 101;
      const response = await api.post('/question-paper/analyze', {
        text: paperText,
        studentId
      });
      setAnalysis(response.data);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.message || 'Failed to analyze the question paper.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <Navbar user={user || { name: 'Student', role: 'student' }} />
      <div className="app-container py-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Question Paper Analysis</h1>
              <p className="mt-3 text-slate-600 max-w-2xl">
                Upload a mock paper or paste the exam content to extract key topics, weak areas, and personalized revision tips.
              </p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-3xl bg-blue-600 px-6 py-4 text-white shadow-lg">
              <Sparkles className="h-6 w-6" />
              <div>
                <p className="text-sm uppercase tracking-[0.2em]">AI-powered</p>
                <p className="text-lg font-semibold">Gemini-backed insight</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
          <section className="space-y-6">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Upload or paste paper text</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Upload question paper (.txt)
                </label>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
                />

                <label className="block text-sm font-medium text-slate-700">
                  Paste paper content
                </label>
                <textarea
                  value={paperText}
                  onChange={(e) => setPaperText(e.target.value)}
                  rows={10}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Paste the question paper, syllabus list, or sample exam here."
                />

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertTriangle className="inline h-4 w-4 align-text-bottom mr-2" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-3xl bg-blue-600 px-5 py-3 text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Analyzing...' : 'Analyze Paper'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            {analysis && (
              <div className="bg-white rounded-3xl shadow-lg p-6 space-y-6">
                <div className="flex items-center gap-3 text-slate-900">
                  <ShieldCheck className="h-7 w-7 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-semibold">Analysis Results</h3>
                    <p className="text-sm text-slate-500">Extracted topics, exam profile, and improvement actions.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Topics</p>
                    <ul className="mt-3 space-y-2 text-slate-700 text-sm">
                      {analysis.topics.map((topic, idx) => (
                        <li key={idx} className="rounded-2xl bg-white px-3 py-2 shadow-sm">{topic}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Weak topics</p>
                    <ul className="mt-3 space-y-2 text-slate-700 text-sm">
                      {analysis.weakTopics.map((topic, idx) => (
                        <li key={idx} className="rounded-2xl bg-white px-3 py-2 shadow-sm">{topic}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Recommendations</p>
                    <ul className="mt-3 space-y-2 text-slate-700 text-sm">
                      {analysis.recommendedResources.map((item, idx) => (
                        <li key={idx} className="rounded-2xl bg-white px-3 py-2 shadow-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Paper Summary</p>
                  <p className="mt-3 text-slate-700 leading-relaxed text-sm">{analysis.summary}</p>
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-600 to-slate-900 p-6 text-white shadow-lg">
              <h2 className="text-xl font-semibold">Why this helps</h2>
              <p className="mt-3 text-sm leading-6 text-blue-100">
                The AI analyzer identifies exam topics, common question patterns, and the highest-impact concepts to revise before your next test.
              </p>
              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-blue-200">Saved time</p>
                  <p className="mt-1 text-sm text-slate-100">Focus on topics that matter most.</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-blue-200">Exam-like insight</p>
                  <p className="mt-1 text-sm text-slate-100">See which areas need targeted practice.</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-blue-200">Adaptive prep</p>
                  <p className="mt-1 text-sm text-slate-100">Pair analysis with mock test practice immediately.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default QuestionUpload;
