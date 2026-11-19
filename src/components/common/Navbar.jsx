import React from 'react';
import { Sparkles, Clock, Flame, Cloud, Settings } from 'lucide-react';

export default function Navbar({
  playbackSpeed,
  setPlaybackSpeed,
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
              <span className="badge badge-core" style={{ fontSize: '0.65rem' }}>KTU CSE SUITE</span>
              <span className="badge badge-optional mono" style={{ fontSize: '0.65rem' }}>
                UPDATED: {lastUpdatedDisplay}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              Personal Exam Preparation & Curated GATE Playlist Suite
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

          {/* Speed Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'var(--bg-active)',
              padding: '0.3rem 0.6rem',
              borderRadius: '5px',
              border: '1px solid var(--border-default)',
              fontSize: '0.75rem'
            }}
          >
            <ZapIcon size={13} color="var(--accent-yellow)" />
            <span style={{ color: 'var(--text-muted)' }}>Pace:</span>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.75rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="1.0" style={{ background: 'var(--bg-surface)' }}>1.0x (Raw Normal)</option>
              <option value="1.25" style={{ background: 'var(--bg-surface)' }}>1.25x (Steady Pace)</option>
              <option value="1.5" style={{ background: 'var(--bg-surface)' }}>1.5x (Recommended)</option>
              <option value="1.75" style={{ background: 'var(--bg-surface)' }}>1.75x (Aggressive)</option>
              <option value="2.0" style={{ background: 'var(--bg-surface)' }}>2.0x (Ultra Crunch)</option>
            </select>
          </div>

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

function ZapIcon(props) {
  return <Sparkles {...props} />;
}
