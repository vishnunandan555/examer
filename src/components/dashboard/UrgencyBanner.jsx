import React from 'react';
import { ArrowRight, AlertTriangle } from 'lucide-react';

export default function UrgencyBanner({
  cnStats,
  cnDays,
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
          <span className="badge badge-optional mono" style={{ fontSize: '0.65rem' }}>PCCST501</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
          <strong>{cnDays} days remaining</strong> • Syllabus Progress:{' '}
          <strong>{cnStats.completedTopics} / {cnStats.totalTopics} topics mastered</strong> ({cnStats.completionRate.toFixed(1)}%). Target revision pace:{' '}
          <strong style={{ color: cnStats.paceColor, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }} className="mono">
            {cnStats.hasWarning && <AlertTriangle size={13} color="#f87171" />}
            {cnStats.requiredPace.toFixed(1)} topics/day
          </strong>{' '}
          ({cnStats.stress}).
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
        Open CN Syllabus Checklist <ArrowRight size={14} />
      </button>
    </div>
  );
}
