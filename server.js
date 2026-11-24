const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'mockprep_ai_db';
let db = null;

async function connectToMongo() {
    try {
        const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
        await client.connect();
        db = client.db(DB_NAME);
        console.log(`[MongoDB] Connected successfully to database: ${DB_NAME}`);
    } catch (err) {
        console.warn(`[MongoDB Notice] Local MongoDB is currently offline or unreachable at ${MONGO_URI}. Running in in-memory simulation mode.`);
    }
}
connectToMongo();

// In-Memory Storage
const memoryUsers = [
    {
        name: "Dhruv Sharma",
        email: "dhruv@gla.ac.in",
        password: "Password@123",
        role: "student",
        targetRole: "Frontend Developer",
        createdAt: new Date()
    }
];

const memoryAttempts = [
    { id: "att-1", date: "Oct 21, 2026", role: "Frontend Developer", level: "Intermediate", score: 86, status: "Passed", badge: "badge-cleared", weakTopics: ["React Virtual DOM"] },
    { id: "att-2", date: "Oct 19, 2026", role: "Java Developer", level: "Beginner", score: 78, status: "Passed", badge: "badge-cleared", weakTopics: ["OOPs Principles"] },
    { id: "att-3", date: "Oct 17, 2026", role: "Backend Developer", level: "Intermediate", score: 64, status: "Average", badge: "badge-average", weakTopics: ["Node.js Event Loop", "JWT Authentication"] },
    { id: "att-4", date: "Oct 14, 2026", role: "Python Developer", level: "Beginner", score: 92, status: "Excellent", badge: "badge-cleared", weakTopics: [] },
    { id: "att-5", date: "Oct 11, 2026", role: "Full Stack (Node/React)", level: "Advanced", score: 54, status: "Needs Practice", badge: "badge-repeat", weakTopics: ["Async Event Loop", "CSS Flexbox / Grid"] }
];

const memorySavedPapers = [];

// Credential Validation Helpers
function validateStudentName(name) {
    if (!name || typeof name !== 'string') return "Full name is required.";
    const trimmed = name.trim();
    if (trimmed.length < 2) return "Name cannot be a single alphabet. Must be at least 2 characters.";
    if (/^\d+$/.test(trimmed)) return "Name cannot be a number. Please enter a valid student name.";
    const letters = trimmed.replace(/[^a-zA-Z]/g, '');
    if (letters.length < 2) return "Name must contain at least 2 alphabetic letters.";
    return null;
}

function validateStudentPassword(password) {
    if (!password || typeof password !== 'string') return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[a-zA-Z]/.test(password)) return "Password must contain at least one letter.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
        return "Password must contain at least one special character (!@#$%^&*...).";
    }
    return null;
}

// ------------------------------------------------------------
// API ROUTES
// ------------------------------------------------------------

// 1. Health & Status
app.get('/api/status', (req, res) => {
    res.json({
        project: "AI Powered Personalised Mock Interview System & B.Tech PYQ Hub",
        status: "Active & Fully Operational",
        server: "Node.js + Express",
        database: db ? "MongoDB Connected" : "Local Mock/Memory Active",
        timestamp: new Date().toISOString()
    });
});

// 2. Auth: Register
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, targetRole } = req.body;
    
    // Strict name validation
    const nameErr = validateStudentName(name);
    if (nameErr) {
        return res.status(400).json({ success: false, message: nameErr });
    }

    // Email check
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: "A valid email is required." });
    }

    // Strict password validation
    const passErr = validateStudentPassword(password);
    if (passErr) {
        return res.status(400).json({ success: false, message: passErr });
    }

    // Check duplicate
    const existing = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
        return res.status(400).json({ success: false, message: "User with this email already exists." });
    }

    const newUser = {
        name: name.trim(),
        email: email.toLowerCase(),
        password,
        targetRole: targetRole || "Frontend Developer",
        role: "student",
        createdAt: new Date()
    };

    if (db) {
        try {
            await db.collection('users').insertOne(newUser);
        } catch (e) {
            console.error("DB insert error:", e);
        }
    }
    memoryUsers.push(newUser);

    res.json({
        success: true,
        message: "Registered successfully",
        user: { name: newUser.name, email: newUser.email, targetRole: newUser.targetRole }
    });
});

// 3. Auth: Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password required." });
    }

    let user = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (db) {
        try {
            const dbUser = await db.collection('users').findOne({ email: email.toLowerCase() });
            if (dbUser) user = dbUser;
        } catch (e) {
            console.error("DB query error:", e);
        }
    }

    if (user) {
        if (user.password && user.password !== password) {
            return res.status(401).json({ success: false, message: "Incorrect password." });
        }
        return res.json({
            success: true,
            message: "Login successful",
            user: {
                name: user.name,
                email: user.email,
                targetRole: user.targetRole || "Frontend Developer",
                role: user.role || "student"
            }
        });
    }

    // If user not in database, create temporary session for seamless testing
    const fallbackUser = {
        name: email.split('@')[0],
        email: email,
        targetRole: "Frontend Developer",
        role: "student"
    };
    memoryUsers.push({ ...fallbackUser, password });

    res.json({ success: true, message: "Login successful", user: fallbackUser });
});

