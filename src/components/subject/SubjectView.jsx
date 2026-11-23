import React from 'react';
import { Clock, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
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
  const hasVideos = subjectData.list && subjectData.list.length > 0;

  return (
    <div>
      {/* 1. Header Banner with Subject Progress */}
      <SubjectHeaderBanner
        subjectData={subjectData}
        lastUpdatedDisplay={lastUpdatedDisplay}
        playbackSpeed={playbackSpeed}
      />

      {/* 2. Syllabus / Curriculum Scope Notice */}
      <SyllabusNotice
        activeTab={activeTab}
        subjectData={subjectData}
        onOpenSyllabusModal={onOpenSyllabusModal}
      />

      {hasVideos ? (
        <>
          {/* 3. 5-Track Interactive Metrics Strip */}
          <SubjectStatsStrip
            subjectData={subjectData}
            activePaceData={activePaceData}
            activeViewMode={activeViewMode}
            setActiveViewMode={setActiveViewMode}
            timeUnitMode={timeUnitMode}
            toggleTimeUnit={toggleTimeUnit}
            playbackSpeed={playbackSpeed}
          />

          {/* 4. Filter and Action Toolbar */}
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
        </>
      ) : (
        /* Dedicated Skeleton Curation Card (When no fake videos are injected) */
        <div
          className="card"
          style={{
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            marginTop: '1.25rem',
            border: '1px dashed var(--border-default)',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-active)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: subjectData.accentColor || 'var(--accent-blue)'
            }}
          >
            <Clock size={28} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.45rem' }}>
            {subjectData.title} • Curation Skeleton Ready
          </h3>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.45rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {subjectData.priority === 'top' ? (
              <span className="badge badge-critical">TOP PRIORITY FOCUS</span>
            ) : (
              <span className="badge badge-core">{subjectData.priorityLabel || 'CORE'}</span>
            )}
            <span className="badge badge-module">Educator: {subjectData.educator}</span>
            <span className="badge badge-optional mono">Target: {subjectData.displayDate}</span>
          </div>

          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 1.75rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
            {subjectData.sourceNote}
            <br />
            <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
              Zero placeholder or fake data injected. The curated YouTube playlist links, video titles, and timestamps will be connected tomorrow.
            </span>
          </p>

          <div
            style={{
              textAlign: 'left',
              maxWidth: '680px',
              margin: '0 auto',
              backgroundColor: 'var(--bg-overlay)',
              padding: '1.15rem',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <h4
              style={{
                margin: '0 0 0.65rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Sparkles size={14} color="var(--accent-yellow)" /> Planned Syllabus Outline &amp; Modules:
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {subjectData.modules.map((mod, idx) => (
                <span
                  key={idx}
                  className="badge badge-module"
                  style={{
                    fontSize: '0.73rem',
                    padding: '0.25rem 0.55rem',
                    backgroundColor: 'var(--bg-active)',
                    border: '1px solid var(--border-default)'
                  }}
                >
                  {mod}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
