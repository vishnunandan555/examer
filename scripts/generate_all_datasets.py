import csv
import json
import os
import shutil

LAST_UPDATED_ISO = '2026-11-19T08:51:05+05:30'
LAST_UPDATED_DISPLAY = '2026-11-19 08:51 IST'

RAW_DIR = 'data/raw'
PROCESSED_DIR = 'data/processed'
os.makedirs(PROCESSED_DIR, exist_ok=True)

# Load original DSA CSV
dsa_csv_path = os.path.join(RAW_DIR, 'Data Structures and Algorithms for GATE — Complete Playlist.csv')
with open(dsa_csv_path, encoding='utf-8') as f:
    dsa_raw = list(csv.DictReader(f))

# Load original CN CSV
cn_csv_path = os.path.join(RAW_DIR, 'Computer Networks (CN) for GATE — Complete Playlist.csv')
with open(cn_csv_path, encoding='utf-8') as f:
    cn_raw = list(csv.DictReader(f))

dsa_records = []
for idx, r in enumerate(dsa_raw, start=1):
    title = r['Title']
    url = r['Video url']
    dur = float(r['Duration in minutes'])
    
    subject = "None"
    module = "None"
    topic = ""
    status = "Core"
    reason = ""

    if idx == 1:
        status = "Removed"
        reason = "GATE syllabus intro - not university course content"
    elif idx in [2, 3]:
        subject = "Both"
        module = "S3-M1 / S5-M1"
        topic = "Introduction to Data Structures & Algorithms"
        status = "Core"
        reason = "Foundational definitions, algorithms criteria, and abstract concepts"
    elif idx in [4, 5]:
        subject = "Both"
        module = "S3-M1 / S5-M1"
        topic = "Algorithm Analysis Criteria (Apriori & Aposteriori)"
        status = "Core"
        reason = "Characteristics and criteria for analyzing algorithms"
    elif 6 <= idx <= 15:
        subject = "Both"
        module = "S3-M1 / S5-M1"
        topic = "Asymptotic Notations (Big-O, Omega, Theta, o, w) & Properties"
        status = "Core"
        reason = "Fundamental asymptotic notations and their mathematical properties"
    elif 16 <= idx <= 24:
        subject = "S5 DAA"
        module = "S5-M1"
        topic = "Asymptotic Notations Complexity Calculation Practice"
        if idx in [16, 17, 18]:
            status = "Core"
            reason = "Key practice for university exam complexity questions"
        else:
            status = "Optional"
            reason = "Extra practice problems; review if time permits"
    elif 25 <= idx <= 31:
        subject = "Both"
        module = "S3-M1 / S5-M1"
        topic = "Time Complexity Calculation of Iterative Algorithms"
        if idx in [25, 26, 27, 28]:
            status = "Core"
            reason = "Step-by-step complexity calculation of iterative loops"
        else:
            status = "Optional"
            reason = "Additional nested loop practice problems"
    elif idx == 32:
        subject = "Both"
        module = "S3-M1 / S5-M1"
        topic = "Space Complexity Calculation of Iterative Algorithms"
        status = "Core"
        reason = "Required in both S3 DSA & S5 DAA performance analysis"
    elif 33 <= idx <= 39:
        subject = "S5 DAA"
        module = "S5-M1"
        topic = "Analysis of Recursive Algorithms & Recurrences"
        if idx in [33, 34, 35, 39]:
            status = "Core"
            reason = "Recursion tree / time-space analysis (e.g. Fibonacci)"
        else:
            status = "Optional"
            reason = "Extended recursive complexity practice"
    elif idx in [40, 41]:
        subject = "S5 DAA"
        module = "S5-M1"
        topic = "Recursive Analysis - Tower of Hanoi"
        status = "Core"
        reason = "Classic recursion and recurrence example frequently asked in university exams"
    elif 42 <= idx <= 46:
        subject = "S5 DAA"
        module = "S5-M1"
        topic = "Solving Recurrences: Substitution Method"
        if idx in [42, 43, 44]:
            status = "Core"
            reason = "Syllabus explicitly specifies Substitution Method"
        else:
            status = "Optional"
            reason = "Additional substitution problems"
    elif 47 <= idx <= 52:
        subject = "S5 DAA"
        module = "S5-M1"
        topic = "Solving Recurrences: Recursion Tree Method"
        if idx in [47, 48, 49]:
            status = "Core"
            reason = "Syllabus explicitly specifies Recursion Tree Method"
        else:
            status = "Optional"
            reason = "Advanced recursion tree variants"
    elif 53 <= idx <= 57:
        subject = "S5 DAA"
        module = "S5-M1"
        topic = "Master's Theorem for Recurrence Relations"
        if idx in [53, 54, 55]:
            status = "Core"
            reason = "Directly part of DAA Module 1 (proof not expected, cases required)"
        else:
            status = "Optional"
            reason = "Detailed derivations / edge cases"
    elif 58 <= idx <= 62:
        subject = "S5 DAA"
        module = "S5-M1"
        topic = "Master's Theorem Practice & Extensions"
        if idx in [58, 59]:
            status = "Core"
            reason = "High yield practice for exam questions"
        else:
            status = "Optional"
            reason = "Extended Master Theorem and deep practice"
    elif 63 <= idx <= 65:
        subject = "S3 DSA"
        module = "S3-M4"
        topic = "Linear Search & Analysis"
        if idx in [63, 64]:
            status = "Core"
            reason = "Linear search algorithm & complexity (S3 DSA Module 4)"
        else:
            status = "Optional"
            reason = "Extra practice problems on linear search"
    elif 66 <= idx <= 75:
        subject = "S3 DSA"
        module = "S3-M4"
        topic = "Binary Search & Analysis"
        if idx in [66, 67, 69, 70]:
            status = "Core"
            reason = "Binary search, average case comparison analysis"
        elif idx in [68, 71, 72]:
            status = "Optional"
            reason = "Modified binary search / placement questions"
        else:
            status = "Removed"
            reason = "Excessive placement practice problems"
    elif idx in [76, 77]:
        subject = "S3 DSA"
        module = "S3-M4"
        topic = "Selection Sort"
        status = "Core"
        reason = "Selection sort algorithm, stability, in-place, complexity"
    elif idx in [78, 79]:
        subject = "S3 DSA"
        module = "S3-M4"
        topic = "Bubble Sort"
        status = "Optional"
        reason = "Foundational sorting concept (good for comparison with Selection/Insertion)"
    elif 80 <= idx <= 82:
        subject = "S3 DSA"
        module = "S3-M4"
        topic = "Insertion Sort"
        if idx in [80, 81]:
            status = "Core"
            reason = "Insertion sort algorithm and complexity analysis"
        else:
            status = "Optional"
            reason = "Additional analysis practice"
    elif idx in [83, 84]:
        subject = "S3 DSA"
        module = "S3-M4"
        topic = "Counting Sort (Linear Time Sort)"
        status = "Optional"
        reason = "Foundation for Radix Sort, useful supplementary sorting concept"
    elif idx in [85, 86]:
        subject = "S3 DSA"
        module = "S3-M4"
        topic = "Radix Sort"
        status = "Core"
        reason = "Explicitly in S3 DSA Module 4 syllabus"
    elif 87 <= idx <= 98:
        subject = "S3 DSA"
        module = "S3-M4 / S3-M3"
        topic = "Heap Sort & Binary Heap Operations"
        if idx in [87, 88, 89, 90, 91, 92]:
            status = "Core"
            reason = "Heap sort algorithm, max/min heapify, build heap, complexity"
        elif idx in [93, 94, 95]:
            status = "Optional"
            reason = "Advanced heap operations and priority queue analysis"
        else:
            status = "Removed"
            reason = "Repetitive practice questions on heap"
    elif 99 <= idx <= 102:
        subject = "S3 DSA"
        module = "S3-M1"
        topic = "Arrays & Memory Representation / Row-Column Major"
        if idx in [99, 100, 101]:
            status = "Core"
            reason = "Array representation and addressing in memory (S3 DSA Module 1)"
        else:
            status = "Optional"
            reason = "Extended multidimensional array indexing"
    elif 103 <= idx <= 116:
        subject = "S3 DSA"
        module = "S3-M2"
        topic = "Linked Lists (Singly, Doubly, Circular)"
        if idx in [103, 104, 105, 106, 107, 108, 111, 112]:
            status = "Core"
            reason = "Linked list operations (insertion, deletion, traversal, doubly & circular)"
        elif idx in [109, 110, 113, 114]:
            status = "Optional"
            reason = "Specialized linked list algorithms and problem solving"
        else:
            status = "Removed"
            reason = "Excessive competitive programming questions on linked lists"
    elif 117 <= idx <= 122:
        subject = "S3 DSA"
        module = "S3-M3"
        topic = "Tree Concepts, Binary Tree Representation & Properties"
        if idx in [117, 118, 119, 120]:
            status = "Core"
            reason = "Basic definitions, binary tree properties, tree formulas"
        else:
            status = "Optional"
            reason = "Additional tree properties and theorems"
    elif 123 <= idx <= 127:
        subject = "S3 DSA"
        module = "S3-M3"
        topic = "Binary Search Tree (BST) Operations"
        if idx in [123, 124, 125, 126]:
            status = "Core"
            reason = "BST creation, insertion, deletion, searching"
        else:
            status = "Optional"
            reason = "BST complex deletion edge cases"
    elif 128 <= idx <= 132:
        subject = "S3 DSA"
        module = "S3-M3"
        topic = "Tree Traversals (Inorder, Preorder, Postorder, Level order)"
        if idx in [128, 129, 130, 131]:
            status = "Core"
            reason = "Tree traversal algorithms and tree reconstruction from traversals"
        else:
            status = "Optional"
            reason = "Extended traversal practice"
    elif 133 <= idx <= 137:
        if idx in [135, 136]:
            subject = "S3 DSA"
            module = "S3-M3"
            topic = "Catalan Numbers & Counting Binary Trees"
            status = "Optional"
            reason = "Number of binary trees with n nodes"
        else:
            subject = "S3 DSA"
            module = "S3-M3"
            topic = "GATE PYQs on Trees"
            status = "Removed"
            reason = "Specialized GATE questions (Leftmost child right sibling, etc.)"
    elif 138 <= idx <= 143:
        subject = "S5 DAA"
        module = "S5-M1"
        topic = "AVL Trees (Rotations: LL, RR, LR, RL & Insertion/Deletion)"
        if idx in [138, 139, 140, 141, 142]:
            status = "Core"
            reason = "Explicitly in S5 DAA Module 1 (Insertion & Deletion with all rotations in detail)"
        else:
            status = "Optional"
            reason = "Advanced AVL deletion examples"
    elif idx in [144, 145, 146]:
        if idx == 145:
            subject = "S3 DSA"
            module = "S3-M3"
            topic = "Expression Trees"
            status = "Core"
            reason = "Expression trees explicitly listed in S3 DSA Module 3"
        elif idx == 146:
            subject = "S3 DSA"
            module = "S3-M3"
            topic = "Various Tree Representations"
            status = "Core"
            reason = "Array & linked representation of trees"
        else:
            subject = "S3 DSA"
            module = "S3-M3"
            topic = "Sub Trees GATE PYQ"
            status = "Removed"
            reason = "GATE 2014 specific question"
    elif idx in [147, 148]:
        subject = "Both"
        module = "S3-M3 / S5-M2"
        topic = "Graph Representations (Adjacency Matrix & Adjacency List)"
        status = "Core"
        reason = "Foundational for both S3 DSA Module 3 and S5 DAA Module 2"
    elif 149 <= idx <= 161:
        subject = "Both"
        module = "S3-M3 / S5-M2"
        topic = "Graph Traversals (BFS, DFS, Edge Classifications, Analysis)"
        if idx in [149, 150, 151, 152, 153, 154, 158, 159]:
            status = "Core"
            reason = "BFS/DFS algorithm, discovery/finish times, tree/back/forward/cross edges"
        elif idx in [155, 156, 157, 160, 161]:
            status = "Optional"
            reason = "Iterative DFS / extra edge properties"
        else:
            status = "Removed"
            reason = "Repetitive edge analysis"
    elif idx in [162, 163]:
        subject = "S3 DSA"
        module = "S3-M1"
        topic = "Parameter Passing (Call by value, Call by reference)"
        status = "Optional"
        reason = "Programming concepts useful for implementation"
    elif 164 <= idx <= 169:
        subject = "S3 DSA"
        module = "S3-M1 / S3-M2"
        topic = "Stacks (Operations & Array/Linked List Implementation)"
        if idx in [164, 165, 166, 167, 169]:
            status = "Core"
            reason = "Stack ADT, push/pop operations, array & LL implementation"
        else:
            status = "Removed"
            reason = "GATE PYQs on stack"
    elif 170 <= idx <= 181:
        subject = "S3 DSA"
        module = "S3-M1"
        topic = "Queues & Circular Queues & Deque"
        if idx in [170, 171, 172, 173, 174, 175, 176, 180, 181]:
            status = "Core"
            reason = "Queue ADT, linear queue, circular queue, deque"
        elif idx in [177, 178]:
            status = "Removed"
            reason = "GATE question specific videos"
        else:
            status = "Optional"
            reason = "Queue variations"
    elif idx in [182, 183]:
        subject = "S3 DSA"
        module = "S3-M3"
        topic = "Priority Queue & Heap Operations"
        status = "Core"
        reason = "Explicitly in S3 DSA Module 3 (Priority Queue using Heaps)"
    elif 184 <= idx <= 195:
        if idx in [187, 188, 189, 191, 192]:
            subject = "S3 DSA"
            module = "S3-M1"
            topic = "Evaluation of Expressions (Infix to Postfix, Postfix Evaluation)"
            status = "Core"
            reason = "Directly listed in S3 DSA Module 1"
        elif idx in [184, 185, 186, 194, 195]:
            subject = "S3 DSA"
            module = "S3-M1"
            topic = "Stack Application in Recursion & Call Frames"
            status = "Optional"
            reason = "Run-time stack and recursion mechanics"
        elif idx == 190:
            subject = "S5 DAA"
            module = "S5-M3"
            topic = "MST Concept Question"
            status = "Optional"
            reason = "Practice question on Minimum Spanning Trees"
        else:
            status = "Optional"
            reason = "Infix to prefix conversion"
    elif idx == 196:
        status = "Removed"
        reason = "GATE Algorithms syllabus intro video"
    elif 197 <= idx <= 205:
        subject = "S5 DAA"
        module = "S5-M2"
        topic = "Divide and Conquer (Control Abstraction & Min-Max Algorithm)"
        if idx in [197, 198, 199, 201, 202]:
            status = "Core"
            reason = "Control abstraction of Divide and Conquer and Min-Max problem"
        else:
            status = "Optional"
            reason = "Detailed steps and power of element"
    elif idx in [206, 207]:
        subject = "S5 DAA"
        module = "S5-M2"
        topic = "Binary Search as Divide and Conquer Application"
        status = "Optional"
        reason = "Recurrence and DAC perspective of Binary Search"
    elif 208 <= idx <= 218:
        subject = "Both"
        module = "S3-M4 / S5-M2"
        topic = "Merge Sort (Algorithm, Recurrence, Complexity Analysis)"
        if idx in [208, 209, 210, 211, 212]:
            status = "Core"
            reason = "Merge sort implementation, 2-way merging, recurrence analysis"
        elif idx in [214, 215, 216]:
            status = "Optional"
            reason = "Union/intersection and k-way merge applications"
        else:
            status = "Removed"
            reason = "Fibonacci merge sort and inversion count (outside KTU syllabus)"
    elif 219 <= idx <= 227:
        subject = "Both"
        module = "S3-M4 / S5-M2"
        topic = "Quick Sort (Partitioning, Best/Worst/Avg Case Analysis)"
        if idx in [219, 220, 221, 222, 223, 224]:
            status = "Core"
            reason = "Partition algorithm, pivot selection, recurrence and complexity"
        else:
            status = "Optional"
            reason = "Extended worst-case scenarios and recursion depth"
    elif idx == 228:
        subject = "S5 DAA"
        module = "S5-M4"
        topic = "Randomized Quick Sort Algorithm & Analysis"
        status = "Core"
        reason = "Directly in S5 DAA Module 4 (Randomized version of Quick Sort)"
    elif idx in [229, 230]:
        subject = "S5 DAA"
        module = "S5-M2"
        topic = "Selection Problem / Quickselect Algorithm"
        status = "Optional"
        reason = "Linear-time median / kth element selection using D&C"
    elif idx in [231, 232]:
        subject = "S5 DAA"
        module = "S5-M2"
        topic = "Strassen's Matrix Multiplication & Analysis"
        status = "Core"
        reason = "Directly in S5 DAA Module 2 (Strassen's Matrix Multiplication, Analysis)"
    elif 233 <= idx <= 238:
        if idx in [233, 236, 237, 238]:
            subject = "S5 DAA"
            module = "S5-M3"
            topic = "Greedy Strategy & Fractional Knapsack Problem"
            status = "Core"
            reason = "Directly in S5 DAA Module 3 (Greedy Strategy Control Abstraction, Fractional Knapsack)"
        else:
            subject = "S5 DAA"
            module = "S5-M3"
            topic = "Job Sequencing with Deadlines"
            status = "Optional"
            reason = "Standard greedy technique, excellent for conceptual understanding"
    elif 239 <= idx <= 242:
        subject = "S5 DAA"
        module = "S5-M3"
        topic = "Greedy Strategy - Huffman Coding & Optimal Merge Pattern"
        status = "Optional"
        reason = "Classic greedy applications often asked in university questions"
    elif 243 <= idx <= 258:
        subject = "S5 DAA"
        module = "S5-M3"
        topic = "Minimum Cost Spanning Tree (Prim's & Kruskal's Algorithms)"
        if idx in [243, 244, 245, 246, 247, 248, 249]:
            status = "Core"
            reason = "Directly in S5 DAA Module 3 (Kruskal's and Prim's, Analysis)"
        elif idx in [250, 251, 252, 253]:
            status = "Optional"
            reason = "Cut property, cycle property, MST variations"
        else:
            status = "Removed"
            reason = "Excessive practice videos on spanning tree"
    elif 259 <= idx <= 262:
        subject = "Both"
        module = "S3-M3 / S5-M3"
        topic = "Shortest Path Problem - Dijkstra's Algorithm & Analysis"
        if idx in [259, 260, 261]:
            status = "Core"
            reason = "Single Source Shortest Path in both S3 DSA Module 3 and S5 DAA Module 3"
        else:
            status = "Optional"
            reason = "Negative weight edge behavior and limitations"
    elif idx in [263, 264]:
        subject = "S5 DAA"
        module = "S5-M3"
        topic = "Bellman-Ford Algorithm (Comparison with Dijkstra)"
        status = "Optional"
        reason = "Valuable comparison for Dijkstra limitations, though not standalone topic"
    elif idx == 265:
        subject = "S5 DAA"
        module = "S5-M2"
        topic = "Topological Sorting (using DFS and BFS / Kahn's)"
        status = "Core"
        reason = "Directly in S5 DAA Module 2 (Topological Sorting)"
    elif idx == 266:
        subject = "S5 DAA"
        module = "S5-M2"
        topic = "Shortest Path in Directed Acyclic Graphs"
        status = "Optional"
        reason = "Application of topological sorting"
    elif 267 <= idx <= 273:
        if idx in [267, 268]:
            subject = "S5 DAA"
            module = "S5-M3"
            topic = "Dynamic Programming (Control Abstraction & Principle of Optimality)"
            status = "Core"
            reason = "Directly in S5 DAA Module 3 (Control Abstraction, Optimality Principle)"
        elif idx in [270, 271, 272]:
            subject = "S5 DAA"
            module = "S5-M3"
            topic = "Matrix Chain Multiplication (MCM) & Analysis"
            status = "Core"
            reason = "Directly in S5 DAA Module 3 (Matrix Chain Multiplication, Analysis)"
        elif idx in [269, 273]:
            subject = "S5 DAA"
            module = "S5-M3"
            topic = "MCM Practice & GATE PYQs"
            status = "Optional"
            reason = "Extra practice problems on MCM"
    elif 274 <= idx <= 277:
        subject = "S5 DAA"
        module = "S5-M3"
        topic = "Longest Common Subsequence (LCS)"
        status = "Optional"
        reason = "Classic DP problem; helpful for understanding DP tables though not strictly named in syllabus"
    elif idx in [278, 279]:
        status = "Removed"
        reason = "Multistage Graph is not in KTU S5 DAA syllabus (MCM and Floyd-Warshall are specified)"
    elif 280 <= idx <= 282:
        subject = "S5 DAA"
        module = "S5-M3"
        topic = "0/1 Knapsack Problem using Dynamic Programming"
        status = "Optional"
        reason = "Frequently tested in algorithm interviews and contrast with Fractional Knapsack"
    elif idx in [283, 284]:
        subject = "S5 DAA"
        module = "S5-M3"
        topic = "Subset Sum Problem"
        status = "Optional"
        reason = "Foundation for NP-complete reductions"
    elif idx == 285:
        subject = "S5 DAA"
        module = "S5-M4"
        topic = "Traveling Salesman Problem (TSP)"
        status = "Core"
        reason = "Directly in S5 DAA Module 4 (Branch and Bound / TSP)"
    elif idx in [286, 287]:
        subject = "S5 DAA"
        module = "S5-M3"
        topic = "All Pairs Shortest Path - Floyd-Warshall Algorithm"
        status = "Core"
        reason = "Directly in S5 DAA Module 3 (Floyd-Warshall Algorithm, Analysis)"
    elif 288 <= idx <= 298:
        subject = "S3 DSA"
        module = "S3-M4"
        topic = "Hashing & Collision Resolution Techniques"
        if idx in [288, 289, 290, 291, 292, 293]:
            status = "Core"
            reason = "Hash functions (Mid-square, division, folding), Collision resolution (Linear/Quadratic probing, Double hashing, Open hashing)"
        elif idx in [294, 295, 297, 298]:
            status = "Optional"
            reason = "Advanced hash table load factor & uniform hashing analysis"
        else:
            status = "Removed"
            reason = "GATE PYQ collection video"
    
    dsa_records.append({
        'Index': idx,
        'Title': title,
        'Duration': dur,
        'Video url': url,
        'Subject': subject,
        'Module': module,
        'Topic': topic,
        'Status': status,
        'Reason': reason,
        'Last Updated': LAST_UPDATED_DISPLAY
    })

