import React from 'react';
import { ArrowRight, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { getExamCountdown } from '../../utils/timeUtils';

export default function UrgencyBanner({
  nextExam,
  nextSubjectStats,
  onNavigate
}) {
  if (!nextExam || !nextSubjectStats) {
    return (
      <div
        className="card"
        style={{
          padding: '1.15rem 1.25rem',
          marginBottom: '1rem',
          borderLeft: '4px solid var(--accent-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <CheckCircle2 size={24} color="var(--accent-green)" />
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
              All Examination Series Modules Completed
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0.2rem 0 0' }}>
              All KTU exam syllabus milestones have been completed. Great work!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const s = nextSubjectStats;
  const countdown = getExamCountdown(nextExam.date);

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
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
            {nextExam.subject} ({nextExam.type}) • {nextExam.displayDate}
          </h2>
          <span className="badge badge-optional mono" style={{ fontSize: '0.65rem' }}>
            {nextExam.code}
          </span>
          <span className="badge badge-module mono" style={{ fontSize: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
            <Clock size={11} /> {countdown.formatted}
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
          <strong>{countdown.formatted}</strong> • Syllabus Progress:{' '}
          <strong>{s.completedTopics} / {s.totalTopics} topics mastered</strong> ({s.completionRate.toFixed(1)}%). Target revision pace:{' '}
          <strong style={{ color: s.paceColor, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }} className="mono">
            {s.hasWarning && <AlertTriangle size={13} color="#f87171" />}
            {s.requiredPace.toFixed(1)} topics/day
          </strong>{' '}
          ({s.stress}).
        </p>
      </div>

      {nextExam.subjectId && (
        <button
          onClick={() => onNavigate(nextExam.subjectId)}
          style={{
            backgroundColor: 'var(--accent-red)',
            color: '#090a0f',
            border: 'none',
            borderRadius: '5px',
            padding: '0.55rem 1rem',
            fontWeight: 750,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            flexShrink: 0
          }}
        >
          <span>Open {nextExam.subject} Syllabus</span>
          <ArrowRight size={14} color="#090a0f" />
        </button>
      )}
    </div>
  );
}
