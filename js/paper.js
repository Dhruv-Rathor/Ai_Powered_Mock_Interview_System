var currentSelectedRole = 'frontend';
var currentSelectedLevel = 'beginner';
var activeExamQuestions = [];
var examTimerInterval = null;

// Syllabus Topics for each role
var roleSyllabus = {
    frontend: ['HTML5 & Semantics', 'CSS Flexbox / Grid', 'JavaScript ES6+', 'React Hooks', 'DOM & Events'],
    backend: ['Node.js Event Loop', 'Express.js Routing', 'REST API Architecture', 'JWT Authentication', 'MongoDB Indexing'],
    java: ['OOPs Principles', 'Collections Framework', 'Exception Handling', 'Multithreading', 'Spring Boot Basics'],
    python: ['Python Data Types', 'List Comprehensions', 'Decorators & Generators', 'Django Architecture', 'DSA in Python']
};

// MCQ QUESTION BANK (with verified correct answers & topic tagging)
var mcqQuestionBank = {
    frontend: [
        {
            topic: "HTML5 & Semantics",
            q: "Which HTML5 element is most semantically appropriate for self-contained syndicatable content?",
            options: ["<div>", "<section>", "<article>", "<aside>"],
            answer: 2
        },
        {
            topic: "CSS Flexbox / Grid",
            q: "Which CSS Flexbox property aligns flex items along the cross axis?",
            options: ["justify-content", "align-items", "flex-direction", "align-content"],
            answer: 1
        },
        {
            topic: "JavaScript ES6+",
            q: "What is the key difference between '==' and '===' in JavaScript?",
            options: [
                "'==' compares references, '===' compares values",
                "'==' performs type coercion, '===' checks both value and type without coercion",
                "'===' is used only for numeric comparisons",
                "There is no difference in ES6"
            ],
            answer: 1
        },
        {
            topic: "React Hooks",
            q: "How does useEffect behave when passed an empty dependency array []?",
            options: [
                "It runs on every re-render",
                "It never executes",
                "It executes exactly once after the initial render",
                "It executes only before the component unmounts"
            ],
            answer: 2
        },
        {
            topic: "DOM & Events",
            q: "What mechanism allows a single event listener on a parent to handle events from child nodes?",
            options: ["Event Bubbling & Delegation", "Event Throttling", "Event Debouncing", "Event Interception"],
            answer: 0
        },
        {
            topic: "JavaScript ES6+",
            q: "What will `typeof NaN` evaluate to in JavaScript?",
            options: ["'undefined'", "'number'", "'NaN'", "'null'"],
            answer: 1
        },
        {
            topic: "React Hooks",
            q: "What is the primary purpose of the useMemo hook in React?",
            options: [
                "To memoize functions between renders",
                "To memoize computed values and prevent expensive recalculations",
                "To create a persistent mutable reference",
                "To handle API network calls"
            ],
            answer: 1
        }
    ],

    backend: [
        {
            topic: "Node.js Event Loop",
            q: "Node.js is described as single-threaded, yet handles concurrent I/O. Which underlying library provides its thread pool?",
            options: ["v8", "libuv", "libc", "openssl"],
            answer: 1
        },
        {
            topic: "Express.js Routing",
            q: "In an Express.js middleware function, what must be called to pass control to the next handler?",
            options: ["res.send()", "next()", "return true", "process.nextTick()"],
            answer: 1
        },
        {
            topic: "REST API Architecture",
            q: "Which HTTP status code represents '201'?",
            options: ["Accepted", "OK", "Created", "No Content"],
            answer: 2
        },
        {
            topic: "JWT Authentication",
            q: "Which part of a JSON Web Token (JWT) is cryptographically signed?",
            options: [
                "Header only",
                "Payload only",
                "Header and Payload combined using the secret key",
                "Signature only"
            ],
            answer: 2
        },
        {
            topic: "MongoDB Indexing",
            q: "What data structure does MongoDB primarily use for default B-tree single field indexing?",
            options: ["Hash Table", "B-Tree", "Linked List", "Radix Tree"],
            answer: 1
        }
    ],

    java: [
        {
            topic: "OOPs Principles",
            q: "Which Java OOP principle is demonstrated by method overloading?",
            options: ["Encapsulation", "Compile-time Polymorphism", "Runtime Polymorphism", "Abstraction"],
            answer: 1
        },
        {
            topic: "Collections Framework",
            q: "Which collection class maintains unique elements in their natural sorted order?",
            options: ["HashSet", "ArrayList", "TreeSet", "Vector"],
            answer: 2
        },
        {
            topic: "Exception Handling",
            q: "Which block in a Java try-catch statement will execute regardless of whether an exception occurs?",
            options: ["catch", "finally", "throw", "finalize"],
            answer: 1
        },
        {
            topic: "Multithreading",
            q: "What is the purpose of the 'volatile' keyword on a Java variable?",
            options: [
                "Makes the variable immutable",
                "Guarantees that reads and writes are done directly to main memory across threads",
                "Locks the object instance exclusively",
                "Prevents garbage collection"
            ],
            answer: 1
        },
        {
            topic: "Spring Boot Basics",
            q: "Which Spring Boot annotation combines @Configuration, @EnableAutoConfiguration, and @ComponentScan?",
            options: ["@SpringBootApplication", "@Component", "@Service", "@RestController"],
            answer: 0
        }
    ],

    python: [
        {
            topic: "Python Data Types",
            q: "What is the key difference between a Python List and a Tuple?",
            options: [
                "Lists use parentheses (), Tuples use brackets []",
                "Lists are mutable, Tuples are immutable",
                "Tuples cannot store integers",
                "There is no difference in Python 3"
            ],
            answer: 1
        },
        {
            topic: "List Comprehensions",
            q: "What does `[x**2 for x in range(4) if x % 2 == 0]` output?",
            options: ["[0, 4]", "[0, 1, 4, 9]", "[4]", "[0, 2]"],
            answer: 0
        },
        {
            topic: "Decorators & Generators",
            q: "Which keyword turns a Python function into a generator that produces values lazily?",
            options: ["return", "generate", "yield", "await"],
            answer: 2
        },
        {
            topic: "DSA in Python",
            q: "What is the average time complexity for searching a key in a Python dictionary?",
            options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
            answer: 2
        },
        {
            topic: "Django Architecture",
            q: "Which architectural pattern does Django adhere to?",
            options: ["MVC (Model-View-Controller)", "MVT (Model-View-Template)", "MVVM", "Microservices"],
            answer: 1
        }
    ]
};

