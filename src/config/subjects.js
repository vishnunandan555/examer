/**
 * Configuration for Examer January & GATE Preparation Suite
 * Main subjects and priority classifications.
 */

export const SUBJECTS = [
  // Top Priority Focus
  {
    id: 'os',
    title: 'Operating Systems',
    shortName: 'OS',
    code: 'GATE / S5 Theory',
    priority: 'top',
    priorityLabel: 'TOP PRIORITY',
    priorityRank: 1,
    badgeClass: 'badge-critical',
    accentColor: 'var(--accent-red)',
    educator: 'Viswadeep Gothi (VD Gothi)',
    sourceNote: 'Operating Systems by Viswadeep Gothi (VD Gothi) — High-Yield GATE & University Focus',
    targetDate: '2027-01-15',
    displayDate: 'Jan 15, 2027',
    modules: [
      'Process Management & Threads',
      'CPU Scheduling Algorithms',
      'Process Synchronization & Semaphores',
      'Classical IPC Problems & Deadlocks',
      'Main Memory Management & Paging',
      'Virtual Memory & Page Replacement',
      'File Systems & Disk Scheduling'
    ]
  },
  {
    id: 'dbms',
    title: 'Database Management Systems',
    shortName: 'DBMS',
    code: 'GATE / S5 Theory',
    priority: 'top',
    priorityLabel: 'TOP PRIORITY',
    priorityRank: 2,
    badgeClass: 'badge-critical',
    accentColor: 'var(--accent-peach)',
    educator: 'Under Review / Selection TBD',
    sourceNote: 'DBMS Playlist selection under pedagogical review — Will be finalized tomorrow',
    targetDate: '2027-01-20',
    displayDate: 'Jan 20, 2027',
    modules: [
      'ER Model & Relational Model',
      'Relational Algebra & Tuple Calculus',
      'Structured Query Language (SQL)',
      'Functional Dependencies & Normalization (1NF-BCNF)',
      'Transaction Processing & ACID Properties',
      'Concurrency Control & Serializability',
      'File Organization, Indexing & B/B+ Trees'
    ]
  },
  {
    id: 'coa',
    title: 'Computer Organization & Architecture',
    shortName: 'COA',
    code: 'GATE / S5 Theory',
    priority: 'top',
    priorityLabel: 'TOP PRIORITY',
    priorityRank: 3,
    badgeClass: 'badge-critical',
    accentColor: 'var(--accent-yellow)',
    educator: 'Viswadeep Gothi (VD Gothi)',
    sourceNote: 'COA by Viswadeep Gothi (VD Gothi) — High-Yield Architecture & Hardware Fundamentals',
    targetDate: '2027-01-25',
    displayDate: 'Jan 25, 2027',
    modules: [
      'Machine Instructions & Addressing Modes',
      'ALU, Computer Arithmetic & Number Representation',
      'Hardwired & Microprogrammed Control Unit',
      'Memory Hierarchy & Cache Memory Mapping',
      'Instruction Pipelining & Pipeline Hazards',
      'I/O Organization, Programmed I/O, DMA & Interrupts'
    ]
  },

  // Core Curriculum & Foundations
  {
    id: 'cn',
    title: 'Computer Networks',
    shortName: 'CN',
    code: 'GATE / S5 Theory (PCCST501)',
    priority: 'core',
    priorityLabel: 'CORE',
    priorityRank: 4,
    badgeClass: 'badge-theory',
    accentColor: 'var(--accent-blue)',
    educator: 'Comprehensive GATE Playlist',
    sourceNote: 'Computer Networks — Layering, Data Link, Routing Protocols, TCP/UDP & Application Protocols',
    targetDate: '2027-01-10',
    displayDate: 'Jan 10, 2027',
    modules: [
      'Network Layering & Physical Layer',
      'Data Link Layer, Framing & Flow/Error Control',
      'Network Layer, IPv4/IPv6 & Routing Algorithms',
      'Transport Layer (TCP, UDP, Congestion Control)',
      'Application Layer (DNS, HTTP, SMTP) & Network Security'
    ]
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    shortName: 'DSA',
    code: 'GATE / Core Theory',
    priority: 'core',
    priorityLabel: 'CORE',
    priorityRank: 5,
    badgeClass: 'badge-theory',
    accentColor: 'var(--accent-green)',
    educator: 'Amit Khurana (Single Unified Playlist)',
    sourceNote: 'Unified Complete DSA Playlist by Amit Khurana — Single consolidated sequence without S3/S5 separation',
    targetDate: '2027-01-12',
    displayDate: 'Jan 12, 2027',
    modules: [
      'Asymptotic Analysis & Recurrence Relations',
      'Arrays, Stacks, Queues & Circular Queues',
      'Linked Lists (Singly, Doubly, Circular)',
      'Trees, Binary Search Trees & AVL Trees',
      'Binary Heaps & Priority Queues',
      'Graph Representations & Traversals (BFS/DFS)',
      'Sorting (Comparison & Non-Comparison) & Searching',
      'Hashing Techniques & Collision Resolution',
      'Greedy Algorithms & Dynamic Programming'
    ]
  },
  {
    id: 'aptitude',
    title: 'General Aptitude',
    shortName: 'Aptitude',
    code: 'GATE 15 Marks Core',
    priority: 'core',
    priorityLabel: 'SUPPLEMENTARY',
    priorityRank: 6,
    badgeClass: 'badge-optional',
    accentColor: 'var(--accent-teal)',
    educator: 'Amit Khurana',
    sourceNote: 'General Aptitude (Quantitative, Analytical & Verbal) by Amit Khurana',
    targetDate: '2027-02-01',
    displayDate: 'Feb 1, 2027',
    modules: [
      'Quantitative Aptitude & Numerical Ability',
      'Analytical Reasoning & Logic',
      'Spatial & Diagrammatic Reasoning',
      'Verbal Ability & Reading Comprehension'
    ]
  },
  {
    id: 'cprog',
    title: 'C Programming',
    shortName: 'C Prog',
    code: 'GATE Foundations',
    priority: 'core',
    priorityLabel: 'FOUNDATIONS',
    priorityRank: 7,
    badgeClass: 'badge-optional',
    accentColor: 'var(--accent-purple)',
    educator: "Beej's Guide to C Programming",
    sourceNote: "C Programming Reference & Problem-Solving Guide based on Beej's Guide to C",
    targetDate: '2027-01-08',
    displayDate: 'Jan 8, 2027',
    modules: [
      'C Syntax, Data Types & Variables',
      'Control Flow & Branching',
      'Functions, Recursion & Scope',
      'Pointers, Addresses & Memory Layout',
      'Arrays, Strings & String Manipulation',
      'Structures, Unions & Bitfields',
      'Dynamic Memory Allocation (malloc, calloc, realloc, free)',
      'File Handling & Preprocessor Directives'
    ]
  }
];

export const UPCOMING_TIMETABLE = [
  {
    date: '2027-01-08',
    subject: 'C Programming (Foundations)',
    code: 'Beej Guide',
    type: 'Foundations',
    status: 'upcoming'
  },
  {
    date: '2027-01-10',
    subject: 'Computer Networks',
    code: 'GATE CN',
    type: 'Core',
    status: 'upcoming'
  },
  {
    date: '2027-01-12',
    subject: 'Data Structures & Algorithms',
    code: 'Amit Khurana',
    type: 'Core',
    status: 'upcoming'
  },
  {
    date: '2027-01-15',
    subject: 'Operating Systems',
    code: 'VD Gothi',
    type: 'Top Priority',
    status: 'upcoming'
  },
  {
    date: '2027-01-20',
    subject: 'Database Management Systems',
    code: 'Curated DBMS',
    type: 'Top Priority',
    status: 'upcoming'
  },
  {
    date: '2027-01-25',
    subject: 'Computer Organization & Architecture',
    code: 'VD Gothi',
    type: 'Top Priority',
    status: 'upcoming'
  },
  {
    date: '2027-02-01',
    subject: 'General Aptitude',
    code: 'Amit Khurana',
    type: 'GATE Core',
    status: 'upcoming'
  }
];
