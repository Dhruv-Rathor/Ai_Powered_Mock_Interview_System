// B.Tech PYQ Search, Filter & PDF View Engine
// NO download buttons — view as PDF only

document.addEventListener('DOMContentLoaded', function() {
    initPyqPortal();
});

var currentFilteredPyqs = [];
var currentOpenPaperId  = null;

function initPyqPortal() {
    var user = JSON.parse(localStorage.getItem('prepAiActiveUser') || '{}');
    if (user.name) {
        var sideName   = document.getElementById('sideUserName');
        var sideAvatar = document.getElementById('sideAvatar');
        if (sideName)   sideName.textContent   = user.name;
        if (sideAvatar) sideAvatar.textContent = user.name.charAt(0).toUpperCase();
    }

    currentFilteredPyqs = btechPyqDatabase.slice();
    renderPyqCards(currentFilteredPyqs);
    updateStatsCounter();
}

function updateStatsCounter() {
    var countEl = document.getElementById('pyqResultsCount');
    if (countEl) countEl.textContent = currentFilteredPyqs.length + ' Papers Available';
}

function renderPyqCards(pyqs) {
    var container = document.getElementById('pyqGridContainer');
    if (!container) return;

    if (pyqs.length === 0) {
        container.innerHTML = '<div class="empty-pyq-state">' +
            '<span style="font-size:3rem;">🔍</span>' +
            '<h3>No Matching Question Papers Found</h3>' +
            '<p>Try clearing your search keyword or switching the subject/company filter.</p>' +
            '<button type="button" class="btn-primary-action" onclick="resetFilters()">Reset All Filters</button>' +
            '</div>';
        return;
    }

    var html = '';
    pyqs.forEach(function(paper) {
        var diffClass = 'diff-medium';
        if (paper.difficulty.toLowerCase().includes('easy')) diffClass = 'diff-easy';
        if (paper.difficulty.toLowerCase().includes('hard')) diffClass = 'diff-hard';

        html += '<div class="pyq-card">' +
            '<div class="pyq-header">' +
                '<div>' +
                    '<span class="pyq-tag">' + escapeHtml(paper.subject) + '</span>' +
                    '<span class="pyq-company-tag">' + escapeHtml(paper.company) + '</span>' +
                '</div>' +
                '<span class="pyq-diff-badge ' + diffClass + '">' + escapeHtml(paper.difficulty) + '</span>' +
            '</div>' +
            '<h3 class="pyq-title">' + escapeHtml(paper.title) + '</h3>' +
            '<p class="pyq-desc">' + escapeHtml(paper.description) + '</p>' +
            '<div class="pyq-meta-row">' +
                '<span>📅 Year: <strong>' + paper.year + '</strong></span>' +
                '<span>⏱️ ' + escapeHtml(paper.duration) + '</span>' +
                '<span>❓ ' + paper.questions.length + ' Questions</span>' +
                '<span>💯 ' + paper.totalMarks + ' Marks</span>' +
            '</div>' +
            '<div class="pyq-card-footer">' +
                '<button type="button" class="btn-pyq-preview" onclick="openPyqModal(\'' + paper.id + '\')">' +
                    '👁️ View Paper &amp; Solutions' +
                '</button>' +
                '<button type="button" class="btn-pyq-view-pdf" onclick="openPyqAsPdf(\'' + paper.id + '\')">' +
                    '📄 Open as PDF' +
                '</button>' +
            '</div>' +
        '</div>';
    });

    container.innerHTML = html;
}

