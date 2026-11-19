import React from 'react';
import { TrendingUp } from 'lucide-react';
import { formatTime } from '../../utils/timeUtils';

export default function ReductionSummary({ timeUnitMode, toggleTimeUnit }) {
  const cards = [
    {
      title: 'Original Raw Playlists',
      value: '500 Videos',
      sub: `${formatTime(260.2, timeUnitMode)} total watch time`,
      color: 'var(--text-main)'
    },
    {
      title: 'Curated Core (Must-Watch)',
      value: '290 Videos',
      sub: `${formatTime(152.0, timeUnitMode)} (42% Load Cut)`,
      color: 'var(--accent-green)'
    },
    {
      title: 'Optional Practice',
      value: '155 Videos',
      sub: `${formatTime(85.9, timeUnitMode)} extra practice`,
      color: 'var(--accent-yellow)'
    },
    {
      title: 'Eliminated Overkill',
      value: '55 Videos',
      sub: `${formatTime(22.3, timeUnitMode)} saved directly`,
      color: 'var(--accent-red)'
    }
  ];

  return (
    <div className="card" style={{ padding: '1rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '0.4rem'
        }}
      >
        <h3 style={{ fontSize: '0.98rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
          <TrendingUp size={16} color="var(--accent-green)" /> Syllabus Filtering Impact Summary
        </h3>
        <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', cursor: 'pointer' }} onClick={toggleTimeUnit}>
          (Click any box to toggle Days / Hours)
        </span>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '0 0 0.85rem' }}>
        Eliminated repetitive competitive programming and isolated 2-minute GATE questions to isolate pure university syllabus portions:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
        {cards.map((c, i) => (
          <div
            key={i}
            className="card card-hover"
            onClick={toggleTimeUnit}
            title="Click to toggle Days format"
            style={{
              backgroundColor: 'var(--bg-overlay)',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{c.title}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: '0.72rem', color: c.color === 'var(--text-main)' ? 'var(--text-muted)' : c.color }}>
              {c.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
