/**
 * Universal unique video identifier across all tracks and subjects.
 * Synchronizes completion state across full, core, and selected views.
 */
export function getItemKey(item) {
  return item['Video url'] || `${item.Subject}_${item.Index}`;
}

/**
 * Computes raw and completed breakdown metrics for a subject list.
 */
export function getSubjectStats(list, completedMap = {}, playbackSpeed = 1.5) {
  if (!list || !list.length) {
    return {
      totalVideos: 0,
      totalHours: 0,
      remainingTotalHours: 0,
      completedTotalVideos: 0,
      coreVideos: 0,
      coreHours: 0,
      remainingCoreHours: 0,
      completedCoreVideos: 0,
      optVideos: 0,
      optHours: 0,
      remainingOptHours: 0,
      completedOptVideos: 0,
      selectedVideos: 0,
      selectedHours: 0,
      remainingSelectedHours: 0,
      completedSelectedVideos: 0,
      remVideos: 0,
      remHours: 0,
      completionRate: 0
    };
  }

  const totalVideos = list.length;
  const totalMinutes = list.reduce((acc, v) => acc + (v.Duration || 0), 0);

  const coreVideos = list.filter((v) => v.Status === 'Core');
  const coreMinutes = coreVideos.reduce((acc, v) => acc + (v.Duration || 0), 0);

  const optVideos = list.filter((v) => v.Status === 'Optional');
  const optMinutes = optVideos.reduce((acc, v) => acc + (v.Duration || 0), 0);

  const remVideos = list.filter((v) => v.Status === 'Removed');
  const remMinutes = remVideos.reduce((acc, v) => acc + (v.Duration || 0), 0);

  const selectedVideos = list.filter((v) => v.Status === 'Core' || v.Status === 'Optional');
  const selectedMinutes = selectedVideos.reduce((acc, v) => acc + (v.Duration || 0), 0);

  // Completed counts & minutes using unified video key
  const completedTotalVideos = list.filter((v) => !!completedMap[getItemKey(v)]);
  const completedTotalMinutes = completedTotalVideos.reduce((acc, v) => acc + (v.Duration || 0), 0);
  const remainingTotalMinutes = Math.max(0, totalMinutes - completedTotalMinutes);

  const completedCoreVideos = coreVideos.filter((v) => !!completedMap[getItemKey(v)]);
  const completedCoreMinutes = completedCoreVideos.reduce((acc, v) => acc + (v.Duration || 0), 0);
  const remainingCoreMinutes = Math.max(0, coreMinutes - completedCoreMinutes);

  const completedOptVideos = optVideos.filter((v) => !!completedMap[getItemKey(v)]);
  const completedOptMinutes = completedOptVideos.reduce((acc, v) => acc + (v.Duration || 0), 0);
  const remainingOptMinutes = Math.max(0, optMinutes - completedOptMinutes);

  const completedSelectedVideos = selectedVideos.filter((v) => !!completedMap[getItemKey(v)]);
  const completedSelectedMinutes = completedSelectedVideos.reduce((acc, v) => acc + (v.Duration || 0), 0);
  const remainingSelectedMinutes = Math.max(0, selectedMinutes - completedSelectedMinutes);

  return {
    totalVideos,
    totalHours: totalMinutes / 60,
    remainingTotalHours: remainingTotalMinutes / (60 * playbackSpeed),
    completedTotalVideos: completedTotalVideos.length,

    coreVideos: coreVideos.length,
    coreHours: coreMinutes / 60,
    remainingCoreHours: remainingCoreMinutes / (60 * playbackSpeed),
    completedCoreVideos: completedCoreVideos.length,

    optVideos: optVideos.length,
    optHours: optMinutes / 60,
    remainingOptHours: remainingOptMinutes / (60 * playbackSpeed),
    completedOptVideos: completedOptVideos.length,

    selectedVideos: selectedVideos.length,
    selectedHours: selectedMinutes / 60,
    remainingSelectedHours: remainingSelectedMinutes / (60 * playbackSpeed),
    completedSelectedVideos: completedSelectedVideos.length,

    remVideos: remVideos.length,
    remHours: remMinutes / 60,

    completionRate: totalVideos > 0 ? (completedTotalVideos.length / totalVideos) * 100 : 0
  };
}

/**
 * Calculates dynamic progress, remaining hours, and color-coded study pace
 * for any given subject and study track (Selected, Core, Full, Optional, Removed).
 */
export function getTrackMetrics(stats, daysLeft, mode = 'study', playbackSpeed = 1.5) {
  let totalVids = stats.selectedVideos;
  let completedVids = stats.completedSelectedVideos;
  let remainingHrs = stats.remainingSelectedHours;
  let totalHrs = stats.selectedHours;
  let trackName = 'Selected Track';
  let trackBadge = 'badge-module';

  if (mode === 'core') {
    totalVids = stats.coreVideos;
    completedVids = stats.completedCoreVideos;
    remainingHrs = stats.remainingCoreHours;
    totalHrs = stats.coreHours;
    trackName = 'Core Track';
    trackBadge = 'badge-supply';
  } else if (mode === 'original') {
    totalVids = stats.totalVideos;
    completedVids = stats.completedTotalVideos;
    remainingHrs = stats.remainingTotalHours;
    totalHrs = stats.totalHours;
    trackName = 'Full Track';
    trackBadge = 'badge-core';
  } else if (mode === 'optional') {
    totalVids = stats.optVideos;
    completedVids = stats.completedOptVideos;
    remainingHrs = stats.remainingOptHours;
    totalHrs = stats.optHours;
    trackName = 'Optional Track';
    trackBadge = 'badge-optional';
  } else if (mode === 'removed') {
    totalVids = stats.remVideos;
    completedVids = 0;
    remainingHrs = stats.remHours / playbackSpeed;
    totalHrs = stats.remHours;
    trackName = 'Removed Cut';
    trackBadge = 'badge-critical';
  }

  const rate = totalVids > 0 ? (completedVids / totalVids) * 100 : 0;
  const safeDays = daysLeft > 0 ? daysLeft : 1;
  const pace = remainingHrs / safeDays;

  let paceColor = '#4ade80'; // Green: <= 3.5 hrs/day
  let stress = 'Comfortable Pace';
  let hasWarning = false;

  if (pace > 12.0) {
    paceColor = '#f87171'; // Red: >= 12.0 hrs/day
    stress = 'Extreme Crunch / Overload';
    hasWarning = true;
  } else if (pace > 6.5) {
    paceColor = '#fb923c'; // Orange: 6.5 - 11.9 hrs/day
    stress = 'Intensive Study';
    hasWarning = false;
  } else if (pace > 3.5) {
    paceColor = '#facc15'; // Yellow: 3.5 - 6.5 hrs/day
    stress = 'Moderate Pace';
    hasWarning = false;
  }

  return {
    totalVids,
    completedVids,
    remainingHrs,
    totalHrs,
    trackName,
    trackBadge,
    rate,
    pace,
    paceColor,
    stress,
    hasWarning
  };
}
