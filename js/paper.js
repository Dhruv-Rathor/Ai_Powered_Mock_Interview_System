var currentSelectedRole = 'google';
var currentSelectedLevel = 'beginner';
var activeExamQuestions = [];
var examTimerInterval = null;

// Syllabus Topics for each role & company placement paper
var roleSyllabus = {
    google: ['Binary Trees & LCA', 'Dynamic Programming', 'LRU Cache Design', 'Hash Table Collisions', 'Asymptotic Complexity'],
    amazon: ['Lowest Common Ancestor (LCA)', 'Top K Frequent Elements (Heap)', 'LRU Cache Architecture', 'Sliding Window', 'Virtual Memory & TLB'],
    microsoft: ['Cycle Detection in Linked Lists', 'Graph BFS/DFS', 'Bit Manipulation', 'Trie Data Structure', 'Deadlock & Concurrency'],
    tcs: ['Floyd Tortoise & Hare Algorithm', 'SQL 2nd Highest Salary', 'Deadlock 4 Conditions', 'Java String Pool', 'Method Overloading vs Overriding'],
    infosys: ['0/1 Knapsack Recurrence', 'Dijkstra vs Bellman-Ford', 'Clustered vs Non-Clustered Index', 'TCP 3-Way Handshake', 'Microservices Architecture'],
    wipro: ['String Anagram in O(N)', 'SQL Join Variations', 'Call-by-Value vs Reference', 'Array Sliding Logic', 'OOPs Inheritance'],
    frontend: ['HTML5 & Semantics', 'CSS Flexbox / Grid', 'JavaScript ES6+', 'React Hooks', 'DOM & Events'],
    backend: ['Node.js Event Loop', 'Express.js Routing', 'REST API Architecture', 'JWT Authentication', 'MongoDB Indexing'],
    java: ['OOPs Principles', 'Collections Framework', 'Exception Handling', 'Multithreading', 'Spring Boot Basics'],
    python: ['Python Data Types', 'List Comprehensions', 'Decorators & Generators', 'Django Architecture', 'DSA in Python']
};

