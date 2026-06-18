import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { ShieldCheck, AlertTriangle, CheckCircle2, BookOpen } from 'lucide-react';

const MockTest = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongTopics, setWrongTopics] = useState([]);
  const [warnings, setWarnings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadMockTest();
  }, []);

  useEffect(() => {
    const handleBlur = () => setWarnings((prev) => prev + 1);
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  const loadMockTest = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/mock-test/generate', {
        studentId: user?.id || 101,
        mode: 'adaptive'
      });

      setQuestions(response.data.questions || []);
    } catch (err) {
      console.error(err);
      setError('Unable to load the mock test. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = () => {
    const total = questions.length;
    let correct = 0;
    const missedTopics = new Set();

    questions.forEach((question) => {
      const selected = answers[question.id];
      if (selected === question.answer) {
        correct += 1;
      } else {
        missedTopics.add(question.topic);
      }
    });

    setScore(Math.round((correct / Math.max(total, 1)) * 100));
    setWrongTopics(Array.from(missedTopics));
    setSubmitted(true);
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setWrongTopics([]);
    loadMockTest();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user || { name: 'Student', role: 'student' }} />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Adaptive Mock Test</h1>
              <p className="mt-3 text-slate-600 max-w-2xl">
                Practice with an exam-like mock test. If you switch tabs, the system logs a warning to preserve integrity.
              </p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-3xl bg-emerald-600 px-6 py-4 text-white shadow-lg">
              <ShieldCheck className="h-6 w-6" />
              <div>
                <p className="text-sm uppercase tracking-[0.2em]">Integrity alert</p>
                <p className="text-lg font-semibold">{warnings} switch warning(s)</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <AlertTriangle className="inline h-4 w-4 mr-2 align-text-bottom" />
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
          <section className="space-y-6">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Mock Test Questions</h2>
                  <p className="mt-2 text-sm text-slate-500">Answer the questions below and submit to see your score.</p>
                </div>
                <button
                  onClick={handleRetake}
                  className="rounded-3xl bg-blue-600 px-5 py-3 text-white shadow hover:bg-blue-700 transition"
                >
                  Retake Test
                </button>
              </div>

              {loading ? (
                <div className="flex min-h-[220px] items-center justify-center text-slate-500">Loading questions...</div>
              ) : (
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={question.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div>
                          <p className="text-lg font-semibold text-slate-900">Question {index + 1}</p>
                          <p className="text-sm text-slate-500">Topic: {question.topic} • Difficulty: {question.difficulty}</p>
                        </div>
                      </div>
                      <p className="text-slate-700 mb-4">{question.text}</p>
                      <div className="grid gap-3">
                        {question.options.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleAnswer(question.id, option)}
                            className={`w-full rounded-2xl border px-4 py-3 text-left transition ${answers[question.id] === option ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-400'}`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={handleSubmit}
                disabled={loading || questions.length === 0 || submitted}
                className="rounded-3xl bg-indigo-600 px-6 py-3 text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Submit Answers
              </button>
              <p className="text-sm text-slate-500">Be careful: switching tabs triggers warnings for test integrity.</p>
            </div>

            {submitted && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  <div>
                    <p className="text-xl font-semibold text-slate-900">Test Completed</p>
                    <p className="text-sm text-slate-500">Your score reflects both accuracy and focus.</p>
                  </div>
                </div>
                <p className="text-5xl font-bold text-slate-900">{score}%</p>
                <div className="mt-4 space-y-3 text-slate-700">
                  <p>Total questions: {questions.length}</p>
                  <p>Missed topic areas: {wrongTopics.length || 0}</p>
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-blue-900 p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-6 w-6" />
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Test integrity</p>
                  <p className="text-lg font-semibold">Exam-like focus</p>
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-200">This practice test detects tab switching, encouraging a stronger exam-like preparation routine.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Tip for better performance</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>• Review weak topics after each mock test.</li>
                <li>• Focus on explanation-based learning, not just answers.</li>
                <li>• Take short notes for repeating concepts.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default MockTest;
