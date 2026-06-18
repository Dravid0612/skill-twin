// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], // Frontend URLs
  credentials: true
}));
app.use(express.json());

// ==================== MOCK DATABASE ====================
const database = {
  users: [
    { id: 1, name: 'Student User', email: 'student@example.com', role: 'student', institution: 'college' },
    { id: 5, name: 'Teacher User', email: 'teacher@example.com', role: 'teacher', institution: 'college' }
  ],
  
  students: [
    { id: 101, name: 'Alice Chen', rollNo: 'CS001', year: 3, branch: 'CSE', cgpa: 8.7 },
    { id: 102, name: 'Bob Wilson', rollNo: 'CS002', year: 3, branch: 'CSE', cgpa: 7.9 },
    { id: 103, name: 'Carol Davis', rollNo: 'CS003', year: 3, branch: 'CSE', cgpa: 9.2 },
    { id: 104, name: 'David Brown', rollNo: 'CS004', year: 3, branch: 'CSE', cgpa: 6.8 },
    { id: 105, name: 'Eva Green', rollNo: 'CS005', year: 3, branch: 'CSE', cgpa: 8.9 }
  ]
};

// ==================== ROOT ENDPOINT (MOST IMPORTANT FOR TESTING) ====================
app.get('/', (req, res) => {
  res.json({
    server: 'SkillTwin Node.js Backend',
    status: '✅ RUNNING',
    port: 5000,
    timestamp: new Date().toISOString(),
    available_endpoints: [
      'GET  /                          - This status page',
      'POST /api/login                  - User login',
      'GET  /api/student/:id/overview   - Student dashboard',
      'GET  /api/teacher/:id/overview   - Teacher dashboard',
      'POST /api/question-paper/analyze - Question paper analysis',
      'POST /api/mock-test/generate    - Generate mock test questions'
    ],
    test_urls: [
      'http://localhost:5000/',
      'http://localhost:5000/api/student/101/overview',
      'http://localhost:5000/api/teacher/5/overview'
    ]
  });
});

// ==================== LOGIN ENDPOINT ====================
app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body;
  console.log('Login attempt:', { email, role });
  
  // Find user by email (case insensitive)
  const user = database.users.find(u => 
    u.email.toLowerCase() === email?.toLowerCase()
  );
  
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
    // For demo, accept any email with @example.com
    if (email.includes('@example.com')) {
      const demoUser = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email,
        role: role || 'student',
        institution: 'college'
      };
      res.json({
        success: true,
        user: demoUser,
        token: 'mock-jwt-token-' + Date.now()
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials. Try student@example.com' 
      });
    }
  }
});

// ==================== STUDENT DASHBOARD ENDPOINTS ====================
app.get('/api/student/:id/overview', (req, res) => {
  const studentId = parseInt(req.params.id);
  console.log(`👨‍🎓 Student ${studentId} overview requested`);
  
  const student = database.students.find(s => s.id === studentId);
  
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  res.json({
    profile: student,
    academic: {
      subjects: [
        { name: 'Data Structures', marks: 88, attendance: 92 },
        { name: 'Algorithms', marks: 85, attendance: 90 },
        { name: 'Database Systems', marks: 92, attendance: 95 }
      ],
      cgpa: student.cgpa,
      weakTopics: ['Dynamic Programming', 'Database Indexing', 'Operating Systems']
    },
    coding: {
      profiles: [
        { platform: 'leetcode', rating: 1750, problemsSolved: 230, contests: 10 },
        { platform: 'codeforces', rating: 1620, problemsSolved: 145, contests: 7 }
      ],
      totalProblems: 375,
      learningTime: '12h 40m'
    },
    progress: {
      mockTestScore: 82,
      learningSessions: 18,
      recommendedTopics: ['Dynamic Programming', 'Database Indexing', 'System Design']
    }
  });
});

