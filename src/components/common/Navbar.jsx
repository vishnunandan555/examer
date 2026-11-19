import React from 'react';
import { BookOpen, Flame, Cloud, Settings } from 'lucide-react';

export default function Navbar({
  lastUpdatedDisplay,
  cloudSyncState,
  cloudConfig,
  onOpenSettings
}) {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-surface)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0.65rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.65rem'
        }}
      >
        {/* Brand & Suite Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: 'var(--accent-blue)',
              color: 'var(--bg-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.9rem'
            }}
          >
            E
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>EXAMER</span>
              <span className="badge badge-core" style={{ fontSize: '0.65rem' }}>SYLLABUS PROGRESS TRACKER</span>
              <span className="badge badge-optional mono" style={{ fontSize: '0.65rem' }}>
                UPDATED: {lastUpdatedDisplay}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              KTU B.Tech CSE (S5 & S3 Supply) • Direct Exam Syllabus Mastery Checklist
            </p>
          </div>
        </div>

        {/* Global Controls & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
          {/* Cloud Sync Status / Settings Pill */}
          <button
            onClick={onOpenSettings}
            title={
              cloudConfig.enabled
                ? `Cloud Sync: ${cloudSyncState}`
                : 'Configure Cloud Sync & Passcode'
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'var(--bg-active)',
              border: '1px solid var(--border-default)',
              color: cloudSyncState === 'syncing' ? 'var(--accent-peach)' : cloudSyncState === 'error' ? 'var(--accent-red)' : cloudConfig.enabled ? 'var(--accent-green)' : 'var(--text-dim)',
              borderRadius: '5px',
              padding: '0.3rem 0.55rem',
              fontSize: '0.72rem',
              cursor: 'pointer'
            }}
          >
            <Cloud size={13} />
            <span style={{ fontWeight: 600 }}>
              {cloudSyncState === 'syncing' ? 'Syncing...' : cloudConfig.enabled ? 'Cloud Synced' : 'Sync Offline'}
            </span>
            <Settings size={11} style={{ opacity: 0.7 }} />
          </button>

          {/* Next Exam Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid var(--accent-red)',
              color: 'var(--accent-red)',
              padding: '0.3rem 0.65rem',
              borderRadius: '5px',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            <Flame size={13} />
            <span>Next: CN Theory in 4 Days (Nov 23)</span>
          </div>
        </div>
      </div>
    </header>
  );
}