// MCQ QUESTION BANK (with verified correct answers & topic tagging)
var mcqQuestionBank = {
    google: [
        {
            topic: "Binary Trees & LCA",
            q: "In a Binary Search Tree (BST), what is the time complexity to find the Lowest Common Ancestor (LCA) of two nodes when the tree height is h?",
            options: ["O(N^2)", "O(h)", "O(1)", "O(N log N)"],
            answer: 1
        },
        {
            topic: "Dynamic Programming",
            q: "Which algorithmic technique is optimal for solving the Longest Common Subsequence (LCS) problem of two strings of lengths m and n?",
            options: [
                "Greedy Choice in O(m + n)",
                "Dynamic Programming with 2D table in O(m * n)",
                "Divide and Conquer in O(2^(m+n))",
                "Binary Search in O(log(m+n))"
            ],
            answer: 1
        },
        {
            topic: "LRU Cache Design",
            q: "Which combination of data structures provides O(1) time complexity for both get() and put() operations in an LRU Cache?",
            options: ["Array and Stack", "Doubly Linked List and Hash Map", "Binary Search Tree and Queue", "Priority Queue and Set"],
            answer: 1
        },
        {
            topic: "Hash Table Collisions",
            q: "In an Open Addressing hash table using Double Hashing, why must the second hash function h2(k) never evaluate to 0?",
            options: [
                "It causes array index out of bounds",
                "It would cause the probe step size to be 0, creating an infinite loop on the same bucket",
                "It corrupts hash table metadata",
                "Double hashing requires h2(k) to evaluate to a negative integer"
            ],
            answer: 1
        },
        {
            topic: "Asymptotic Complexity",
            q: "What is the worst-case time complexity of QuickSelect to find the k-th smallest element when using a deterministic first-element pivot?",
            options: ["O(log N)", "O(N)", "O(N^2)", "O(N log N)"],
            answer: 2
        }
    ],

    amazon: [
        {
            topic: "Lowest Common Ancestor (LCA)",
            q: "In a general Binary Tree (not BST), what condition determines that node 'root' is the Lowest Common Ancestor of nodes p and q?",
            options: [
                "root.val == p.val + q.val",
                "Both left and right subtrees return non-null from recursive search, or root matches one node while the other is in a subtree",
                "root is the leaf node closest to p",
                "root is at depth 0"
            ],
            answer: 1
        },
        {
            topic: "Top K Frequent Elements (Heap)",
            q: "Which approach finds the Top K Frequent Elements in an array of size N with optimal O(N log K) time and O(N) space?",
            options: [
                "Sort entire array in O(N log N)",
                "Frequency HashMap + Min-Heap of size K",
                "Bubble Sort on frequency array",
                "Linear scan with stack"
            ],
            answer: 1
        },
        {
            topic: "LRU Cache Architecture",
            q: "In an LRU Cache, when maximum capacity is reached and a new element arrives, which node is evicted?",
            options: [
                "The head node (most recently used)",
                "The tail node (least recently accessed)",
                "A randomly chosen node",
                "The node with the lowest numeric key value"
            ],
            answer: 1
        },
        {
            topic: "Virtual Memory & TLB",
            q: "What is the primary function of the Translation Lookaside Buffer (TLB) in CPU memory management?",
            options: [
                "To store dirty cache lines for disk flush",
                "A fast hardware cache of recent virtual-to-physical page frame translations to accelerate MMU lookups",
                "To store interrupt vector tables",
                "To balance thread load across CPU cores"
            ],
            answer: 1
        },
        {
            topic: "Sliding Window",
            q: "What is the time complexity of the Sliding Window technique to find the maximum sum subarray of fixed size K in an array of size N?",
            options: ["O(N * K)", "O(N)", "O(N^2)", "O(K log N)"],
            answer: 1
        }
    ],

    microsoft: [
        {
            topic: "Cycle Detection in Linked Lists",
            q: "Floyd's Tortoise and Hare algorithm detects a cycle in a linked list. If a cycle exists, what is its time complexity?",
            options: ["O(N)", "O(N^2)", "O(1)", "O(N!)"],
            answer: 0
        },
        {
            topic: "Graph BFS/DFS",
            q: "Which traversal algorithm is strictly guaranteed to find the shortest path between two vertices in an unweighted directed graph?",
            options: ["Depth First Search (DFS)", "Breadth First Search (BFS)", "Topological Sort", "In-order traversal"],
            answer: 1
        },
        {
            topic: "Bit Manipulation",
            q: "What operation does the expression `(n & (n - 1))` perform in binary arithmetic?",
            options: [
                "Checks if n is odd",
                "Clears the lowest set (rightmost 1) bit of n",
                "Inverts all bits of n",
                "Multiplies n by 2"
            ],
            answer: 1
        },
        {
            topic: "Trie Data Structure",
            q: "Why is a Trie preferred over a Hash Table for implementing search engine auto-complete queries?",
            options: [
                "Tries use less memory than flat arrays",
                "Tries support fast O(L) prefix-based search queries where L is prefix length",
                "Tries provide O(1) delete",
                "Hash tables cannot store strings"
            ],
            answer: 1
        },
        {
            topic: "Deadlock & Concurrency",
            q: "In operating systems, what is a Race Condition?",
            options: [
                "When two processes run at different CPU clock speeds",
                "When multiple threads concurrently access and modify shared data, and the final outcome depends on execution timing",
                "A hardware bus failure",
                "When a thread is preempted during I/O wait"
            ],
            answer: 1
        }
    ],

    tcs: [
        {
            topic: "Floyd Tortoise & Hare Algorithm",
            q: "In Floyd's Cycle-Finding Algorithm for linked lists, by how many nodes does the fast pointer advance per iteration relative to the slow pointer?",
            options: ["1 node", "2 nodes (1 node faster than slow)", "3 nodes", "It jumps directly to the tail"],
            answer: 1
        },
        {
            topic: "SQL 2nd Highest Salary",
            q: "Which standard SQL query finds the second highest salary without using proprietary LIMIT or TOP clauses?",
            options: [
                "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee)",
                "SELECT salary FROM Employee ORDER BY salary DESC",
                "SELECT AVG(salary) FROM Employee",
                "SELECT MIN(salary) FROM Employee"
            ],
            answer: 0
        },
        {
            topic: "Deadlock 4 Conditions",
            q: "Which of the following is NOT one of Coffman's four conditions required for deadlock to occur?",
            options: ["Mutual Exclusion", "Circular Wait", "Preemption Allowed", "Hold and Wait"],
            answer: 2
        },
        {
            topic: "Java String Pool",
            q: "Where are String literals created in Java 8 and later JVM implementations?",
            options: [
                "PermGen space",
                "String Constant Pool located inside the main Heap memory",
                "Stack memory frame",
                "Native CPU registers"
            ],
            answer: 1
        },
        {
            topic: "Method Overloading vs Overriding",
            q: "Can a private or static method be overridden in Java?",
            options: [
                "Yes, using the @Override annotation",
                "No, private methods are not inherited and static methods are shadowed/hidden, not overridden",
                "Only if protected modifier is added",
                "Yes, in interfaces"
            ],
            answer: 1
        }
    ],

    infosys: [
        {
            topic: "0/1 Knapsack Recurrence",
            q: "In the 0/1 Knapsack problem with N items and maximum weight capacity W, what is the space complexity when space-optimized?",
            options: ["O(N * W)", "O(W)", "O(N)", "O(1)"],
            answer: 1
        },
        {
            topic: "Dijkstra vs Bellman-Ford",
            q: "Why cannot Dijkstra's algorithm be safely used on graphs containing negative edge weights?",
            options: [
                "It throws a stack overflow exception",
                "Dijkstra's greedy assumption assumes once a node is visited its distance is minimized, which negative edges violate",
                "Dijkstra requires directed acyclic graphs only",
                "Dijkstra only runs on unweighted graphs"
            ],
            answer: 1
        },
        {
            topic: "Clustered vs Non-Clustered Index",
            q: "How many Clustered Indexes can be created on a single database table in relational DBMS?",
            options: ["Unlimited", "Exactly 1", "Up to 16", "Equal to the number of columns"],
            answer: 1
        },
        {
            topic: "TCP 3-Way Handshake",
            q: "What flag does the receiving server send back in response to the initial TCP SYN packet during a Three-Way Handshake?",
            options: ["FIN", "SYN-ACK", "RST", "ACK only"],
            answer: 1
        },
        {
            topic: "Microservices Architecture",
            q: "What is the primary architectural purpose of an API Gateway in a microservices deployment?",
            options: [
                "To replace the primary database",
                "To serve as a reverse proxy providing centralized authentication, rate limiting, and request routing to backend services",
                "To compile client-side TypeScript code",
                "To host static HTML files"
            ],
            answer: 1
        }
    ],

    wipro: [
        {
            topic: "String Anagram in O(N)",
            q: "What is the most space-efficient time-optimal method to verify if two strings of lowercase English alphabets are anagrams?",
            options: [
                "Sort both strings in O(N log N)",
                "Maintain an integer frequency array of size 26 for char counting in O(N) time and O(1) space",
                "Use nested loops in O(N^2)",
                "Generate all string permutations"
            ],
            answer: 1
        },
        {
            topic: "SQL Join Variations",
            q: "Which SQL JOIN returns all records from the left table, and matching records from the right table (with NULL for non-matches)?",
            options: ["INNER JOIN", "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "CROSS JOIN"],
            answer: 1
        },
        {
            topic: "Call-by-Value vs Reference",
            q: "In Java, how are object parameters passed to methods?",
            options: [
                "Strictly Call-by-Reference",
                "Call-by-Value where the value passed is the object reference copy",
                "Call-by-Name",
                "Call-by-Result"
            ],
            answer: 1
        },
        {
            topic: "Array Sliding Logic",
            q: "Which data structure follows the Last-In-First-Out (LIFO) order and is used for function call stacks and undo operations?",
            options: ["Queue", "Stack", "Priority Queue", "Circular Buffer"],
            answer: 1
        },
        {
            topic: "OOPs Inheritance",
            q: "What is the primary difference between Black-Box Testing and White-Box Testing?",
            options: [
                "Black-Box tests UI colors, White-Box tests text",
                "Black-Box tests functionality without knowing internal code structure, whereas White-Box examines internal logic and code paths",
                "Black-Box is manual only, White-Box is automated only",
                "There is no difference"
            ],
            answer: 1
        }
    ],

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
        var sideName = document.getElementById('sideUserName');
        var sideAvatar = document.getElementById('sideAvatar');
        if (sideName) sideName.textContent = user.name || 'Student';
        if (sideAvatar) sideAvatar.textContent = (user.name || 'S').charAt(0).toUpperCase();

        if (user.targetRole && roleSyllabus[user.targetRole]) {
            var roleSelect = document.getElementById('roleSelector');
            if (roleSelect) {
                roleSelect.value = user.targetRole;
                onRoleChanged(user.targetRole);
            }
        }
    }
}

