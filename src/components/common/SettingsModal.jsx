import React, { useState } from 'react';
import { Lock, Cloud, KeyRound, Check, RotateCcw } from 'lucide-react';
import { saveCloudConfig } from '../../services/cloudSync';

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
  cloudMsg
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
      } catch (err) {
        // ignore
      }
      setPasscodeSuccessMsg('Passcode updated successfully!');
      setNewPasscodeInput('');
      setTimeout(() => setPasscodeSuccessMsg(''), 3000);
    }
  };

  const handleCloudConfigSave = (updated) => {
    setCloudConfig(updated);
    saveCloudConfig(updated);
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
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.5rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.8)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Lock size={16} color="var(--accent-blue)" /> Security & Cloud Sync Settings
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
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <KeyRound size={14} color="var(--accent-yellow)" /> Change Passcode
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: '0 0 0.65rem' }}>
            Set a new 4-digit passcode for accessing the application.
          </p>

          <form onSubmit={handleUpdatePasscode} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="password"
              placeholder="New Passcode (min 4 chars)"
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

        {/* Section 2: Multi-Device Cloud Sync */}
        <div style={{ marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Cloud size={14} color="var(--accent-blue)" /> Multi-Device Cloud Sync
            </h4>
            <label style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={cloudConfig.enabled}
                onChange={(e) => handleCloudConfigSave({ ...cloudConfig, enabled: e.target.checked })}
              />
              <span>Enable Cloud Sync</span>
            </label>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: '0 0 0.75rem' }}>
            Sync your video checkmarks across phone, laptop, and desktop via free Upstash Redis or Vercel KV REST URL.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                REST Endpoint URL:
              </label>
              <input
                type="text"
                placeholder="https://...upstash.io"
                value={cloudConfig.endpoint || ''}
                onChange={(e) => handleCloudConfigSave({ ...cloudConfig, endpoint: e.target.value.trim() })}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-active)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-main)',
                  padding: '0.4rem 0.65rem',
                  borderRadius: '5px',
                  fontSize: '0.78rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                REST Token:
              </label>
              <input
                type="password"
                placeholder="ReadOnly or ReadWrite REST Token"
                value={cloudConfig.token || ''}
                onChange={(e) => handleCloudConfigSave({ ...cloudConfig, token: e.target.value.trim() })}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-active)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-main)',
                  padding: '0.4rem 0.65rem',
                  borderRadius: '5px',
                  fontSize: '0.78rem'
                }}
              />
            </div>

            {/* Cloud Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={onManualPull}
                disabled={!cloudConfig.enabled || !cloudConfig.endpoint || cloudSyncState === 'syncing'}
                style={{
                  backgroundColor: 'var(--bg-active)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--accent-blue)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <RotateCcw size={12} /> Pull from Cloud
              </button>
              <button
                type="button"
                onClick={onManualPush}
                disabled={!cloudConfig.enabled || !cloudConfig.endpoint || cloudSyncState === 'syncing'}
                style={{
                  backgroundColor: 'var(--bg-active)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--accent-green)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <Cloud size={12} /> Push to Cloud
              </button>
            </div>

            {cloudMsg && (
              <div
                style={{
                  fontSize: '0.72rem',
                  color: cloudSyncState === 'error' ? 'var(--accent-red)' : 'var(--accent-green)',
                  marginTop: '0.25rem'
                }}
              >
                {cloudMsg}
              </div>
            )}
          </div>
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
