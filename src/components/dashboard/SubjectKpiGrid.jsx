import React from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SubjectKpiGrid({
  cnStats,
  cnDays,
  daaStats,
  daaDays,
  dsaStats,
  dsaDays,
  onNavigate
}) {
  const cards = [
    {
      id: 'cn',
      title: 'Computer Networks',
      code: 'Nov 23 • S5 Theory (PCCST501)',
      badgeClass: 'badge-critical',
      accentColor: 'var(--accent-red)',
      stats: cnStats,
      days: cnDays,
      viewLabel: 'Open CN Syllabus'
    },
    {
      id: 'daa',
      title: 'DAA (Algorithms)',
      code: 'Nov 27 • S5 Theory (PCCST502)',
      badgeClass: 'badge-theory',
      accentColor: 'var(--accent-peach)',
      stats: daaStats,
      days: daaDays,
      viewLabel: 'Open DAA Syllabus'
    },
    {
      id: 'dsa',
      title: 'S3 DSA (Supply)',
      code: 'Nov 30 • S3 Supply (PCCST303)',
      badgeClass: 'badge-supply',
      accentColor: 'var(--accent-green)',
      stats: dsaStats,
      days: dsaDays,
      viewLabel: 'Open DSA Syllabus'
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '0.85rem',
        marginBottom: '1.25rem'
      }}
    >
      {cards.map((card) => {
        const s = card.stats;

        return (
          <div
            key={card.id}
            className="card card-hover"
            style={{ padding: '1rem', borderTop: `3px solid ${card.accentColor}`, userSelect: 'none' }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.4rem',
                flexWrap: 'wrap',
                gap: '0.35rem'
              }}
            >
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{card.title}</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{card.code}</span>
              </div>
              <span className={`badge ${card.badgeClass}`}>{card.days} Days Left</span>
            </div>

            {/* Progress Section */}
            <div style={{ margin: '0.75rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  Mastery: {s.completedTopics} / {s.totalTopics} syllabus topics
                </span>
                <span className="mono" style={{ color: card.accentColor, fontWeight: 700 }}>
                  {s.completionRate.toFixed(1)}%
                </span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-active)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${s.completionRate}%`,
                    background: card.accentColor,
                    height: '100%',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>

            {/* Remaining Topics & Study Pace Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                paddingTop: '0.5rem',
                borderTop: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '0.35rem'
              }}
            >
              <span>
                Remaining: <strong style={{ color: 'var(--text-main)' }}>{s.remainingTopics} topics</strong>
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Target Pace:</span>
                <strong
                  style={{ color: s.paceColor, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                  className="mono"
                >
                  {s.hasWarning && <AlertTriangle size={12} color="#f87171" />}
                  {s.requiredPace.toFixed(1)} topics/day
                </strong>
              </div>
            </div>

            {/* View Link Button */}
            <div style={{ marginTop: '0.65rem', textAlign: 'right' }}>
              <button
                onClick={() => onNavigate(card.id)}
                style={{
                  background: 'var(--bg-active)',
                  border: '1px solid var(--border-default)',
                  color: card.accentColor,
                  padding: '0.25rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                {card.viewLabel} <ArrowRight size={11} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