function getRoleDisplayName(role) {
    var roleNames = {
        google: 'Google Placement Paper (2026)',
        amazon: 'Amazon SDE Placement (2026)',
        microsoft: 'Microsoft Software Engineering OA',
        tcs: 'TCS NQT & Digital Placement Exam',
        infosys: 'Infosys Specialist Programmer (SP) Exam',
        wipro: 'Wipro Elite NLTH Placement Exam',
        frontend: 'Frontend Developer',
        backend: 'Backend Developer',
        java: 'Java Developer',
        python: 'Python Developer'
    };
    return roleNames[role] || 'Technical Assessment';
}

function onRoleChanged(role) {
    currentSelectedRole = role;
    var labelEl = document.getElementById('selectedRoleLabel');
    if (labelEl) labelEl.textContent = getRoleDisplayName(role);

    // Populate role topics checkboxes
    var container = document.getElementById('roleTopicsContainer');
    if (!container) return;
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

// START GENERATED MCQ EXAM
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

    var finalPool = [];
    var safetyLimit = 0;
    while (finalPool.length < count && topicFiltered.length > 0 && safetyLimit < 20) {
        safetyLimit++;
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

    var durationRadio = document.querySelector('input[name="examDuration"]:checked');
    var totalSeconds = 600;
    var displayDurationLabel = "10 Mins";

    if (durationRadio) {
        if (durationRadio.value === 'custom') {
            var custVal = parseInt(document.getElementById('customTimeVal').value);
            var unit = document.getElementById('customTimeUnit').value;
            if (isNaN(custVal) || custVal < 1) custVal = 30;

            if (unit === 'seconds') {
                totalSeconds = Math.min(custVal, 3600);
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

    document.getElementById('examBannerTitle').textContent = getRoleDisplayName(currentSelectedRole) + ' Assessment';
    document.getElementById('examBannerMeta').textContent = count + ' Questions • ' + displayDurationLabel + ' Time Limit • Pass criteria: 70%';

    // Render MCQ Cards
    var html = '';
    activeExamQuestions.forEach(function(item, idx) {
        var optionsHtml = '';
        item.options.forEach(function(opt, optIdx) {
            optionsHtml += '<label class="option-choice">' +
                '<input type="radio" name="q_' + idx + '" value="' + optIdx + '" required> ' +
                '<span>' + opt + '</span>' +
            '</label>';
        });

        html += '<div class="mcq-card">' +
            '<div class="mcq-head">' +
                '<span class="q-index-pill">Question ' + (idx + 1) + ' of ' + activeExamQuestions.length + '</span>' +
                '<span class="q-topic-tag">' + item.topic + '</span>' +
            '</div>' +
            '<div class="mcq-question">' + item.q + '</div>' +
            '<div class="options-list">' + optionsHtml + '</div>' +
        '</div>';
    });

    document.getElementById('mcqDeck').innerHTML = html;

    // Start Timer
    startExamTimer(totalSeconds);
}

function startExamTimer(seconds) {
    if (examTimerInterval) {
        clearInterval(examTimerInterval);
        examTimerInterval = null;
    }
    
    var remaining = parseInt(seconds);
    if (isNaN(remaining) || remaining <= 0) remaining = 600;
    
    var clock = document.getElementById('timerClock');
    if (!clock) return;

    function renderTime() {
        var mins = Math.floor(remaining / 60);
        var secs = remaining % 60;
        clock.textContent = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;

        if (remaining <= 10) {
            clock.classList.add('timer-alert');
        } else {
            clock.classList.remove('timer-alert');
        }
    }

    renderTime();

    examTimerInterval = setInterval(function() {
        remaining--;
        if (remaining < 0) {
            clearInterval(examTimerInterval);
            examTimerInterval = null;
            clock.textContent = '00:00';
            alert("Time's up! Submitting your answers automatically.");
            evaluateExam(new Event('submit'));
            return;
        }
        renderTime();
    }, 1000);
}

function cancelExam() {
    if (confirm("Are you sure you want to cancel? Your progress will not be saved.")) {
        if (examTimerInterval) clearInterval(examTimerInterval);
        document.getElementById('examStage').classList.add('hidden');
        document.getElementById('configCard').classList.remove('hidden');
    }
}

// EVALUATE EXAM, SAVE FULL PAPER & UPDATE WEAK POINTS
function evaluateExam(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (examTimerInterval) clearInterval(examTimerInterval);

    var total = activeExamQuestions.length;
    var correctCount = 0;
    var identifiedWeakTopics = [];
    var identifiedStrongTopics = [];
    var answeredQuestions = [];

    activeExamQuestions.forEach(function(item, qIdx) {
        var selected = document.querySelector('input[name="q_' + qIdx + '"]:checked');
        var selectedVal = selected ? parseInt(selected.value) : -1;
        var isRight = (selectedVal === item.answer);

        if (isRight) {
            correctCount++;
            if (identifiedStrongTopics.indexOf(item.topic) === -1) {
                identifiedStrongTopics.push(item.topic);
            }
        } else {
            if (identifiedWeakTopics.indexOf(item.topic) === -1) {
                identifiedWeakTopics.push(item.topic);
            }
        }

        answeredQuestions.push({
            qNo: qIdx + 1,
            topic: item.topic,
            question: item.q,
            options: item.options,
            selectedOption: selectedVal,
            correctOption: item.answer,
            isCorrect: isRight,
            explanation: "Correct option: " + (item.answer + 1) + ". " + item.options[item.answer]
        });
    });

    var scorePct = Math.round((correctCount / total) * 100);
    var roleLabel = getRoleDisplayName(currentSelectedRole);
    var levelLabel = currentSelectedLevel.charAt(0).toUpperCase() + currentSelectedLevel.slice(1);

    // Save this attempt to exam history
    var history = JSON.parse(localStorage.getItem('prepAiExamHistory') || '[]');
    var attemptRecord = {
        id: 'attempt-' + Date.now(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        role: roleLabel,
        level: levelLabel,
        score: scorePct,
        total: total,
        correct: correctCount,
        weakTopics: identifiedWeakTopics,
        strongTopics: identifiedStrongTopics
    };
    history.push(attemptRecord);
    localStorage.setItem('prepAiExamHistory', JSON.stringify(history));

    // Save full paper to prepAiSavedPapers repository for search and review!
    var fullSavedPaper = {
        id: 'paper-' + Date.now(),
        title: roleLabel + ' Assessment (' + levelLabel + ')',
        role: roleLabel,
        level: levelLabel,
        topics: roleSyllabus[currentSelectedRole] || [],
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        score: scorePct,
        totalQuestions: total,
        correctCount: correctCount,
        weakTopics: identifiedWeakTopics,
        strongTopics: identifiedStrongTopics,
        questions: answeredQuestions
    };

    var savedPapers = JSON.parse(localStorage.getItem('prepAiSavedPapers') || '[]');
    savedPapers.unshift(fullSavedPaper);
    localStorage.setItem('prepAiSavedPapers', JSON.stringify(savedPapers));

    // Sync to backend API
    fetch('/api/papers/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullSavedPaper)
    }).catch(function() {
        console.log("Local browser storage active for saved papers");
    });

    // Update weak points in localStorage for Paper by AI
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

    document.getElementById('resultStage').scrollIntoView({ behavior: 'smooth' });
}
