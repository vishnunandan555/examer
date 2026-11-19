import React from 'react';
import { Layers } from 'lucide-react';

export default function DashboardTrackBar({ activeViewMode, setActiveViewMode }) {
  return (
    <div
      className="card"
      style={{
        padding: '0.65rem 0.95rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.65rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
        <Layers size={15} color="var(--accent-blue)" />
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Active Study Track:
        </span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
          (Dashboard stats dynamically adapt to this track)
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveViewMode('study')}
          style={{
            backgroundColor: activeViewMode === 'study' ? 'var(--accent-blue)' : 'var(--bg-active)',
            color: activeViewMode === 'study' ? 'var(--bg-base)' : 'var(--text-main)',
            border: activeViewMode === 'study' ? '1px solid var(--accent-blue)' : '1px solid var(--border-default)',
            padding: '0.3rem 0.65rem',
            borderRadius: '4px',
            fontSize: '0.74rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          🎯 Selected Plan
        </button>
        <button
          onClick={() => setActiveViewMode('core')}
          style={{
            backgroundColor: activeViewMode === 'core' ? 'var(--accent-green)' : 'var(--bg-active)',
            color: activeViewMode === 'core' ? 'var(--bg-base)' : 'var(--text-main)',
            border: activeViewMode === 'core' ? '1px solid var(--accent-green)' : '1px solid var(--border-default)',
            padding: '0.3rem 0.65rem',
            borderRadius: '4px',
            fontSize: '0.74rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          ⚡ Core Only
        </button>
        <button
          onClick={() => setActiveViewMode('original')}
          style={{
            backgroundColor: activeViewMode === 'original' ? 'var(--text-main)' : 'var(--bg-active)',
            color: activeViewMode === 'original' ? 'var(--bg-base)' : 'var(--text-main)',
            border: activeViewMode === 'original' ? '1px solid var(--text-main)' : '1px solid var(--border-default)',
            padding: '0.3rem 0.65rem',
            borderRadius: '4px',
            fontSize: '0.74rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          📜 Full Playlist
        </button>
      </div>
    </div>
  );
}
