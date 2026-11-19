import React from 'react';
import { Target, CheckCircle2, Flame, Award } from 'lucide-react';

export default function OverallProgressSummary({
  totalTopics,
  completedTopics,
  overallRate
}) {
  const cards = [
    {
      title: 'Total Syllabus Topics',
      value: `${totalTopics} Topics`,
      sub: 'Across all 8 S5 Regular & S3 Supply courses',
      color: 'var(--text-main)',
      icon: <Target size={16} color="var(--accent-blue)" />
    },
    {
      title: 'Topics Mastered',
      value: `${completedTopics} Done`,
      sub: `${(totalTopics - completedTopics)} remaining to revise`,
      color: 'var(--accent-green)',
      icon: <CheckCircle2 size={16} color="var(--accent-green)" />
    },
    {
      title: 'Exam Series Readiness',
      value: `${overallRate.toFixed(1)}%`,
      sub: overallRate >= 80 ? 'Exam Ready!' : overallRate >= 50 ? 'Strong Progress' : 'Revision In Progress',
      color: overallRate >= 75 ? 'var(--accent-green)' : overallRate >= 40 ? 'var(--accent-yellow)' : 'var(--accent-peach)',
      icon: <Award size={16} color="var(--accent-yellow)" />
    },
    {
      title: 'Immediate Target',
      value: 'CN (Nov 23)',
      sub: 'Immediate Exam • 30 Topics in Syllabus',
      color: 'var(--accent-red)',
      icon: <Flame size={16} color="var(--accent-red)" />
    }
  ];

  return (
    <div className="card" style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '0.85rem' }}>
        <h3 style={{ fontSize: '0.98rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
          <Target size={16} color="var(--accent-blue)" /> Exam Series Readiness & Syllabus Mastery
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '0.2rem 0 0' }}>
          Real-time syllabus completion across all 8 upcoming university examinations:
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {cards.map((c, i) => (
          <div
            key={i}
            className="card card-hover"
            style={{
              backgroundColor: 'var(--bg-overlay)',
              padding: '0.85rem',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              userSelect: 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{c.title}</span>
              {c.icon}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: c.color }} className="mono">
              {c.value}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              {c.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