// Live Filter Handler
function filterPyqs() {
    var searchVal  = (document.getElementById('pyqSearchInput').value || '').trim().toLowerCase();
    var subjectVal = document.getElementById('pyqSubjectFilter').value;
    var companyVal = document.getElementById('pyqCompanyFilter').value;

    currentFilteredPyqs = btechPyqDatabase.filter(function(paper) {
        var matchSearch = true;
        if (searchVal) {
            matchSearch = paper.title.toLowerCase().indexOf(searchVal) !== -1 ||
                paper.description.toLowerCase().indexOf(searchVal) !== -1 ||
                paper.subject.toLowerCase().indexOf(searchVal) !== -1 ||
                paper.company.toLowerCase().indexOf(searchVal) !== -1 ||
                paper.questions.some(function(q) {
                    return q.question.toLowerCase().indexOf(searchVal) !== -1 ||
                           q.topic.toLowerCase().indexOf(searchVal) !== -1;
                });
        }
        var matchSubject = (subjectVal === 'all') || (paper.subject === subjectVal);
        var matchCompany = (companyVal === 'all') || (paper.company.toLowerCase().indexOf(companyVal.toLowerCase()) !== -1);
        return matchSearch && matchSubject && matchCompany;
    });

    renderPyqCards(currentFilteredPyqs);
    updateStatsCounter();
}

function resetFilters() {
    document.getElementById('pyqSearchInput').value  = '';
    document.getElementById('pyqSubjectFilter').value = 'all';
    document.getElementById('pyqCompanyFilter').value = 'all';
    filterPyqs();
}

// Open Detail Modal (view questions in-page)
function openPyqModal(paperId) {
    var paper = btechPyqDatabase.find(function(p) { return p.id === paperId; });
    if (!paper) return;

    currentOpenPaperId = paperId;

    document.getElementById('modalPaperTitle').textContent = paper.title;
    document.getElementById('modalPaperMeta').textContent =
        paper.company + ' • ' + paper.subject + ' • ' + paper.year +
        ' • ' + paper.duration + ' • Total Marks: ' + paper.totalMarks;

    var qListEl = document.getElementById('modalQuestionsList');
    var qHtml = '';

    paper.questions.forEach(function(q) {
        var codeBlock = '';
        if (q.code && q.code.trim()) {
            codeBlock = '<div class="solution-code">' +
                '<div class="code-badge">Code / SQL / Approach:</div>' +
                '<pre><code>' + escapeHtml(q.code) + '</code></pre>' +
            '</div>';
        }

        qHtml += '<div class="modal-q-item">' +
            '<div class="q-item-header">' +
                '<span class="q-num">Q' + q.qNo + '.</span>' +
                '<span class="q-topic-tag">' + escapeHtml(q.topic) + '</span>' +
            '</div>' +
            '<h4 class="q-text">' + escapeHtml(q.question) + '</h4>' +
            '<div class="q-solution-box">' +
                '<strong class="sol-heading">💡 Solution &amp; Technical Explanation:</strong>' +
                '<p class="sol-text">' + escapeHtml(q.answer).replace(/\n/g, '<br>') + '</p>' +
                codeBlock +
            '</div>' +
        '</div>';
    });

    qListEl.innerHTML = qHtml;
    document.getElementById('pyqDetailModal').classList.remove('hidden');
}

function closePyqModal() {
    document.getElementById('pyqDetailModal').classList.add('hidden');
    currentOpenPaperId = null;
}

// Open current paper from modal as PDF view
function openCurrentPaperAsPdf() {
    if (currentOpenPaperId) {
        openPyqAsPdf(currentOpenPaperId);
    }
}

