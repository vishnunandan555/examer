import React from 'react';
import UrgencyBanner from './UrgencyBanner';
import DashboardTrackBar from './DashboardTrackBar';
import SubjectKpiGrid from './SubjectKpiGrid';
import ExamTimetable from './ExamTimetable';
import ReductionSummary from './ReductionSummary';

export default function DashboardView({
  subjectsData,
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
      {/* 1. Urgency Banner for January / GATE Milestones */}
      <UrgencyBanner
        onNavigateToOS={() => onNavigate('os')}
        onNavigateToCOA={() => onNavigate('coa')}
        onNavigateToDBMS={() => onNavigate('dbms')}
      />

      {/* 2. Track Selector for Main Dashboard */}
      <DashboardTrackBar
        activeViewMode={activeViewMode}
        setActiveViewMode={setActiveViewMode}
      />

      {/* 3. Comprehensive Subject KPI Grid */}
      <SubjectKpiGrid
        subjectsData={subjectsData}
        playbackSpeed={playbackSpeed}
        timeUnitMode={timeUnitMode}
        toggleTimeUnit={toggleTimeUnit}
        onNavigate={onNavigate}
      />

      {/* 4. Examination & Preparation Timetable Table */}
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
