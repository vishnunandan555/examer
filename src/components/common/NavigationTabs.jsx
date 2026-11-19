import React from 'react';
import { Layers, Clock, Sparkles, BookOpen, FileText, Cpu, Brain, BarChart3, Scale } from 'lucide-react';
import { getDaysLeft } from '../../utils/timeUtils';
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
  setActiveTab
}) {
  // Sort subjects chronologically by exam date / days left
  const subjectTabs = Object.entries(syllabusData.subjects)
    .map(([key, subj]) => {
      const days = Math.max(0, getDaysLeft(subj.examDate));
      const config = SUBJECT_CONFIG[key] || {
        short: subj.code,
        icon: <BookOpen size={13} />,
        badgeClass: 'badge-theory'
      };
      return {
        id: key,
        label: config.short,
        fullTitle: `${subj.title} (${subj.code}) • ${subj.displayDate}`,
        badge: `${days}D`,
        days,
        icon: config.icon
      };
    })
    .sort((a, b) => a.days - b.days);

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
        className="no-scrollbar"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 0.5rem',
          display: 'flex',
          gap: '0.15rem',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          alignItems: 'center'
        }}
      >
        {allTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.fullTitle}
              style={{
                padding: '0.6rem 0.55rem',
                fontSize: '0.78rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)',
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
                flexShrink: 0
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className="badge mono"
                  style={{
                    fontSize: '0.6rem',
                    padding: '0.05rem 0.3rem',
                    backgroundColor: isActive ? 'rgba(96, 165, 250, 0.18)' : 'var(--bg-active)',
                    color: isActive ? 'var(--accent-blue)' : 'var(--text-dim)',
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
    </div>
  );
}