# CN records
cn_records = []
for idx, r in enumerate(cn_raw, start=1):
    title = r['Title']
    url = r['Video url']
    dur = float(r['Duration in minutes'])
    
    subject = 'S5 CN'
    module = ''
    topic = ''
    status = 'Core'
    reason = ''
    
    if idx == 1:
        status = 'Removed'
        reason = 'GATE syllabus intro video - not course content'
    elif 2 <= idx <= 14:
        module = 'Module 1'
        topic = 'Network Models (OSI, TCP/IP, Protocol Layering)'
        if 'why OSI model failed' in title:
            status = 'Optional'
            reason = 'Historical context on OSI vs TCP/IP'
        else:
            status = 'Core'
            reason = 'Core concept of layered architecture and layer duties'
    elif 15 <= idx <= 40:
        module = 'Module 4'
        if idx in [15, 16, 17, 18]:
            topic = 'Data & Signals (Analog, Digital, Composite)'
            status = 'Core'
            reason = 'Explicit in Module 4 Physical Layer'
        elif idx in [19, 20, 21, 22, 24, 25]:
            topic = 'Digital Transmission & Signal Encoding (NRZ, RZ, Manchester)'
            status = 'Core'
            reason = 'Line coding techniques in Physical Layer'
        elif idx in [27, 28]:
            topic = 'Transmission Impairments & Transmission Modes'
            status = 'Core'
            reason = 'Bit rate, baud rate, serial vs parallel transmission'
        elif idx in [32, 33]:
            topic = 'Bandwidth, Throughput, Propagation & Transmission Delay'
            status = 'Core'
            reason = 'Essential performance metrics & delay calculations'
        elif idx in [35, 36, 37]:
            topic = 'Bandwidth Utilization: Multiplexing (FDM, WDM, TDM)'
            status = 'Core'
            reason = 'Explicitly in Module 4 Bandwidth utilization'
        elif any(k in title.lower() for k in ['gate', 'numerical']):
            topic = 'Physical Layer Numerical Practice'
            if idx in [34, 38]:
                status = 'Optional'
                reason = 'Representative numerical on delay & TDM'
            else:
                status = 'Removed'
                reason = 'Specific isolated GATE PYQ'
        else:
            topic = 'Physical Layer Details'
            status = 'Optional'
            reason = 'Secondary physical layer concept'
    elif 41 <= idx <= 57:
        module = 'Module 3'
        if idx in [41, 42, 43, 44]:
            topic = 'Error Detection Concepts & Hamming Distance'
            status = 'Core'
            reason = 'Foundation of error control in Data Link Layer'
        elif idx in [45, 46, 49, 50, 51, 54, 55]:
            topic = 'Error Detecting Codes (Parity, CRC, Checksum, Hamming Code)'
            status = 'Core'
            reason = 'Core syllabus topics for DLC error detection'
        elif any(k in title.lower() for k in ['gate', '2d parity check']):
            topic = 'Error Detection GATE Questions'
            if idx in [47, 56]:
                status = 'Optional'
                reason = 'Helpful worked examples on 2D parity & Hamming code'
            else:
                status = 'Removed'
                reason = 'Isolated GATE PYQ'
        else:
            topic = 'Cyclic codes & error control'
            status = 'Optional'
            reason = 'In-depth code theory'
    elif 58 <= idx <= 84:
        module = 'Module 3'
        if idx in [58, 59, 60, 62, 63, 68, 69, 74, 80]:
            topic = 'Flow Control Protocols (Stop-and-Wait, GBN, Selective Repeat)'
            status = 'Core'
            reason = 'DLC protocol operation, window size, efficiency, throughput'
        elif idx in [61, 64, 71, 72, 82]:
            topic = 'Flow Control Variations & Analysis'
            status = 'Optional'
            reason = 'Piggybacking, link capacity, and pipelining comparisons'
        elif any(k in title.lower() for k in ['gate', 'question']):
            topic = 'Flow Control GATE Numericals'
            if idx in [65, 78]:
                status = 'Optional'
                reason = 'Standard university-level numerical practice'
            else:
                status = 'Removed'
                reason = 'Redundant GATE PYQ'
        else:
            topic = 'Sliding window details'
            status = 'Optional'
            reason = 'Supplementary sliding window detail'
    elif 85 <= idx <= 106:
        module = 'Module 3'
        if idx in [85, 86, 87, 88, 89, 92, 93, 94, 95, 96, 100, 101, 102, 103, 105, 106]:
            topic = 'Multiple Access Protocols (ALOHA, CSMA, CSMA/CD, CSMA/CA, Polling, Token Passing)'
            status = 'Core'
            reason = 'Explicit in Module 3 MAC protocols (including Token Passing)'
        elif idx in [90, 97, 104]:
            topic = 'MAC Protocol Analysis & Questions'
            status = 'Optional'
            reason = 'Efficiency analysis and controlled access detail'
        else:
            topic = 'MAC GATE PYQs'
            status = 'Removed'
            reason = 'Short single-year GATE question'
    elif 107 <= idx <= 117:
        module = 'Module 3'
        topic = 'Ethernet & Connecting Devices (Hub, Switch, Bridge, Router, Gateway)'
        if idx in [107, 108, 109, 110, 111, 112, 113, 114, 115, 116]:
            status = 'Core'
            reason = 'Connecting devices and Ethernet framing explicitly in Module 3'
        else:
            status = 'Optional'
            reason = 'Collision vs broadcast domain concepts'
    elif 118 <= idx <= 146:
        module = 'Module 2'
        if idx in [118, 119, 120, 121, 122, 125, 126, 129, 130, 132, 133, 134, 135, 136, 137, 139, 140, 142, 144, 146]:
            topic = 'IPv4 Addressing, Subnetting, CIDR, Header Format, Fragmentation, ARP & ICMP'
            status = 'Core'
            reason = 'Core Network Layer addressing, Supernetting, Fragmentation, and ICMP protocols'
        elif idx in [123, 124, 127, 131, 138, 141, 143, 145]:
            topic = 'Subnetting Practice & Protocol Details'
            status = 'Optional'
            reason = 'Extended subnetting problems, Supernetting, and RARP'
        else:
            topic = 'IP Addressing GATE PYQs'
            status = 'Removed'
            reason = 'Isolated multi-year GATE question sets'
    elif 147 <= idx <= 158:
        module = 'Module 2'
        if idx in [147, 148, 150, 151, 152, 154, 155, 156, 157, 158]:
            topic = 'Unicast Routing (Distance Vector, Count to Infinity, Link State)'
            status = 'Core'
            reason = 'Directly in Module 2 Routing protocols (Distance Vector & Link State)'
        elif idx in [149, 153]:
            topic = 'Routing Table Optimization & Routing Questions'
            status = 'Optional'
            reason = 'Routing table reduction and practice'
        else:
            topic = 'Routing GATE Questions'
            status = 'Removed'
            reason = 'GATE specific question video'
    elif 159 <= idx <= 191:
        module = 'Module 2'
        if idx in [159, 160, 161, 162, 163, 166, 167, 168, 169, 178, 181, 182, 183, 184, 185, 187]:
            topic = 'Transport Layer (UDP, TCP Header, Connection Management, Leaky/Token Bucket, AIMD)'
            status = 'Core'
            reason = 'Directly in Module 2 Transport layer & QoS'
        elif idx in [164, 165, 170, 171, 172, 173, 174, 175, 176, 177, 179, 180, 186, 188, 189, 190, 191]:
            topic = 'TCP In-Depth (State Machine, Timers, Flags, Silly Window Syndrome)'
            status = 'Optional'
            reason = 'Detailed state transitions, timers, and Silly Window Syndrome'
    elif 192 <= idx <= 201:
        module = 'Module 1'
        if idx in [192, 193, 194, 195, 196, 197, 198, 199]:
            topic = 'Application Layer Protocols (DNS, Email / SMTP, FTP, HTTP)'
            status = 'Core'
            reason = 'Explicitly listed in Module 1 Application layer'
        else:
            topic = 'Application Layer Review & Questions'
            status = 'Optional'
            reason = 'Application layer summary and PYQ points'
    elif idx == 202:
        status = 'Removed'
        reason = 'Course conclusion video'
    
    cn_records.append({
        'Index': idx,
        'Title': title,
        'Duration': dur,
        'Video url': url,
        'Subject': subject,
        'Module': module,
        'Topic': topic,
        'Status': status,
        'Reason': reason,
        'Last Updated': LAST_UPDATED_DISPLAY
    })

