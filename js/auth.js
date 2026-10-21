function switchTab(tab) {
    var lForm = document.getElementById('loginForm');
    var rForm = document.getElementById('registerForm');
    var lTab = document.getElementById('tabLogin');
    var rTab = document.getElementById('tabRegister');

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

function handleLogin(e) {
    e.preventDefault();
    var email = document.getElementById('loginEmail').value.trim();
    var pass = document.getElementById('loginPass').value;

    if (!email || pass.length < 6) {
        alert("Please enter a valid email and password (minimum 6 characters).");
        return;
    }

    // Check if this user has already completed onboarding
    var existingProfiles = JSON.parse(localStorage.getItem('prepAiProfiles') || '{}');
    var userProfile = existingProfiles[email];

    if (!userProfile) {
        // FIRST TIME USER -> Prompt basic onboarding questions
        window.tempUser = {
            name: email.split('@')[0],
            email: email
        };
        document.getElementById('onboardingModal').classList.remove('hidden');
    } else {
        // Returning user -> store active session & go directly to dashboard
        localStorage.setItem('prepAiActiveUser', JSON.stringify(userProfile));
        window.location.href = 'dashboard.html';
    }
}

function handleRegister(e) {
    e.preventDefault();
    var name = document.getElementById('regName').value.trim();
    var email = document.getElementById('regEmail').value.trim();
    var pass = document.getElementById('regPass').value;

    if (!name || !email || pass.length < 6) {
        alert("Please fill all fields with a valid password.");
        return;
    }

    // New registration always triggers first-time questionnaire
    window.tempUser = {
        name: name,
        email: email
    };

    // Open Onboarding Modal
    document.getElementById('onboardingModal').classList.remove('hidden');
}

function submitOnboarding(e) {
    e.preventDefault();

    var targetRole = document.querySelector('input[name="targetRole"]:checked').value;
    var experienceLevel = document.querySelector('input[name="experienceLevel"]:checked').value;
    var focusGoal = document.querySelector('input[name="focusGoal"]:checked').value;
    var dailyTarget = document.getElementById('dailyTarget').value;

    var fullProfile = {
        name: window.tempUser ? window.tempUser.name : 'Student',
        email: window.tempUser ? window.tempUser.email : 'student@gla.ac.in',
        targetRole: targetRole,
        experienceLevel: experienceLevel,
        focusGoal: focusGoal,
        dailyTarget: dailyTarget,
        joinedDate: new Date().toLocaleDateString(),
        onboardingComplete: true
    };

    // Save to persistent user repository
    var existingProfiles = JSON.parse(localStorage.getItem('prepAiProfiles') || '{}');
    existingProfiles[fullProfile.email] = fullProfile;
    localStorage.setItem('prepAiProfiles', JSON.stringify(existingProfiles));

    // Save as currently active logged-in user
    localStorage.setItem('prepAiActiveUser', JSON.stringify(fullProfile));

    // Send to Node backend API if available
    fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullProfile)
    }).catch(function(err) {
        console.log("Local browser storage prioritized");
    });

    alert('Profile initialized! Loading your personalised Dashboard...');
    window.location.href = 'dashboard.html';
}
