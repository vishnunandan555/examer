import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Search,
  RotateCcw,
  Eye,
  EyeOff,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ListFilter,
  Clock
} from 'lucide-react';
import { getExamCountdown } from '../../utils/timeUtils';

export default function SubjectSyllabusView({
  subject,
  daysLeft,
  stats,
  completedMap,
  animatingOutKeys,
  onToggleComplete,
  onToggleSubtopic,
  onMarkBatch,
  showCompleted,
  setShowCompleted,
  lastUpdatedDisplay
}) {
  const [selectedModuleId, setSelectedModuleId] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [expandedTopics, setExpandedTopics] = useState({});

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
              (t.concepts && t.concepts.toLowerCase().includes(q)) ||
              (t.type && t.type.toLowerCase().includes(q)) ||
              (t.subtopics && t.subtopics.some((s) => s.title.toLowerCase().includes(q)))
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

  const toggleExpand = (topicId) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const areAllExpanded = useMemo(() => {
    if (allVisibleTopics.length === 0) return false;
    return allVisibleTopics.every((t) => !!expandedTopics[t.id]);
  }, [allVisibleTopics, expandedTopics]);

  const toggleExpandAll = () => {
    const nextState = !areAllExpanded;
    const updated = {};
    allVisibleTopics.forEach((t) => {
      updated[t.id] = nextState;
    });
    setExpandedTopics(updated);
  };

  return (
    <div>
      {/* 1. Subject Header Banner */}
      <div className="card subject-header-banner" style={{ borderLeft: `4px solid ${subject.color}` }}>
        <div className="subject-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{subject.title}</h2>
            <span className="badge badge-module mono">{subject.code}</span>
            {(() => {
              const countdown = getExamCountdown(subject.examDate);
              if (countdown.isCompleted) {
                return (
                  <span className="badge badge-core mono" style={{ fontSize: '0.68rem', backgroundColor: 'rgba(74, 222, 128, 0.15)', color: 'var(--accent-green)', border: '1px solid rgba(74, 222, 128, 0.4)' }}>
                    EXAM CONCLUDED
                  </span>
                );
              }
              if (countdown.isLive) {
                return (
                  <span className="badge badge-critical mono" style={{ fontSize: '0.68rem' }}>
                    LIVE NOW (ENDS 4 PM)
                  </span>
                );
              }
              return (
                <span className="badge badge-critical mono" style={{ fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Clock size={11} /> {countdown.formatted.toUpperCase()}
                </span>
              );
            })()}
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
            All Modules ({subject.modules ? subject.modules.reduce((acc, m) => acc + m.topics.length, 0) : 0})
          </button>
          {subject.modules?.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setSelectedModuleId(m.id)}
              style={{
                backgroundColor: selectedModuleId === m.id ? 'var(--accent-blue)' : 'var(--bg-active)',
                color: selectedModuleId === m.id ? 'var(--bg-base)' : 'var(--text-muted)',
                border: '1px solid var(--border-default)',
                padding: '0.3rem 0.65rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              M{i + 1} ({m.topics.length})
            </button>
          ))}
        </div>

        {/* Search & Actions Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          {/* Priority Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-active)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-main)',
                fontSize: '0.72rem',
                borderRadius: '4px',
                padding: '0.25rem 0.45rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
            </select>
          </div>

          {/* Search Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-active)',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              border: '1px solid var(--border-default)'
            }}
          >
            <Search size={13} color="var(--text-dim)" />
            <input
              type="text"
              placeholder="Search topics / subtopics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '0.75rem',
                width: '140px'
              }}
            />
          </div>

          {/* Expand / Collapse All Subtopics Toggle */}
          <button
            onClick={toggleExpandAll}
            title={areAllExpanded ? 'Collapse all subtopics' : 'Expand all subtopics'}
            style={{
              backgroundColor: 'var(--bg-active)',
              border: '1px solid var(--border-default)',
              color: 'var(--accent-purple)',
              borderRadius: '4px',
              padding: '0.25rem 0.5rem',
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <ChevronsUpDown size={12} /> {areAllExpanded ? 'Collapse Subtopics' : 'Expand Subtopics'}
          </button>

          {/* Check All */}
          <button
            onClick={() => {
              const allIds = [];
              allVisibleTopics.forEach((t) => {
                allIds.push(t.id);
                t.subtopics?.forEach((s) => allIds.push(s.id));
              });
              onMarkBatch(allIds, true);
            }}
            title="Mark visible topics & subtopics completed"
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
            onClick={() => {
              const allIds = [];
              allVisibleTopics.forEach((t) => {
                allIds.push(t.id);
                t.subtopics?.forEach((s) => allIds.push(s.id));
              });
              onMarkBatch(allIds, false);
            }}
            title="Uncheck visible topics & subtopics"
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
                  {topics.map((t) => {
                    const isDone = !!completedMap[t.id];
                    const isAnimatingOut = !!animatingOutKeys[t.id];
                    const subtopics = t.subtopics || [];
                    const completedSubCount = subtopics.filter((s) => !!completedMap[s.id]).length;
                    const isExpanded = !!expandedTopics[t.id];
                    const allSubIds = subtopics.map((s) => s.id);

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
                        {/* Main Topic Header Row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.65rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexGrow: 1, minWidth: 0 }}>
                            {/* Main Topic Checkbox */}
                            <button
                              onClick={() => onToggleComplete(t.id, allSubIds)}
                              title={isDone ? 'Mark topic as incomplete' : 'Mark entire topic and all subtopics as mastered'}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: isDone ? 'var(--accent-green)' : 'var(--text-dim)',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                flexShrink: 0
                              }}
                            >
                              {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                            </button>

                            {/* Clickable Title & Badges Area (Toggles Subtopics) */}
                            <div
                              onClick={() => toggleExpand(t.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                flexWrap: 'wrap',
                                cursor: 'pointer',
                                flexGrow: 1
                              }}
                            >
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

                              {subtopics.length > 0 && (
                                <span
                                  className="badge mono"
                                  style={{
                                    fontSize: '0.62rem',
                                    padding: '0.04rem 0.35rem',
                                    backgroundColor: completedSubCount === subtopics.length && subtopics.length > 0 ? 'rgba(74, 222, 128, 0.15)' : 'var(--bg-active)',
                                    color: completedSubCount === subtopics.length && subtopics.length > 0 ? 'var(--accent-green)' : 'var(--text-dim)',
                                    border: '1px solid var(--border-default)'
                                  }}
                                >
                                  {completedSubCount}/{subtopics.length} Subtopics
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Expand/Collapse Chevron Indicator */}
                          {subtopics.length > 0 && (
                            <button
                              onClick={() => toggleExpand(t.id)}
                              title={isExpanded ? 'Collapse subtopics' : 'Expand subtopics'}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: isExpanded ? 'var(--accent-blue)' : 'var(--text-dim)',
                                padding: '0.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                flexShrink: 0
                              }}
                            >
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          )}
                        </div>

                        {/* Collapsible Subtopics Section */}
                        {isExpanded && subtopics.length > 0 && (
                          <div
                            style={{
                              marginTop: '0.65rem',
                              paddingLeft: '1.75rem',
                              borderLeft: '2px solid var(--border-default)',
                              marginLeft: '0.5rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.35rem'
                            }}
                          >
                            {subtopics.map((sub) => {
                              const isSubDone = !!completedMap[sub.id];

                              return (
                                <div
                                  key={sub.id}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                    padding: '0.35rem 0.55rem',
                                    borderRadius: '4px',
                                    backgroundColor: isSubDone ? 'rgba(74, 222, 128, 0.04)' : 'var(--bg-active)',
                                    border: '1px solid var(--border-subtle)',
                                    transition: 'background-color 0.15s ease'
                                  }}
                                >
                                  <button
                                    onClick={() => onToggleSubtopic(t.id, sub.id, allSubIds)}
                                    title={isSubDone ? 'Mark subtopic incomplete' : 'Mark subtopic completed'}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      cursor: 'pointer',
                                      color: isSubDone ? 'var(--accent-green)' : 'var(--text-dim)',
                                      padding: 0,
                                      display: 'flex',
                                      alignItems: 'center',
                                      flexShrink: 0
                                    }}
                                  >
                                    {isSubDone ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                  </button>
                                  <span
                                    style={{
                                      fontSize: '0.75rem',
                                      color: isSubDone ? 'var(--text-dim)' : 'var(--text-main)',
                                      textDecoration: isSubDone ? 'line-through' : 'none',
                                      lineHeight: 1.35
                                    }}
                                  >
                                    {sub.title}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
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
