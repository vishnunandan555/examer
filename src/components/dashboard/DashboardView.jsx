import React from 'react';
import UrgencyBanner from './UrgencyBanner';
import DashboardTrackBar from './DashboardTrackBar';
import SubjectKpiGrid from './SubjectKpiGrid';
import ExamTimetable from './ExamTimetable';
import ReductionSummary from './ReductionSummary';

export default function DashboardView({
  cnStats,
  cnDays,
  cnMetrics,
  daaMetrics,
  daaDays,
  dsaMetrics,
  dsaDays,
  activeViewMode,
  setActiveViewMode,
  playbackSpeed,
  timeUnitMode,
  toggleTimeUnit,
  timetable,
  lastUpdatedDisplay,
  onNavigate
}) {
  return (
    <div>
      {/* 1. Urgency Banner for Immediate Exam */}
      <UrgencyBanner
        cnStats={cnStats}
        cnDays={cnDays}
        cnMetrics={cnMetrics}
        playbackSpeed={playbackSpeed}
        onNavigateToCN={() => onNavigate('cn')}
      />

      {/* 2. Track Selector for Main Dashboard */}
      <DashboardTrackBar
        activeViewMode={activeViewMode}
        setActiveViewMode={setActiveViewMode}
      />

      {/* 3. Subject KPI Grid (CN, DAA, S3 DSA) */}
      <SubjectKpiGrid
        cnMetrics={cnMetrics}
        cnDays={cnDays}
        daaMetrics={daaMetrics}
        daaDays={daaDays}
        dsaMetrics={dsaMetrics}
        dsaDays={dsaDays}
        playbackSpeed={playbackSpeed}
        timeUnitMode={timeUnitMode}
        toggleTimeUnit={toggleTimeUnit}
        onNavigate={onNavigate}
      />

      {/* 4. Examination Timetable Table */}
      <ExamTimetable
        timetable={timetable}
        lastUpdatedDisplay={lastUpdatedDisplay}
        onNavigate={onNavigate}
      />

      {/* 5. Reduction Analysis Summary */}
      <ReductionSummary
        timeUnitMode={timeUnitMode}
        toggleTimeUnit={toggleTimeUnit}
      />
    </div>
  );
}
