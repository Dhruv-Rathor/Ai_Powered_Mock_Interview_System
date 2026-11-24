// Saved Papers & Exam History Engine with Search, Review & Download

document.addEventListener('DOMContentLoaded', function() {
    initSavedPapers();
});

var allSavedPapers = [];
var filteredSavedPapers = [];

// Seed sample completed papers if none exist yet
function seedInitialSavedPapers() {
    var existing = JSON.parse(localStorage.getItem('prepAiSavedPapers') || '[]');
    if (existing.length === 0) {
        var samplePapers = [
            {
                id: "paper-sample-1",
                title: "Frontend Developer Assessment (Intermediate)",
                role: "Frontend Developer",
                level: "Intermediate",
                topics: ["HTML5 & Semantics", "CSS Flexbox / Grid", "JavaScript ES6+", "React Hooks", "DOM & Events"],
                date: "Oct 21, 2026",
                score: 86,
                totalQuestions: 7,
                correctCount: 6,
                weakTopics: ["React Virtual DOM"],
                strongTopics: ["HTML5 & Semantics", "JavaScript ES6+", "React Hooks"],
                questions: [
                    {
                        qNo: 1,
                        topic: "HTML5 & Semantics",
                        question: "Which HTML5 element is most semantically appropriate for self-contained syndicatable content?",
                        options: ["<div>", "<section>", "<article>", "<aside>"],
                        selectedOption: 2,
                        correctOption: 2,
                        isCorrect: true,
                        explanation: "<article> specifies independent, self-contained content intended to be independently distributable."
                    },
                    {
                        qNo: 2,
                        topic: "CSS Flexbox / Grid",
                        question: "Which CSS Flexbox property aligns flex items along the cross axis?",
                        options: ["justify-content", "align-items", "flex-direction", "align-content"],
                        selectedOption: 1,
                        correctOption: 1,
                        isCorrect: true,
                        explanation: "align-items controls cross-axis alignment for items inside the current flex line."
                    },
                    {
                        qNo: 3,
                        topic: "JavaScript ES6+",
                        question: "What is the key difference between '==' and '===' in JavaScript?",
                        options: [
                            "'==' compares references, '===' compares values",
                            "'==' performs type coercion, '===' checks both value and type without coercion",
                            "'===' is used only for numeric comparisons",
                            "There is no difference in ES6"
                        ],
                        selectedOption: 1,
                        correctOption: 1,
                        isCorrect: true,
                        explanation: "Strict equality (===) checks both identity and type without implicit casting."
                    },
                    {
                        qNo: 4,
                        topic: "React Hooks",
                        question: "How does useEffect behave when passed an empty dependency array []?",
                        options: [
                            "It runs on every re-render",
                            "It never executes",
                            "It executes exactly once after the initial render",
                            "It executes only before the component unmounts"
                        ],
                        selectedOption: 2,
                        correctOption: 2,
                        isCorrect: true,
                        explanation: "An empty dependency array indicates no state triggers re-execution after mount."
                    },
                    {
                        qNo: 5,
                        topic: "React Virtual DOM",
                        question: "During reconciliation, what heuristic allows React to match children across renders quickly?",
                        options: ["class names", "unique and stable 'key' props", "z-index", "DOM element IDs"],
                        selectedOption: 0,
                        correctOption: 1,
                        isCorrect: false,
                        explanation: "React relies on key props to identify which items have changed, been added, or been removed."
                    }
                ]
            },
            {
                id: "paper-sample-2",
                title: "Java Developer Assessment (Beginner)",
                role: "Java Developer",
                level: "Beginner",
                topics: ["OOPs Principles", "Collections Framework", "Exception Handling", "Multithreading"],
                date: "Oct 19, 2026",
                score: 78,
                totalQuestions: 5,
                correctCount: 4,
                weakTopics: ["OOPs Principles"],
                strongTopics: ["Collections Framework", "Exception Handling"],
                questions: [
                    {
                        qNo: 1,
                        topic: "OOPs Principles",
                        question: "Which Java OOP principle is demonstrated by method overloading?",
                        options: ["Encapsulation", "Compile-time Polymorphism", "Runtime Polymorphism", "Abstraction"],
                        selectedOption: 2,
                        correctOption: 1,
                        isCorrect: false,
                        explanation: "Method overloading is resolved at compile time based on parameter signatures."
                    },
                    {
                        qNo: 2,
                        topic: "Collections Framework",
                        question: "Which collection class maintains unique elements in their natural sorted order?",
                        options: ["HashSet", "ArrayList", "TreeSet", "Vector"],
                        selectedOption: 2,
                        correctOption: 2,
                        isCorrect: true,
                        explanation: "TreeSet implements NavigableSet and sorts elements in natural ascending order or custom Comparator."
                    },
                    {
                        qNo: 3,
                        topic: "Exception Handling",
                        question: "Which block in a Java try-catch statement will execute regardless of whether an exception occurs?",
                        options: ["catch", "finally", "throw", "finalize"],
                        selectedOption: 1,
                        correctOption: 1,
                        isCorrect: true,
                        explanation: "finally blocks always execute to perform cleanup actions like closing file/database streams."
                    }
                ]
            },
            {
                id: "paper-sample-3",
                title: "AI Remedial Paper: Async Event Loop & React Virtual DOM",
                role: "Targeted Weak Points",
                level: "Remedial",
                topics: ["Async Event Loop", "React Virtual DOM"],
                date: "Oct 18, 2026",
                score: 100,
                totalQuestions: 4,
                correctCount: 4,
                weakTopics: [],
                strongTopics: ["Async Event Loop", "React Virtual DOM"],
                questions: [
                    {
                        qNo: 1,
                        topic: "Async Event Loop",
                        question: "Between Microtasks (Promise.then) and Macrotasks (setTimeout), which is prioritized by the Event Loop?",
                        options: [
                            "Macrotasks are always executed first",
                            "Microtask queue is fully drained before the next Macrotask is processed",
                            "They run concurrently on parallel OS threads",
                            "Order is random"
                        ],
                        selectedOption: 1,
                        correctOption: 1,
                        isCorrect: true,
                        explanation: "Microtasks execute immediately after the current script turn and before yielding to macrotasks."
                    }
                ]
            }
        ];

        localStorage.setItem('prepAiSavedPapers', JSON.stringify(samplePapers));
        return samplePapers;
    }
    return existing;
}

