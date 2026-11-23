import React from 'react';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';

export default function UrgencyBanner({
  onNavigateToOS,
  onNavigateToCOA,
  onNavigateToDBMS
}) {
  return (
    <div
      className="card"
      style={{
        padding: '1.15rem 1.25rem',
        marginBottom: '1.25rem',
        borderLeft: '4px solid var(--accent-red)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}
    >
      <div style={{ flex: '1 1 auto', minWidth: '280px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
          <span className="badge badge-critical" style={{ fontSize: '0.65rem' }}>
            TOP PRIORITY SUITE
          </span>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
            January Semester Exams & GATE Suite
          </h2>
          <span className="badge badge-core" style={{ fontSize: '0.65rem' }}>
            TARGET 2027
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0, lineHeight: 1.45 }}>
          Top priority subjects: <strong style={{ color: 'var(--accent-red)' }}>Operating Systems</strong> &amp;{' '}
          <strong style={{ color: 'var(--accent-yellow)' }}>COA</strong> (by Viswadeep Gothi / VD Gothi), alongside{' '}
          <strong style={{ color: 'var(--accent-peach)' }}>DBMS</strong>. Core foundations: CN, DSA (Amit Khurana unified playlist), General Aptitude, and C Programming (Beej's Guide).
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
        <button
          onClick={onNavigateToOS}
          style={{
            backgroundColor: 'var(--accent-red)',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            padding: '0.5rem 0.85rem',
            fontWeight: 600,
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Flame size={13} /> Open OS (P1)
        </button>
        <button
          onClick={onNavigateToCOA}
          style={{
            backgroundColor: 'var(--bg-active)',
            color: 'var(--accent-yellow)',
            border: '1px solid var(--border-default)',
            borderRadius: '5px',
            padding: '0.5rem 0.85rem',
            fontWeight: 600,
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <span>Open COA (P1)</span>
        </button>
      </div>
    </div>
  );
}