// ==================== TEACHER DASHBOARD ENDPOINTS ====================
app.get('/api/teacher/:id/overview', (req, res) => {
  const teacherId = req.params.id;
  console.log(`👩‍🏫 Teacher ${teacherId} overview requested`);

  res.json({
    teacher: {
      id: teacherId,
      name: teacherId === '101' ? 'Teacher A' : 'Teacher User',
      department: 'Computer Science'
    },
    classes: [
      { name: 'Data Structures', students: 64, averageScore: 76 },
      { name: 'Algorithms', students: 62, averageScore: 74 }
    ],
    weakTopicSummary: ['Dynamic Programming', 'Database Systems', 'Operating Systems'],
    platformInsights: {
      totalStudents: database.students.length,
      averageEngagement: '85%',
      topImprovementAreas: ['Dynamic Programming', 'Databases']
    }
  });
});

// ==================== QUESTION PAPER ANALYSIS ENDPOINT ====================
app.post('/api/question-paper/analyze', async (req, res) => {
  const { text, studentId } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: 'question paper text is required' });
  }

  try {
    const analysis = await analyzeQuestionPaperWithGemini(text);
    const weakTopics = recommendWeakTopics(studentId, analysis.topics);

    res.json({
      topics: analysis.topics,
      weakTopics,
      recommendedResources: createResourceList(weakTopics),
      summary: analysis.summary
    });
  } catch (err) {
    console.error('Gemini analysis failed:', err);
    res.status(500).json({ message: 'Failed to analyze question paper' });
  }
});

// ==================== MOCK TEST ENDPOINT ====================
app.post('/api/mock-test/generate', (req, res) => {
  const { studentId, mode } = req.body;
  const questionBank = getMockQuestionBank();

  const selectedQuestions = questionBank
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)
    .map((question) => ({
      ...question,
      options: shuffleArray(question.options)
    }));

  res.json({
    questions: selectedQuestions,
    mode: mode || 'adaptive',
    generatedAt: new Date().toISOString()
  });
});

// ==================== UTILITY FUNCTIONS ====================
const getMockQuestionBank = () => ([
  {
    id: 'q1',
    text: 'Which data structure provides the best performance for implementing a LRU cache?',
    topic: 'Data Structures',
    difficulty: 'Medium',
    options: ['HashMap + Doubly Linked List', 'Binary Search Tree', 'Stack', 'Queue'],
    answer: 'HashMap + Doubly Linked List'
  },
  {
    id: 'q2',
    text: 'What is the time complexity of quicksort in the average case?',
    topic: 'Algorithms',
    difficulty: 'Easy',
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
    answer: 'O(n log n)'
  },
  {
    id: 'q3',
    text: 'Which normal form removes transitive dependencies from a database schema?',
    topic: 'Database Systems',
    difficulty: 'Medium',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    answer: '3NF'
  },
  {
    id: 'q4',
    text: 'What is the maximum number of nodes in a binary tree of height h?',
    topic: 'Data Structures',
    difficulty: 'Easy',
    options: ['2^h', '2^(h+1)-1', 'h^2', 'h!'],
    answer: '2^(h+1)-1'
  },
  {
    id: 'q5',
    text: 'Which SQL command is used to remove duplicate rows from a SELECT query result?',
    topic: 'Database Systems',
    difficulty: 'Easy',
    options: ['UNIQUE', 'DISTINCT', 'ROW_NUMBER', 'GROUP BY'],
    answer: 'DISTINCT'
  },
  {
    id: 'q6',
    text: 'Which algorithm is most appropriate for finding the shortest path in a weighted graph with non-negative edges?',
    topic: 'Algorithms',
    difficulty: 'Medium',
    options: ['Depth-first search', 'Breadth-first search', 'Dijkstra’s algorithm', 'Bellman-Ford algorithm'],
    answer: 'Dijkstra’s algorithm'
  }
]);

const recommendWeakTopics = (studentId, analyzedTopics) => {
  const performance = {
    101: ['Algorithms', 'Database Systems'],
    102: ['Data Structures', 'Algorithms'],
    103: ['Database Systems'],
    104: ['Algorithms', 'Data Structures'],
    105: ['Database Systems', 'Algorithms']
  };

  const studentWeak = performance[studentId] || ['Data Structures', 'Algorithms'];
  return [...new Set([...analyzedTopics.slice(0, 4), ...studentWeak].slice(0, 4))];
};

