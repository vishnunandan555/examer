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
  ethics: { badgeClass: 'badge-supply', accentColor: 'var(--accent-pink)', typeLabel: 'S3 Supply' }
};

export default function SubjectKpiGrid({
  allSubjectStats = {},
  onNavigate
}) {
  const subjectList = Object.entries(allSubjectStats)
    .map(([id, info]) => {
      const meta = SUBJECT_METADATA[id] || {
        badgeClass: 'badge-theory',
        accentColor: 'var(--accent-blue)',
        typeLabel: 'Course'
      };
      return {
        id,
        title: info.data.title,
        code: info.data.code,
        displayDate: info.data.displayDate,
        typeLabel: meta.typeLabel,
        badgeClass: meta.badgeClass,
        accentColor: meta.accentColor,
        stats: info.stats,
        days: info.days
      };
    })
    .sort((a, b) => a.days - b.days);

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
            style={{
              padding: '1.1rem',
              borderTop: `3px solid ${card.accentColor}`,
              userSelect: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* 1. Uniform Top Meta Row: Code + Type on Left, Days Left Badge on Right */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span
                    className="badge badge-module mono"
                    style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.45rem' }}
                  >
                    {card.code}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    {card.typeLabel}
                  </span>
                </div>

                <span
                  className={`badge ${card.badgeClass} mono`}
                  style={{
                    fontSize: '0.68rem',
                    flexShrink: 0,
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    letterSpacing: '0.02em'
                  }}
                >
                  {card.days} DAYS LEFT
                </span>
              </div>

              {/* 2. Standardized Title Block with Uniform Height */}
              <div style={{ minHeight: '2.7rem', marginBottom: '0.75rem' }}>
                <h3
                  style={{
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    margin: 0,
                    color: 'var(--text-main)',
                    lineHeight: 1.3
                  }}
                  title={card.title}
                >
                  {card.title}
                </h3>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-dim)',
                    display: 'block',
                    marginTop: '0.15rem'
                  }}
                >
                  Exam Date: <strong style={{ color: 'var(--text-muted)' }}>{card.displayDate}</strong>
                </span>
              </div>
            </div>

            {/* 3. Mastery Progress Bar */}
            <div>
              <div style={{ margin: '0.5rem 0' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.74rem',
                    marginBottom: '0.25rem'
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>
                    Mastery: {s.completedTopics} / {s.totalTopics} syllabus topics
                  </span>
                  <span className="mono" style={{ color: card.accentColor, fontWeight: 700 }}>
                    {s.completionRate.toFixed(1)}%
                  </span>
                </div>
                <div
                  style={{
                    height: '6px',
                    background: 'var(--bg-active)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}
                >
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

              {/* 4. Remaining Topics & Study Pace Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.74rem',
                  color: 'var(--text-muted)',
                  paddingTop: '0.55rem',
                  borderTop: '1px solid var(--border-subtle)',
                  marginTop: '0.4rem'
                }}
              >
                <span>
                  Remaining: <strong style={{ color: 'var(--text-main)' }}>{s.remainingTopics} topics</strong>
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Target Pace:</span>
                  <strong
                    style={{
                      color: s.paceColor,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                    className="mono"
                  >
                    {s.hasWarning && <AlertTriangle size={12} color="#f87171" />}
                    {s.requiredPace.toFixed(1)} topics/day
                  </strong>
                </div>
              </div>

              {/* 5. Uniform Action Button */}
              <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
                <button
                  onClick={() => onNavigate(card.id)}
                  style={{
                    background: 'var(--bg-active)',
                    border: '1px solid var(--border-default)',
                    color: card.accentColor,
                    padding: '0.3rem 0.65rem',
                    borderRadius: '4px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>Open Syllabus</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