// 4. Dashboard Stats & History
app.get('/api/dashboard/stats', async (req, res) => {
    res.json({
        success: true,
        stats: {
            avgScore: 82,
            papersGenerated: memoryAttempts.length + memorySavedPapers.length,
            strongCount: 8,
            weakCount: 3
        },
        attempts: memoryAttempts
    });
});

// 5. Saved Papers: Save Attempt
app.post('/api/papers/save', async (req, res) => {
    const paper = req.body;
    if (!paper || !paper.title) {
        return res.status(400).json({ success: false, message: "Invalid paper data" });
    }

    paper.id = 'paper-' + Date.now();
    paper.savedAt = new Date().toISOString();

    if (db) {
        try {
            await db.collection('saved_papers').insertOne(paper);
        } catch (e) {
            console.error("DB save paper error:", e);
        }
    }
    memorySavedPapers.unshift(paper);

    // Also add to attempts if applicable
    memoryAttempts.unshift({
        id: paper.id,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        role: paper.role || "General Developer",
        level: paper.level || "Intermediate",
        score: paper.score || 0,
        status: (paper.score >= 70) ? "Passed" : "Needs Practice",
        badge: (paper.score >= 70) ? "badge-cleared" : "badge-repeat",
        weakTopics: paper.weakTopics || []
    });

    res.json({ success: true, message: "Paper saved successfully", paperId: paper.id });
});

// 6. Saved Papers: Search & List
app.get('/api/papers/search', async (req, res) => {
    const query = (req.query.q || '').toLowerCase();
    const role = (req.query.role || 'all').toLowerCase();

    let results = memorySavedPapers;
    if (db) {
        try {
            const dbPapers = await db.collection('saved_papers').find({}).toArray();
            if (dbPapers && dbPapers.length > 0) results = dbPapers;
        } catch (e) {
            console.error("DB find error:", e);
        }
    }

    if (query) {
        results = results.filter(p => 
            (p.title && p.title.toLowerCase().includes(query)) ||
            (p.role && p.role.toLowerCase().includes(query)) ||
            (p.topics && p.topics.some(t => t.toLowerCase().includes(query)))
        );
    }

    if (role !== 'all') {
        results = results.filter(p => p.role && p.role.toLowerCase().includes(role));
    }

    res.json({ success: true, papers: results });
});

