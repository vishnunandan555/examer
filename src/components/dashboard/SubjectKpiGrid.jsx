import React from 'react';
import { AlertTriangle, ArrowRight, Check, Clock } from 'lucide-react';
import { getExamCountdown } from '../../utils/timeUtils';

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
  showCompletedExams = false,
  onNavigate
}) {
  const subjectList = Object.entries(allSubjectStats)
    .map(([id, info]) => {
      const countdown = getExamCountdown(info.data.examDate);
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
        countdown,
        isCompleted: countdown.isCompleted
      };
    })
    .filter((card) => showCompletedExams || !card.isCompleted)
    .sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      return a.countdown.totalHours - b.countdown.totalHours;
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
            style={{
              padding: '1.1rem',
              borderTop: `3px solid ${card.accentColor}`,
              userSelect: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              opacity: card.isCompleted ? 0.7 : 1
            }}
          >
            {/* 1. Uniform Top Meta Row: Code + Type on Left, Dynamic Countdown Badge on Right */}
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

                {card.isCompleted ? (
                  <span
                    className="badge badge-core mono"
                    style={{
                      fontSize: '0.68rem',
                      flexShrink: 0,
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      letterSpacing: '0.02em',
                      backgroundColor: 'rgba(74, 222, 128, 0.15)',
                      color: 'var(--accent-green)',
                      border: '1px solid rgba(74, 222, 128, 0.4)'
                    }}
                  >
                    EXAM CONCLUDED
                  </span>
                ) : card.countdown.isLive ? (
                  <span
                    className="badge badge-critical mono"
                    style={{
                      fontSize: '0.68rem',
                      flexShrink: 0,
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      letterSpacing: '0.02em'
                    }}
                  >
                    LIVE NOW
                  </span>
                ) : (
                  <span
                    className={`badge ${card.badgeClass} mono`}
                    style={{
                      fontSize: '0.68rem',
                      flexShrink: 0,
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      letterSpacing: '0.02em',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    <Clock size={10} />
                    {card.countdown.formatted.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Subject Title */}
              <h3 style={{ fontSize: '1.02rem', fontWeight: 800, margin: '0 0 0.25rem', letterSpacing: '-0.01em' }}>
                {card.title}
              </h3>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '0.85rem' }}>
                Exam Target: <strong style={{ color: 'var(--text-muted)' }}>{card.displayDate}</strong>
              </div>

              {/* Progress Summary Section */}
              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Mastery: <strong>{s.completedTopics}</strong> / {s.totalTopics} topics
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
            </div>

            {/* Bottom Row: Revision Pace Indicator & Action Button */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.74rem',
                  color: 'var(--text-muted)',
                  paddingTop: '0.65rem',
                  borderTop: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '0.35rem'
                }}
              >
                <span>
                  Remaining:{' '}
                  <strong style={{ color: 'var(--text-main)' }}>
                    {s.remainingTopics} topic{s.remainingTopics !== 1 ? 's' : ''}
                  </strong>
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Target Pace:</span>
                  <strong
                    style={{ color: s.paceColor, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                    className="mono"
                  >
                    {s.hasWarning && <AlertTriangle size={13} color="#f87171" />}
                    {s.requiredPace.toFixed(1)} topics/day
                  </strong>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
                <button
                  onClick={() => onNavigate(card.id)}
                  style={{
                    backgroundColor: 'var(--bg-active)',
                    border: '1px solid var(--border-default)',
                    color: card.accentColor,
                    padding: '0.35rem 0.75rem',
                    borderRadius: '5px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>Open Syllabus Checklist</span> <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
