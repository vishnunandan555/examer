import React from 'react';
import { Layers, Clock, Sparkles, BookOpen, FileText, Cpu, Brain, BarChart3, Scale } from 'lucide-react';
import { getDaysLeft } from '../../utils/timeUtils';
import syllabusData from '../../data/syllabus_data.json';

export default function NavigationTabs({
  activeTab,
  setActiveTab
}) {
  const subjectIcons = {
    cn: <Clock size={13} color="var(--accent-red)" />,
    mat: <Sparkles size={13} color="var(--accent-yellow)" />,
    daa: <Sparkles size={13} color="var(--accent-peach)" />,
    dsa: <BookOpen size={13} color="var(--accent-green)" />,
    ml: <Brain size={13} color="var(--accent-blue)" />,
    mc: <Cpu size={13} color="var(--accent-purple)" />,
    da: <BarChart3 size={13} color="var(--accent-cyan)" />,
    ethics: <Scale size={13} color="var(--accent-peach)" />
  };

  const subjectTabs = Object.entries(syllabusData.subjects).map(([key, subj]) => {
    const days = Math.max(0, getDaysLeft(subj.examDate));
    return {
      id: key,
      label: subj.code,
      fullTitle: subj.title,
      badge: `${days}D`,
      icon: subjectIcons[key] || <BookOpen size={13} />
    };
  });

  const allTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <Layers size={13} /> },
    ...subjectTabs,
    {
      id: 'references',
      label: 'Syllabi & Guidelines',
      icon: <FileText size={13} color="var(--accent-purple)" />
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
          gap: '0.2rem',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          alignItems: 'center'
        }}
      >
        {allTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.fullTitle || tab.label}
              style={{
                padding: '0.65rem 0.7rem',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)',
                borderBottom: isActive ? '2px solid var(--accent-blue)' : '2px solid transparent',
                background: 'none',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
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
                    fontSize: '0.62rem',
                    padding: '0.05rem 0.35rem',
                    backgroundColor: isActive ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-active)',
                    color: isActive ? 'var(--accent-blue)' : 'var(--text-dim)',
                    border: '1px solid var(--border-default)'
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