def write_csv(filename, fieldnames, data):
    filepath = os.path.join(PROCESSED_DIR, filename)
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in data:
            writer.writerow({k: row.get(k, '') for k in fieldnames})
    print(f"Generated {filepath} ({len(data)} rows)")

study_fields = ['Index', 'Subject', 'Module', 'Topic', 'Title', 'Duration in minutes', 'Video url', 'Status', 'Reason', 'Last Updated']
removed_fields = ['Index', 'Subject', 'Module', 'Topic', 'Title', 'Duration in minutes', 'Video url', 'Reason for Removal', 'Last Updated']

# 1. Combined DSA & DAA Study portions
dsa_study = [{
    'Index': r['Index'],
    'Subject': r['Subject'],
    'Module': r['Module'],
    'Topic': r['Topic'],
    'Title': r['Title'],
    'Duration in minutes': r['Duration'],
    'Video url': r['Video url'],
    'Status': r['Status'],
    'Reason': r['Reason'],
    'Last Updated': r['Last Updated']
} for r in dsa_records if r['Status'] in ['Core', 'Optional']]
write_csv('Data_Structures_and_Algorithms_Study_Portions.csv', study_fields, dsa_study)

# 2. Combined DSA & DAA Removed portions
dsa_removed = [{
    'Index': r['Index'],
    'Subject': r['Subject'],
    'Module': r['Module'],
    'Topic': r['Topic'],
    'Title': r['Title'],
    'Duration in minutes': r['Duration'],
    'Video url': r['Video url'],
    'Reason for Removal': r['Reason'],
    'Last Updated': r['Last Updated']
} for r in dsa_records if r['Status'] == 'Removed']
write_csv('Data_Structures_and_Algorithms_Removed_Portions.csv', removed_fields, dsa_removed)

