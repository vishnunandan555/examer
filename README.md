# 🎓 EXAMER — KTU CSE Exam Preparation & Syllabus Progress Tracker

> **Last Updated**: November 19, 2026, 10:25 AM IST (`2026-11-19T10:25:00+05:30`)  
> **Academic Context**: B.Tech Computer Science & Engineering (KTU Syllabus, S5 Regular & S3 Supply)  
> **Repository**: [git@github.com:vishnunandan555/examer.git](git@github.com:vishnunandan555/examer.git)  
> **Safe Archive Branch**: `archive/playlist-suite` (Full historical GATE playlist curated suite)

A pure, distraction-free **Syllabus Progress & Exam Clearance Tracker** built with **React 18 + Vite** and styled with an **Obsidian pitch-dark theme**. 

Zero video fluff. Instead of spending hundreds of hours watching playlists, this application breaks down the **exact official KTU course syllabi** into actionable, high-yield mastery checklists to clear every upcoming university examination.

---

## ⚡ Quick Start & Environment Configuration

### 1. Environment Variable for Security PIN
Set your 5-key PIN using either `PIN` or `VITE_PIN`:
```bash
# In local development (.env or shell):
PIN=0000 npm run dev

# Or in desktop fallback, defaults automatically to '0000':
npm run dev
```

### 2. GitHub & Cloud Deployment PIN Setup
- **GitHub Codespaces**: Repository Settings → *Secrets and variables* → *Codespaces* → Name: `PIN`, Value: `<YOUR_5_DIGIT_PIN>`
- **GitHub Actions (GitHub Pages)**: Repository Settings → *Secrets and variables* → *Actions* → Name: `PIN` (or under *Variables* → *Actions*)
- **Vercel / Cloudflare**: Project Settings → *Environment Variables* → Key: `PIN`, Value: `<YOUR_5_DIGIT_PIN>`

---

## 📅 Official Examination Schedule & Syllabus Coverage

*Time-synchronized to 2026-11-19 10:25 IST*

| Date | Examination | Subject Code | Type | Days Left | Topics | Status & Target |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Nov 16** | Machine Learning Lab | CST307 | Lab | *Completed* | - | ✅ Done |
| **Nov 18** | Computer Networks Lab | PCCST501-L | Lab | *Completed* | - | ✅ Done |
| **Nov 23** | **Computer Networks** | **PCCST501** | **Theory** | **4 Days Left** | **30 Topics** | 🔥 **CRITICAL (Immediate Focus)** |
| **Nov 24** | **S3 Mathematics** | **MAT203** | **Supply** | **5 Days Left** | **19 Topics** | 🔥 **HIGH PRIORITY** |
| **Nov 27** | **DAA (Algorithms)** | **PCCST502** | **Theory** | **8 Days Left** | **21 Topics** | 🔥 **HIGH PRIORITY** |
| **Nov 30** | **S3 DSA (Supply)** | **PCCST303** | **Supply** | **11 Days Left** | **19 Topics** | 🔥 **HIGH PRIORITY** |
| **Dec 01** | **Machine Learning** | **CST307-T** | **Theory** | **12 Days Left** | **18 Topics** | Upcoming Focus |
| **Dec 04** | **Microcontrollers** | **CST309** | **Theory** | **15 Days Left** | **19 Topics** | Upcoming Focus |
| **Dec 07** | **Data Analytics** | **CST311** | **Theory** | **18 Days Left** | **16 Topics** | Upcoming Focus |
| **Dec 08** | **S3 EE / Ethics** | **HUT200** | **Supply** | **19 Days Left** | **18 Topics** | Final Exam |

**Total Ingested Curriculum: 160 Core Topics & 653 Granular Subtopics across 32 Modules**

---

## 📚 Syllabus Structure & Mastery Checklists

Each course is organized into its official KTU 4-module distribution with marks weightage, concept summaries, and priority tags. Clicking on any main topic smoothly expands its interactive subtopics:

| Subject | Modules | Topics Covered | Granular Subtopics | Exam Pattern & Marks |
| :--- | :--- | :--- | :--- | :--- |
| **Computer Networks (`PCCST501`)** | Modules 1 to 4 | **30 Topics** | **117 Subsections** | Part A: 8Q x 3M (24M) • Part B: 4M x 9M (36M) = 60 Marks |
| **S3 Mathematics (`MAT203`)** | Modules 1 to 4 | **19 Topics** | **78 Subsections** | Part A: 8Q x 3M (24M) • Part B: 4M x 9M (36M) = 60 Marks |
| **DAA Algorithms (`PCCST502`)** | Modules 1 to 4 | **21 Topics** | **83 Subsections** | Part A: 8Q x 3M (24M) • Part B: 4M x 9M (36M) = 60 Marks |
| **S3 DSA Supply (`PCCST303`)** | Modules 1 to 4 | **19 Topics** | **80 Subsections** | Part A: 8Q x 3M (24M) • Part B: 4M x 9M (36M) = 60 Marks |
| **Machine Learning (`CST307-T`)** | Modules 1 to 4 | **18 Topics** | **74 Subsections** | Part A: 8Q x 3M (24M) • Part B: 4M x 9M (36M) = 60 Marks |
| **Microcontrollers (`CST309`)** | Modules 1 to 4 | **19 Topics** | **76 Subsections** | Part A: 8Q x 3M (24M) • Part B: 4M x 9M (36M) = 60 Marks |
| **Data Analytics (`CST311`)** | Modules 1 to 4 | **16 Topics** | **69 Subsections** | Part A: 8Q x 3M (24M) • Part B: 4M x 9M (36M) = 60 Marks |
| **EE & Ethics (`HUT200`)** | Modules 1 to 4 | **18 Topics** | **76 Subsections** | Part A: 8Q x 3M (24M) • Part B: 4M x 9M (36M) = 60 Marks |

---

## 🛠️ Key Capabilities

- **Collapsible Subtopics Checklist**: Topics stay clean and compact by default; click any topic or use *Expand Subtopics* to access granular sub-checklists with 2-way auto completion sync.
- **Dynamic Revision Pace**: Displays required pace in `topics/day` with color-coded stress indicators (Green/Yellow/Orange/Red + `AlertTriangle` warning icon).
- **Single-User Built-in Cloud Sync**: Zero-config personal sync via Upstash Redis REST API. All checks sync between phone and laptop upon entering your PIN.
- **Show Completed Toggle & Smooth Animation**: Toggle between full syllabus order and unrevised view with fluid exit animations.
- **Safe Branching**: The prior video playlist suite remains permanently preserved in `archive/playlist-suite`.
