import React from 'react';
import SubjectHeaderBanner from './SubjectHeaderBanner';
import SubjectStatsStrip from './SubjectStatsStrip';
import SubjectFilterToolbar from './SubjectFilterToolbar';
import SyllabusNotice from './SyllabusNotice';
import VideoTableDesktop from './VideoTableDesktop';
import VideoCardMobile from './VideoCardMobile';

export default function SubjectView({
  activeTab,
  subjectData,
  activeViewMode,
  setActiveViewMode,
  activePaceData,
  selectedModule,
  setSelectedModule,
  searchQuery,
  setSearchQuery,
  displayedVideos,
  completedMap,
  animatingOutKeys,
  onToggleComplete,
  onMarkBatch,
  showCompleted,
  setShowCompleted,
  playbackSpeed,
  timeUnitMode,
  toggleTimeUnit,
  lastUpdatedDisplay,
  onOpenSyllabusModal
}) {
  return (
    <div>
      {/* 1. Header Banner with Subject Progress */}
      <SubjectHeaderBanner
        subjectData={subjectData}
        lastUpdatedDisplay={lastUpdatedDisplay}
        playbackSpeed={playbackSpeed}
      />

      {/* 2. 5-Track Interactive Metrics Strip */}
      <SubjectStatsStrip
        subjectData={subjectData}
        activePaceData={activePaceData}
        activeViewMode={activeViewMode}
        setActiveViewMode={setActiveViewMode}
        timeUnitMode={timeUnitMode}
        toggleTimeUnit={toggleTimeUnit}
        playbackSpeed={playbackSpeed}
      />

      {/* 3. Filter and Action Toolbar */}
      <SubjectFilterToolbar
        activeViewMode={activeViewMode}
        setActiveViewMode={setActiveViewMode}
        stats={subjectData.stats}
        modules={subjectData.modules}
        selectedModule={selectedModule}
        setSelectedModule={setSelectedModule}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        displayedVideos={displayedVideos}
        onMarkBatch={onMarkBatch}
        showCompleted={showCompleted}
        setShowCompleted={setShowCompleted}
      />

      {/* 4. Syllabus Pedagogical Advisory Notice */}
      <SyllabusNotice
        activeTab={activeTab}
        onOpenSyllabusModal={onOpenSyllabusModal}
      />

      {/* 5. Desktop View (>= 769px) */}
      <VideoTableDesktop
        displayedVideos={displayedVideos}
        completedMap={completedMap}
        animatingOutKeys={animatingOutKeys}
        onToggleComplete={onToggleComplete}
        showCompleted={showCompleted}
        playbackSpeed={playbackSpeed}
      />

      {/* 6. Mobile Card View (< 769px) */}
      <VideoCardMobile
        displayedVideos={displayedVideos}
        completedMap={completedMap}
        animatingOutKeys={animatingOutKeys}
        onToggleComplete={onToggleComplete}
        showCompleted={showCompleted}
        playbackSpeed={playbackSpeed}
      />
    </div>
  );
}
