const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// MongoDB Connection URI (defaults to MongoDB Compass standard local port)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'mockprep_ai_db';
let db = null;

// Connect to MongoDB (fallback gracefully if Compass/MongoDB service is not started)
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

// In-Memory Storage (ensures 100% reliability for evaluation demo even without local MongoDB running)
const memoryUsers = [];
const memoryAttempts = [
    { date: "Oct 21, 2026", role: "Frontend Developer", level: "Intermediate", score: 86, status: "Passed", badge: "badge-cleared" },
    { date: "Oct 19, 2026", role: "Java Developer", level: "Beginner", score: 78, status: "Passed", badge: "badge-cleared" },
    { date: "Oct 17, 2026", role: "Backend Developer", level: "Intermediate", score: 64, status: "Average", badge: "badge-average" },
    { date: "Oct 14, 2026", role: "Python Developer", level: "Beginner", score: 92, status: "Excellent", badge: "badge-cleared" },
    { date: "Oct 11, 2026", role: "Full Stack (Node/React)", level: "Advanced", score: 54, status: "Needs Practice", badge: "badge-repeat" }
];

// ------------------------------------------------------------
// API ROUTES
// ------------------------------------------------------------

// 1. Health check & Evaluation Status API
app.get('/api/status', (req, res) => {
    res.json({
        project: "AI Powered Personalised Mock Interview System",
        evaluation: "Phase 1 Completed",
        server: "Node.js + Express",
        database: db ? "MongoDB Connected" : "Local Mock/Memory Active",
        timestamp: new Date().toISOString()
    });
});

// 2. Auth: Register
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, targetRole } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newUser = {
        name,
        email,
        targetRole: targetRole || "Frontend Developer",
        role: "student",
        createdAt: new Date()
    };

    if (db) {
        try {
            await db.collection('users').insertOne({ ...newUser, password });
        } catch (e) {
            console.error("DB insert error:", e);
        }
    }
    memoryUsers.push(newUser);

    res.json({ success: true, message: "Registered successfully", user: newUser });
});

// 3. Auth: Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = {
        name: email.split('@')[0],
        email,
        role: role || "student",
        targetRole: "Frontend Developer",
        loginTime: new Date().toLocaleTimeString()
    };

    res.json({ success: true, message: "Login successful", user });
});

// 4. Dashboard: Get Evaluation Metrics and History
app.get('/api/dashboard/stats', async (req, res) => {
    res.json({
        success: true,
        stats: {
            avgScore: 82,
            papersGenerated: 14,
            strongCount: 6,
            weakCount: 3
        },
        attempts: memoryAttempts,
        phases: [
            { phase: "Phase 1", title: "Frontend UI & Evaluation Demo", status: "Completed", progress: 100 },
            { phase: "Phase 2", title: "Node.js REST API & MongoDB Storage", status: "In Progress", progress: 35 },
            { phase: "Phase 3", title: "Adaptive Engine & Model Evaluation", status: "Upcoming", progress: 0 }
        ]
    });
});

// Default route -> redirect to login or dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(` PrepAI Server running on http://localhost:${PORT}`);
});
