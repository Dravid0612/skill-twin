// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
app.use(express.json());

// ==================== MOCK DATABASE ====================
const mockDatabase = {
  users: [
    { id: 1, name: 'John Student', email: 'student@example.com', role: 'student', institution: 'college' },
    { id: 2, name: 'Prof. Smith', email: 'teacher@example.com', role: 'teacher', institution: 'college' },
    { id: 3, name: 'Dr. Johnson', email: 'advisor@example.com', role: 'advisor', institution: 'college' },
    { id: 4, name: 'Mr. Placement', email: 'placement@example.com', role: 'placement', institution: 'college' },
    { id: 5, name: 'Dr. HOD', email: 'hod@example.com', role: 'hod', institution: 'college' }
  ],
  
  students: [
    { id: 101, name: 'Alice Chen', rollNo: 'CS001', year: 3, branch: 'CSE', cgpa: 8.7 },
    { id: 102, name: 'Bob Wilson', rollNo: 'CS002', year: 3, branch: 'CSE', cgpa: 7.9 },
    { id: 103, name: 'Carol Davis', rollNo: 'CS003', year: 3, branch: 'CSE', cgpa: 9.2 },
    { id: 104, name: 'David Brown', rollNo: 'CS004', year: 3, branch: 'CSE', cgpa: 6.8 },
    { id: 105, name: 'Eva Green', rollNo: 'CS005', year: 3, branch: 'CSE', cgpa: 8.9 }
  ],

  codingProfiles: [
    { studentId: 101, platform: 'leetcode', username: 'alice_c', rating: 1850, problemsSolved: 245, contests: 12 },
    { studentId: 101, platform: 'codeforces', username: 'alice_cf', rating: 1620, problemsSolved: 189, contests: 8 },
    { studentId: 102, platform: 'leetcode', username: 'bob_w', rating: 1680, problemsSolved: 178, contests: 7 },
    { studentId: 102, platform: 'codechef', username: 'bob_cc', rating: 1720, problemsSolved: 156, contests: 5 },
    { studentId: 103, platform: 'leetcode', username: 'carol_d', rating: 2150, problemsSolved: 312, contests: 15 },
    { studentId: 103, platform: 'codeforces', username: 'carol_cf', rating: 1980, problemsSolved: 267, contests: 11 },
    { studentId: 104, platform: 'leetcode', username: 'david_b', rating: 1450, problemsSolved: 98, contests: 3 },
    { studentId: 105, platform: 'codeforces', username: 'eva_g', rating: 1720, problemsSolved: 203, contests: 9 }
  ],

  placements: [
    { studentId: 101, company: 'Google', offer: 'SDE Intern', status: 'selected', package: 25 },
    { studentId: 103, company: 'Microsoft', offer: 'SDE', status: 'selected', package: 28 },
    { studentId: 105, company: 'Amazon', offer: 'SDE Intern', status: 'in-process', package: 22 }
  ],

  academicRecords: [
    { studentId: 101, subject: 'Data Structures', marks: 88, attendance: 92 },
    { studentId: 101, subject: 'Algorithms', marks: 85, attendance: 90 },
    { studentId: 102, subject: 'Data Structures', marks: 72, attendance: 78 },
    { studentId: 102, subject: 'Algorithms', marks: 75, attendance: 80 },
    { studentId: 103, subject: 'Data Structures', marks: 95, attendance: 98 },
    { studentId: 103, subject: 'Algorithms', marks: 92, attendance: 95 },
    { studentId: 104, subject: 'Data Structures', marks: 65, attendance: 70 },
    { studentId: 104, subject: 'Algorithms', marks: 68, attendance: 72 },
    { studentId: 105, subject: 'Data Structures', marks: 86, attendance: 88 },
    { studentId: 105, subject: 'Algorithms', marks: 89, attendance: 91 }
  ]
};

