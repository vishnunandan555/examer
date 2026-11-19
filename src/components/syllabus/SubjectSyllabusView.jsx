import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Search,
  Filter,
  RotateCcw,
  Eye,
  EyeOff,
  AlertTriangle,
  BookOpen,
  Award,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function SubjectSyllabusView({
  subject,
  daysLeft,
  stats,
  completedMap,
  animatingOutKeys,
  onToggleComplete,
  onMarkBatch,
  showCompleted,
  setShowCompleted,
  lastUpdatedDisplay
}) {
  const [selectedModuleId, setSelectedModuleId] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Filter topics
  const filteredModules = useMemo(() => {
    if (!subject || !subject.modules) return [];

    return subject.modules
      .filter((mod) => selectedModuleId === 'ALL' || mod.id === selectedModuleId)
      .map((mod) => {
        let topics = mod.topics;

        if (priorityFilter !== 'ALL') {
          topics = topics.filter((t) => t.priority === priorityFilter);
        }

        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          topics = topics.filter(
            (t) =>
              t.title.toLowerCase().includes(q) ||
              t.concepts.toLowerCase().includes(q) ||
              t.type.toLowerCase().includes(q)
          );
        }

        if (!showCompleted) {
          topics = topics.filter((t) => {
            const isDone = !!completedMap[t.id];
            const isAnimating = !!animatingOutKeys[t.id];
            return !isDone || isAnimating;
          });
        }

        return {
          ...mod,
          visibleTopics: topics
        };
      });
  }, [subject, selectedModuleId, priorityFilter, searchQuery, showCompleted, completedMap, animatingOutKeys]);

  const allVisibleTopics = useMemo(() => {
    return filteredModules.flatMap((m) => m.visibleTopics);
  }, [filteredModules]);

  return (
    <div>
      {/* 1. Subject Header Banner */}
      <div className="card subject-header-banner" style={{ borderLeft: `4px solid ${subject.color}` }}>
        <div className="subject-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{subject.title}</h2>
            <span className="badge badge-module mono">{subject.code}</span>
            <span className="badge badge-critical">{daysLeft} Days Left</span>
            <span className="badge badge-optional mono" style={{ fontSize: '0.68rem' }}>
              Updated: {lastUpdatedDisplay}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '0 0 0.35rem', lineHeight: 1.45 }}>
            Exam Date: <strong>{subject.displayDate}</strong> • {subject.semester} • {subject.examFormat}
          </p>
        </div>

        {/* Progress Summary Pill on Right */}
        <div className="subject-header-right">
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
            Syllabus Mastery
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.1rem 0' }} className="mono">
            {stats.completedTopics} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>/</span> {stats.totalTopics}{' '}
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-green)', fontWeight: 600 }}>
              ({stats.completionRate.toFixed(1)}%)
            </span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>Target:</span>
            <strong style={{ color: stats.paceColor }} className="mono">
              {stats.hasWarning && <AlertTriangle size={12} color="#f87171" />}
              {stats.requiredPace.toFixed(1)} topics/day
            </strong>
          </div>
        </div>
      </div>

      {/* 2. Filter & Action Toolbar */}
      <div
        className="card"
        style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.65rem'
        }}
      >
        {/* Module Filter Pills */}
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedModuleId('ALL')}
            style={{
              backgroundColor: selectedModuleId === 'ALL' ? 'var(--accent-blue)' : 'var(--bg-active)',
              color: selectedModuleId === 'ALL' ? 'var(--bg-base)' : 'var(--text-main)',
              border: '1px solid var(--border-default)',
              padding: '0.3rem 0.65rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            All Modules ({stats.totalTopics})
          </button>
          {subject.modules.map((m) => {
            const mStat = stats.moduleStats[m.id];
            const isSel = selectedModuleId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedModuleId(m.id)}
                style={{
                  backgroundColor: isSel ? 'var(--accent-blue)' : 'var(--bg-active)',
                  color: isSel ? 'var(--bg-base)' : 'var(--text-main)',
                  border: '1px solid var(--border-default)',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {m.name.split(':')[0]} ({mStat ? `${mStat.completed}/${mStat.total}` : m.topics.length})
              </button>
            );
          })}
        </div>

        {/* Search, Check All, Reset, Show Completed */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'var(--bg-overlay)',
              padding: '0.25rem 0.55rem',
              borderRadius: '5px',
              border: '1px solid var(--border-default)'
            }}
          >
            <Search size={13} color="var(--text-dim)" />
            <input
              type="text"
              placeholder="Search syllabus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '0.75rem',
                width: '120px'
              }}
            />
          </div>

          {/* Check All */}
          <button
            onClick={() => onMarkBatch(allVisibleTopics.map((t) => t.id), true)}
            title="Mark visible topics completed"
            style={{
              backgroundColor: 'var(--bg-active)',
              border: '1px solid var(--border-default)',
              color: 'var(--accent-green)',
              borderRadius: '4px',
              padding: '0.25rem 0.5rem',
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <CheckCircle2 size={12} /> Check All
          </button>

          {/* Reset */}
          <button
            onClick={() => onMarkBatch(allVisibleTopics.map((t) => t.id), false)}
            title="Uncheck visible topics"
            style={{
              backgroundColor: 'var(--bg-active)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-dim)',
              borderRadius: '4px',
              padding: '0.25rem 0.5rem',
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <RotateCcw size={12} /> Reset
          </button>

          {/* Show / Hide Completed Toggle */}
          <button
            onClick={() => setShowCompleted((prev) => !prev)}
            title={showCompleted ? 'Click to hide completed topics' : 'Click to show all completed topics'}
            style={{
              backgroundColor: showCompleted ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-active)',
              border: showCompleted ? '1px solid var(--accent-blue)' : '1px solid var(--border-default)',
              color: showCompleted ? 'var(--accent-blue)' : 'var(--text-dim)',
              borderRadius: '4px',
              padding: '0.25rem 0.55rem',
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: showCompleted ? 600 : 400,
              transition: 'all 0.15s ease'
            }}
          >
            {showCompleted ? <Eye size={12} /> : <EyeOff size={12} />}
            <span>Show Completed</span>
          </button>
        </div>
      </div>

      {/* 3. Modules and Topics Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredModules.map((mod) => {
          const modStat = stats.moduleStats[mod.id] || { total: mod.topics.length, completed: 0, rate: 0 };
          const topics = mod.visibleTopics;

          return (
            <div
              key={mod.id}
              className="card"
              style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)' }}
            >
              {/* Module Header Strip */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.85rem',
                  paddingBottom: '0.65rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                    {mod.name}
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    Exam Weightage: {mod.weightage}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {modStat.completed} / {modStat.total} Mastered
                  </span>
                  <span
                    className="badge mono"
                    style={{
                      fontSize: '0.65rem',
                      backgroundColor: modStat.rate === 100 ? 'rgba(74, 222, 128, 0.15)' : 'var(--bg-active)',
                      color: modStat.rate === 100 ? 'var(--accent-green)' : 'var(--text-main)',
                      borderColor: modStat.rate === 100 ? 'var(--accent-green)' : 'var(--border-default)'
                    }}
                  >
                    {modStat.rate.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Topic Checklist Items */}
              {topics.length === 0 ? (
                <div style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                  {showCompleted
                    ? 'No topics found matching search criteria.'
                    : 'All topics in this module mastered! (Toggle "Show Completed" to review)'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {topics.map((t, idx) => {
                    const isDone = !!completedMap[t.id];
                    const isAnimatingOut = !!animatingOutKeys[t.id];

                    return (
                      <div
                        key={t.id}
                        className={`card ${isAnimatingOut ? 'card-animating-out' : ''}`.trim()}
                        style={{
                          padding: '0.75rem 0.85rem',
                          backgroundColor: isDone ? 'rgba(74, 222, 128, 0.03)' : 'var(--bg-overlay)',
                          borderLeft: isDone ? '3px solid var(--accent-green)' : '3px solid var(--border-default)',
                          transition: 'opacity 0.45s ease, transform 0.45s ease, max-height 0.45s ease, padding 0.45s ease, margin 0.45s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.65rem' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', flexGrow: 1 }}>
                            {/* Checkbox */}
                            <button
                              onClick={() => onToggleComplete(t.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: isDone ? 'var(--accent-green)' : 'var(--text-dim)',
                                padding: 0,
                                marginTop: '0.1rem',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                            </button>

                            {/* Content */}
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                                <span
                                  style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    color: isDone ? 'var(--text-dim)' : 'var(--text-main)',
                                    textDecoration: isDone ? 'line-through' : 'none'
                                  }}
                                >
                                  {t.title}
                                </span>
                                <span
                                  className="badge"
                                  style={{
                                    fontSize: '0.62rem',
                                    padding: '0.04rem 0.35rem',
                                    backgroundColor: t.priority === 'High' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(250, 204, 21, 0.1)',
                                    color: t.priority === 'High' ? 'var(--accent-red)' : 'var(--accent-yellow)',
                                    border: `1px solid ${t.priority === 'High' ? 'rgba(248, 113, 113, 0.3)' : 'rgba(250, 204, 21, 0.3)'}`
                                  }}
                                >
                                  {t.priority}
                                </span>
                                <span className="badge badge-optional mono" style={{ fontSize: '0.62rem', padding: '0.04rem 0.35rem' }}>
                                  {t.type}
                                </span>
                              </div>

                              <p
                                style={{
                                  fontSize: '0.74rem',
                                  color: isDone ? 'var(--text-dim)' : 'var(--text-muted)',
                                  margin: 0,
                                  lineHeight: 1.45
                                }}
                              >
                                {t.concepts}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
