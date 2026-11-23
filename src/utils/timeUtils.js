// Normalized base timeline for KTU 2026 Examination Series
export const CURRENT_TIMELINE_DATE = new Date('2026-11-23T23:31:00+05:30');

/**
 * Returns the current date/time normalized to IST.
 */
export function getCurrentIST() {
  const now = new Date();
  return now.getFullYear() === 2026 ? now : new Date('2026-11-23T23:45:00+05:30');
}

/**
 * Checks whether an exam is completed.
 * Afternoon exams conclude at 4:00 PM (16:00) IST on the exam day.
 */
export function isExamCompleted(dateStr) {
  if (!dateStr) return false;
  const current = getCurrentIST();
  const cutoff = new Date(`${dateStr}T16:00:00+05:30`);
  return current.getTime() >= cutoff.getTime();
}

/**
 * Returns a comprehensive, dynamic countdown object to the exam session.
 * Standard KTU afternoon exams begin at 1:30 PM (13:30 IST) and conclude at 4:00 PM (16:00 IST).
 * Dynamically switches from days (e.g. "3.5d", "1.2d") to hours (e.g. "13h 45m") to minutes ("35m").
 */
export function getExamCountdown(dateStr) {
  if (!dateStr) {
    return {
      totalMs: 0,
      totalHours: 0,
      fractionalDays: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      isCompleted: false,
      isLive: false,
      badgeText: '--',
      formatted: '--'
    };
  }

  const current = getCurrentIST();
  const examStart = new Date(`${dateStr}T13:30:00+05:30`);
  const examEnd = new Date(`${dateStr}T16:00:00+05:30`);

  // Past 4:00 PM on exam day -> Concluded
  if (current.getTime() >= examEnd.getTime()) {
    return {
      totalMs: 0,
      totalHours: 0,
      fractionalDays: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      isCompleted: true,
      isLive: false,
      badgeText: 'DONE',
      formatted: 'Exam Concluded'
    };
  }

  // Between 1:30 PM and 4:00 PM on exam day -> Live session
  if (current.getTime() >= examStart.getTime() && current.getTime() < examEnd.getTime()) {
    const remLiveMins = Math.max(1, Math.floor((examEnd.getTime() - current.getTime()) / (1000 * 60)));
    return {
      totalMs: 0,
      totalHours: 0,
      fractionalDays: 0,
      days: 0,
      hours: 0,
      minutes: remLiveMins,
      isCompleted: false,
      isLive: true,
      badgeText: 'LIVE',
      formatted: `Live (Ends in ${remLiveMins}m)`
    };
  }

  const diffMs = Math.max(0, examStart.getTime() - current.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = diffMs / (1000 * 60 * 60);
  const fractionalDays = Number((totalHours / 24).toFixed(1));
  const days = Math.floor(totalHours / 24);
  const remHours = Math.floor(totalHours % 24);
  const minutes = Math.floor(totalMinutes % 60);
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  let badgeText = '';
  let formatted = '';

  if (totalHours >= 48) {
    badgeText = `${fractionalDays}d`;
    formatted = `${days}d ${remHours}h left`;
  } else if (totalHours >= 24) {
    badgeText = `${fractionalDays}d`;
    formatted = `${days}d ${remHours}h ${minutes}m left`;
  } else if (totalHours >= 1) {
    badgeText = `${Math.floor(totalHours)}h`;
    formatted = `${Math.floor(totalHours)}h ${minutes}m ${seconds}s left`;
  } else {
    badgeText = `${Math.max(1, minutes)}m`;
    formatted = `${Math.max(1, minutes)}m ${seconds}s left`;
  }

  return {
    totalMs: diffMs,
    totalHours,
    fractionalDays,
    days,
    hours: remHours,
    minutes,
    isCompleted: false,
    isLive: false,
    badgeText,
    formatted
  };
}

/**
 * Calculates remaining days from today to the given exam date string (YYYY-MM-DD).
 * Returns fractional days for accurate study pace calculation.
 */
export function getDaysLeft(dateStr) {
  const cd = getExamCountdown(dateStr);
  if (cd.isCompleted) return 0;
  return Math.max(0.5, cd.fractionalDays);
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