// ==================== AUTH ROUTES ====================
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockDatabase.users.find(u => u.email === email);
  
  if (user) {
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution
      },
      token: 'mock-jwt-token-' + Date.now()
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// ==================== HOD DASHBOARD ROUTES ====================
app.get('/api/hod/overview', (req, res) => {
  const totalStudents = mockDatabase.students.length;
  const totalSubmissions = mockDatabase.codingProfiles.reduce((sum, p) => sum + p.problemsSolved, 0);
  
  res.json({
    total_students: totalStudents,
    total_submissions: totalSubmissions,
    placement_rate: '78%',
    average_cgpa: 8.3,
    raw_data: mockDatabase.codingProfiles.slice(0, 10).map(p => ({
      user_id: `student_${p.studentId}`,
      platform: p.platform,
      rating: p.rating,
      problems_solved: p.problemsSolved,
      contest_date: new Date().toISOString()
    })),
    summary_stats: {
      leetcode: {
        total_students: mockDatabase.codingProfiles.filter(p => p.platform === 'leetcode').length,
        avg_rating: Math.round(mockDatabase.codingProfiles.filter(p => p.platform === 'leetcode')
          .reduce((sum, p) => sum + p.rating, 0) / 
          mockDatabase.codingProfiles.filter(p => p.platform === 'leetcode').length),
        total_solved: mockDatabase.codingProfiles.filter(p => p.platform === 'leetcode')
          .reduce((sum, p) => sum + p.problemsSolved, 0)
      },
      codeforces: {
        total_students: mockDatabase.codingProfiles.filter(p => p.platform === 'codeforces').length,
        avg_rating: Math.round(mockDatabase.codingProfiles.filter(p => p.platform === 'codeforces')
          .reduce((sum, p) => sum + p.rating, 0) / 
          mockDatabase.codingProfiles.filter(p => p.platform === 'codeforces').length),
        total_solved: mockDatabase.codingProfiles.filter(p => p.platform === 'codeforces')
          .reduce((sum, p) => sum + p.problemsSolved, 0)
      },
      codechef: {
        total_students: mockDatabase.codingProfiles.filter(p => p.platform === 'codechef').length,
        avg_rating: Math.round(mockDatabase.codingProfiles.filter(p => p.platform === 'codechef')
          .reduce((sum, p) => sum + p.rating, 0) / 
          mockDatabase.codingProfiles.filter(p => p.platform === 'codechef').length || 1),
        total_solved: mockDatabase.codingProfiles.filter(p => p.platform === 'codechef')
          .reduce((sum, p) => sum + p.problemsSolved, 0)
      }
    }
  });
});

app.get('/api/hod/department-stats', (req, res) => {
  res.json({
    branches: [
      { name: 'CSE', students: 120, placed: 95, avgPackage: 18.5 },
      { name: 'IT', students: 85, placed: 65, avgPackage: 16.2 },
      { name: 'ECE', students: 95, placed: 70, avgPackage: 14.8 },
      { name: 'ME', students: 75, placed: 45, avgPackage: 12.5 }
    ],
    placement_trends: [
      { year: 2020, placed: 145 },
      { year: 2021, placed: 162 },
      { year: 2022, placed: 188 },
      { year: 2023, placed: 215 },
      { year: 2024, placed: 178 }
    ],
    top_performers: mockDatabase.students.sort((a, b) => b.cgpa - a.cgpa).slice(0, 5)
  });
});

// ==================== ADVISOR DASHBOARD ROUTES ====================
app.get('/api/advisor/mentees/:advisorId', (req, res) => {
  const { advisorId } = req.params;
  
  res.json({
    mentees: mockDatabase.students.map(s => ({
      id: s.id,
      name: s.name,
      rollNo: s.rollNo,
      year: s.year,
      branch: s.branch,
      cgpa: s.cgpa,
      status: s.cgpa >= 8 ? 'Good' : s.cgpa >= 7 ? 'Average' : 'At Risk',
      attendance: Math.floor(Math.random() * 30) + 70, // Random attendance 70-100%
      meetings: Math.floor(Math.random() * 5) + 1,
      lastMeeting: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    })),
    summary: {
      totalMentees: mockDatabase.students.length,
      atRisk: mockDatabase.students.filter(s => s.cgpa < 7).length,
      goodStanding: mockDatabase.students.filter(s => s.cgpa >= 8).length,
      average: mockDatabase.students.filter(s => s.cgpa >= 7 && s.cgpa < 8).length
    }
  });
});

app.post('/api/advisor/schedule-meeting', (req, res) => {
  const { studentId, date, time, type } = req.body;
  
  res.json({
    success: true,
    message: `Meeting scheduled with student ${studentId}`,
    meeting: {
      id: Date.now(),
      studentId,
      date,
      time,
      type,
      status: 'scheduled'
    }
  });
});

