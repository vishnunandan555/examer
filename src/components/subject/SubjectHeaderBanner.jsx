import React from 'react';
import { formatTime } from '../../utils/timeUtils';

export default function SubjectHeaderBanner({
  subjectData,
  lastUpdatedDisplay,
  playbackSpeed
}) {
  return (
    <div className="card subject-header-banner">
      <div className="subject-header-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{subjectData.title}</h2>
          <span className="badge badge-module mono">{subjectData.code}</span>
          <span className="badge badge-critical">{subjectData.daysLeft} Days Left</span>
          <span className="badge badge-optional mono" style={{ fontSize: '0.68rem' }}>
            Updated: {lastUpdatedDisplay}
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0, lineHeight: 1.45 }}>
          Exam Date: <strong>{subjectData.displayDate}</strong> • {subjectData.syllabusNote}
        </p>
      </div>

      {/* Progress Summary Pill on Right */}
      <div className="subject-header-right">
        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
          Subject Progress
        </div>
        <div style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.1rem 0' }} className="mono">
          {subjectData.stats.completedVideos || subjectData.stats.completedSelectedVideos}{' '}
          <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>/</span>{' '}
          {subjectData.stats.totalVideos}{' '}
          <span style={{ fontSize: '0.85rem', color: 'var(--accent-green)', fontWeight: 600 }}>
            ({subjectData.stats.completionRate.toFixed(1)}%)
          </span>
        </div>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          Remaining Core: <strong style={{ color: 'var(--text-main)' }}>{formatTime(subjectData.stats.remainingCoreHours)}</strong> at {playbackSpeed}x
        </div>
      </div>
    </div>
  );
}
