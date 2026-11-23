import React from 'react';
import { formatTime } from '../../utils/timeUtils';

export default function SubjectHeaderBanner({
  subjectData,
  lastUpdatedDisplay,
  playbackSpeed
}) {
  const hasVideos = subjectData.stats.totalVideos > 0;

  return (
    <div className="card subject-header-banner">
      <div className="subject-header-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{subjectData.title}</h2>
          <span className="badge badge-module mono">{subjectData.code}</span>
          {subjectData.priority === 'top' ? (
            <span className="badge badge-critical">TOP PRIORITY</span>
          ) : (
            <span className="badge badge-core">{subjectData.priorityLabel || 'CORE'}</span>
          )}
          <span className="badge badge-theory">{subjectData.daysLeft} Days Left</span>
          <span className="badge badge-optional mono" style={{ fontSize: '0.68rem' }}>
            Updated: {lastUpdatedDisplay}
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0, lineHeight: 1.45 }}>
          Target: <strong>{subjectData.displayDate}</strong> • Educator:{' '}
          <strong style={{ color: 'var(--text-main)' }}>{subjectData.educator}</strong> • {subjectData.sourceNote}
        </p>
      </div>

      {/* Progress Summary Pill on Right */}
      <div className="subject-header-right">
        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
          Subject Progress
        </div>
        {hasVideos ? (
          <>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.1rem 0' }} className="mono">
              {subjectData.stats.completedSelectedVideos || subjectData.stats.completedVideos || 0}{' '}
              <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>/</span>{' '}
              {subjectData.stats.totalVideos}{' '}
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                ({subjectData.stats.completionRate.toFixed(1)}%)
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              Remaining Core: <strong style={{ color: 'var(--text-main)' }}>{formatTime(subjectData.stats.remainingCoreHours)}</strong> at {playbackSpeed}x
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.15rem 0', color: 'var(--accent-peach)' }}>
              Skeleton Initialized
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
              0 Videos • Linking Tomorrow
            </div>
          </>
        )}
      </div>
    </div>
  );
}
