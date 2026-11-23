import React from 'react';
import { Layers, Clock, Sparkles, BookOpen, FileText, Cpu, Brain, BarChart3, Scale, Eye, EyeOff } from 'lucide-react';
import { getExamCountdown, isExamCompleted } from '../../utils/timeUtils';
import syllabusData from '../../data/syllabus_data.json';

const SUBJECT_CONFIG = {
  cn: { short: 'CN', icon: <Clock size={13} color="var(--accent-red)" />, badgeClass: 'badge-critical' },
  mat: { short: 'MAT', icon: <Sparkles size={13} color="var(--accent-yellow)" />, badgeClass: 'badge-supply' },
  daa: { short: 'DAA', icon: <Sparkles size={13} color="var(--accent-peach)" />, badgeClass: 'badge-theory' },
  dsa: { short: 'DSA', icon: <BookOpen size={13} color="var(--accent-green)" />, badgeClass: 'badge-supply' },
  ml: { short: 'ML', icon: <Brain size={13} color="var(--accent-blue)" />, badgeClass: 'badge-theory' },
  mc: { short: 'MC', icon: <Cpu size={13} color="var(--accent-purple)" />, badgeClass: 'badge-theory' },
  da: { short: 'DA', icon: <BarChart3 size={13} color="var(--accent-cyan)" />, badgeClass: 'badge-theory' },
  ethics: { short: 'Ethics', icon: <Scale size={13} color="var(--accent-pink)" />, badgeClass: 'badge-supply' }
};

export default function NavigationTabs({
  activeTab,
  setActiveTab,
  showCompletedExams = false,
  setShowCompletedExams
}) {
  // Count completed exams
  const completedCount = Object.values(syllabusData.subjects).filter((s) =>
    isExamCompleted(s.examDate)
  ).length;

  // Filter and sort subjects chronologically by exam date / remaining hours
  const subjectTabs = Object.entries(syllabusData.subjects)
    .map(([key, subj]) => {
      const countdown = getExamCountdown(subj.examDate);
      const config = SUBJECT_CONFIG[key] || {
        short: subj.code,
        icon: <BookOpen size={13} />,
        badgeClass: 'badge-theory'
      };
      return {
        id: key,
        label: config.short,
        fullTitle: `${subj.title} (${subj.code}) • ${subj.displayDate} — ${countdown.formatted}`,
        badge: countdown.badgeText,
        isCompleted: countdown.isCompleted,
        totalHours: countdown.totalHours,
        countdown,
        icon: config.icon
      };
    })
    .filter((tab) => showCompletedExams || !tab.isCompleted)
    .sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      return a.totalHours - b.totalHours;
    });

  const allTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <Layers size={13} />, fullTitle: 'Main Overview' },
    ...subjectTabs,
    {
      id: 'references',
      label: 'Syllabi',
      icon: <FileText size={13} color="var(--accent-purple)" />,
      fullTitle: 'Official Course Syllabi & Guidelines'
    }
  ];

  return (
    <div style={{ borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--bg-base)' }}>
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}
      >
        {/* Left Scrolling Tabs Container */}
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: '0.15rem',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            alignItems: 'center',
            flex: '1 1 auto',
            minWidth: 0
          }}
        >
          {allTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isDone = tab.isCompleted;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.fullTitle}
                style={{
                  padding: '0.6rem 0.55rem',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent-blue)' : isDone ? 'var(--text-dim)' : 'var(--text-muted)',
                  borderBottom: isActive ? '2px solid var(--accent-blue)' : '2px solid transparent',
                  background: 'none',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                  opacity: isDone && !isActive ? 0.6 : 1
                }}
              >
                {tab.icon}
                <span style={{ textDecoration: isDone ? 'line-through' : 'none' }}>{tab.label}</span>
                {tab.badge && (
                  <span
                    className="badge mono"
                    style={{
                      fontSize: '0.6rem',
                      padding: '0.05rem 0.3rem',
                      backgroundColor: isDone
                        ? 'rgba(74, 222, 128, 0.12)'
                        : isActive
                        ? 'rgba(96, 165, 250, 0.18)'
                        : 'var(--bg-active)',
                      color: isDone
                        ? 'var(--accent-green)'
                        : isActive
                        ? 'var(--accent-blue)'
                        : 'var(--text-dim)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '4px'
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right-most Eye Toggle Button for Completed Exams */}
        {completedCount > 0 && setShowCompletedExams && (
          <button
            onClick={() => setShowCompletedExams(!showCompletedExams)}
            title={
              showCompletedExams
                ? 'Click to hide completed exams'
                : `Click to show ${completedCount} completed past exam${completedCount > 1 ? 's' : ''}`
            }
            style={{
              padding: '0.32rem 0.6rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: showCompletedExams ? 'var(--accent-blue)' : 'var(--text-muted)',
              backgroundColor: showCompletedExams ? 'rgba(96, 165, 250, 0.12)' : 'var(--bg-surface)',
              border: showCompletedExams ? '1px solid var(--accent-blue)' : '1px solid var(--border-default)',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.15s ease'
            }}
          >
            {showCompletedExams ? <Eye size={13} color="var(--accent-blue)" /> : <EyeOff size={13} />}
            <span>{showCompletedExams ? 'Hide Past' : `Past (${completedCount})`}</span>
          </button>
        )}
      </div>
    </div>
  );
}
