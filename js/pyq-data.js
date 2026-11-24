// B.Tech Interview & Placement Examination Previous Year Questions (PYQ) Repository

var btechPyqDatabase = [
    {
        id: "pyq-tcs-2025",
        title: "TCS NQT & Digital Technical Interview Paper 2025",
        subject: "Company Placement",
        company: "TCS (Tata Consultancy Services)",
        year: 2025,
        targetRole: "Digital & Ninja Software Engineer",
        difficulty: "Medium",
        duration: "60 mins",
        totalMarks: 50,
        description: "Actual frequently asked interview questions on DSA, DBMS SQL queries, and Object-Oriented Programming for B.Tech 2024-2025 campus drive.",
        questions: [
            {
                qNo: 1,
                topic: "Data Structures",
                question: "How do you detect and remove a loop in a Singly Linked List without using extra hash memory?",
                answer: "Use Floyd's Cycle-Finding Algorithm (Tortoise and Hare). Maintain slow and fast pointers. Slow moves 1 step, fast moves 2 steps. If they meet, a loop exists. To remove: move slow to head, advance both 1 step until their next pointers meet; set the preceding node's next to null.",
                code: "// Floyd's Cycle Detection:\nListNode slow = head, fast = head;\nwhile (fast != null && fast.next != null) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow == fast) { /* loop detected */ break; }\n}"
            },
            {
                qNo: 2,
                topic: "DBMS / SQL",
                question: "Write an SQL query to find the 2nd highest salary from the Employee table without using LIMIT/TOP.",
                answer: "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
                code: "SELECT MAX(salary) AS SecondHighestSalary\nFROM Employee\nWHERE salary < (SELECT MAX(salary) FROM Employee);"
            },
            {
                qNo: 3,
                topic: "Operating Systems",
                question: "Explain the four necessary and sufficient conditions for a Deadlock to occur.",
                answer: "1. Mutual Exclusion (non-shareable resources)\n2. Hold and Wait (process holding resources while requesting more)\n3. No Preemption (resources cannot be forcibly taken)\n4. Circular Wait (a closed chain of processes each waiting for a resource held by the next).",
                code: ""
            },
            {
                qNo: 4,
                topic: "OOPs Concepts",
                question: "What is the difference between Method Overloading (Compile-Time Polymorphism) and Method Overriding (Runtime Polymorphism)?",
                answer: "Overloading occurs within the same class with same method name but different parameter list/signature. Overriding occurs across parent and child classes where subclass redefines superclass method with exact same signature and return type.",
                code: ""
            },
            {
                qNo: 5,
                topic: "Core Java / Memory",
                question: "Why is String immutable in Java? Explain String Constant Pool (SCP).",
                answer: "Strings are immutable for security (network sockets, database URLs), thread-safety without synchronization, and caching efficiency. String literals are stored in the String Constant Pool in Heap memory so identical literals share memory.",
                code: ""
            }
        ]
    },
    {
        id: "pyq-infosys-2024",
        title: "Infosys Specialist Programmer (SP) & DSE Placement Paper",
        subject: "Company Placement",
        company: "Infosys",
        year: 2024,
        targetRole: "Specialist Programmer / DSE",
        difficulty: "Hard",
        duration: "75 mins",
        totalMarks: 60,
        description: "Previous Year Interview Paper covering Dynamic Programming, Graph Traversals, Indexing in Databases, and RESTful Microservices.",
        questions: [
            {
                qNo: 1,
                topic: "Dynamic Programming",
                question: "Explain 0/1 Knapsack Problem. Provide the recurrence relation and time/space complexity.",
                answer: "Recurrence: dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]]) if wt[i-1] <= w else dp[i-1][w]. Time Complexity: O(N * W), Space Complexity: O(W) with 1D array space optimization.",
                code: "for (int i = 0; i < n; i++) {\n    for (int w = W; w >= wt[i]; w--) {\n        dp[w] = Math.max(dp[w], val[i] + dp[w - wt[i]]);\n    }\n}"
            },
            {
                qNo: 2,
                topic: "Graph Algorithms",
                question: "When should you use Dijkstra's Algorithm vs Bellman-Ford Algorithm?",
                answer: "Dijkstra is a greedy algorithm suitable for graphs with non-negative edge weights (Time: O((V + E) log V)). Bellman-Ford handles negative edge weights and detects negative weight cycles (Time: O(V * E)).",
                code: ""
            },
            {
                qNo: 3,
                topic: "Database Systems",
                question: "What is the difference between Clustered Index and Non-Clustered Index in relational databases?",
                answer: "Clustered Index dictates the physical order of data rows on disk (only 1 per table, typically Primary Key). Non-Clustered Index creates a separate structure (B-tree) pointing to the actual data rows (multiple allowed per table).",
                code: ""
            },
            {
                qNo: 4,
                topic: "Computer Networks",
                question: "Explain the TCP Three-Way Handshake connection establishment process.",
                answer: "1. Client sends SYN (Synchronize Sequence Number = X) to Server.\n2. Server receives SYN, responds with SYN-ACK (Seq = Y, Ack = X + 1).\n3. Client sends ACK (Seq = X + 1, Ack = Y + 1) to establish connection.",
                code: ""
            }
        ]
    },
    {
        id: "pyq-amazon-2024",
        title: "Amazon SDE-1 Campus Technical Interview Question Paper",
        subject: "Company Placement",
        company: "Amazon",
        year: 2024,
        targetRole: "Software Development Engineer (SDE-1)",
        difficulty: "Hard",
        duration: "90 mins",
        totalMarks: 100,
        description: "Real questions asked in Amazon on-campus technical rounds covering Trees, Heaps, Sliding Window, and System Scalability.",
        questions: [
            {
                qNo: 1,
                topic: "Binary Trees & BST",
                question: "Given a Binary Tree, find the Lowest Common Ancestor (LCA) of two given nodes p and q.",
                answer: "Base case: if root is null or root == p or root == q, return root. Recurse left and right. If both left and right return non-null, root is LCA. If only one branch returns non-null, pass that result up.",
                code: "TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n    if (root == null || root == p || root == q) return root;\n    TreeNode left = lowestCommonAncestor(root.left, p, q);\n    TreeNode right = lowestCommonAncestor(root.right, p, q);\n    return (left != null && right != null) ? root : (left != null ? left : right);\n}"
            },
            {
                qNo: 2,
                topic: "Heap / Priority Queue",
                question: "Find Top K Frequent Elements in an integer array of size N.",
                answer: "Count frequencies with HashMap O(N). Insert into Min-Heap of size K based on frequency O(N log K) or use Bucket Sort for O(N) average time.",
                code: ""
            },
            {
                qNo: 3,
                topic: "System Design & Caching",
                question: "How does an LRU (Least Recently Used) Cache work? What data structures are used for O(1) get and put?",
                answer: "Combines a Doubly Linked List (maintains access recency order) with a Hash Map (keys point to DLL nodes). When an item is accessed or added, move to head. When cache exceeds capacity, evict tail node in O(1).",
                code: ""
            },
            {
                qNo: 4,
                topic: "Operating Systems",
                question: "What is Virtual Memory and how does the TLB (Translation Lookaside Buffer) accelerate address translation?",
                answer: "Virtual memory maps logical addresses to physical RAM pages. The TLB is a high-speed hardware associative cache on the CPU memory management unit (MMU) storing recent virtual-to-physical page frame translations, avoiding 2 memory lookups per access.",
                code: ""
            }
        ]
    },
    {
        id: "pyq-wipro-2024",
        title: "Wipro Elite NLTH / Turbo Technical Interview Exam",
        subject: "Company Placement",
        company: "Wipro",
        year: 2024,
        targetRole: "Project Engineer / Turbo Developer",
        difficulty: "Easy to Medium",
        duration: "50 mins",
        totalMarks: 40,
        description: "B.Tech national-level talent hunt previous questions: Core programming, loops, pointers, SQL joins, and software testing.",
        questions: [
            {
                qNo: 1,
                topic: "Algorithms",
                question: "Check if two given strings are Anagrams of each other in O(N) time and O(1) auxiliary space.",
                answer: "Maintain a frequency array of 26 integers. Increment count for chars in string 1, decrement for string 2. If all indices are 0 at the end, strings are anagrams.",
                code: "boolean isAnagram(String s, String t) {\n    if (s.length() != t.length()) return false;\n    int[] counts = new int[26];\n    for (int i = 0; i < s.length(); i++) {\n        counts[s.charAt(i) - 'a']++;\n        counts[t.charAt(i) - 'a']--;\n    }\n    for (int c : counts) if (c != 0) return false;\n    return true;\n}"
            },
            {
                qNo: 2,
                topic: "DBMS",
                question: "Explain the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.",
                answer: "INNER JOIN: returns matching rows from both tables.\nLEFT JOIN: returns all rows from left table and matching rows from right table (NULL for non-matches).\nRIGHT JOIN: returns all rows from right table and matching from left.\nFULL JOIN: returns rows where there is a match in either table.",
                code: ""
            },
            {
                qNo: 3,
                topic: "Core Programming",
                question: "What is the difference between call-by-value and call-by-reference?",
                answer: "Call-by-value passes a copy of the actual argument value (changes inside function do not affect original). Call-by-reference passes memory address of the actual argument (changes reflect in original caller variable).",
                code: ""
            }
        ]
    },
    {
        id: "pyq-dsa-core-2024",
        title: "B.Tech 3rd Semester: Data Structures & Algorithms University PYQ",
        subject: "Data Structures & Algorithms",
        company: "University B.Tech Exam",
        year: 2024,
        targetRole: "B.Tech End-Semester Examination",
        difficulty: "Medium",
        duration: "180 mins",
        totalMarks: 100,
        description: "Complete B.Tech CS/IT Semester exam previous paper on Stacks, Queues, Binary Search Trees, AVL Trees, and Sorting complexities.",
        questions: [
            {
                qNo: 1,
                topic: "Stacks & Applications",
                question: "Convert Infix expression (A + B * (C ^ D - E) ^ (F + G * H) - I) to Postfix expression using Stack algorithm.",
                answer: "Use standard operator precedence stack: Parentheses > Exponentiation (^) > Multiplication/Division (*, /) > Addition/Subtraction (+, -). Pop operators to output when incoming operator has lower or equal precedence.",
                code: ""
            },
            {
                qNo: 2,
                topic: "Self-Balancing Trees",
                question: "What is an AVL tree? Explain the 4 types of rotations (LL, RR, LR, RL) with balance factor criteria.",
                answer: "AVL tree is a self-balancing BST where balance factor BF = height(left) - height(right) is in {-1, 0, 1}. Violations trigger single rotations (LL rotation for left-left insertion, RR for right-right) or double rotations (LR = Left on child then Right on parent; RL = Right on child then Left on parent).",
                code: ""
            },
            {
                qNo: 3,
                topic: "Sorting Algorithms",
                question: "Compare QuickSort and MergeSort in terms of Time Complexity, Space Complexity, Stability, and In-Place nature.",
                answer: "QuickSort: Best/Avg O(N log N), Worst O(N^2), Auxiliary Space O(log N) stack, In-place, Not stable.\nMergeSort: Best/Avg/Worst O(N log N), Auxiliary Space O(N), Out-of-place, Stable.",
                code: ""
            },
            {
                qNo: 4,
                topic: "Graph Representation",
                question: "Differentiate between Adjacency Matrix and Adjacency List representations of a Graph in terms of space and edge lookup time.",
                answer: "Adjacency Matrix: Space O(V^2), Edge lookup O(1), efficient for dense graphs.\nAdjacency List: Space O(V + E), Edge lookup O(degree(V)), optimal for sparse graphs with few edges.",
                code: ""
            }
        ]
    },
    {
        id: "pyq-os-core-2024",
        title: "B.Tech 4th Semester: Operating Systems University Exam Paper",
        subject: "Operating Systems",
        company: "University B.Tech Exam",
        year: 2024,
        targetRole: "B.Tech End-Semester Examination",
        difficulty: "Medium",
        duration: "180 mins",
        totalMarks: 100,
        description: "Official university previous paper on Process Scheduling (FCFS, SJF, Round Robin), Banker's Algorithm, and Page Replacement.",
        questions: [
            {
                qNo: 1,
                topic: "CPU Scheduling",
                question: "Explain Preemptive Shortest Job First (SRTF) and Round Robin scheduling. How does Time Quantum size affect context switching overhead?",
                answer: "SRTF switches CPU when a new process arrives with remaining burst time smaller than current process. Round Robin assigns equal time slice (quantum) cyclically. If quantum is too small, excessive context switching degrades CPU throughput. If too large, it degenerates to FCFS.",
                code: ""
            },
            {
                qNo: 2,
                topic: "Deadlock Avoidance",
                question: "State and explain Dijkstra's Banker's Algorithm with Safety Algorithm and Resource-Request Algorithm steps.",
                answer: "Banker's Algorithm tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources, and then makes an s-state check to verify that no deadlock condition will occur before granting requests.",
                code: ""
            },
            {
                qNo: 3,
                topic: "Memory Management",
                question: "Explain Page Fault, Thrashing, and Belady's Anomaly in FIFO page replacement.",
                answer: "Page Fault occurs when referenced memory page is not in RAM. Thrashing happens when system spends more time swapping pages in/out than executing code. Belady's Anomaly is the phenomenon where adding more physical page frames results in MORE page faults under FIFO.",
                code: ""
            }
        ]
    },
    {
        id: "pyq-dbms-core-2024",
        title: "B.Tech 5th Semester: Database Management Systems (DBMS) PYQ",
        subject: "Database Management Systems",
        company: "University B.Tech Exam",
        year: 2024,
        targetRole: "B.Tech End-Semester Examination",
        difficulty: "Medium",
        duration: "180 mins",
        totalMarks: 100,
        description: "University PYQ covering Relational Algebra, Normal Forms (1NF, 2NF, 3NF, BCNF), ACID Properties, and Two-Phase Locking (2PL).",
        questions: [
            {
                qNo: 1,
                topic: "Normalization",
                question: "Define Functional Dependency. Explain 1NF, 2NF, 3NF and Boyce-Codd Normal Form (BCNF) with examples.",
                answer: "1NF: Atomic attributes, no repeating groups.\n2NF: In 1NF and no partial dependency (non-prime attribute depends on proper subset of candidate key).\n3NF: In 2NF and no transitive dependency (non-prime attribute depends on non-prime).\nBCNF: For every functional dependency X -> Y, X must be a Super Key.",
                code: ""
            },
            {
                qNo: 2,
                topic: "Transactions & Concurrency",
                question: "What are ACID properties? Explain Atomicity, Consistency, Isolation, and Durability.",
                answer: "Atomicity: All-or-nothing execution.\nConsistency: Database transitions from one valid state to another satisfying all constraints.\nIsolation: Concurrent transactions execute without mutual interference.\nDurability: Committed updates survive system crashes.",
                code: ""
            },
            {
                qNo: 3,
                topic: "Concurrency Control",
                question: "Explain Strict Two-Phase Locking (Strict 2PL) protocol and how it prevents Cascading Aborts.",
                answer: "In Strict 2PL, all exclusive (write) locks held by a transaction are retained until the transaction commits or aborts. Because uncommitted data is never read by other transactions, cascading rollbacks cannot occur.",
                code: ""
            }
        ]
    },
    {
        id: "pyq-cn-core-2024",
        title: "B.Tech 5th Semester: Computer Networks University PYQ",
        subject: "Computer Networks",
        company: "University B.Tech Exam",
        year: 2024,
        targetRole: "B.Tech End-Semester Examination",
        difficulty: "Medium",
        duration: "180 mins",
        totalMarks: 100,
        description: "Official B.Tech paper on OSI 7-Layer Architecture, Subnetting IPv4, Sliding Window Flow Control, and DNS Resolution.",
        questions: [
            {
                qNo: 1,
                topic: "Network Models",
                question: "List all 7 layers of the OSI model and state the primary responsibility and protocol unit (PDU) of each.",
                answer: "1. Physical (Bits): transmission of raw bit stream\n2. Data Link (Frames): node-to-node framing, MAC addressing, error detection (CRC)\n3. Network (Packets): logical routing and IP addressing\n4. Transport (Segments): end-to-end reliability, flow control, TCP/UDP\n5. Session (Data): session establishment & checkpointing\n6. Presentation (Data): encryption, compression, formatting\n7. Application (Data): user interface, HTTP, FTP, DNS.",
                code: ""
            },
            {
                qNo: 2,
                topic: "IP Addressing & Subnetting",
                question: "Given IP address 192.168.10.0/26, find the Subnet Mask, Number of Subnets, Number of usable Host IPs per subnet, and the Broadcast address.",
                answer: "CIDR /26: Subnet Mask = 255.255.255.192. Number of subnets = 2^(26-24) = 4 subnets. Host bits = 32 - 26 = 6. Total addresses per subnet = 64. Usable host IPs = 64 - 2 = 62. For first subnet (0-63), Network IP = 192.168.10.0, Broadcast IP = 192.168.10.63.",
                code: ""
            },
            {
                qNo: 3,
                topic: "Flow Control Protocols",
                question: "Compare Stop-and-Wait ARQ, Go-Back-N ARQ, and Selective Repeat ARQ in terms of sender/receiver window size and efficiency.",
                answer: "Stop-and-Wait: Sender Ws=1, Receiver Wr=1. Very low efficiency on long delay links.\nGo-Back-N: Ws=N, Wr=1. Retransmits all unacknowledged frames on error.\nSelective Repeat: Ws=2^(n-1), Wr=2^(n-1). Retransmits only damaged frames, receiver buffers out-of-order frames.",
                code: ""
            }
        ]
    },
    {
        id: "pyq-cognizant-2024",
        title: "Cognizant GenC / GenC Next Technical Interview Assessment",
        subject: "Company Placement",
        company: "Cognizant",
        year: 2024,
        targetRole: "GenC & GenC Next Software Engineer",
        difficulty: "Easy to Medium",
        duration: "60 mins",
        totalMarks: 50,
        description: "Actual interview questions on Java Strings, Collections, Exception Handling, SQL Group By / Having, and Agile Scrum.",
        questions: [
            {
                qNo: 1,
                topic: "Java Collections",
                question: "What is the difference between HashMap, LinkedHashMap, and TreeMap in Java?",
                answer: "HashMap: Unordered, O(1) average time operations, allows one null key.\nLinkedHashMap: Maintains insertion order (or access order) using a doubly-linked bucket list, O(1) operations.\nTreeMap: Red-Black tree implementation, sorted natural order of keys or custom Comparator, O(log N) operations, does not allow null keys.",
                code: ""
            },
            {
                qNo: 2,
                topic: "SQL Aggregations",
                question: "What is the difference between WHERE and HAVING clause in SQL?",
                answer: "WHERE filters individual rows BEFORE any grouping or aggregate functions are applied. HAVING filters grouped rows AFTER GROUP BY aggregation is computed.",
                code: "SELECT department_id, COUNT(*) AS emp_count\nFROM employees\nWHERE status = 'Active'\nGROUP BY department_id\nHAVING COUNT(*) > 5;"
            },
            {
                qNo: 3,
                topic: "Software Engineering",
                question: "Explain the Agile Scrum workflow: Sprint, Daily Standup, Sprint Review, and Retrospective.",
                answer: "Sprint: Time-boxed iteration (typically 2-4 weeks) delivering a working product increment.\nDaily Scrum: 15-minute sync answering what did I do yesterday, what will I do today, any blockers.\nSprint Review: Demonstration of completed features to stakeholders.\nSprint Retrospective: Team internal reflection on what went well and what to improve.",
                code: ""
            }
        ]
    }
];

// Helper to get all PYQs
function getAllPyqs() {
    return btechPyqDatabase;
}
