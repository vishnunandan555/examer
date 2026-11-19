# Agent Instructions & Guidelines (`AGENTS.md`)

*Last Updated: 2026-11-19 09:27 IST*

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

* **Project**: Examer — Personal Exam Preparation & Curated GATE Playlist Suite for KTU B.Tech CSE (S5 & S3).
* **Tech Stack**: React 18, Vite, Lucide-React icons, vanilla responsive CSS (`src/index.css`).
* **Design & Theme**:
  * **Pitch Dark Theme**: Pure Frappe / Obsidian dark aesthetics (`#090a0f`, `#10121a`, `#171a26`).
  * **No AI Gradients**: Avoid loud, generic AI-style gradients; use crisp, solid borders and subtle status badges.
  * **Mobile-First Layout**: Ensure every table, card, and modal remains completely responsive on mobile viewports (< 768px) with zero layout breakage or awkward text wrapping.

---

## 3. Data & State Management Rules

1. **Cross-Track & Cross-Tab Video Key Synchronization**:
   * Every video item must be keyed by its unique YouTube URL (`item['Video url']`) for completion state.
   * If a user marks a video completed in `Full` track, it must instantly reflect as completed in `Selected`, `Core`, and across subjects (e.g., common DAA/DSA topics).
2. **Study Tracks Hierarchy**:
   * **`Full`**: Entire raw playlist (all original videos).
   * **`Selected`**: Curated study plan (Core + Optional, excluding removed overkill).
   * **`Core`**: High-yield essential exam videos only (excluding optional deep dives).
   * **`Optional`**: Practice, proofs, and supplementary topics.
   * **`Removed`**: Verified overkill or out-of-syllabus topics with explicit pedagogical reasons.
3. **Required Study Pace Metric**:
   * **Always display in `hrs/day`** (never convert study pace to days format).
   * Stress indicators:
     * $\le 3.5\text{ hrs/day}$: Green (`#4ade80`) — Comfortable Pace
     * $3.5 - 6.5\text{ hrs/day}$: Yellow (`#facc15`) — Moderate Pace
     * $6.5 - 11.9\text{ hrs/day}$: Orange (`#fb923c`) — Intensive Study
     * $\ge 12.0\text{ hrs/day}$: Red (`#f87171`) — Extreme Crunch / Overload + Lucide `<AlertTriangle />` icon (not emoji).
4. **Dates & Timetable**:
   * Always normalize date calculations to start-of-day IST (`T00:00:00`) using integer day differences (`Math.round`).
   * Explicitly check `item.status === 'completed' || days < 0` for past exams.

---

## 4. Directory Organization

* `data/raw/`: Original downloaded CSV playlists.
* `data/processed/`: Filtered and curated CSV datasets with `Last Updated` columns.
* `data/playlist_data.json` & `src/data/playlist_data.json`: Application JSON database.
* `docs/syllabus/`: PDF course syllabi and extracted text files.
* `docs/timetable/`: Exam schedule graphics and assets.
* `docs/SYLLABUS_ANALYSIS_AND_STUDY_PLAN.md`: Comprehensive pedagogical study plan and gap report.
* `scripts/`: Generation and verification scripts.
* `src/`: React source files.
