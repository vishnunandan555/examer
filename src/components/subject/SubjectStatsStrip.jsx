import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { formatTime } from '../../utils/timeUtils';

export default function SubjectStatsStrip({
  subjectData,
  activePaceData,
  activeViewMode,
  setActiveViewMode,
  timeUnitMode,
  toggleTimeUnit,
  playbackSpeed
}) {
  const stats = subjectData.stats;

  return (
    <div className="stats-grid-5">
      {/* Card 1: FULL TRACK */}
      <div
        className="card card-hover"
        onClick={() => setActiveViewMode('original')}
        title="Click to view Full Playlist Track (Click Days/Hrs badge to toggle format)"
        style={{
          padding: '0.75rem',
          cursor: 'pointer',
          userSelect: 'none',
          borderTop: activeViewMode === 'original' ? '3px solid var(--text-main)' : '1px solid var(--border-default)',
          backgroundColor: activeViewMode === 'original' ? 'rgba(255, 255, 255, 0.03)' : 'var(--bg-surface)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
          <span style={{ fontSize: '0.68rem', color: activeViewMode === 'original' ? 'var(--text-main)' : 'var(--text-dim)', fontWeight: 700 }}>
            1. FULL Time
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {activeViewMode === 'original' && (
              <span className="badge badge-core" style={{ fontSize: '0.52rem', padding: '0.02rem 0.25rem' }}>ACTIVE</span>
            )}
            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleTimeUnit();
              }}
              title="Toggle Days / Hours format"
              style={{ fontSize: '0.6rem', color: 'var(--accent-blue)', opacity: 0.85, cursor: 'pointer' }}
            >
              {timeUnitMode === 'days' ? '📅 Days' : '⏱️ Hrs'}
            </span>
          </div>
        </div>
        <div style={{ fontSize: '1.15rem', fontWeight: 700 }} className="mono">
          {formatTime(stats.remainingTotalHours, timeUnitMode)}
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          {stats.completedTotalVideos} / {stats.totalVideos} watched ({formatTime(stats.totalHours, timeUnitMode)} total)
        </div>
      </div>

      {/* Card 2: CORE TRACK */}
      <div
        className="card card-hover"
        onClick={() => setActiveViewMode('core')}
        title="Click to view Core Track (Click Days/Hrs badge to toggle format)"
        style={{
          padding: '0.75rem',
          cursor: 'pointer',
          userSelect: 'none',
          borderTop: activeViewMode === 'core' ? '3px solid var(--accent-green)' : '1px solid var(--border-default)',
          backgroundColor: activeViewMode === 'core' ? 'rgba(74, 222, 128, 0.03)' : 'var(--bg-surface)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
          <span style={{ fontSize: '0.68rem', color: activeViewMode === 'core' ? 'var(--accent-green)' : 'var(--text-dim)', fontWeight: 700 }}>
            2. CORE Time
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {activeViewMode === 'core' && (
              <span className="badge badge-supply" style={{ fontSize: '0.52rem', padding: '0.02rem 0.25rem' }}>ACTIVE</span>
            )}
            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleTimeUnit();
              }}
              title="Toggle Days / Hours format"
              style={{ fontSize: '0.6rem', color: 'var(--accent-green)', opacity: 0.85, cursor: 'pointer' }}
            >
              {timeUnitMode === 'days' ? '📅 Days' : '⏱️ Hrs'}
            </span>
          </div>
        </div>
        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-green)' }} className="mono">
          {formatTime(stats.remainingCoreHours, timeUnitMode)}
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          {stats.completedCoreVideos} / {stats.coreVideos} watched ({formatTime(stats.coreHours, timeUnitMode)} total)
        </div>
      </div>

      {/* Card 3: REQUIRED STUDY PACE (ALWAYS IN HOURS/DAY, COLOR CODED, WARNING ICON IF > 12 HRS/DAY) */}
      <div
        className="card card-hover"
        style={{
          padding: '0.75rem',
          cursor: 'default',
          userSelect: 'none',
          borderTop: `3px solid ${activePaceData.color}`,
          backgroundColor: activePaceData.hasWarning ? 'rgba(248, 113, 113, 0.04)' : 'var(--bg-surface)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700 }}>
            3. Required Study Pace
          </span>
          <span
            className="badge mono"
            style={{
              fontSize: '0.56rem',
              padding: '0.04rem 0.3rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: activePaceData.color,
              borderColor: activePaceData.color
            }}
          >
            {activePaceData.trackLabel}
          </span>
        </div>
        <div
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: activePaceData.color,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
          className="mono"
        >
          {activePaceData.hasWarning && (
            <AlertTriangle size={15} color="#f87171" style={{ flexShrink: 0 }} />
          )}
          <span>{activePaceData.pace.toFixed(1)} hrs/day</span>
        </div>
        <div style={{ fontSize: '0.68rem', color: activePaceData.color, opacity: 0.9 }}>
          Over next {subjectData.daysLeft}d • {activePaceData.stress}
        </div>
      </div>

      {/* Card 4: SELECTED STUDY TRACK */}
      <div
        className="card card-hover"
        onClick={() => setActiveViewMode('study')}
        title="Click to view Selected Study Track (Click Days/Hrs badge to toggle format)"
        style={{
          padding: '0.75rem',
          cursor: 'pointer',
          userSelect: 'none',
          borderTop: activeViewMode === 'study' ? '3px solid var(--accent-blue)' : '1px solid var(--border-default)',
          backgroundColor: activeViewMode === 'study' ? 'rgba(96, 165, 250, 0.03)' : 'var(--bg-surface)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
          <span style={{ fontSize: '0.68rem', color: activeViewMode === 'study' ? 'var(--accent-blue)' : 'var(--text-dim)', fontWeight: 700 }}>
            Selected Plan
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {activeViewMode === 'study' && (
              <span className="badge badge-module" style={{ fontSize: '0.52rem', padding: '0.02rem 0.25rem' }}>ACTIVE</span>
            )}
            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleTimeUnit();
              }}
              title="Toggle Days / Hours format"
              style={{ fontSize: '0.6rem', color: 'var(--accent-blue)', opacity: 0.85, cursor: 'pointer' }}
            >
              {timeUnitMode === 'days' ? '📅 Days' : '⏱️ Hrs'}
            </span>
          </div>
        </div>
        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-blue)' }} className="mono">
          {formatTime(stats.remainingSelectedHours, timeUnitMode)}
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          {stats.completedSelectedVideos} / {stats.selectedVideos} watched ({formatTime(stats.selectedHours, timeUnitMode)} total)
        </div>
      </div>

      {/* Card 5: REMOVED OVERKILL */}
      <div
        className="card card-hover"
        onClick={() => setActiveViewMode('removed')}
        title="Click to view Removed Cut Videos (Click Days/Hrs badge to toggle format)"
        style={{
          padding: '0.75rem',
          cursor: 'pointer',
          userSelect: 'none',
          borderTop: activeViewMode === 'removed' ? '3px solid var(--accent-red)' : '1px solid var(--border-default)',
          backgroundColor: activeViewMode === 'removed' ? 'rgba(248, 113, 113, 0.03)' : 'var(--bg-surface)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
          <span style={{ fontSize: '0.68rem', color: activeViewMode === 'removed' ? 'var(--accent-red)' : 'var(--text-dim)', fontWeight: 700 }}>
            Cut Overkill
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {activeViewMode === 'removed' && (
              <span className="badge badge-critical" style={{ fontSize: '0.52rem', padding: '0.02rem 0.25rem' }}>ACTIVE</span>
            )}
            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleTimeUnit();
              }}
              title="Toggle Days / Hours format"
              style={{ fontSize: '0.6rem', color: 'var(--accent-red)', opacity: 0.85, cursor: 'pointer' }}
            >
              {timeUnitMode === 'days' ? '📅 Days' : '⏱️ Hrs'}
            </span>
          </div>
        </div>
        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-red)' }} className="mono">
          {formatTime(stats.remHours, timeUnitMode)}
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--accent-red)' }}>
          {stats.remVideos} cut videos (saved {formatTime(stats.remHours / playbackSpeed, timeUnitMode)})
        </div>
      </div>
    </div>
  );
}
