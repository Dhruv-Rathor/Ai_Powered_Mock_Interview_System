// Auth & Credential Validation Engine for AI Interview System

// Seed default demo profile if not already present
(function seedDefaultProfiles() {
    var profiles = JSON.parse(localStorage.getItem('prepAiProfiles') || '{}');
    if (!profiles['dhruv@gla.ac.in']) {
        profiles['dhruv@gla.ac.in'] = {
            name: 'Dhruv Sharma',
            email: 'dhruv@gla.ac.in',
            password: 'Password@123',
            targetRole: 'frontend',
            experienceLevel: 'intermediate',
            focusGoal: 'campus_placements',
            dailyTarget: '15',
            joinedDate: new Date().toLocaleDateString(),
            onboardingComplete: true
        };
        localStorage.setItem('prepAiProfiles', JSON.stringify(profiles));
    }
})();

function showAlert(elementId, message, type) {
    var el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.className = 'auth-alert ' + (type || 'error');
    el.classList.remove('hidden');
}

function clearAlert(elementId) {
    var el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = '';
    el.classList.add('hidden');
}

function switchTab(tab) {
    var lForm = document.getElementById('loginForm');
    var rForm = document.getElementById('registerForm');
    var lTab = document.getElementById('tabLogin');
    var rTab = document.getElementById('tabRegister');

    clearAlert('loginAlert');
    clearAlert('registerAlert');

    if (tab === 'login') {
        lForm.classList.remove('hidden');
        rForm.classList.add('hidden');
        lTab.classList.add('active');
        rTab.classList.remove('active');
    } else {
        lForm.classList.add('hidden');
        rForm.classList.remove('hidden');
        rTab.classList.add('active');
        lTab.classList.remove('active');
    }
}

// Credential Validation Rules:
// 1. Name cannot be purely numbers, cannot be a single alphabet, must contain at least 2 letters.
function validateStudentName(name) {
    if (!name || typeof name !== 'string') {
        return { valid: false, error: 'Please enter your full name.' };
    }
    var trimmed = name.trim();
    if (trimmed.length < 2) {
        return { valid: false, error: 'Name cannot be a single alphabet. Must be at least 2 characters.' };
    }
    // Reject pure numbers
    if (/^\d+$/.test(trimmed)) {
        return { valid: false, error: 'Name cannot be a number. Please enter a valid student name.' };
    }
    // Reject single alphabet even with spaces
    var lettersOnly = trimmed.replace(/[^a-zA-Z]/g, '');
    if (lettersOnly.length < 2) {
        return { valid: false, error: 'Name must contain at least 2 alphabetic characters (e.g. John Doe).' };
    }
    // Reject numbers mixed into name if it looks like a phone number or serial
    if (/\d{3,}/.test(trimmed)) {
        return { valid: false, error: 'Name should not contain numerical sequences.' };
    }
    return { valid: true, error: null };
}

// 2. Password criteria: Minimum 8 characters, at least 1 letter, at least 1 number, at least 1 special character
function validateStudentPassword(password) {
    if (!password || typeof password !== 'string') {
        return { valid: false, error: 'Password is required.' };
    }
    if (password.length < 8) {
        return { valid: false, error: 'Password must be at least 8 characters long.' };
    }
    if (!/[a-zA-Z]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one alphabet letter (a-z or A-Z).' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one number (0-9).' };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one special character (!@#$%^&*...).' };
    }
    return { valid: true, error: null };
}

// Live validation feedback while typing name
function validateNameInput(val) {
    var hint = document.getElementById('nameHint');
    if (!hint) return;
    var check = validateStudentName(val);
    if (!val.trim()) {
        hint.style.color = '#64748b';
        hint.textContent = 'Must contain at least 2 letters. Cannot be purely numbers or a single letter.';
    } else if (!check.valid) {
        hint.style.color = '#dc2626';
        hint.textContent = '✕ ' + check.error;
    } else {
        hint.style.color = '#16a34a';
        hint.textContent = '✓ Valid student name';
    }
}

// Live validation feedback while typing password
function updatePasswordCriteria(password) {
    var lenEl = document.getElementById('reqLength');
    var letEl = document.getElementById('reqLetter');
    var numEl = document.getElementById('reqNumber');
    var speEl = document.getElementById('reqSpecial');

    if (!lenEl) return;

    function setReq(el, isMet, label) {
        if (isMet) {
            el.className = 'req-item met';
            el.innerHTML = '<span class="req-icon">✓</span> ' + label;
        } else {
            el.className = 'req-item unmet';
            el.innerHTML = '<span class="req-icon">✕</span> ' + label;
        }
    }

    setReq(lenEl, password.length >= 8, 'Minimum 8 characters');
    setReq(letEl, /[a-zA-Z]/.test(password), 'At least one letter (a-z, A-Z)');
    setReq(numEl, /[0-9]/.test(password), 'At least one number (0-9)');
    setReq(speEl, /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password), 'At least one special symbol (!@#$%^&*...)');
}