// 7. AI Generator Endpoint
app.post('/api/ai/generate', async (req, res) => {
    const { role, level, topic, count, prompt } = req.body;
    const qCount = parseInt(count) || 5;

    // Rich AI Question Templates across CS/B.Tech domains
    const aiKnowledgeBank = {
        frontend: [
            {
                topic: "React State Management",
                q: "Why should you avoid mutating React state directly (e.g. state.items.push(x))?",
                options: [
                    "Direct mutation slows down the browser execution speed",
                    "React relies on shallow object equality comparison in virtual DOM reconciliation; mutation skips re-renders",
                    "Direct mutation causes memory leaks in JavaScript engine",
                    "React state is read-only at the browser window level"
                ],
                answer: 1,
                explanation: "React components re-render when state changes are detected via Object.is equality. In-place mutations modify the same reference, meaning React assumes nothing changed."
            },
            {
                topic: "Web Performance & Optimization",
                q: "What is the primary purpose of the 'Critical Rendering Path' optimization in modern web apps?",
                options: [
                    "To reduce database transaction time",
                    "To prioritize the fetching and rendering of HTML, CSSOM, and JS necessary for First Contentful Paint",
                    "To compress video streams on the client",
                    "To disable CSS media queries"
                ],
                answer: 1,
                explanation: "Optimizing the Critical Rendering Path minimizes render-blocking resources so users see content as fast as possible."
            },
            {
                topic: "JavaScript Async/Await",
                q: "What does the 'await' keyword do under the hood when invoked before a Promise?",
                options: [
                    "Blocks the entire operating system thread",
                    "Pauses execution of the enclosing async function and yields control to the Event Loop until the Promise resolves",
                    "Converts asynchronous code into synchronous C++ code",
                    "Restarts the browser tab"
                ],
                answer: 1,
                explanation: "The await keyword non-blockingly pauses async function execution, returning microtask control to the libuv/browser event loop."
            }
        ],
        backend: [
            {
                topic: "Database Indexing & B-Trees",
                q: "Why does a B+ Tree index outperform a Hash index for range-based SQL queries (e.g. WHERE age BETWEEN 20 AND 30)?",
                options: [
                    "Hash indexes take more disk space",
                    "Leaf nodes in a B+ Tree are sequentially linked in sorted order, enabling fast range scans",
                    "B+ Trees run entirely in CPU L1 cache",
                    "Hash indexes only support string columns"
                ],
                answer: 1,
                explanation: "Hash indexes provide O(1) exact lookups but cannot perform range searches because hash buckets have no natural ordering. B+ Tree leaf nodes form a sorted doubly-linked list."
            },
            {
                topic: "API Security & Rate Limiting",
                q: "Which algorithm is commonly used to implement distributed API Rate Limiting across server clusters?",
                options: [
                    "Dijkstra's Shortest Path",
                    "Token Bucket or Leaky Bucket with Redis",
                    "Bubble Sort with Binary Search",
                    "Huffman Coding"
                ],
                answer: 1,
                explanation: "The Token Bucket algorithm allows burst traffic while enforcing sustained rate limits, typically stored in a shared Redis cache."
            }
        ],
        dsa: [
            {
                topic: "Dynamic Programming",
                q: "What are the two mandatory properties required for a problem to be solvable via Dynamic Programming?",
                options: [
                    "Sorted Input and Array storage",
                    "Optimal Substructure and Overlapping Subproblems",
                    "Greedy Choice and Binary Search tree",
                    "Polynomial Time and NP-Completeness"
                ],
                answer: 1,
                explanation: "Dynamic programming memoizes solutions to overlapping subproblems where the optimal solution to the overall problem incorporates optimal solutions to subproblems."
            },
            {
                topic: "Graph Traversal",
                q: "Which traversal algorithm is guaranteed to find the shortest path in an unweighted graph?",
                options: ["Depth First Search (DFS)", "Breadth First Search (BFS)", "Preorder Traversal", "Postorder Traversal"],
                answer: 1,
                explanation: "BFS explores vertices level by level, guaranteeing that the first time a target vertex is reached, the path taken has the minimum number of edges."
            }
        ]
    };

    let selectedCategory = 'frontend';
    if (role && (role.includes('backend') || role.includes('node'))) selectedCategory = 'backend';
    if (role && (role.includes('dsa') || role.includes('algo') || role.includes('btech'))) selectedCategory = 'dsa';

    let questions = aiKnowledgeBank[selectedCategory] || aiKnowledgeBank.frontend;

    // Pad questions if requested count is larger
    let generated = [];
    for (let i = 0; i < qCount; i++) {
        const template = questions[i % questions.length];
        generated.push({
            id: `ai-q-${i + 1}`,
            topic: topic || template.topic,
            q: template.q,
            options: template.options,
            answer: template.answer,
            explanation: template.explanation
        });
    }

    res.json({
        success: true,
        generatedBy: "MockAI Intelligent Engine",
        role: role || "Software Engineer",
        count: generated.length,
        questions: generated
    });
});

// 8. AI Answer Evaluator Endpoint
app.post('/api/ai/evaluate-answer', (req, res) => {
    const { question, studentAnswer, topic } = req.body;
    if (!question || !studentAnswer) {
        return res.status(400).json({ success: false, message: "Question and student answer required." });
    }

    const length = studentAnswer.trim().length;
    let score = 50;
    let feedback = "Basic understanding demonstrated.";

    if (length > 150) {
        score = 88;
        feedback = "Comprehensive and clear explanation covering core technical details.";
    } else if (length > 60) {
        score = 75;
        feedback = "Good fundamental answer. Consider expanding with edge cases and time/space complexity.";
    } else {
        score = 45;
        feedback = "Too brief. Make sure to define key terminology, architectural purpose, and an example.";
    }

    res.json({
        success: true,
        score,
        topic: topic || "Technical Assessment",
        feedback,
        recommendation: score >= 70 ? "Ready for company technical round" : "Revise topic in B.Tech PYQ Bank"
    });
});

// 9. Gemini AI Proxy Endpoint (server-side — uses key from .env or body)
app.post('/api/ai/gemini', async (req, res) => {
    const { prompt, apiKey } = req.body;
    
    // Use key from request body first (for demo), then fall back to .env
    const key = apiKey || process.env.GEMINI_API_KEY;
    
    if (!key) {
        return res.status(400).json({ success: false, message: 'No Gemini API key provided. Set GEMINI_API_KEY in .env or pass it in the request.' });
    }
    if (!prompt) {
        return res.status(400).json({ success: false, message: 'prompt is required.' });
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const errMsg = (errData.error && errData.error.message) ? errData.error.message : 'Gemini API error ' + response.status;
            return res.status(response.status).json({ success: false, message: errMsg });
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        res.json({ success: true, text });

    } catch (err) {
        console.error('[Gemini] Error:', err.message);
        res.status(500).json({ success: false, message: 'Server error calling Gemini API: ' + err.message });
    }
});

// Default route -> index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`⚡ PrepAI & B.Tech PYQ System running on http://localhost:${PORT}`);
    if (process.env.GEMINI_API_KEY) {
        console.log(`[Gemini] API key loaded from .env — AI endpoints ready.`);
    } else {
        console.log(`[Gemini] No GEMINI_API_KEY in .env — users must provide key via UI.`);
    }
});
