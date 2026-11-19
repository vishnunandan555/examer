import React from 'react';
import UrgencyBanner from './UrgencyBanner';
import SubjectKpiGrid from './SubjectKpiGrid';
import ExamTimetable from './ExamTimetable';
import OverallProgressSummary from './OverallProgressSummary';

export default function DashboardView({
  cnStats,
  cnDays,
  daaStats,
  daaDays,
  dsaStats,
  dsaDays,
  timetable,
  lastUpdatedDisplay,
  availableSubjectIds,
  onNavigate
}) {
  const totalTopics = (cnStats?.totalTopics || 0) + (daaStats?.totalTopics || 0) + (dsaStats?.totalTopics || 0);
  const completedTopics = (cnStats?.completedTopics || 0) + (daaStats?.completedTopics || 0) + (dsaStats?.completedTopics || 0);
  const overallRate = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  return (
    <div>
      {/* 1. Urgency Banner for Computer Networks (Immediate Exam) */}
      <UrgencyBanner
        cnStats={cnStats}
        cnDays={cnDays}
        onNavigateToCN={() => onNavigate('cn')}
      />

      {/* 2. Subject KPI Grid (CN, DAA, S3 DSA) */}
      <SubjectKpiGrid
        cnStats={cnStats}
        cnDays={cnDays}
        daaStats={daaStats}
        daaDays={daaDays}
        dsaStats={dsaStats}
        dsaDays={dsaDays}
        onNavigate={onNavigate}
      />

      {/* 3. Official Examination Timetable */}
      <ExamTimetable
        timetable={timetable}
        lastUpdatedDisplay={lastUpdatedDisplay}
        availableSubjectIds={availableSubjectIds}
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