window.addEventListener('DOMContentLoaded', function() {
    loadUserNav();
    onRoleChanged('frontend');
});

function loadUserNav() {
    var raw = localStorage.getItem('prepAiActiveUser');
    if (raw) {
        var user = JSON.parse(raw);
        document.getElementById('sideUserName').textContent = user.name || 'Student';
        document.getElementById('sideAvatar').textContent = (user.name || 'S').charAt(0).toUpperCase();

        if (user.targetRole && roleSyllabus[user.targetRole]) {
            document.getElementById('roleSelector').value = user.targetRole;
            onRoleChanged(user.targetRole);
        }
    }
}

function onRoleChanged(role) {
    currentSelectedRole = role;
    var roleNames = {
        frontend: 'Frontend Developer',
        backend: 'Backend Developer',
        java: 'Java Developer',
        python: 'Python Developer'
    };
    document.getElementById('selectedRoleLabel').textContent = roleNames[role] || 'Selected Role';

    // Populate role topics checkboxes
    var container = document.getElementById('roleTopicsContainer');
    var topics = roleSyllabus[role] || [];
    var html = '';
    topics.forEach(function(top) {
        html += '<label class="topic-option">' +
            '<input type="checkbox" value="' + top + '" checked> ' +
            '<span>' + top + '</span>' +
        '</label>';
    });
    container.innerHTML = html;
}

function setLevel(lvl) {
    currentSelectedLevel = lvl;
    document.getElementById('lvl-beginner').classList.remove('active');
    document.getElementById('lvl-intermediate').classList.remove('active');
    document.getElementById('lvl-advanced').classList.remove('active');
    document.getElementById('lvl-' + lvl).classList.add('active');
}

function toggleCustomCount(isCustom) {
    var box = document.getElementById('customCountBox');
    if (box) {
        if (isCustom) {
            box.classList.remove('hidden');
            document.getElementById('customInputVal').focus();
        } else {
            box.classList.add('hidden');
        }
    }
}

