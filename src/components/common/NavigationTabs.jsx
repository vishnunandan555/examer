import React from 'react';
import { Layers, Clock, Sparkles, BookOpen, FolderTree, Download } from 'lucide-react';

export default function NavigationTabs({
  activeTab,
  setActiveTab,
  onOpenSyllabusModal
}) {
  const tabs = [
    { id: 'dashboard', label: 'Main Dashboard', icon: <Layers size={14} /> },
    {
      id: 'cn',
      label: 'Computer Networks (Nov 23)',
      badge: '4D',
      icon: <Clock size={14} color="var(--accent-red)" />
    },
    {
      id: 'daa',
      label: 'DAA (Nov 27)',
      badge: '8D',
      icon: <Sparkles size={14} color="var(--accent-peach)" />
    },
    {
      id: 'dsa',
      label: 'S3 DSA Supply (Nov 30)',
      badge: '11D',
      icon: <BookOpen size={14} color="var(--accent-green)" />
    },
    {
      id: 'datasets',
      label: 'Directory & Datasets',
      icon: <FolderTree size={14} color="var(--accent-purple)" />
    }
  ];

  return (
    <div style={{ borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--bg-base)' }}>
      <div
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
          <Download size={14} color="var(--accent-purple)" /> Study Files & Syllabi
        </button>
      </div>
    </div>
  );
}