function initSavedPapers() {
    var raw = localStorage.getItem('prepAiActiveUser');
    if (raw) {
        var user = JSON.parse(raw);
        var sideName = document.getElementById('sideUserName');
        var sideAvatar = document.getElementById('sideAvatar');
        if (sideName) sideName.textContent = user.name || 'Student';
        if (sideAvatar) sideAvatar.textContent = (user.name || 'S').charAt(0).toUpperCase();
    }

    allSavedPapers = seedInitialSavedPapers();
    filteredSavedPapers = allSavedPapers.slice();

    renderSavedCards(filteredSavedPapers);
    updateMetrics();
}

function updateMetrics() {
    var totalEl = document.getElementById('metricTotalPapers');
    var avgEl = document.getElementById('metricAvgScore');
    var passedEl = document.getElementById('metricPassedCount');
    var practiceEl = document.getElementById('metricPracticeCount');

    var total = allSavedPapers.length;
    var sum = 0;
    var passed = 0;
    var practice = 0;

    allSavedPapers.forEach(function(p) {
        var s = p.score || 0;
        sum += s;
        if (s >= 70) passed++;
        else practice++;
    });

    var avg = total > 0 ? Math.round(sum / total) : 0;

    if (totalEl) totalEl.textContent = total;
    if (avgEl) avgEl.textContent = avg + '%';
    if (passedEl) passedEl.textContent = passed;
    if (practiceEl) practiceEl.textContent = practice;
}