# 3. S3 DSA specific study portions
s3_dsa_study = [r for r in dsa_study if r['Subject'] in ['S3 DSA', 'Both']]
write_csv('S3_DSA_Study_Portions.csv', study_fields, s3_dsa_study)

# 4. S5 DAA specific study portions
s5_daa_study = [r for r in dsa_study if r['Subject'] in ['S5 DAA', 'Both']]
write_csv('S5_DAA_Study_Portions.csv', study_fields, s5_daa_study)

# 5. CN Study portions
cn_study = [{
    'Index': r['Index'],
    'Subject': r['Subject'],
    'Module': r['Module'],
    'Topic': r['Topic'],
    'Title': r['Title'],
    'Duration in minutes': r['Duration'],
    'Video url': r['Video url'],
    'Status': r['Status'],
    'Reason': r['Reason'],
    'Last Updated': r['Last Updated']
} for r in cn_records if r['Status'] in ['Core', 'Optional']]
write_csv('Computer_Networks_Study_Portions.csv', study_fields, cn_study)

# 6. CN Removed portions
cn_removed = [{
    'Index': r['Index'],
    'Subject': r['Subject'],
    'Module': r['Module'],
    'Topic': r['Topic'],
    'Title': r['Title'],
    'Duration in minutes': r['Duration'],
    'Video url': r['Video url'],
    'Reason for Removal': r['Reason'],
    'Last Updated': r['Last Updated']
} for r in cn_records if r['Status'] == 'Removed']
write_csv('Computer_Networks_Removed_Portions.csv', removed_fields, cn_removed)