// ==================== STUDENT DASHBOARD ROUTES ====================
app.get('/api/student/:studentId/overview', (req, res) => {
  const { studentId } = req.params;
  const student = mockDatabase.students.find(s => s.id === parseInt(studentId));
  const codingProfiles = mockDatabase.codingProfiles.filter(p => p.studentId === parseInt(studentId));
  const placements = mockDatabase.placements.filter(p => p.studentId === parseInt(studentId));
  const academics = mockDatabase.academicRecords.filter(a => a.studentId === parseInt(studentId));
  
  res.json({
    profile: student,
    academic: {
      subjects: academics,
      cgpa: student.cgpa,
      totalMarks: academics.reduce((sum, a) => sum + a.marks, 0),
      averageAttendance: Math.round(academics.reduce((sum, a) => sum + a.attendance, 0) / academics.length)
    },
    coding: {
      profiles: codingProfiles,
      totalProblems: codingProfiles.reduce((sum, p) => sum + p.problemsSolved, 0),
      averageRating: Math.round(codingProfiles.reduce((sum, p) => sum + p.rating, 0) / codingProfiles.length),
      contests: codingProfiles.reduce((sum, p) => sum + p.contests, 0)
    },
    placements: placements,
    recommendations: {
      companies: ['Google', 'Microsoft', 'Amazon', 'Meta'].filter(() => Math.random() > 0.5),
      skills: ['DSA', 'System Design', 'React', 'Node.js'].filter(() => Math.random() > 0.5),
      contests: ['LeetCode Weekly', 'Codeforces Round'].filter(() => Math.random() > 0.5)
    }
  });
});

app.get('/api/student/:studentId/coding-stats', (req, res) => {
  const { studentId } = req.params;
  const profiles = mockDatabase.codingProfiles.filter(p => p.studentId === parseInt(studentId));
  
  const platformStats = {};
  profiles.forEach(p => {
    platformStats[p.platform] = {
      rating: p.rating,
      problemsSolved: p.problemsSolved,
      contests: p.contests,
      username: p.username
    };
  });
  
  res.json({
    platforms: platformStats,
    rating_history: [
      { month: 'Jan', rating: 1450 },
      { month: 'Feb', rating: 1520 },
      { month: 'Mar', rating: 1580 },
      { month: 'Apr', rating: 1650 },
      { month: 'May', rating: 1720 },
      { month: 'Jun', rating: 1780 }
    ],
    problem_stats: {
      easy: 85,
      medium: 120,
      hard: 45
    }
  });
});

// ==================== TEACHER DASHBOARD ROUTES ====================
app.get('/api/teacher/:teacherId/classes', (req, res) => {
  const { teacherId } = req.params;
  
  res.json({
    classes: [
      { id: 101, name: 'Data Structures', year: 3, branch: 'CSE', students: 65 },
      { id: 102, name: 'Algorithms', year: 3, branch: 'CSE', students: 65 },
      { id: 103, name: 'Database Systems', year: 3, branch: 'IT', students: 58 }
    ],
    recent_activities: [
      { type: 'assignment', title: 'DSA Assignment 3', submitted: 45, total: 65 },
      { type: 'test', title: 'Mid Term Exam', average: 72, highest: 98 },
      { type: 'lecture', title: 'Graph Algorithms', attendance: 58 }
    ]
  });
});

app.get('/api/teacher/:teacherId/class/:classId/performance', (req, res) => {
  const { classId } = req.params;
  
  const students = mockDatabase.students.slice(0, 10).map(s => ({
    id: s.id,
    name: s.name,
    rollNo: s.rollNo,
    marks: Math.floor(Math.random() * 40) + 60,
    attendance: Math.floor(Math.random() * 30) + 70,
    status: Math.random() > 0.8 ? 'At Risk' : 'Good'
  }));
  
  res.json({
    class_id: classId,
    subject: 'Data Structures',
    students: students,
    statistics: {
      average: Math.round(students.reduce((sum, s) => sum + s.marks, 0) / students.length),
      highest: Math.max(...students.map(s => s.marks)),
      lowest: Math.min(...students.map(s => s.marks)),
      atRisk: students.filter(s => s.status === 'At Risk').length
    }
  });
});