// Open PYQ paper as a clean printable PDF-style view in a new tab
function openPyqAsPdf(paperId) {
    var paper = btechPyqDatabase.find(function(p) { return p.id === paperId; });
    if (!paper) return;

    var questionsHtml = '';
    paper.questions.forEach(function(q) {
        var codeSection = '';
        if (q.code && q.code.trim()) {
            codeSection = '<div style="background:#f1f5f9;border-left:4px solid #3b82f6;padding:12px 16px;border-radius:4px;margin-top:10px;font-family:monospace;font-size:0.85rem;white-space:pre-wrap;">' +
                escapeHtmlRaw(q.code) + '</div>';
        }
        questionsHtml += '<div style="border:1px solid #e2e8f0;border-radius:10px;padding:20px 24px;margin-bottom:18px;page-break-inside:avoid;">' +
            '<div style="display:flex;justify-content:space-between;margin-bottom:8px;">' +
                '<span style="font-size:0.75rem;font-weight:800;color:#3b82f6;letter-spacing:1px;text-transform:uppercase;">Question ' + q.qNo + '</span>' +
                '<span style="font-size:0.75rem;font-weight:600;color:#64748b;background:#f1f5f9;padding:3px 10px;border-radius:12px;">' + escapeHtmlRaw(q.topic) + '</span>' +
            '</div>' +
            '<p style="font-size:0.95rem;font-weight:700;color:#1e293b;margin:0 0 12px;line-height:1.6;">' + escapeHtmlRaw(q.question) + '</p>' +
            '<div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:12px 16px;border-radius:4px;">' +
                '<div style="font-size:0.75rem;font-weight:800;color:#166534;margin-bottom:6px;">✓ ANSWER &amp; EXPLANATION</div>' +
                '<p style="font-size:0.875rem;color:#15803d;margin:0;line-height:1.65;">' + escapeHtmlRaw(q.answer).replace(/\n/g, '<br>') + '</p>' +
            '</div>' +
            codeSection +
        '</div>';
    });

    var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">' +
        '<title>' + escapeHtmlRaw(paper.title) + ' — PYQ Paper</title>' +
        '<style>' +
            'body{font-family:"Segoe UI",system-ui,sans-serif;max-width:860px;margin:0 auto;padding:40px 32px;color:#1e293b;line-height:1.6;}' +
            '@media print{body{max-width:100%;padding:20px;} .no-print{display:none;}}' +
            'h1{font-size:1.6rem;font-weight:800;margin:0 0 4px;}' +
            '.meta-row{display:flex;flex-wrap:wrap;gap:12px;margin:16px 0 32px;border-top:2px solid #2563eb;padding-top:14px;}' +
            '.meta-pill{font-size:0.8rem;font-weight:600;background:#eff6ff;color:#1d4ed8;padding:5px 14px;border-radius:20px;}' +
            '.section-label{font-size:0.75rem;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#64748b;margin-bottom:16px;}' +
            '.print-btn{background:#2563eb;color:#fff;border:none;padding:10px 24px;border-radius:8px;font-size:0.875rem;font-weight:700;cursor:pointer;margin-bottom:28px;}' +
            '.print-btn:hover{background:#1d4ed8;}' +
            '.footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:0.75rem;color:#94a3b8;text-align:center;}' +
        '</style></head><body>' +
        '<div class="no-print">' +
            '<button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>' +
        '</div>' +
        '<div style="border-left:5px solid #2563eb;padding-left:16px;margin-bottom:4px;">' +
            '<div style="font-size:0.72rem;font-weight:800;color:#2563eb;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">B.Tech PYQ Repository — MockAI</div>' +
            '<h1>' + escapeHtmlRaw(paper.title) + '</h1>' +
            '<p style="color:#64748b;font-size:0.875rem;margin:4px 0 0;">' + escapeHtmlRaw(paper.description) + '</p>' +
        '</div>' +
        '<div class="meta-row">' +
            '<span class="meta-pill">🏢 ' + escapeHtmlRaw(paper.company) + '</span>' +
            '<span class="meta-pill">📚 ' + escapeHtmlRaw(paper.subject) + '</span>' +
            '<span class="meta-pill">📅 Year: ' + paper.year + '</span>' +
            '<span class="meta-pill">⏱️ ' + escapeHtmlRaw(paper.duration) + '</span>' +
            '<span class="meta-pill">❓ ' + paper.questions.length + ' Questions</span>' +
            '<span class="meta-pill">💯 ' + paper.totalMarks + ' Marks</span>' +
            '<span class="meta-pill">📊 ' + escapeHtmlRaw(paper.difficulty) + '</span>' +
        '</div>' +
        '<div class="section-label">Questions &amp; Detailed Solutions</div>' +
        questionsHtml +
        '<div class="footer">Generated by AI Powered Mock Interview System · GLA University, Mathura · ' +
        new Date().toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' }) + '</div>' +
        '</body></html>';

    var newWin = window.open('', '_blank');
    if (newWin) {
        newWin.document.write(html);
        newWin.document.close();
    } else {
        alert('Pop-up was blocked. Please allow pop-ups for this site and try again.');
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

function escapeHtmlRaw(text) {
    if (!text) return '';
    return text.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
