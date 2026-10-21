window.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

function initDashboard() {
    // 1. Read Active Logged-in User
    var userRaw = localStorage.getItem('prepAiActiveUser');
    if (!userRaw) {
        // Not logged in -> redirect to login
        window.location.href = 'login.html';
        return;
    }

    var user = JSON.parse(userRaw);

    // Populate UI User indicators
    document.getElementById('sideUserName').textContent = user.name || 'Student';
    document.getElementById('sideUserRole').textContent = formatRole(user.targetRole);
    document.getElementById('sideAvatar').textContent = (user.name || 'S').charAt(0).toUpperCase();

    document.getElementById('bannerUserName').textContent = user.name || 'Candidate';
    document.getElementById('bannerTargetRole').textContent = formatRole(user.targetRole);
    document.getElementById('bannerTargetQs').textContent = (user.dailyTarget || '10') + ' Qs / Day';
    document.getElementById('bannerLevel').textContent = (user.experienceLevel || 'Beginner').toUpperCase();
    document.getElementById('bannerGoal').textContent = formatGoal(user.focusGoal);

    // 2. Load Assessment History & Weak Points
    loadExamHistoryAndMetrics();
}

function loadExamHistoryAndMetrics() {
    var history = JSON.parse(localStorage.getItem('prepAiExamHistory') || '[]');

    // If fresh account with 0 exams, seed with 2 realistic baseline assessments for immediate demo
    if (history.length === 0) {
        history = [
            {
                date: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
                role: "Frontend Developer",
                level: "Intermediate",
                score: 60,
                total: 5,
                correct: 3,
                weakTopics: ["React Virtual DOM", "Async Event Loop"],
                strongTopics: ["HTML5 Semantics", "CSS Flexbox"]
            },
            {
                date: new Date(Date.now() - 86400000).toLocaleDateString(),
                role: "Frontend Developer",
                level: "Beginner",
                score: 80,
                total: 5,
                correct: 4,
                weakTopics: ["Closures in JavaScript"],
                strongTopics: ["Box Model", "Let vs Const", "DOM API"]
            }
        ];
        localStorage.setItem('prepAiExamHistory', JSON.stringify(history));

        // Save accumulated weak topics into master list
        var initialWeak = ["React Virtual DOM", "Async Event Loop", "Closures in JavaScript"];
        localStorage.setItem('prepAiWeakTopics', JSON.stringify(initialWeak));
    }

    // Calculate aggregated metrics
    var totalExams = history.length;
    var totalScoreSum = 0;
    var allWeak = JSON.parse(localStorage.getItem('prepAiWeakTopics') || '[]');
    var allStrong = [];

    history.forEach(function(item) {
        totalScoreSum += item.score;
        if (item.strongTopics) {
            item.strongTopics.forEach(function(s) {
                if (allStrong.indexOf(s) === -1) allStrong.push(s);
            });
        }
    });

    var avgScore = totalExams > 0 ? Math.round(totalScoreSum / totalExams) : 0;

    // Update KPI UI
    document.getElementById('statExamsTaken').textContent = totalExams;
    document.getElementById('statAvgScore').textContent = avgScore + '%';
    document.getElementById('statStrongCount').textContent = allStrong.length;
    document.getElementById('statWeakCount').textContent = allWeak.length;
    document.getElementById('weakBadgeCount').textContent = allWeak.length + ' Weak';

    // Render Weak Topics
    var weakContainer = document.getElementById('weakTopicsContainer');
    if (allWeak.length === 0) {
        weakContainer.innerHTML = '<span style="color:#64748b; font-size:0.85rem;">No weak points flagged yet! Take a test to evaluate.</span>';
    } else {
        weakContainer.innerHTML = allWeak.map(function(t) {
            return '<span class="weak-chip">⚠️ ' + t + '</span>';
        }).join('');
    }

    // Render Strong Topics
    var strongContainer = document.getElementById('strongTopicsContainer');
    if (allStrong.length === 0) {
        strongContainer.innerHTML = '<span style="color:#64748b; font-size:0.85rem;">Take exams to establish mastered concepts.</span>';
    } else {
        strongContainer.innerHTML = allStrong.map(function(s) {
            return '<span class="strong-chip">✓ ' + s + '</span>';
        }).join('');
    }

    // Render Exam History Table
    var tbody = document.getElementById('examHistoryBody');
    var html = '';
    history.slice().reverse().forEach(function(exam) {
        var isPass = exam.score >= 70;
        var pillClass = isPass ? 'score-pass' : 'score-fail';
        var weakStr = exam.weakTopics && exam.weakTopics.length > 0 
            ? exam.weakTopics.join(', ') 
            : 'None (Clean Test)';

        html += '<tr>' +
            '<td>' + exam.date + '</td>' +
            '<td><strong>' + exam.role + '</strong></td>' +
            '<td>' + exam.level + '</td>' +
            '<td><span class="score-pill ' + pillClass + '">' + exam.score + '% (' + exam.correct + '/' + exam.total + ')</span></td>' +
            '<td><small style="color:#b91c1c;">' + weakStr + '</small></td>' +
            '<td><a href="paper-by-ai.html" class="btn-action-small">AI Remedy &rarr;</a></td>' +
        '</tr>';
    });
    tbody.innerHTML = html;
}

function formatRole(r) {
    if (!r) return 'Frontend Developer';
    var map = {
        frontend: 'Frontend Developer',
        backend: 'Backend Developer',
        java: 'Java Developer',
        python: 'Python Developer'
    };
    return map[r] || r;
}

function formatGoal(g) {
    if (!g) return 'Placement Preparation';
    var map = {
        campus_placements: 'Campus Placements',
        mock_interviews: 'Technical MCQs & Tests',
        weak_topics: 'Remediating Weak Areas'
    };
    return map[g] || g;
}

function logout() {
    localStorage.removeItem('prepAiActiveUser');
    window.location.href = 'login.html';
}
