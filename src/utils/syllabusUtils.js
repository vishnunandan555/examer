/**
 * Computes syllabus mastery statistics for a given subject.
 */
export function getSubjectSyllabusStats(subject, completedMap = {}, daysLeft = 1) {
  if (!subject || !subject.modules) {
    return {
      totalTopics: 0,
      completedTopics: 0,
      remainingTopics: 0,
      completionRate: 0,
      moduleStats: {},
      requiredPace: 0,
      paceColor: '#4ade80',
      stress: 'Comfortable Pace',
      hasWarning: false
    };
  }

  let totalTopics = 0;
  let completedTopics = 0;
  const moduleStats = {};

  subject.modules.forEach((mod) => {
    const modTotal = mod.topics.length;
    const modCompleted = mod.topics.filter((t) => !!completedMap[t.id]).length;
    const modRate = modTotal > 0 ? (modCompleted / modTotal) * 100 : 0;

    moduleStats[mod.id] = {
      total: modTotal,
      completed: modCompleted,
      remaining: Math.max(0, modTotal - modCompleted),
      rate: modRate
    };

    totalTopics += modTotal;
    completedTopics += modCompleted;
  });

  const remainingTopics = Math.max(0, totalTopics - completedTopics);
  const completionRate = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  const safeDays = daysLeft > 0 ? daysLeft : 1;
  const requiredPace = remainingTopics / safeDays;

  let paceColor = '#4ade80'; // Green: <= 3.0 topics/day
  let stress = 'Comfortable Pace';
  let hasWarning = false;

  if (requiredPace > 8.0) {
    paceColor = '#f87171'; // Red: > 8 topics/day
    stress = 'Intensive Exam Crunch';
    hasWarning = true;
  } else if (requiredPace > 4.5) {
    paceColor = '#fb923c'; // Orange: 4.5 - 8.0 topics/day
    stress = 'Focused Study Required';
    hasWarning = false;
  } else if (requiredPace > 2.5) {
    paceColor = '#facc15'; // Yellow: 2.5 - 4.5 topics/day
    stress = 'Moderate Study Pace';
    hasWarning = false;
  }

  return {
    totalTopics,
    completedTopics,
    remainingTopics,
    completionRate,
    moduleStats,
    requiredPace,
    paceColor,
    stress,
    hasWarning
  };
}
