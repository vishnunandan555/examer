# Project Agent Instructions

See full guidelines in [AGENTS.md](./AGENTS.md).

### Core Rule Summary:
- **Git Push Policy**: Do NOT push for small or minute changes. Only push for meaningful milestones or when explicitly requested by the user.
- **Verification**: Always run `npm run build` with zero errors before committing/pushing.
- **Styling**: Obsidian pitch-dark theme, mobile-compatible, no AI gradients.
- **Data Model**: Pure syllabus mastery checklists by topic ID (`t.id`).
- **Revision Pace**: Always in `topics/day` with color coding (green/yellow/orange/red + AlertTriangle for high pace).
- **Safe Branch**: Historical playlist tracker is permanently preserved in `archive/playlist-suite`.
