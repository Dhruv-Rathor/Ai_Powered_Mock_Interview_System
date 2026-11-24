// B.Tech PYQ Portal — Exclusively shows downloaded placement PDFs from C:\Users\Dhruv\Desktop\mnproject2\pyqs
// Each paper redirects directly to the real PDF file

document.addEventListener('DOMContentLoaded', function() {
    initPyqPortal();
});

var downloadedPdfsList = [];
var currentFilteredPyqs = [];

async function initPyqPortal() {
    // Populate user profile info in sidebar
    var user = JSON.parse(localStorage.getItem('prepAiActiveUser') || '{}');
    if (user.name) {
        var sideName   = document.getElementById('sideUserName');
        var sideAvatar = document.getElementById('sideAvatar');
        if (sideName)   sideName.textContent   = user.name;
        if (sideAvatar) sideAvatar.textContent = user.name.charAt(0).toUpperCase();
    }

    var container = document.getElementById('pyqGridContainer');
    if (container) {
        container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#64748b;font-weight:600;">Loading downloaded placement PDFs...</div>';
    }

    // Fetch exclusively downloaded PDFs from backend
    try {
        var res = await fetch('/api/pyqs/downloaded-pdfs');
        var data = await res.json();
        if (data && data.success && data.files && data.files.length > 0) {
            downloadedPdfsList = data.files.map(function(pdf) {
                return {
                    id: pdf.id,
                    filename: pdf.filename,
                    title: pdf.company + ' Campus Placement Paper (' + pdf.year + ')',
                    company: pdf.company,
                    year: pdf.year,
                    difficulty: 'Placement Exam',
                    size: pdf.size,
                    pdfUrl: pdf.url,
                    description: 'Official campus recruitment paper for ' + pdf.company + ' (' + pdf.size + '). Includes technical coding rounds, aptitude challenges, and selection guidelines.'
                };
            });
        } else {
            downloadedPdfsList = [];
        }
    } catch (e) {
        console.error("Error loading downloaded PDFs:", e);
        downloadedPdfsList = [];
    }

    currentFilteredPyqs = downloadedPdfsList.slice();
    renderPyqCards(currentFilteredPyqs);
    updateStatsCounter();
}

function updateStatsCounter() {
    var countEl = document.getElementById('pyqResultsCount');
    if (countEl) {
        countEl.textContent = currentFilteredPyqs.length + ' Downloaded Placement Papers Available';
    }
}

function renderPyqCards(papers) {
    var container = document.getElementById('pyqGridContainer');
    if (!container) return;

    if (papers.length === 0) {
        container.innerHTML = '<div class="empty-pyq-state">' +
            '<span style="font-size:3rem;">🔍</span>' +
            '<h3>No Placement Papers Found</h3>' +
            '<p>Try clearing your search query or selecting "All Companies".</p>' +
            '<button type="button" class="btn-primary-action" onclick="resetFilters()">Reset Filter</button>' +
            '</div>';
        return;
    }

    var html = '';
    papers.forEach(function(paper) {
        html += '<div class="pyq-card">' +
            '<div class="pyq-header">' +
                '<div>' +
                    '<span class="pyq-company-tag" style="background:#eff6ff;color:#1d4ed8;font-weight:700;">🏢 ' + escapeHtml(paper.company) + '</span>' +
                    '<span style="background:#fee2e2;color:#991b1b;font-size:0.72rem;font-weight:700;padding:2px 8px;border-radius:12px;margin-left:6px;">PDF Document</span>' +
                '</div>' +
                '<span class="pyq-diff-badge diff-medium">' + escapeHtml(paper.size) + '</span>' +
            '</div>' +
            '<h3 class="pyq-title">' + escapeHtml(paper.title) + '</h3>' +
            '<p class="pyq-desc">' + escapeHtml(paper.description) + '</p>' +
            '<div class="pyq-meta-row">' +
                '<span>📅 Drive Year: <strong>' + escapeHtml(paper.year) + '</strong></span>' +
                '<span>📁 File: <strong>' + escapeHtml(paper.filename) + '</strong></span>' +
            '</div>' +
            '<div class="pyq-card-footer">' +
                '<button type="button" class="btn-pyq-view-pdf" onclick="window.open(\'' + paper.pdfUrl + '\', \'_blank\')" style="width:100%;padding:11px 16px;font-size:0.9rem;font-weight:700;background:linear-gradient(135deg,#0284c7,#2563eb);border:none;border-radius:8px;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">' +
                    '📄 Open PDF' +
                '</button>' +
            '</div>' +
        '</div>';
    });

    container.innerHTML = html;
}

// Live Filter Handler (By Company and Search Query Only)
function filterPyqs() {
    var searchVal  = (document.getElementById('pyqSearchInput').value || '').trim().toLowerCase();
    var companyVal = document.getElementById('pyqCompanyFilter').value;

    currentFilteredPyqs = downloadedPdfsList.filter(function(paper) {
        var matchSearch = true;
        if (searchVal) {
            var searchInCompany = paper.company.toLowerCase().indexOf(searchVal) !== -1;
            var searchInTitle   = paper.title.toLowerCase().indexOf(searchVal) !== -1;
            var searchInFile    = paper.filename.toLowerCase().indexOf(searchVal) !== -1;
            var searchInYear    = paper.year.toString().indexOf(searchVal) !== -1;
            var searchInDesc    = paper.description.toLowerCase().indexOf(searchVal) !== -1;
            matchSearch = searchInCompany || searchInTitle || searchInFile || searchInYear || searchInDesc;
        }

        var matchCompany = (companyVal === 'all') || (paper.company.toLowerCase() === companyVal.toLowerCase());

        return matchSearch && matchCompany;
    });

    renderPyqCards(currentFilteredPyqs);
    updateStatsCounter();
}

function resetFilters() {
    document.getElementById('pyqSearchInput').value   = '';
    document.getElementById('pyqCompanyFilter').value = 'all';
    filterPyqs();
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
