import React from 'react';
import { ArrowRight } from 'lucide-react';
import { formatTime } from '../../utils/timeUtils';

export default function UrgencyBanner({
  cnStats,
  cnDays,
  cnMetrics,
  playbackSpeed,
  onNavigateToCN
}) {
  return (
    <div
      className="card"
      style={{
        padding: '1.15rem 1.25rem',
        marginBottom: '1rem',
        borderLeft: '4px solid var(--accent-red)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}
    >
      <div style={{ flex: '1 1 auto', minWidth: '280px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
          <span className="badge badge-critical">IMMEDIATE FOCUS</span>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Computer Networks (Theory) • Nov 23</h2>
          <span className={`badge ${cnMetrics.trackBadge}`} style={{ fontSize: '0.65rem' }}>
            {cnMetrics.trackName}
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
          <strong>{cnDays} days remaining</strong> • <strong>{cnMetrics.trackName}</strong>:{' '}
          <strong>{formatTime(cnMetrics.remainingHrs)}</strong> remaining at {playbackSpeed}x ({cnMetrics.completedVids}/{cnMetrics.totalVids} completed, {cnMetrics.rate.toFixed(1)}%). Target pace:{' '}
          <strong style={{ color: cnMetrics.paceColor }} className="mono">
            {cnMetrics.pace.toFixed(1)} hrs/day
          </strong>{' '}
          ({cnMetrics.stress}).
        </p>
      </div>
      <button
        onClick={onNavigateToCN}
        style={{
          backgroundColor: 'var(--accent-red)',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          padding: '0.55rem 1rem',
          fontWeight: 600,
          fontSize: '0.82rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          flexShrink: 0
        }}
      >
        Open CN ({cnMetrics.trackName}) <ArrowRight size={14} />
      </button>
    </div>
  );
}