function renderSavedCards(papers) {
    var container = document.getElementById('savedPapersContainer');
    if (!container) return;

    var countText = document.getElementById('savedPapersCount');
    if (countText) countText.textContent = `${papers.length} Papers Found`;

    if (papers.length === 0) {
        container.innerHTML = `
            <div class="empty-state-box">
                <span style="font-size:3rem;">📂</span>
                <h3>No Saved Papers Match Your Search</h3>
                <p>Try modifying your keyword, role filter, or take a new exam on the "Generate Paper" page.</p>
                <button type="button" class="btn-res" style="background:#2563eb; color:#fff;" onclick="resetSearchFilters()">Reset Filters</button>
            </div>
        `;
        return;
    }

    var html = '';
    papers.forEach(function(paper) {
        var isPassed = (paper.score >= 70);
        var scoreClass = isPassed ? 'score-passed' : 'score-repeat';
        var statusLabel = isPassed ? 'Passed' : 'Needs Practice';

        var weakChips = '';
        if (paper.weakTopics && paper.weakTopics.length > 0) {
            weakChips = paper.weakTopics.map(function(w) {
                return `<span class="chip-weak">⚠️ ${escapeHtml(w)}</span>`;
            }).join(' ');
        } else {
            weakChips = `<span class="chip-passed">✨ Clean Run (No Weak Points)</span>`;
        }

        html += `
            <div class="saved-paper-card">
                <div class="saved-card-header">
                    <div>
                        <span class="paper-date-pill">📅 ${escapeHtml(paper.date)}</span>
                        <span class="paper-role-pill">${escapeHtml(paper.role || 'Developer')}</span>
                    </div>
                    <div class="score-badge ${scoreClass}">
                        <strong>${paper.score}%</strong>
                        <small>${statusLabel}</small>
                    </div>
                </div>

                <h3 class="paper-card-title">${escapeHtml(paper.title)}</h3>

                <div class="paper-summary-meta">
                    <span>📊 Questions: <strong>${paper.totalQuestions || (paper.questions ? paper.questions.length : 5)}</strong></span>
                    <span>✅ Correct: <strong>${paper.correctCount !== undefined ? paper.correctCount : Math.round((paper.score / 100) * (paper.totalQuestions || 5))}</strong></span>
                    <span>🎯 Level: <strong>${escapeHtml(paper.level || 'Intermediate')}</strong></span>
                </div>

                <div class="weak-tags-wrapper">
                    <span style="font-size:0.75rem; color:#64748b; font-weight:700; display:block; margin-bottom:4px;">Diagnostic Findings:</span>
                    ${weakChips}
                </div>

                <div class="saved-card-actions">
                    <button type="button" class="btn-review-paper" onclick="openReviewModal('${paper.id}')">
                        🔍 Review Paper Details
                    </button>
                    <button type="button" class="btn-download-record" onclick="downloadSavedReport('${paper.id}')" title="Download Graded Paper">
                        📥 Download
                    </button>
                    <button type="button" class="btn-delete-paper" onclick="deleteSavedPaper('${paper.id}')" title="Delete from history">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Live Search & Filter
function filterSavedPapers() {
    var searchVal = (document.getElementById('paperSearchInput').value || '').trim().toLowerCase();
    var roleVal = document.getElementById('paperRoleFilter').value;
    var statusVal = document.getElementById('paperStatusFilter').value;

    filteredSavedPapers = allSavedPapers.filter(function(p) {
        var matchSearch = true;
        if (searchVal) {
            var searchInTitle = (p.title || '').toLowerCase().indexOf(searchVal) !== -1;
            var searchInRole = (p.role || '').toLowerCase().indexOf(searchVal) !== -1;
            var searchInTopics = (p.topics || []).some(function(t) { return t.toLowerCase().indexOf(searchVal) !== -1; });
            var searchInWeak = (p.weakTopics || []).some(function(w) { return w.toLowerCase().indexOf(searchVal) !== -1; });
            var searchInDate = (p.date || '').toLowerCase().indexOf(searchVal) !== -1;
            matchSearch = searchInTitle || searchInRole || searchInTopics || searchInWeak || searchInDate;
        }

        var matchRole = (roleVal === 'all') || ((p.role || '').toLowerCase().indexOf(roleVal.toLowerCase()) !== -1);
        
        var matchStatus = true;
        if (statusVal === 'passed') {
            matchStatus = (p.score >= 70);
        } else if (statusVal === 'repeat') {
            matchStatus = (p.score < 70);
        }

        return matchSearch && matchRole && matchStatus;
    });

    renderSavedCards(filteredSavedPapers);
}

function resetSearchFilters() {
    document.getElementById('paperSearchInput').value = '';
    document.getElementById('paperRoleFilter').value = 'all';
    document.getElementById('paperStatusFilter').value = 'all';
    filterSavedPapers();
}

// Open Review Modal
function openReviewModal(paperId) {
    var paper = allSavedPapers.find(function(p) { return p.id === paperId; });
    if (!paper) return;

    document.getElementById('reviewModalTitle').textContent = paper.title;
    document.getElementById('reviewModalMeta').textContent = 
        `Taken on ${paper.date} • Track: ${paper.role} • Score: ${paper.score}% (${paper.score >= 70 ? 'Passed' : 'Needs Practice'})`;

    var container = document.getElementById('reviewQuestionsList');
    var html = '';

    if (!paper.questions || paper.questions.length === 0) {
        html = '<p style="color:#64748b; padding:20px; text-align:center;">Detailed question breakdown is not available for this legacy attempt.</p>';
    } else {
        paper.questions.forEach(function(q) {
            var isCorrect = q.isCorrect;
            var statusIcon = isCorrect ? '✅ Correct' : '❌ Incorrect';
            var statusColor = isCorrect ? '#15803d' : '#b91c1c';

            var optionsHtml = '';
            q.options.forEach(function(opt, idx) {
                var isSelected = (idx === q.selectedOption);
                var isRightAnswer = (idx === q.correctOption);

                var badge = '';
                var optStyle = 'background:#f8fafc; border:1px solid #e2e8f0; color:#334155;';

                if (isRightAnswer) {
                    optStyle = 'background:#f0fdf4; border:1.5px solid #22c55e; color:#14532d; font-weight:700;';
                    badge = '<span style="color:#16a34a; font-size:0.75rem; margin-left:8px;">(Correct Answer)</span>';
                }
                if (isSelected && !isRightAnswer) {
                    optStyle = 'background:#fef2f2; border:1.5px solid #ef4444; color:#991b1b;';
                    badge = '<span style="color:#dc2626; font-size:0.75rem; margin-left:8px;">(Your Choice)</span>';
                } else if (isSelected && isRightAnswer) {
                    badge = '<span style="color:#16a34a; font-size:0.75rem; margin-left:8px;">(Your Correct Choice)</span>';
                }

                optionsHtml += `
                    <div style="padding:8px 12px; border-radius:6px; margin-bottom:6px; font-size:0.85rem; ${optStyle}">
                        ${String.fromCharCode(65 + idx)}. ${escapeHtml(opt)} ${badge}
                    </div>
                `;
            });

            html += `
                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:18px; margin-bottom:14px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span style="font-weight:700; color:#2563eb;">Q${q.qNo}. ${escapeHtml(q.topic)}</span>
                        <span style="font-weight:700; color:${statusColor}; font-size:0.85rem;">${statusIcon}</span>
                    </div>
                    <p style="font-size:0.95rem; font-weight:600; color:#0f172a; margin-bottom:12px;">${escapeHtml(q.question)}</p>
                    <div style="margin-bottom:10px;">${optionsHtml}</div>
                    <div style="background:#f8fafc; border-left:3px solid #2563eb; padding:8px 12px; font-size:0.82rem; color:#475569;">
                        <strong>💡 AI Explanation:</strong> ${escapeHtml(q.explanation || 'Reviewed concept.')}
                    </div>
                </div>
            `;
        });
    }

    container.innerHTML = html;

    document.getElementById('reviewModalDownloadBtn').onclick = function() {
        downloadSavedReport(paper.id);
    };

    document.getElementById('reviewPaperModal').classList.remove('hidden');
}

function closeReviewModal() {
    document.getElementById('reviewPaperModal').classList.add('hidden');
}

// Download printable report
function downloadSavedReport(paperId) {
    var paper = allSavedPapers.find(function(p) { return p.id === paperId; });
    if (!paper) return;

    var text = `================================================================================
             AI PERSONALIZED MOCK INTERVIEW SYSTEM — EXAMINATION REPORT
================================================================================
Assessment Title:   ${paper.title}
Date Attempted:     ${paper.date}
Target Job Track:   ${paper.role}
Difficulty Tier:    ${paper.level}
Final Score:        ${paper.score}% [${paper.score >= 70 ? 'PASSED / CLEARED' : 'NEEDS PRACTICE'}]
Questions Answered: ${paper.totalQuestions || (paper.questions ? paper.questions.length : 5)}
Correct Answers:    ${paper.correctCount || 0}
Weak Topics:        ${paper.weakTopics && paper.weakTopics.length > 0 ? paper.weakTopics.join(', ') : 'None (Mastery demonstrated)'}
================================================================================

QUESTION-BY-QUESTION BREAKDOWN & REVIEW:
`;

    if (paper.questions) {
        paper.questions.forEach(function(q) {
            var selectedText = (q.selectedOption >= 0 && q.options[q.selectedOption]) ? q.options[q.selectedOption] : 'Not answered';
            var correctText = q.options[q.correctOption];
            text += `
--------------------------------------------------------------------------------
Q${q.qNo} [Topic: ${q.topic}] — Result: ${q.isCorrect ? 'CORRECT' : 'INCORRECT'}
Question: ${q.question}

Your Answer:    ${selectedText}
Correct Answer: ${correctText}
AI Explanation: ${q.explanation}
`;
        });
    }

    text += `
================================================================================
Generated via PrepAI Platform for Candidate Technical Preparation.
================================================================================
`;

    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = (paper.role ? paper.role.replace(/\s+/g, '_') : 'Exam') + '_Report_' + paper.date.replace(/[\s,]+/g, '_') + '.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// Delete paper
function deleteSavedPaper(paperId) {
    if (confirm("Delete this saved exam report from your history?")) {
        allSavedPapers = allSavedPapers.filter(function(p) { return p.id !== paperId; });
        localStorage.setItem('prepAiSavedPapers', JSON.stringify(allSavedPapers));
        filterSavedPapers();
        updateMetrics();
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return text.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
