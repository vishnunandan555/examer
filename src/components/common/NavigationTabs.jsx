import React from 'react';
import { Layers, Flame, BookOpen, Cpu, HardDrive, Network, Binary, Lightbulb, Code2, FolderTree, Download } from 'lucide-react';
import { SUBJECTS } from '../../config/subjects';

const ICON_MAP = {
  os: <Cpu size={14} color="var(--accent-red)" />,
  dbms: <HardDrive size={14} color="var(--accent-peach)" />,
  coa: <Flame size={14} color="var(--accent-yellow)" />,
  cn: <Network size={14} color="var(--accent-blue)" />,
  dsa: <Binary size={14} color="var(--accent-green)" />,
  aptitude: <Lightbulb size={14} color="var(--accent-teal)" />,
  cprog: <Code2 size={14} color="var(--accent-purple)" />
};

export default function NavigationTabs({
  activeTab,
  setActiveTab,
  onOpenSyllabusModal
}) {
  const tabs = [
    { id: 'dashboard', label: 'Main Dashboard', icon: <Layers size={14} /> },
    ...SUBJECTS.map((sub) => ({
      id: sub.id,
      label: sub.shortName,
      badge: sub.priority === 'top' ? 'P1' : null,
      icon: ICON_MAP[sub.id] || <BookOpen size={14} />
    })),
    {
      id: 'datasets',
      label: 'Datasets',
      icon: <FolderTree size={14} color="var(--accent-purple)" />
    }
  ];

  return (
    <div style={{ borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--bg-base)' }}>
      <div
        className="no-scrollbar"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          gap: '0.25rem',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.7rem 0.85rem',
                  fontSize: '0.82rem',
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
                  gap: '0.4rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
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
                      backgroundColor: 'rgba(248, 113, 113, 0.18)',
                      color: 'var(--accent-red)',
                      border: '1px solid rgba(248, 113, 113, 0.4)'
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Syllabi Breakdown Trigger */}
        <button
          onClick={onOpenSyllabusModal}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-purple)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          <Download size={14} color="var(--accent-purple)" /> Study Files &amp; Syllabi
        </button>
      </div>
    </div>
  );
}
