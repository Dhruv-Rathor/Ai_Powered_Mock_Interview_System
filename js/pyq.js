// B.Tech PYQ Search, Filter & Download Engine

document.addEventListener('DOMContentLoaded', function() {
    initPyqPortal();
});

var currentFilteredPyqs = [];

function initPyqPortal() {
    // Populate user profile info in sidebar
    var user = JSON.parse(localStorage.getItem('prepAiActiveUser') || '{}');
    if (user.name) {
        var sideName = document.getElementById('sideUserName');
        var sideAvatar = document.getElementById('sideAvatar');
        if (sideName) sideName.textContent = user.name;
        if (sideAvatar) sideAvatar.textContent = user.name.charAt(0).toUpperCase();
    }

    currentFilteredPyqs = btechPyqDatabase.slice();
    renderPyqCards(currentFilteredPyqs);
    updateStatsCounter();
}

function updateStatsCounter() {
    var countEl = document.getElementById('pyqResultsCount');
    if (countEl) {
        countEl.textContent = currentFilteredPyqs.length + ' Papers Available';
    }
}

function renderPyqCards(pyqs) {
    var container = document.getElementById('pyqGridContainer');
    if (!container) return;

    if (pyqs.length === 0) {
        container.innerHTML = `
            <div class="empty-pyq-state">
                <span style="font-size: 3rem;">🔍</span>
                <h3>No Matching Question Papers Found</h3>
                <p>Try clearing your search keyword or switching the subject/company filter.</p>
                <button type="button" class="btn-primary-action" onclick="resetFilters()">Reset All Filters</button>
            </div>
        `;
        return;
    }

    var html = '';
    pyqs.forEach(function(paper) {
        var diffClass = 'diff-medium';
        if (paper.difficulty.toLowerCase().includes('easy')) diffClass = 'diff-easy';
        if (paper.difficulty.toLowerCase().includes('hard')) diffClass = 'diff-hard';

        html += `
            <div class="pyq-card">
                <div class="pyq-header">
                    <div>
                        <span class="pyq-tag">${escapeHtml(paper.subject)}</span>
                        <span class="pyq-company-tag">${escapeHtml(paper.company)}</span>
                    </div>
                    <span class="pyq-diff-badge ${diffClass}">${escapeHtml(paper.difficulty)}</span>
                </div>

                <h3 class="pyq-title">${escapeHtml(paper.title)}</h3>
                <p class="pyq-desc">${escapeHtml(paper.description)}</p>

                <div class="pyq-meta-row">
                    <span>📅 Year: <strong>${paper.year}</strong></span>
                    <span>⏱️ ${escapeHtml(paper.duration)}</span>
                    <span>❓ ${paper.questions.length} Questions</span>
                    <span>💯 ${paper.totalMarks} Marks</span>
                </div>

                <div class="pyq-card-footer">
                    <button type="button" class="btn-pyq-preview" onclick="openPyqModal('${paper.id}')">
                        👁️ View Paper & Solutions
                    </button>
                    <button type="button" class="btn-pyq-download" onclick="downloadPyqPaper('${paper.id}')" title="Download Printable Paper">
                        📥 Download Paper
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Live Filter Handler
function filterPyqs() {
    var searchVal = (document.getElementById('pyqSearchInput').value || '').trim().toLowerCase();
    var subjectVal = document.getElementById('pyqSubjectFilter').value;
    var companyVal = document.getElementById('pyqCompanyFilter').value;

    currentFilteredPyqs = btechPyqDatabase.filter(function(paper) {
        var matchSearch = true;
        if (searchVal) {
            var searchInTitle = paper.title.toLowerCase().indexOf(searchVal) !== -1;
            var searchInDesc = paper.description.toLowerCase().indexOf(searchVal) !== -1;
            var searchInSubject = paper.subject.toLowerCase().indexOf(searchVal) !== -1;
            var searchInCompany = paper.company.toLowerCase().indexOf(searchVal) !== -1;
            var searchInQuestions = paper.questions.some(function(q) {
                return q.question.toLowerCase().indexOf(searchVal) !== -1 ||
                       q.topic.toLowerCase().indexOf(searchVal) !== -1;
            });
            matchSearch = searchInTitle || searchInDesc || searchInSubject || searchInCompany || searchInQuestions;
        }

        var matchSubject = (subjectVal === 'all') || (paper.subject === subjectVal);
        var matchCompany = (companyVal === 'all') || (paper.company.toLowerCase().indexOf(companyVal.toLowerCase()) !== -1);

        return matchSearch && matchSubject && matchCompany;
    });

    renderPyqCards(currentFilteredPyqs);
    updateStatsCounter();
}

function resetFilters() {
    document.getElementById('pyqSearchInput').value = '';
    document.getElementById('pyqSubjectFilter').value = 'all';
    document.getElementById('pyqCompanyFilter').value = 'all';
    filterPyqs();
}

// Open Detail Modal
function openPyqModal(paperId) {
    var paper = btechPyqDatabase.find(function(p) { return p.id === paperId; });
    if (!paper) return;

    document.getElementById('modalPaperTitle').textContent = paper.title;
    document.getElementById('modalPaperMeta').textContent = 
        `${paper.company} • ${paper.subject} • ${paper.year} • ${paper.duration} • Total Marks: ${paper.totalMarks}`;

    var qListEl = document.getElementById('modalQuestionsList');
    var qHtml = '';

    paper.questions.forEach(function(q) {
        var codeBlock = '';
        if (q.code && q.code.trim()) {
            codeBlock = `
                <div class="solution-code">
                    <div class="code-badge">Code / SQL / Approach:</div>
                    <pre><code>${escapeHtml(q.code)}</code></pre>
                </div>
            `;
        }

        qHtml += `
            <div class="modal-q-item">
                <div class="q-item-header">
                    <span class="q-num">Q${q.qNo}.</span>
                    <span class="q-topic-tag">${escapeHtml(q.topic)}</span>
                </div>
                <h4 class="q-text">${escapeHtml(q.question)}</h4>
                <div class="q-solution-box">
                    <strong class="sol-heading">💡 Solution & Technical Explanation:</strong>
                    <p class="sol-text">${escapeHtml(q.answer).replace(/\n/g, '<br>')}</p>
                    ${codeBlock}
                </div>
            </div>
        `;
    });

    qListEl.innerHTML = qHtml;

    // Attach current paper ID to modal download button
    document.getElementById('modalDownloadBtn').onclick = function() {
        downloadPyqPaper(paper.id);
    };

    document.getElementById('pyqDetailModal').classList.remove('hidden');
}

function closePyqModal() {
    document.getElementById('pyqDetailModal').classList.add('hidden');
}

// DOWNLOAD PYQ PAPER
function downloadPyqPaper(paperId) {
    var paper = btechPyqDatabase.find(function(p) { return p.id === paperId; });
    if (!paper) return;

    var textContent = `================================================================================
                 B.TECH TECHNICAL INTERVIEW & EXAM PREPARATION
                 PREVIOUS YEAR QUESTION (PYQ) PAPER
================================================================================
Title:        ${paper.title}
Subject:      ${paper.subject}
Company/Exam: ${paper.company}
Year:         ${paper.year}
Target Track: ${paper.targetRole}
Difficulty:   ${paper.difficulty}
Duration:     ${paper.duration} | Maximum Marks: ${paper.totalMarks}
Description:  ${paper.description}
================================================================================

QUESTIONS & DETAILED TECHNICAL SOLUTIONS:
`;

    paper.questions.forEach(function(q) {
        textContent += `
--------------------------------------------------------------------------------
QUESTION ${q.qNo} [Topic: ${q.topic}]
--------------------------------------------------------------------------------
Q: ${q.question}

ANSWER & DETAILED EXPLANATION:
${q.answer}
`;
        if (q.code && q.code.trim()) {
            textContent += `
CODE / QUERY / IMPLEMENTATION:
${q.code}
`;
        }
    });

    textContent += `
================================================================================
Generated via AI Personalized Mock Interview System
Prepared for B.Tech Technical Placements (Campus & Off-Campus Drives)
Good Luck with your Preparation!
================================================================================
`;

    // Trigger download in browser
    var blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    var filename = paper.id + '-' + paper.year + '-interview-paper.txt';
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// Download All PYQs Bundle
function downloadAllPyqsBundle() {
    var bundleText = `================================================================================
           ALL-IN-ONE B.TECH INTERVIEW & CAMPUS PLACEMENT PYQ MEGA BUNDLE
                   AI PERSONALIZED MOCK INTERVIEW SYSTEM
================================================================================
Total Papers Included: ${btechPyqDatabase.length}
Subjects Covered: Data Structures, Operating Systems, DBMS, Networks, Java, TCS, Infosys, Amazon, Wipro, Cognizant
Generated At: ${new Date().toLocaleDateString()}
================================================================================\n\n`;

    btechPyqDatabase.forEach(function(paper, idx) {
        bundleText += `
################################################################################
PAPER #${idx + 1}: ${paper.title}
Company / Exam: ${paper.company} | Subject: ${paper.subject} | Year: ${paper.year}
Difficulty: ${paper.difficulty} | Total Marks: ${paper.totalMarks}
################################################################################\n`;

        paper.questions.forEach(function(q) {
            bundleText += `
Q${q.qNo} [${q.topic}]:
${q.question}

Solution:
${q.answer}
`;
            if (q.code) {
                bundleText += `\nCode Snippet / Query:\n${q.code}\n`;
            }
        });
        bundleText += `\n\n`;
    });

    var blob = new Blob([bundleText], { type: 'text/plain;charset=utf-8' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'BTech-Placement-PYQ-Complete-Bundle.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
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