// ==================== PLACEMENT OFFICER DASHBOARD ROUTES ====================
app.get('/api/placement/overview', (req, res) => {
  const eligibleStudents = mockDatabase.students.filter(s => s.cgpa >= 7);
  const placedStudents = mockDatabase.placements.length;
  
  res.json({
    statistics: {
      totalStudents: mockDatabase.students.length,
      eligible: eligibleStudents.length,
      placed: placedStudents,
      registrationRate: '85%',
      placementRate: Math.round((placedStudents / eligibleStudents.length) * 100),
      averagePackage: '18.5 LPA',
      companiesVisited: 45
    },
    recentPlacements: mockDatabase.placements.map(p => ({
      ...p,
      studentName: mockDatabase.students.find(s => s.id === p.studentId)?.name
    })),
    upcomingDrives: [
      { company: 'Google', date: '2024-03-15', role: 'SDE', package: '25 LPA', eligible: 'CGPA > 8' },
      { company: 'Microsoft', date: '2024-03-20', role: 'SDE', package: '24 LPA', eligible: 'CGPA > 7.5' },
      { company: 'Amazon', date: '2024-03-25', role: 'SDE', package: '23 LPA', eligible: 'CGPA > 7' }
    ]
  });
});

app.get('/api/placement/leaderboard', (req, res) => {
  const leaderboard = mockDatabase.students.map(s => ({
    rank: 0, // Will be set after sorting
    name: s.name,
    rollNo: s.rollNo,
    cgpa: s.cgpa,
    codingScore: mockDatabase.codingProfiles
      .filter(p => p.studentId === s.id)
      .reduce((sum, p) => sum + p.problemsSolved, 0),
    contestRating: Math.round(mockDatabase.codingProfiles
      .filter(p => p.studentId === s.id)
      .reduce((sum, p) => sum + p.rating, 0) / 
      mockDatabase.codingProfiles.filter(p => p.studentId === s.id).length || 1),
    status: mockDatabase.placements.find(p => p.studentId === s.id) ? 'Placed' : 'Not Placed'
  }))
  .sort((a, b) => (b.codingScore + b.cgpa * 100) - (a.codingScore + a.cgpa * 100))
  .map((student, index) => ({ ...student, rank: index + 1 }));
  
  res.json(leaderboard);
});

// ==================== SCHOOL MODE ROUTES ====================
app.get('/api/school/student/:studentId/academics', (req, res) => {
  res.json({
    performance: [
      { subject: 'Mathematics', marks: 92, grade: 'A', teacher: 'Mr. Sharma' },
      { subject: 'Science', marks: 88, grade: 'B+', teacher: 'Ms. Patel' },
      { subject: 'English', marks: 85, grade: 'B+', teacher: 'Mrs. Gupta' },
      { subject: 'Social Studies', marks: 78, grade: 'B', teacher: 'Mr. Singh' },
      { subject: 'Computer Science', marks: 95, grade: 'A+', teacher: 'Ms. Reddy' }
    ],
    attendance: 94,
    classRank: 8,
    totalStudents: 45,
    predictions: {
      nextExam: '85-90%',
      stream: 'Science with CS',
      atRisk: false
    },
    resources: [
      { type: 'notes', subject: 'Mathematics', title: 'Calculus Notes', url: '#' },
      { type: 'assignment', subject: 'Science', title: 'Physics Lab Report', dueDate: '2024-03-20' }
    ]
  });
});

// ==================== ROOT ROUTE ====================
app.get('/', (req, res) => {
  res.json({
    name: 'SkillTwin API',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      '/api/login',
      '/api/hod/overview',
      '/api/hod/department-stats',
      '/api/advisor/mentees/:advisorId',
      '/api/student/:studentId/overview',
      '/api/student/:studentId/coding-stats',
      '/api/teacher/:teacherId/classes',
      '/api/teacher/:teacherId/class/:classId/performance',
      '/api/placement/overview',
      '/api/placement/leaderboard',
      '/api/school/student/:studentId/academics'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 SkillTwin Backend Server');
  console.log('='.repeat(50));
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`📊 API Base: http://localhost:${PORT}/api`);
  console.log('\n📋 Available Endpoints:');
  console.log('   GET  /                          - API Info');
  console.log('   POST /api/login                  - User login');
  console.log('   GET  /api/hod/overview           - HOD dashboard');
  console.log('   GET  /api/hod/department-stats   - Department stats');
  console.log('   GET  /api/advisor/mentees/:id    - Advisor view');
  console.log('   GET  /api/student/:id/overview   - Student dashboard');
  console.log('   GET  /api/placement/overview     - Placement officer');
  console.log('   GET  /api/placement/leaderboard  - Student leaderboard');
  console.log('='.repeat(50));
});