const createResourceList = (topics) => (
  topics.map((topic) => `Review short notes and example questions for ${topic}`)
);

const analyzeQuestionPaperWithGemini = async (text) => {
  const model = process.env.GEMINI_MODEL || 'gemini-1.5';
  const apiKey = process.env.GEMINI_API_KEY;

  const topicMatches = Array.from(new Set(
    text.match(/\b(Data Structures|Algorithms|Database Systems|Operating Systems|Networks|OOP|System Design|Software Engineering)\b/gi) || []
  )).map((match) => match.trim());

  const topics = topicMatches.length ? topicMatches : ['Data Structures', 'Algorithms', 'Database Systems'];
  const summary = `Extracted ${topics.length} high-priority topics from the uploaded paper.`;

  if (!apiKey) {
    return { topics, summary };
  }

  const url = `https://gemini.googleapis.com/v1/models/${model}:predict`;
  const payload = {
    instances: [
      {
        prompt: `Extract a concise list of exam topics from the following question paper text:\n\n${text}`
      }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Gemini API responded with status ${response.status}`);
  }

  const data = await response.json();
  const extractedText = data?.predictions?.[0]?.content?.[0]?.text || data?.predictions?.[0]?.output || '';
  const parsedTopics = Array.from(new Set(
    extractedText.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean)
  ));

  return {
    topics: parsedTopics.length ? parsedTopics : topics,
    summary: parsedTopics.length ? `Gemini extracted ${parsedTopics.length} topics.` : summary
  };
};

const shuffleArray = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// ==================== TEACHER DASHBOARD ENDPOINTS ====================
app.get('/api/teacher/:id/overview', (req, res) => {
  const teacherId = req.params.id;
  console.log(`👩‍🏫 Teacher ${teacherId} overview requested`);

  res.json({
    teacher: {
      id: teacherId,
      name: teacherId === '5' ? 'Teacher User' : 'Teacher',
      department: 'Computer Science'
    },
    classes: [
      { name: 'Data Structures', students: 64, averageScore: 76 },
      { name: 'Algorithms', students: 62, averageScore: 74 }
    ],
    weakTopicSummary: ['Dynamic Programming', 'Database Systems', 'Operating Systems'],
    platformInsights: {
      totalStudents: database.students.length,
      averageEngagement: '85%',
      topImprovementAreas: ['Dynamic Programming', 'Databases']
    }
  });
});

// ==================== CATCH-ALL FOR DEBUGGING ====================
app.use((req, res) => {
  console.log('❌ 404 Not Found:', req.method, req.url);
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.url} does not exist`,
    requested: {
      method: req.method,
      url: req.url,
      path: req.path
    },
    available_routes: [
      'GET /',
      'POST /api/login',
      'GET /api/student/:id/overview (try /api/student/101/overview)',
      'GET /api/teacher/:id/overview (try /api/teacher/5/overview)',
      'POST /api/question-paper/analyze',
      'POST /api/mock-test/generate'
    ],
    tip: 'Try accessing http://localhost:5000/ first to see all available endpoints'
  });
});

// ==================== START SERVER ====================
const PORT = 5000;
app.listen(PORT, () => {
  console.log('\n' + '🎯'.repeat(30));
  console.log('🚀 SKILLTWIN NODE.JS BACKEND');
  console.log('🎯'.repeat(30));
  console.log(`\n✅ Server is running on: http://localhost:${PORT}`);
  console.log(`✅ Test root endpoint: http://localhost:${PORT}/`);
  console.log(`\n📊 Available API Endpoints:`);
  console.log(`   • POST http://localhost:${PORT}/api/login`);
  console.log(`   • GET  http://localhost:${PORT}/api/student/101/overview`);
  console.log(`   • GET  http://localhost:${PORT}/api/teacher/5/overview`);
  console.log(`   • POST http://localhost:${PORT}/api/question-paper/analyze`);
  console.log(`   • POST http://localhost:${PORT}/api/mock-test/generate`);
  console.log('\n' + 'executed successfully' + '\n');
});