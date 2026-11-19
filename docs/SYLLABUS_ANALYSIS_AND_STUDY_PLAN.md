# EXAMER — Syllabus Analysis & Comprehensive Exam Preparation Plan

> **Academic Context**: B.Tech Computer Science & Engineering (KTU Syllabus)  
> **Upcoming Critical Examination Window**: November 19, 2026 – December 08, 2026  
> **Repository**: [git@github.com:vishnunandan555/examer.git](git@github.com:vishnunandan555/examer.git)  
> **Last Updated**: November 19, 2026, 08:51 AM IST (`2026-11-19T08:51:05+05:30`)

---

## 1. Directory Structure & File Map

The repository is structured cleanly with separated concerns:

```
examer/
├── data/
│   ├── raw/                                 # Original raw GATE playlists
│   │   ├── Computer Networks (CN) for GATE — Complete Playlist.csv
│   │   └── Data Structures and Algorithms for GATE — Complete Playlist.csv
│   ├── processed/                           # Curated study portions & removed playlists
│   │   ├── Computer_Networks_Study_Portions.csv
│   │   ├── Computer_Networks_Removed_Portions.csv
│   │   ├── Data_Structures_and_Algorithms_Study_Portions.csv
│   │   ├── Data_Structures_and_Algorithms_Removed_Portions.csv
│   │   ├── S3_DSA_Study_Portions.csv
│   │   └── S5_DAA_Study_Portions.csv
│   └── playlist_data.json                   # Master indexed JSON data
├── docs/                                    # Documentation, official syllabi, and timetable
│   ├── syllabus/
│   │   ├── S3 CSE DSA.pdf
│   │   ├── S5 CSE CN.pdf
│   │   └── S5 CSE DAA.pdf
│   ├── timetable/
│   │   └── EXAM Time table.jpeg
│   └── SYLLABUS_ANALYSIS_AND_STUDY_PLAN.md
├── scripts/
│   └── generate_all_datasets.py             # Data processing & classification pipeline
├── src/                                     # Web application source code (Vite + React)
│   ├── data/
│   │   └── playlist_data.json
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 2. Examination Timetable & Urgency Analysis

*Last Synchronized: 2026-11-19 08:51 IST*

| Date | Day | Examination | Subject Code | Type | Status / Days Left | Priority Level |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Nov 16** | Monday | Machine Learning Lab | CST307-L | Lab | Completed | Done |
| **Nov 18** | Wednesday | Computer Networks Lab | PCCST501-L | Lab | Completed | Done |
| **Nov 23** | Monday | **Computer Networks** | **PCCST501** | **Theory** | **4 Days Left** | 🔥 **CRITICAL (Top Priority)** |
| **Nov 24** | Tuesday | S3 Mathematics | MAT203 | Supply | 5 Days Left | High |
| **Nov 27** | Friday | **DAA (Design & Analysis of Algorithms)** | **PCCST502** | **Theory** | **8 Days Left** | 🔥 **HIGH PRIORITY** |
| **Nov 30** | Monday | **S3 DSA (Data Structures & Algorithms)** | **PCCST303** | **Supply** | **11 Days Left** | 🔥 **HIGH PRIORITY** |
| **Dec 01** | Tuesday | Machine Learning | CST307 | Theory | 12 Days Left | Normal |
| **Dec 04** | Friday | Microcontrollers | CST309 | Theory | 15 Days Left | Normal |
| **Dec 07** | Monday | Data Analytics | CST311 | Theory | 18 Days Left | Normal |
| **Dec 08** | Tuesday | S3 EE / Ethics | HUT200 | Supply | 19 Days Left | Normal |

---

## 3. Comparative Analysis: GATE Syllabus vs. KTU University Syllabus

GATE playlists are designed for comprehensive competitive examination depth, with heavy emphasis on tricky numericals, historical GATE question solving, and advanced competitive programming variations. In contrast, **KTU University End Semester Examinations (ESE - 60 Marks)** focus on:
1. Standard conceptual derivations and clear architecture explanations.
2. Algorithm pseudocode, step-by-step trace examples, and asymptotic recurrences.
3. Module-by-module coverage with 2 questions per module (Part A 3-mark conceptual, Part B 9-mark descriptive/algorithmic).

By separating the playlists into **Core (Must Watch)**, **Optional (High-Yield Practice)**, and **Removed (Irrelevant / Overkill)**, we eliminate **22+ hours of unnecessary video bloat** and provide a crisp study track.

```
Original Total: 500 Videos | 260.2 Hours
Reduced Core:   290 Videos | 152.0 Hours (~42% reduction in study load!)
Last Updated:   2026-11-19 08:51 IST
```

---

## 4. Computer Networks (S5 CSE - PCCST501)

- **Exam Date**: November 23, 2026 (4 Days Left)
- **Original Playlist**: 202 Videos (4,637.3 minutes ≈ 77.3 hours)
- **Curated Study Plan**: 175 Videos (Core: 124, Optional: 51)
- **Removed Overkill**: 27 Videos (397.3 minutes ≈ 6.6 hours)
- **Dataset**: `data/processed/Computer_Networks_Study_Portions.csv`

### Module-by-Module Breakdown

#### Module 1: Network Layering & Application Layer (6 Contact Hours)
* **KTU Syllabus Topics**:
  - Overview of the Internet, Protocol Layering (Book 1 Ch 1)
  - Application Layer: Paradigms, Client-Server Applications: World Wide Web & HTTP, FTP, Electronic Mail (SMTP, POP, IMAP), DNS.
  - Peer-to-Peer Paradigm: P2P Networks, Case Study: BitTorrent (Book 1 Ch 2).
* **Playlist Mapping**:
  - Videos 2–14: Intro, OSI 7-Layer Model, TCP/IP Model, Layer Functions.
  - Videos 192–200: DNS (Hierarchical namespace, resolution, records), Electronic Mail (Architecture, SMTP, POP, IMAP), FTP (Control vs Data connection), HTTP (Non-persistent vs Persistent, Request/Response formats).
* **Core Hours**: ~5.8 hours | **Optional**: ~1.4 hours

#### Module 2: Transport Layer & Network Layer (18 Contact Hours - Heaviest Module)
* **KTU Syllabus Topics**:
  - Transport Layer: Services, Protocols, UDP Datagram, TCP Header, Connection Establishment/Termination, Flow Control, Congestion Control (Book 1 Ch 3).
  - Network Layer: Network-layer protocols (IPv4, IPv6, ICMP, ARP), Unicast Routing (Distance Vector, Link State), Multicast Routing Basics, Intra-domain vs Inter-domain Routing, Next Generation IP, Quality of Service (QoS) & Traffic Shaping (Leaky Bucket, Token Bucket) (Book 1 Ch 4 & 8).
* **Playlist Mapping**:
  - Videos 118–146: IPv4 addressing, Classful vs Classless (CIDR), Subnetting & Masking, IPv4 Header, Fragmentation, ARP & ICMP.
  - Videos 147–158: Forwarding, Distance Vector Routing, Count to Infinity problem & solutions, Link State Routing (Dijkstra-based).
  - Videos 159–191: UDP, TCP Header, Sequence numbers, 3-Way Handshake, TCP State Transition, Flow Control, Congestion Control (AIMD), Leaky Bucket & Token Bucket algorithms.
* **Core Hours**: ~23.5 hours | **Optional**: ~13.8 hours

#### Module 3: Data-Link Layer (11 Contact Hours)
* **KTU Syllabus Topics**:
  - Data Link Control (DLC): Framing, Flow and Error Control, CRC, Checksums, Hamming Codes, Stop-and-Wait, Go-Back-N, Selective Repeat.
  - Multiple Access Protocols (MAC): ALOHA, Slotted ALOHA, CSMA, CSMA/CD, CSMA/CA.
  - Link-layer addressing, Ethernet Protocol, Connecting Devices (Hubs, Repeaters, Bridges, Switches, Routers, Gateways).
  - Wireless LANs (802.11) & Mobile IP.
* **Playlist Mapping**:
  - Videos 41–57: Hamming distance, Parity, Cyclic Redundancy Check (CRC), Checksum, Hamming Codes.
  - Videos 58–84: Framing, Flow control, Stop & Wait ARQ, Go-Back-N ARQ, Selective Repeat ARQ.
  - Videos 85–106: Random access (ALOHA, CSMA, CSMA/CD, CSMA/CA), Controlled access (Polling, Token passing).
  - Videos 107–117: Ethernet frame format, Connecting devices (Hub, Bridge, Switch, Router, Gateway), Collision and Broadcast domains.
* **Core Hours**: ~12.2 hours | **Optional**: ~4.1 hours

#### Module 4: Physical Layer & Network Management (9 Contact Hours)
* **KTU Syllabus Topics**:
  - SNMP, ASN.1 (Book 1 Ch 9).
  - Physical Layer: Data & Signals (Analog, Digital, Composite), Digital Transmission (Line coding: NRZ, RZ, Manchester), Analog Transmission, Bandwidth Utilization (Multiplexing: FDM, TDM, WDM), Transmission Media.
* **Playlist Mapping**:
  - Videos 15–40: Analog and digital signals, Line coding techniques (NRZ-L, NRZ-I, RZ, Manchester), Bit rate vs Baud rate, Serial vs Parallel, Delay & Bandwidth metrics, Multiplexing (FDM, WDM, TDM).
* **Core Hours**: ~7.2 hours | **Optional**: ~2.7 hours

---

## 5. DAA (S5 CSE - PCCST502) & S3 DSA (S3 CSE - PCCST303)

The single 298-video playlist covers both subjects. Partitioning summary:

```
Combined Playlist: 298 Videos (10,974.5 minutes ≈ 182.9 hours)
├── S3 DSA Specific Portions: 163 Videos (data/processed/S3_DSA_Study_Portions.csv)
├── S5 DAA Specific Portions: 164 Videos (data/processed/S5_DAA_Study_Portions.csv)
├── Common Foundations (Both): 57 Videos (Asymptotic notations, BFS/DFS, Merge/Quick Sort, Dijkstra)
├── Study Plan Total (Core + Optional): 270 Videos (data/processed/Data_Structures_and_Algorithms_Study_Portions.csv)
└── Removed (Irrelevant / Overkill): 28 Videos (data/processed/Data_Structures_and_Algorithms_Removed_Portions.csv)
```

### S5 DAA (PCCST502) — Exam Date: Nov 27 (8 Days Left)
* **Module 1**: Algorithms criteria, Asymptotic Notations & properties, Time/Space complexity of simple algorithms, Analysis of recursive algorithms (Recurrence equations, Substitution method, Recursion Tree method, Master's Theorem), Balanced Search Trees: AVL Trees (Insertions/deletions with all rotations in detail).
  * *Playlist Videos*: 2–24, 33–62, 138–143.
* **Module 2**: Disjoint Sets (Union-find, Union by rank, Path compression), Graph Representations, Traversals (BFS, DFS, Strongly Connected Components), Topological Sorting, Divide & Conquer (Control Abstraction, Merge Sort, Strassen's Matrix Multiplication).
  * *Playlist Videos*: 147–161, 197–205, 208–218, 231–232, 265–266.
* **Module 3**: Greedy Strategy (Control Abstraction, Fractional Knapsack, Prim's & Kruskal's MST, Dijkstra's Shortest Path), Dynamic Programming (Control Abstraction, Principle of Optimality, Matrix Chain Multiplication, Floyd-Warshall Algorithm), Backtracking (Control Abstraction, N-Queens Problem).
  * *Playlist Videos*: 233–258, 259–262, 267–273, 286–287.
* **Module 4**: Branch and Bound (Control Abstraction, Traveling Salesman Problem), Complexity Classes (P, NP, NP-Hard, NP-Complete, Clique & Vertex Cover proofs), Approximation (Bin Packing), Randomized Algorithms (Monte Carlo, Las Vegas, Randomized Quick Sort).
  * *Playlist Videos*: 228 (Randomized Quick Sort), 285 (TSP).

### S3 DSA (PCCST303) — Exam Date: Nov 30 (11 Days Left)
* **Module 1**: Definitions, Data Abstraction, Time & Space Complexity, Asymptotic Notations, Arrays (Polynomial representation, Sparse Matrix tuple representation), Stacks & Queues (Multi-stacks, Circular Queues, Deque), Evaluation of Expressions (Infix to Postfix conversion, Postfix evaluation).
  * *Playlist Videos*: 2–15, 25–32, 99–102, 164–181, 187–193.
* **Module 2**: Linked Lists (Singly, Doubly, Circular Linked List operations, Stacks & Queues using Linked List, Polynomial representation using Linked List), Memory Management (First-fit, Best-fit, Worst-fit schemes, Garbage collection, Compaction).
  * *Playlist Videos*: 103–116, 169.
* **Module 3**: Trees (Binary Tree properties, representations, tree operations, traversals: Inorder, Preorder, Postorder), Expression Trees, Binary Search Trees (BST operations), Binary Heaps (Heap operations, Priority Queue), Graphs (Definitions, Representations, BFS, DFS, Single-Source Shortest Path).
  * *Playlist Videos*: 117–132, 145–161, 182–183, 259–262.
* **Module 4**: Sorting (Selection Sort, Insertion Sort, Quick Sort, Merge Sort, Heap Sort, Radix Sort), Searching (Linear Search, Binary Search), Hashing (Hash functions: Mid-square, Division, Folding, Digit Analysis; Collision Resolution: Linear Probing, Quadratic Probing, Double Hashing, Open Hashing / Chaining).
  * *Playlist Videos*: 63–98, 208–212, 219–224, 288–298.

---

## 6. Time & Study Pace Matrix (Action Plan)

*Last Updated: 2026-11-19 08:51 IST*

| Target Exam | Exam Date | Available Days | Total Core Hours | At 1.0x Speed | At 1.25x Speed | At 1.5x Speed (Recommended) | Daily Target (1.5x) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Computer Networks** | Nov 23 | 4 Days | 48.7 hrs | 12.2 hrs/day | 9.7 hrs/day | **32.5 hrs (8.1 hrs/day)** | **8 hours/day** |
| **DAA** | Nov 27 | 8 Days | 58.4 hrs | 7.3 hrs/day | 5.8 hrs/day | **38.9 hrs (4.9 hrs/day)** | **5 hours/day** |
| **S3 DSA** | Nov 30 | 11 Days | 52.8 hrs | 4.8 hrs/day | 3.8 hrs/day | **35.2 hrs (3.2 hrs/day)** | **3.5 hours/day** |

---

## 7. Curated Dataset Files Location

All processed files reside in `data/processed/`:
1. `data/processed/Data_Structures_and_Algorithms_Study_Portions.csv`
2. `data/processed/Data_Structures_and_Algorithms_Removed_Portions.csv`
3. `data/processed/S3_DSA_Study_Portions.csv`
4. `data/processed/S5_DAA_Study_Portions.csv`
5. `data/processed/Computer_Networks_Study_Portions.csv`
6. `data/processed/Computer_Networks_Removed_Portions.csv`
7. `data/playlist_data.json`
