# 🎓 EXAMER — Personal Exam Preparation Suite & Curated Playlist Tracker

> **Last Updated**: November 19, 2026, 08:51 AM IST (`2026-11-19T08:51:05+05:30`)  
> **Academic Context**: B.Tech Computer Science & Engineering (KTU Syllabus)  
> **Repository**: [git@github.com:vishnunandan555/examer.git](git@github.com:vishnunandan555/examer.git)

A lightweight, distraction-free exam preparation dashboard built with **React + Vite** and styled with a **matte dark theme (Catppuccin Frappé palette)**. High information density, zero AI gradients, and comprehensive progress tracking.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Production build (Vercel-ready)
npm run build
```

---

## 📁 Refined Repository Structure

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
├── docs/                                    # Documentation, syllabi PDFs, and timetable
│   ├── syllabus/
│   │   ├── S3 CSE DSA.pdf
│   │   ├── S5 CSE CN.pdf
│   │   └── S5 CSE DAA.pdf
│   ├── timetable/
│   │   └── EXAM Time table.jpeg
│   └── SYLLABUS_ANALYSIS_AND_STUDY_PLAN.md  # Comprehensive syllabus mapping report
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

## 📅 Examination Timetable

*Last Synchronized: 2026-11-19 08:51 IST*

| Date | Examination | Subject Code | Type | Days Left | Priority / Urgency |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Nov 16** | Machine Learning Lab | CST307-L | Lab | *Completed* | Done |
| **Nov 18** | Computer Networks Lab | PCCST501-L | Lab | *Completed* | Done |
| **Nov 23** | **Computer Networks** | **PCCST501** | **Theory** | **4 Days Left** | 🔥 **CRITICAL (Immediate Focus)** |
| **Nov 24** | S3 Mathematics | MAT203 | Supply | 5 Days Left | High |
| **Nov 27** | **DAA (Algorithms)** | **PCCST502** | **Theory** | **8 Days Left** | 🔥 **HIGH PRIORITY** |
| **Nov 30** | **S3 DSA (Data Structures)** | **PCCST303** | **Supply** | **11 Days Left** | 🔥 **HIGH PRIORITY** |
| **Dec 01** | Machine Learning | CST307 | Theory | 12 Days Left | Normal |
| **Dec 04** | Microcontrollers | CST309 | Theory | 15 Days Left | Normal |
| **Dec 07** | Data Analytics | CST311 | Theory | 18 Days Left | Normal |
| **Dec 08** | S3 EE / Ethics | HUT200 | Supply | 19 Days Left | Normal |

---

## 📊 Syllabus Filtering & Pedagogical Analysis

GATE playlists cover extensive competitive programming and isolated numericals that do not align with university exam patterns. By filtering them against KTU syllabi, we trimmed **22+ hours of bloat** while safeguarding all high-yield university topics:

| Subject | Original Videos | Core Videos (Must Watch) | Optional (Practice) | Removed (Overkill) | Core Watch Time |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Computer Networks (CN)** | 202 | 124 | 51 | 27 | 48.7 hrs |
| **DAA (Algorithms)** | 164* | 98 | 66 | 18 | 58.4 hrs |
| **S3 DSA (Data Structures)** | 163* | 95 | 68 | 16 | 52.8 hrs |
| **Total Study Load** | **500** | **290** | **155** | **55** | **152.0 hrs** (42% Cut) |

*\*DSA and DAA share a master 298-video playlist with 57 foundational videos in common.*

### Recommended Viewing Pace
- **1.5x Playback Speed**: Reduces Computer Networks from 48.7h to **32.5h (~8.1h/day across 4 days)**.

---

## 📁 Generated Datasets (CSV Files)

All processed files reside in `data/processed/` and include YouTube URLs, durations, module numbers, status, and last updated timestamps:

1. **[Data_Structures_and_Algorithms_Study_Portions.csv](./data/processed/Data_Structures_and_Algorithms_Study_Portions.csv)**: Combined master study list (270 videos) for S3 DSA & S5 DAA.
2. **[Data_Structures_and_Algorithms_Removed_Portions.csv](./data/processed/Data_Structures_and_Algorithms_Removed_Portions.csv)**: 28 eliminated videos with detailed reasons for exclusion.
3. **[Computer_Networks_Study_Portions.csv](./data/processed/Computer_Networks_Study_Portions.csv)**: Curated study portions (175 videos) for S5 CN (Modules 1–4).
4. **[Computer_Networks_Removed_Portions.csv](./data/processed/Computer_Networks_Removed_Portions.csv)**: 27 eliminated videos (isolated GATE PYQs, syllabus intro) with reasons.
5. **[S3_DSA_Study_Portions.csv](./data/processed/S3_DSA_Study_Portions.csv)**: 163 videos specifically relevant to the S3 DSA supply exam.
6. **[S5_DAA_Study_Portions.csv](./data/processed/S5_DAA_Study_Portions.csv)**: 164 videos specifically relevant to the S5 DAA theory exam.

---

## 🚀 Features of the Web App

- **Master Dashboard**: Live countdown to each exam, urgency alerts, and study pace calculation.
- **Dedicated Subject Tabs**: Separate views for Computer Networks, DAA, and S3 DSA.
- **Multiple View Filters**: Switch between *Curated Study Plan*, *Core Only*, *Optional Only*, *Removed Topics*, and *Original Full Playlist*.
- **Interactive Progress Tracking**: Check off completed videos with immediate persistence in browser `localStorage`.
- **Direct YouTube Links**: One-click opening for every lecture video.
- **Pace Calculator**: Switch between 1.0x, 1.25x, 1.5x, 1.75x, and 2.0x to see dynamic remaining hours and daily targets.
- **Module Filter & Search**: Instant real-time search across titles, topics, and reasons.
- **Official KTU Syllabus Accordion**: Course descriptions embedded directly in the interface.
- **Last Updated Badge**: Always visible timestamp indicating when data and plans were last refreshed.

---

## 🌐 Deploying to Vercel

1. Push this repository to GitHub: `git push origin main`
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Select your repository `examer`.
4. Framework Preset: **Vite** (auto-detected).
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Click **Deploy** — your personal suite will be live with free global CDN!
