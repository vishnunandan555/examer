# 🎓 EXAMER — KTU CSE Exam Preparation & Syllabus Progress Tracker

> **Last Updated**: November 19, 2026, 09:43 AM IST (`2026-11-19T09:43:00+05:30`)  
> **Academic Context**: B.Tech Computer Science & Engineering (KTU Syllabus, S5 Regular & S3 Supply)  
> **Repository**: [git@github.com:vishnunandan555/examer.git](git@github.com:vishnunandan555/examer.git)  
> **Safe Archive Branch**: `archive/playlist-suite` (Full historical GATE playlist curated suite)

A pure, distraction-free **Syllabus Progress & Exam Clearance Tracker** built with **React 18 + Vite** and styled with an **Obsidian pitch-dark theme**. 

Zero video fluff. Instead of spending hundreds of hours watching playlists, this application breaks down the **exact official KTU course syllabi** into actionable, high-yield mastery checklists to clear every upcoming university examination.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Production build (0 warnings, 0 errors)
npm run build
```

---

## 📅 Official Examination Schedule

*Time-synchronized to 2026-11-19 09:43 IST*

| Date | Examination | Subject Code | Type | Days Left | Status & Target |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Nov 16** | Machine Learning Lab | CST307 | Lab | *Completed* | ✅ Done |
| **Nov 18** | Computer Networks Lab | PCCST501-L | Lab | *Completed* | ✅ Done |
| **Nov 23** | **Computer Networks** | **PCCST501** | **Theory** | **4 Days Left** | 🔥 **CRITICAL (Immediate Focus)** |
| **Nov 24** | S3 Mathematics | MAT203 | Supply | 5 Days Left | High Priority |
| **Nov 27** | **DAA (Algorithms)** | **PCCST502** | **Theory** | **8 Days Left** | 🔥 **HIGH PRIORITY** |
| **Nov 30** | **S3 DSA (Supply)** | **PCCST303** | **Supply** | **11 Days Left** | 🔥 **HIGH PRIORITY** |
| **Dec 01** | Machine Learning | CST307-T | Theory | 12 Days Left | Upcoming |
| **Dec 04** | Microcontrollers | CST309 | Theory | 15 Days Left | Upcoming |
| **Dec 07** | Data Analytics | CST311 | Theory | 18 Days Left | Upcoming |
| **Dec 08** | S3 EE / Ethics | HUT200 | Supply | 19 Days Left | Upcoming |

---

## 📚 Syllabus Structure & Mastery Checklists

Each course is organized into its official KTU 4-module distribution with marks weightage, concept summaries, and priority tags:

| Subject | Modules | Topics Covered | Exam Pattern & Marks |
| :--- | :--- | :--- | :--- |
| **Computer Networks (`PCCST501`)** | Modules 1 to 4 | **30 Topics** | Part A: 8Q x 3M (24M) • Part B: 4M x 9M (36M) = 60 Marks |
| **DAA Algorithms (`PCCST502`)** | Modules 1 to 4 | **21 Topics** | Part A: 8Q x 3M (24M) • Part B: 4M x 9M (36M) = 60 Marks |
| **S3 DSA Supply (`PCCST303`)** | Modules 1 to 4 | **19 Topics** | Part A: 8Q x 3M (24M) • Part B: 4M x 9M (36M) = 60 Marks |
| **Upcoming Subjects** | MAT203, CST307-T, etc. | *Queued* | Will be dynamically added upon syllabus ingestion |

---

## 🛠️ Key Capabilities

- **Zero-Distraction Checklist**: Mark topics as mastered as you revise notes and solve PYQs.
- **Dynamic Revision Pace**: Displays required pace in `topics/day` with color-coded stress indicators.
- **Passcode Gate**: Clean, minimalist PIN protection (`2026` default) to prevent unauthorized edits.
- **Multi-Device Cloud Sync**: Real-time cross-device state synchronization via free Upstash Redis or Vercel KV REST APIs.
- **Show Completed Toggle & Smooth Animation**: Toggle between full syllabus order and unrevised view with fluid exit animations.
- **Safe Branching**: The prior video playlist suite remains permanently preserved in `archive/playlist-suite`.
