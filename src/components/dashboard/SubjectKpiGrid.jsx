import React from 'react';
import { AlertTriangle, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { formatTime } from '../../utils/timeUtils';

export default function SubjectKpiGrid({
  subjectsData,
  playbackSpeed,
  timeUnitMode,
  toggleTimeUnit,
  onNavigate
}) {
  const topPrioritySubjects = subjectsData.filter((s) => s.priority === 'top');
  const coreSubjects = subjectsData.filter((s) => s.priority !== 'top');

  const renderCard = (card) => {
    const m = card.metrics;
    const hasVideos = m.totalVids > 0;

    return (
      <div
        key={card.id}
        className="card card-hover"
        style={{
          padding: '1rem',
          borderTop: `3px solid ${card.accentColor}`,
          userSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Card Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '0.45rem',
              flexWrap: 'wrap',
              gap: '0.35rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '0.96rem', fontWeight: 700, margin: 0 }}>{card.title}</h3>
                {card.priority === 'top' ? (
                  <span className="badge badge-critical" style={{ fontSize: '0.62rem' }}>
                    TOP PRIORITY
                  </span>
                ) : (
                  <span className="badge badge-module" style={{ fontSize: '0.62rem' }}>
                    {card.priorityLabel}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                Educator: <strong style={{ color: 'var(--text-muted)' }}>{card.educator}</strong>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className={`badge ${card.badgeClass}`}>{card.days} Days Left</span>
              {hasVideos && (
                <span
                  onClick={toggleTimeUnit}
                  title="Click to toggle Hours / Days format"
                  style={{ fontSize: '0.62rem', color: 'var(--accent-blue)', opacity: 0.8, cursor: 'pointer' }}
                >
                  {timeUnitMode === 'days' ? '📅 Days' : '⏱️ Hrs'}
                </span>
              )}
            </div>
          </div>

          {/* Progress / Skeleton Section */}
          {hasVideos ? (
            <div style={{ margin: '0.75rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  Progress: {m.completedVids} / {m.totalVids} videos
                </span>
                <span className="mono" style={{ color: card.accentColor, fontWeight: 700 }}>
                  {m.rate.toFixed(1)}%
                </span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-active)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${m.rate}%`,
                    background: card.accentColor,
                    height: '100%',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          ) : (
            <div
              style={{
                margin: '0.75rem 0',
                padding: '0.55rem 0.75rem',
                backgroundColor: 'var(--bg-overlay)',
                borderRadius: '6px',
                border: '1px dashed var(--border-subtle)',
                fontSize: '0.74rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-peach)', fontWeight: 600 }}>
                <Clock size={12} /> Curation Skeleton Ready
              </div>
              <div style={{ color: 'var(--text-dim)', marginTop: '0.2rem', fontSize: '0.7rem' }}>
                Curated playlist will be linked tomorrow.
              </div>
            </div>
          )}
        </div>

        <div>
          {/* Remaining Watch Time & Study Pace Footer */}
          {hasVideos ? (
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
                Remaining:{' '}
                <strong style={{ color: 'var(--text-main)' }}>
                  {formatTime(m.remainingHrs, timeUnitMode)}
                </strong>{' '}
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>({playbackSpeed}x)</span>
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Pace:</span>
                <strong
                  style={{ color: m.paceColor, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                  className="mono"
                >
                  {m.hasWarning && <AlertTriangle size={12} color="#f87171" />}
                  {m.pace.toFixed(1)} hrs/day
                </strong>
              </div>
            </div>
          ) : (
            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-dim)',
                paddingTop: '0.5rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{card.modules.length} Planned Modules</span>
              <span className="mono" style={{ color: 'var(--text-muted)' }}>Target: {card.displayDate}</span>
            </div>
          )}

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
              <span>View {card.shortName}</span> <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {/* 1. Top Priority Section */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
          <Sparkles size={15} color="var(--accent-red)" />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Top Priority Focus (OS • DBMS • COA)
          </h3>
          <span className="badge badge-critical" style={{ fontSize: '0.6rem' }}>
            PRIMARY FOCUS
          </span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '0.85rem'
          }}
        >
          {topPrioritySubjects.map(renderCard)}
        </div>
      </div>

      {/* 2. Core Curriculum & Foundations Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
            Core Engineering & Foundations (CN, DSA, Aptitude, C Prog)
          </h3>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '0.85rem'
          }}
        >
          {coreSubjects.map(renderCard)}
        </div>
      </div>
    </div>
  );
}
