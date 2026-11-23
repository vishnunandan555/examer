import React from 'react';
import UrgencyBanner from './UrgencyBanner';
import SubjectKpiGrid from './SubjectKpiGrid';
import ExamTimetable from './ExamTimetable';
import OverallProgressSummary from './OverallProgressSummary';

export default function DashboardView({
  allSubjectStats = {},
  timetable,
  lastUpdatedDisplay,
  availableSubjectIds,
  nextExam,
  showCompletedExams = false,
  onNavigate
}) {
  const nextSubjectInfo = nextExam?.subjectId ? allSubjectStats[nextExam.subjectId] : null;
  const nextSubjectStats = nextSubjectInfo?.stats;
  const nextDays = nextSubjectInfo?.days || 0;

  // Aggregate stats across all 8 subjects
  let totalTopics = 0;
  let completedTopics = 0;

  Object.values(allSubjectStats).forEach((item) => {
    if (item.stats) {
      totalTopics += item.stats.totalTopics || 0;
      completedTopics += item.stats.completedTopics || 0;
    }
  });

  const overallRate = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  return (
    <div>
      {/* 1. Urgency Banner for Next Immediate Exam */}
      <UrgencyBanner
        nextExam={nextExam}
        nextSubjectStats={nextSubjectStats}
        nextDays={nextDays}
        onNavigate={onNavigate}
      />

      {/* 2. Subject KPI Grid across all upcoming courses */}
      <SubjectKpiGrid
        allSubjectStats={allSubjectStats}
        showCompletedExams={showCompletedExams}
        onNavigate={onNavigate}
      />

      {/* 3. Official Examination Timetable */}
      <ExamTimetable
        timetable={timetable}
        lastUpdatedDisplay={lastUpdatedDisplay}
        availableSubjectIds={availableSubjectIds}
        nextExam={nextExam}
        onNavigate={onNavigate}
      />

      {/* 4. Overall Exam Series Readiness */}
      <OverallProgressSummary
        totalTopics={totalTopics}
        completedTopics={completedTopics}
        overallRate={overallRate}
      />
    </div>
  );
}