// Email format check
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// LOG IN HANDLER
function handleLogin(e) {
    e.preventDefault();
    clearAlert('loginAlert');

    var email = document.getElementById('loginEmail').value.trim();
    var pass = document.getElementById('loginPass').value;

    if (!email || !isValidEmail(email)) {
        showAlert('loginAlert', 'Please enter a valid email address (e.g. student@gla.ac.in).');
        return;
    }

    if (!pass) {
        showAlert('loginAlert', 'Please enter your password.');
        return;
    }

    var existingProfiles = JSON.parse(localStorage.getItem('prepAiProfiles') || '{}');
    var userProfile = existingProfiles[email];

    // If profile exists locally, verify password
    if (userProfile) {
        if (userProfile.password && userProfile.password !== pass) {
            showAlert('loginAlert', 'Incorrect password. Please verify your credentials or create a new profile.');
            return;
        }
        localStorage.setItem('prepAiActiveUser', JSON.stringify(userProfile));
        showAlert('loginAlert', 'Log in successful! Redirecting to Dashboard...', 'success');
        setTimeout(function() {
            window.location.href = 'dashboard.html';
        }, 500);
        return;
    }

    // Try backend verification if profile wasn't in localStorage
    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: pass })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.success && data.user) {
            var fullProfile = Object.assign({
                name: data.user.name || email.split('@')[0],
                email: email,
                password: pass,
                targetRole: data.user.targetRole || 'frontend',
                experienceLevel: 'intermediate',
                focusGoal: 'campus_placements',
                dailyTarget: '10',
                joinedDate: new Date().toLocaleDateString(),
                onboardingComplete: true
            }, data.user);

            existingProfiles[email] = fullProfile;
            localStorage.setItem('prepAiProfiles', JSON.stringify(existingProfiles));
            localStorage.setItem('prepAiActiveUser', JSON.stringify(fullProfile));
            showAlert('loginAlert', 'Log in successful! Redirecting...', 'success');
            setTimeout(function() { window.location.href = 'dashboard.html'; }, 500);
        } else {
            // First time user trying to log in directly -> prompt setup or registration
            window.tempUser = {
                name: email.split('@')[0],
                email: email,
                password: pass
            };
            document.getElementById('onboardingModal').classList.remove('hidden');
        }
    })
    .catch(function() {
        // Fallback for offline/first-time local login
        window.tempUser = {
            name: email.split('@')[0],
            email: email,
            password: pass
        };
        document.getElementById('onboardingModal').classList.remove('hidden');
    });
}

// REGISTER HANDLER
function handleRegister(e) {
    e.preventDefault();
    clearAlert('registerAlert');

    var name = document.getElementById('regName').value.trim();
    var email = document.getElementById('regEmail').value.trim();
    var pass = document.getElementById('regPass').value;

    // Validate Name
    var nameCheck = validateStudentName(name);
    if (!nameCheck.valid) {
        showAlert('registerAlert', nameCheck.error);
        return;
    }

    // Validate Email
    if (!email || !isValidEmail(email)) {
        showAlert('registerAlert', 'Please enter a valid college or work email address.');
        return;
    }

    // Check if user already exists
    var existingProfiles = JSON.parse(localStorage.getItem('prepAiProfiles') || '{}');
    if (existingProfiles[email]) {
        showAlert('registerAlert', 'An account with email "' + email + '" already exists. Please switch to Log In.');
        return;
    }

    // Validate Password
    var passCheck = validateStudentPassword(pass);
    if (!passCheck.valid) {
        showAlert('registerAlert', passCheck.error);
        return;
    }

    // Store temporary user data and open the onboarding questionnaire
    window.tempUser = {
        name: name,
        email: email,
        password: pass
    };

    document.getElementById('onboardingModal').classList.remove('hidden');
}

// SUBMIT ONBOARDING QUESTIONNAIRE
function submitOnboarding(e) {
    e.preventDefault();

    var targetRole = document.querySelector('input[name="targetRole"]:checked').value;
    var experienceLevel = document.querySelector('input[name="experienceLevel"]:checked').value;
    var focusGoal = document.querySelector('input[name="focusGoal"]:checked').value;
    var dailyTarget = document.getElementById('dailyTarget').value;

    var studentName = window.tempUser ? window.tempUser.name : 'Student';
    var studentEmail = window.tempUser ? window.tempUser.email : 'student@gla.ac.in';
    var studentPass = window.tempUser ? window.tempUser.password : 'Password@123';

    var fullProfile = {
        name: studentName,
        email: studentEmail,
        password: studentPass,
        targetRole: targetRole,
        experienceLevel: experienceLevel,
        focusGoal: focusGoal,
        dailyTarget: dailyTarget,
        joinedDate: new Date().toLocaleDateString(),
        onboardingComplete: true
    };

    // Save locally
    var existingProfiles = JSON.parse(localStorage.getItem('prepAiProfiles') || '{}');
    existingProfiles[fullProfile.email] = fullProfile;
    localStorage.setItem('prepAiProfiles', JSON.stringify(existingProfiles));
    localStorage.setItem('prepAiActiveUser', JSON.stringify(fullProfile));

    // Send to backend API
    fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullProfile)
    }).catch(function() {
        console.log("Local browser storage prioritized");
    });

    alert('Welcome ' + studentName + '! Your profile has been initialized with role: ' + targetRole.toUpperCase());
    window.location.href = 'dashboard.html';
}

function logout() {
    localStorage.removeItem('prepAiActiveUser');
    window.location.href = 'login.html';
}
