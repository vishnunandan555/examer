// Normalized base timeline for KTU 2026 Examination Series
export const CURRENT_TIMELINE_DATE = new Date('2026-11-23T23:31:00+05:30');

/**
 * Calculates remaining days from today to the given exam date string (YYYY-MM-DD).
 * Normalized strictly to start-of-day IST (T00:00:00) using integer day differences.
 */
export function getDaysLeft(dateStr) {
  const now = new Date();
  // Fallback to active timeline date if not in 2026
  const baseDate = now.getFullYear() === 2026 ? now : new Date('2026-11-23T23:31:00+05:30');
  
  const todayYear = baseDate.getFullYear();
  const todayMonth = String(baseDate.getMonth() + 1).padStart(2, '0');
  const todayDay = String(baseDate.getDate()).padStart(2, '0');
  
  const todayNorm = new Date(`${todayYear}-${todayMonth}-${todayDay}T00:00:00+05:30`);
  const examNorm = new Date(`${dateStr}T00:00:00+05:30`);
  
  const diffTime = examNorm.getTime() - todayNorm.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Checks whether an exam is completed.
 * Afternoon exams conclude at 4:00 PM (16:00) IST on the exam day.
 * - If today is the exam day, the exam remains active until 4:00 PM, then becomes completed.
 * - If the exam date is in the past (yesterday or earlier), it is completed.
 */
export function isExamCompleted(dateStr) {
  if (!dateStr) return false;
  const now = new Date();
  const current = now.getFullYear() === 2026 ? now : new Date('2026-11-23T23:31:00+05:30');
  
  // Cutoff is 16:00 (4:00 PM) IST on the exam day
  const cutoff = new Date(`${dateStr}T16:00:00+05:30`);
  return current.getTime() >= cutoff.getTime();
}

/**
 * Finds the next upcoming uncompleted exam from the timetable.
 */
export function getNextUpcomingExam(timetable = []) {
  for (const item of timetable) {
    if (item.status !== 'completed' && !isExamCompleted(item.date)) {
      return item;
    }
  }
  return null;
}

/**
 * Formats hours into hrs or Days depending on user preference.
 * Study pace is excluded from days conversion per AGENTS.md.
 */
export function formatTime(hours, timeUnitMode = 'hrs') {
  if (hours === undefined || hours === null || isNaN(hours)) return '0.0 hrs';
  if (timeUnitMode === 'days') {
    if (hours > 12.0) {
      return `${(hours / 24).toFixed(1)} Days`;
    }
    return `${hours.toFixed(1)} hrs`;
  }
  return `${hours.toFixed(1)} hrs`;
}
