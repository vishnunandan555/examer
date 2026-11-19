import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';

const SUBJECT_METADATA = {
  cn: { badgeClass: 'badge-critical', accentColor: 'var(--accent-red)', typeLabel: 'S5 Theory' },
  mat: { badgeClass: 'badge-supply', accentColor: 'var(--accent-yellow)', typeLabel: 'S3 Supply' },
  daa: { badgeClass: 'badge-theory', accentColor: 'var(--accent-peach)', typeLabel: 'S5 Theory' },
  dsa: { badgeClass: 'badge-supply', accentColor: 'var(--accent-green)', typeLabel: 'S3 Supply' },
  ml: { badgeClass: 'badge-theory', accentColor: 'var(--accent-blue)', typeLabel: 'S5 Theory' },
  mc: { badgeClass: 'badge-theory', accentColor: 'var(--accent-purple)', typeLabel: 'S5 Theory' },
  da: { badgeClass: 'badge-theory', accentColor: 'var(--accent-cyan)', typeLabel: 'S5 Theory' },
  ethics: { badgeClass: 'badge-supply', accentColor: '#ec4899', typeLabel: 'S3 Supply' }
};

export default function SubjectKpiGrid({
  allSubjectStats = {},
  onNavigate
}) {
  const subjectList = Object.entries(allSubjectStats).map(([id, info]) => {
    const meta = SUBJECT_METADATA[id] || {
      badgeClass: 'badge-theory',
      accentColor: 'var(--accent-blue)',
      typeLabel: 'Course'
    };
    return {
      id,
      title: info.data.title,
      code: `${info.data.displayDate} • ${meta.typeLabel} (${info.data.code})`,
      badgeClass: meta.badgeClass,
      accentColor: meta.accentColor,
      stats: info.stats,
      days: info.days,
      viewLabel: `Open ${info.data.code} Syllabus`
    };
  });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '0.85rem',
        marginBottom: '1.25rem'
      }}
    >
      {subjectList.map((card) => {
        const s = card.stats;
        if (!s) return null;

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
