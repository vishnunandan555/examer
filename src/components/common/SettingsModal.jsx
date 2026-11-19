import React, { useState } from 'react';
import { Lock, Cloud, KeyRound, Check, RotateCcw, Smartphone, Download } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  passcode,
  setPasscode,
  onLockDashboard,
  cloudConfig,
  setCloudConfig,
  onManualPull,
  onManualPush,
  cloudSyncState,
  cloudMsg,
  onInstallApp,
  canInstall
}) {
  const [newPasscodeInput, setNewPasscodeInput] = useState('');
  const [passcodeSuccessMsg, setPasscodeSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleUpdatePasscode = (e) => {
    e.preventDefault();
    if (newPasscodeInput.trim().length >= 4) {
      const code = newPasscodeInput.trim();
      setPasscode(code);
      try {
        localStorage.setItem('examer_passcode_v1', code);
      } catch (err) {}
      setPasscodeSuccessMsg('Passcode updated successfully!');
      setNewPasscodeInput('');
      setTimeout(() => setPasscodeSuccessMsg(''), 3000);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.5rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.8)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '0.75rem'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Lock size={16} color="var(--accent-blue)" /> Security & Sync Settings
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '0.2rem'
            }}
          >
            ✕
          </button>
        </div>

        {/* Section 1: Change Passcode */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: '0 0 0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <KeyRound size={14} color="var(--accent-yellow)" /> Change Passcode
          </h4>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', margin: '0 0 0.55rem' }}>
            Personal security PIN to unlock the study dashboard.
          </p>

          <form onSubmit={handleUpdatePasscode} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="password"
              placeholder="New PIN (4-10 chars)"
              value={newPasscodeInput}
              onChange={(e) => setNewPasscodeInput(e.target.value)}
              maxLength={10}
              style={{
                backgroundColor: 'var(--bg-active)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-main)',
                padding: '0.4rem 0.65rem',
                borderRadius: '5px',
                fontSize: '0.8rem',
                flexGrow: 1
              }}
            />
            <button
              type="submit"
              disabled={newPasscodeInput.trim().length < 4}
              style={{
                backgroundColor: 'var(--accent-blue)',
                color: 'var(--bg-base)',
                border: 'none',
                borderRadius: '5px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: newPasscodeInput.trim().length >= 4 ? 'pointer' : 'not-allowed',
                opacity: newPasscodeInput.trim().length >= 4 ? 1 : 0.5
              }}
            >
              Update
            </button>
          </form>

          {passcodeSuccessMsg && (
            <div style={{ color: 'var(--accent-green)', fontSize: '0.72rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Check size={12} /> {passcodeSuccessMsg}
            </div>
          )}
        </div>

        {/* Section 2: Built-in Single-User Cloud Sync */}
        <div style={{ marginBottom: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Cloud size={14} color="var(--accent-blue)" /> Built-in Cloud Sync
            </h4>
            <span
              className="badge mono"
              style={{
                fontSize: '0.65rem',
                backgroundColor: cloudConfig.enabled ? 'rgba(74, 222, 128, 0.15)' : 'var(--bg-active)',
                color: cloudConfig.enabled ? 'var(--accent-green)' : 'var(--text-dim)',
                border: '1px solid var(--border-default)'
              }}
            >
              {cloudConfig.enabled ? '● Online & Linked' : '○ Offline Cache'}
            </span>
          </div>

          <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', margin: '0 0 0.75rem', lineHeight: 1.4 }}>
            Zero-config personal cloud sync via Upstash Redis. Every checkmark automatically syncs between your phone and laptop upon entering your PIN.
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={onManualPull}
              disabled={!cloudConfig.enabled || cloudSyncState === 'syncing'}
              style={{
                backgroundColor: 'var(--bg-active)',
                border: '1px solid var(--border-default)',
                color: 'var(--accent-blue)',
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: cloudConfig.enabled ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                opacity: cloudConfig.enabled ? 1 : 0.5
              }}
            >
              <RotateCcw size={12} /> Pull Latest
            </button>
            <button
              type="button"
              onClick={onManualPush}
              disabled={!cloudConfig.enabled || cloudSyncState === 'syncing'}
              style={{
                backgroundColor: 'var(--bg-active)',
                border: '1px solid var(--border-default)',
                color: 'var(--accent-green)',
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: cloudConfig.enabled ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                opacity: cloudConfig.enabled ? 1 : 0.5
              }}
            >
              <Cloud size={12} /> Push Now
            </button>
          </div>

          {cloudMsg && (
            <div
              style={{
                fontSize: '0.72rem',
                color: cloudSyncState === 'error' ? 'var(--accent-red)' : 'var(--accent-green)',
                marginTop: '0.45rem'
              }}
            >
              {cloudMsg}
            </div>
          )}
        </div>

        {/* Section 3: Install Mobile Web App (PWA) */}
        <div style={{ marginBottom: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: '0 0 0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Smartphone size={14} color="var(--accent-green)" /> Install on Mobile
          </h4>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', margin: '0 0 0.65rem', lineHeight: 1.4 }}>
            Install Examer as a fullscreen, standalone app on your smartphone with instant home screen access.
          </p>

          {canInstall ? (
            <button
              type="button"
              onClick={onInstallApp}
              style={{
                backgroundColor: 'rgba(74, 222, 128, 0.15)',
                border: '1px solid var(--accent-green)',
                color: 'var(--accent-green)',
                padding: '0.45rem 0.85rem',
                borderRadius: '5px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Download size={13} /> Install Examer App Now
            </button>
          ) : (
            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-overlay)',
                padding: '0.55rem 0.75rem',
                borderRadius: '5px',
                lineHeight: 1.45
              }}
            >
              <div>• <strong>Android (Chrome)</strong>: Tap ⋮ (top right) → select <strong>Install App</strong> or <strong>Add to Home screen</strong>.</div>
              <div style={{ marginTop: '0.25rem' }}>• <strong>iPhone (Safari)</strong>: Tap the Share button (square with arrow) → select <strong>Add to Home Screen</strong>.</div>
            </div>
          )}
        </div>

        {/* Lock Dashboard Now Action */}
        <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={onLockDashboard}
            style={{
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid var(--accent-red)',
              color: 'var(--accent-red)',
              padding: '0.4rem 0.8rem',
              borderRadius: '5px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Lock size={12} /> Lock Dashboard Now
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: 'var(--bg-active)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-main)',
              padding: '0.4rem 0.85rem',
              borderRadius: '5px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
