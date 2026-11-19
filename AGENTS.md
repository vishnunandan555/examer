# Agent Instructions & Guidelines (`AGENTS.md`)

*Last Updated: 2026-11-19 10:11 IST*

## 1. Git Push & Commit Policy (Strict)

> [!IMPORTANT]
> **DO NOT push to remote for small, minute, or trivial changes.**
> 
> * **No Trivial Pushes**: Do not push for minor typo corrections, micro CSS adjustments, single-variable renames, or incremental iterative experiments.
> * **When to Push**:
>   1. **Meaningful Milestone Batches**: Only commit and push when a cohesive, meaningful batch of changes or complete feature/fix is finished and thoroughly verified.
>   2. **Explicit User Request**: Always push immediately when the user explicitly instructs to push (e.g., *"push to github"*, *"push the changes"*).
> * **Pre-Push Requirement**: Always run `npm run build` and ensure **zero compilation errors and zero warnings** before committing or pushing.

---

## 2. Codebase Architecture & Conventions

* **Project**: Examer — KTU B.Tech CSE (S5 Regular & S3 Supply) Direct Syllabus Progress Tracker.
* **Tech Stack**: React 18, Vite, Lucide-React icons, vanilla responsive CSS (`src/index.css`).
* **Design & Theme**:
  * **Pitch Dark Theme**: Pure Frappe / Obsidian dark aesthetics (`#090a0f`, `#10121a`, `#171a26`).
  * **No AI Gradients**: Avoid loud, generic AI-style gradients; use crisp, solid borders and subtle status badges.
  * **Mobile-First Layout**: Ensure every card, checklist row, and modal remains completely responsive on mobile viewports (< 768px) with zero layout breakage or awkward text wrapping.

---

## 3. Data & State Management Rules

1. **Syllabus Topic & Subtopic Key Synchronization**:
   * Every syllabus item is keyed by its unique topic ID (e.g., `cn-m1-01`, `daa-m2-03`).
   * Each topic contains collapsible, granular subtopics (e.g. `cn-m1-01-s1`, `cn-m1-01-s2`) with two-way completion sync (marking a topic completes all subtopics; marking all subtopics completes the parent topic).
   * Completions persist in `localStorage` under `examer_syllabus_completed_v1` and sync seamlessly with cloud storage (Upstash Redis / Vercel KV REST).
2. **Required Revision Pace Metric**:
   * **Always display in `topics/day`** based on integer days left until the exam ($remainingTopics / daysLeft$).
   * Stress indicators:
     * $\le 2.5\text{ topics/day}$: Green (`#4ade80`) — Comfortable Pace
     * $2.5 - 4.5\text{ topics/day}$: Yellow (`#facc15`) — Moderate Pace
     * $4.5 - 8.0\text{ topics/day}$: Orange (`#fb923c`) — Focused Study Required
     * $> 8.0\text{ topics/day}$: Red (`#f87171`) — Intensive Exam Crunch + Lucide `<AlertTriangle />` icon (not emoji).
3. **Dates & Timetable**:
   * Always normalize date calculations to start-of-day IST (`T00:00:00`) using integer day differences (`Math.round`).
   * Explicitly check `item.status === 'completed' || days < 0` for past exams.
4. **Historical Archive Branch**:
   * The historical video playlist suite is permanently preserved in branch `archive/playlist-suite`.

---

## 4. Directory Organization

* `data/syllabus_data.json` & `src/data/syllabus_data.json`: Application JSON database with full course syllabi and timetable.
* `docs/syllabus/`: PDF course syllabi and reference materials.
* `docs/timetable/`: Exam schedule graphics and assets.
* `src/components/`: Modular React components (common, dashboard, syllabus, references).
* `src/utils/`: Pure utilities (`timeUtils.js`, `syllabusUtils.js`, `exportUtils.js`).
* `src/services/`: Cloud sync provider (`cloudSync.js`).