function toggleCustomTime(isCustom) {
    var box = document.getElementById('customTimeBox');
    if (box) {
        if (isCustom) {
            box.classList.remove('hidden');
            document.getElementById('customTimeVal').focus();
        } else {
            box.classList.add('hidden');
        }
    }
}

// -------------------------------------------------------------
// START GENERATED MCQ EXAM
// -------------------------------------------------------------
function startGeneratedExam() {
    var selectedRadio = document.querySelector('input[name="examQCount"]:checked').value;
    var count = 5;

    if (selectedRadio === 'custom') {
        var customVal = parseInt(document.getElementById('customInputVal').value);
        if (isNaN(customVal) || customVal < 1) {
            alert('Please enter a valid number of questions (at least 1).');
            return;
        }
        count = Math.min(customVal, 100);
    } else {
        count = parseInt(selectedRadio);
    }

    var pool = mcqQuestionBank[currentSelectedRole] || mcqQuestionBank.frontend;

    // Filter by selected topic checkboxes
    var checkedTopics = Array.from(document.querySelectorAll('#roleTopicsContainer input[type="checkbox"]:checked')).map(function(c) { return c.value; });
    var topicFiltered = pool.filter(function(q) {
        return checkedTopics.length === 0 || checkedTopics.indexOf(q.topic) !== -1;
    });
    if (topicFiltered.length === 0) topicFiltered = pool;

    // Generate pool to match requested count (repeat/cycle dynamically if count > available pool)
    var finalPool = [];
    while (finalPool.length < count) {
        var copy = topicFiltered.slice();
        for (var i = copy.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = copy[i];
            copy[i] = copy[j];
            copy[j] = temp;
        }
        finalPool = finalPool.concat(copy);
    }

    activeExamQuestions = finalPool.slice(0, count);

    // Switch Views
    document.getElementById('configCard').classList.add('hidden');
    document.getElementById('resultStage').classList.add('hidden');
    document.getElementById('examStage').classList.remove('hidden');

    // Setup Exam Header
    var roleNames = {
        frontend: 'Frontend Developer',
        backend: 'Backend Developer',
        java: 'Java Developer',
        python: 'Python Developer'
    };
    // Determine duration in total seconds
    var durationRadio = document.querySelector('input[name="examDuration"]:checked');
    var totalSeconds = 600; // default 10 mins
    var displayDurationLabel = "10 Mins";

    if (durationRadio) {
        if (durationRadio.value === 'custom') {
            var custVal = parseInt(document.getElementById('customTimeVal').value);
            var unit = document.getElementById('customTimeUnit').value; // 'seconds' or 'minutes'
            if (isNaN(custVal) || custVal < 1) custVal = 30;

            if (unit === 'seconds') {
                totalSeconds = Math.min(custVal, 3600); // max 1 hour in seconds
                displayDurationLabel = totalSeconds + " Secs";
            } else {
                var safeMins = Math.min(custVal, 120);
                totalSeconds = safeMins * 60;
                displayDurationLabel = safeMins + " Mins";
            }
        } else {
            var mins = parseInt(durationRadio.value);
            totalSeconds = mins * 60;
            displayDurationLabel = mins + " Mins";
        }
    }

    document.getElementById('examBannerTitle').textContent = roleNames[currentSelectedRole] + ' Assessment';
    document.getElementById('examBannerMeta').textContent = count + ' Questions • ' + displayDurationLabel + ' Time Limit • Pass criteria: 70%';

    // Render MCQ Cards
    var deckHtml = '';
    activeExamQuestions.forEach(function(item, qIdx) {
        var optionsHtml = '';
        item.options.forEach(function(opt, optIdx) {
            optionsHtml += '<label class="option-choice">' +
                '<input type="radio" name="q_' + qIdx + '" value="' + optIdx + '" required> ' +
                '<span>' + opt + '</span>' +
            '</label>';
        });

        deckHtml += '<div class="mcq-card">' +
            '<div class="mcq-head">' +
                '<span class="q-index-pill">Question ' + (qIdx + 1) + ' of ' + count + '</span>' +
                '<span class="q-topic-tag">Topic: ' + item.topic + '</span>' +
            '</div>' +
            '<div class="mcq-question">' + item.q + '</div>' +
            '<div class="options-list">' + optionsHtml + '</div>' +
        '</div>';
    });

    document.getElementById('mcqDeck').innerHTML = deckHtml;

    // Start Timer with the user-selected duration
    startExamTimer(totalSeconds);
}