# JSON dump
app_data = {
    'lastUpdated': LAST_UPDATED_ISO,
    'lastUpdatedDisplay': LAST_UPDATED_DISPLAY,
    'examTimetable': [
        {'date': '2026-11-16', 'displayDate': 'Nov 16', 'subject': 'Machine Learning', 'code': 'CST307', 'type': 'Lab', 'status': 'completed'},
        {'date': '2026-11-18', 'displayDate': 'Nov 18', 'subject': 'Computer Networks', 'code': 'PCCST501-L', 'type': 'Lab', 'status': 'completed'},
        {'date': '2026-11-23', 'displayDate': 'Nov 23', 'subject': 'Computer Networks', 'code': 'PCCST501', 'type': 'Theory', 'status': 'upcoming', 'playlistKey': 'cn'},
        {'date': '2026-11-24', 'displayDate': 'Nov 24', 'subject': 'S3 Mathematics', 'code': 'MAT203', 'type': 'Supply', 'status': 'upcoming'},
        {'date': '2026-11-27', 'displayDate': 'Nov 27', 'subject': 'DAA', 'code': 'PCCST502', 'type': 'Theory', 'status': 'upcoming', 'playlistKey': 'daa'},
        {'date': '2026-11-30', 'displayDate': 'Nov 30', 'subject': 'S3 DSA', 'code': 'PCCST303', 'type': 'Supply', 'status': 'upcoming', 'playlistKey': 'dsa'},
        {'date': '2026-12-01', 'displayDate': 'Dec 1', 'subject': 'Machine Learning', 'code': 'CST307-T', 'type': 'Theory', 'status': 'upcoming'},
        {'date': '2026-12-04', 'displayDate': 'Dec 4', 'subject': 'Microcontrollers', 'code': 'CST309', 'type': 'Theory', 'status': 'upcoming'},
        {'date': '2026-12-07', 'displayDate': 'Dec 7', 'subject': 'Data Analytics', 'code': 'CST311', 'type': 'Theory', 'status': 'upcoming'},
        {'date': '2026-12-08', 'displayDate': 'Dec 8', 'subject': 'S3 EE/Ethics', 'code': 'HUT200', 'type': 'Supply', 'status': 'upcoming'}
    ],
    'dsa_all': dsa_records,
    'cn_all': cn_records
}

with open('data/playlist_data.json', 'w', encoding='utf-8') as f:
    json.dump(app_data, f, indent=2)

os.makedirs('src/data', exist_ok=True)
shutil.copy('data/playlist_data.json', 'src/data/playlist_data.json')

print("Updated and generated all processed CSVs and JSON data successfully!")