function startExamTimer(seconds) {
    if (examTimerInterval) clearInterval(examTimerInterval);
    var remaining = seconds;
    var clock = document.getElementById('timerClock');

    examTimerInterval = setInterval(function() {
        remaining--;
        var mins = Math.floor(remaining / 60);
        var secs = remaining % 60;
        clock.textContent = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;

        if (remaining <= 0) {
            clearInterval(examTimerInterval);
            alert("Time's up! Automatically submitting your answers.");
            evaluateExam(new Event('submit'));
        }
    }, 1000);
}

function cancelExam() {
    if (confirm("Are you sure you want to cancel? Your progress will not be saved.")) {
        if (examTimerInterval) clearInterval(examTimerInterval);
        document.getElementById('examStage').classList.add('hidden');
        document.getElementById('configCard').classList.remove('hidden');
    }
}

// -------------------------------------------------------------
// EVALUATE EXAM & SEND WEAK POINTS TO "PAPER BY AI"
// -------------------------------------------------------------
function evaluateExam(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (examTimerInterval) clearInterval(examTimerInterval);

    var total = activeExamQuestions.length;
    var correctCount = 0;
    var identifiedWeakTopics = [];
    var identifiedStrongTopics = [];

    activeExamQuestions.forEach(function(item, qIdx) {
        var selected = document.querySelector('input[name="q_' + qIdx + '"]:checked');
        var selectedVal = selected ? parseInt(selected.value) : -1;

        if (selectedVal === item.answer) {
            correctCount++;
            if (identifiedStrongTopics.indexOf(item.topic) === -1) {
                identifiedStrongTopics.push(item.topic);
            }
        } else {
            // Flagged as weak point!
            if (identifiedWeakTopics.indexOf(item.topic) === -1) {
                identifiedWeakTopics.push(item.topic);
            }
        }
    });

    var scorePct = Math.round((correctCount / total) * 100);

    // Save this attempt to exam history
    var history = JSON.parse(localStorage.getItem('prepAiExamHistory') || '[]');
    var roleNames = {
        frontend: 'Frontend Developer',
        backend: 'Backend Developer',
        java: 'Java Developer',
        python: 'Python Developer'
    };

    var attemptRecord = {
        date: new Date().toLocaleDateString(),
        role: roleNames[currentSelectedRole] || 'Developer',
        level: currentSelectedLevel.charAt(0).toUpperCase() + currentSelectedLevel.slice(1),
        score: scorePct,
        total: total,
        correct: correctCount,
        weakTopics: identifiedWeakTopics,
        strongTopics: identifiedStrongTopics
    };
    history.push(attemptRecord);
    localStorage.setItem('prepAiExamHistory', JSON.stringify(history));

    // CRITICAL REQUIREMENT:
    // "according to that there weak point send to paper by ai"
    var masterWeak = JSON.parse(localStorage.getItem('prepAiWeakTopics') || '[]');
    identifiedWeakTopics.forEach(function(wt) {
        if (masterWeak.indexOf(wt) === -1) {
            masterWeak.push(wt);
        }
    });
    localStorage.setItem('prepAiWeakTopics', JSON.stringify(masterWeak));

    // Show Evaluation Result Screen
    document.getElementById('examStage').classList.add('hidden');
    document.getElementById('resultStage').classList.remove('hidden');

    document.getElementById('scoreCircle').textContent = scorePct + '%';
    document.getElementById('resTotal').textContent = total;
    document.getElementById('resCorrect').textContent = correctCount;
    document.getElementById('resIncorrect').textContent = (total - correctCount);

    if (identifiedWeakTopics.length > 0) {
        document.getElementById('weakPointsAlert').classList.remove('hidden');
        document.getElementById('weakListSummary').textContent = identifiedWeakTopics.join(' • ');
    } else {
        document.getElementById('weakPointsAlert').classList.add('hidden');
    }

    // Scroll smoothly to results
    document.getElementById('resultStage').scrollIntoView({ behavior: 'smooth' });
}
