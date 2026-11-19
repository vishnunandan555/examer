import React, { useState } from 'react';
import { Lock, ArrowRight, KeyRound, AlertTriangle } from 'lucide-react';

export default function PasscodeModal({
  passcode,
  hasPinConfigured = true,
  onUnlock
}) {
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const handleUnlock = (e) => {
    if (e) e.preventDefault();
    if (!hasPinConfigured) return; // Strict: if no PIN in env, no secret works

    if (passcode && passcodeAttempt.trim() === String(passcode).trim()) {
      setPasscodeError(false);
      onUnlock();
    } else {
      setPasscodeError(true);
      setPasscodeAttempt('');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-base)',
        padding: '1.5rem'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '380px',
          padding: '2.25rem 1.75rem',
          textAlign: 'center',
          boxShadow: '0 25px 50px rgba(0,0,0,0.7)',
          border: '1px solid var(--border-default)',
          borderRadius: '8px'
        }}
      >
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            backgroundColor: hasPinConfigured ? 'var(--accent-blue)' : 'var(--bg-active)',
            color: hasPinConfigured ? 'var(--bg-base)' : 'var(--text-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.4rem',
            margin: '0 auto 1.15rem',
            border: hasPinConfigured ? 'none' : '1px solid var(--border-default)'
          }}
        >
          <KeyRound size={26} />
        </div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.35rem', letterSpacing: '-0.02em' }}>
          EXAMER
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: '0 0 1.5rem' }}>
          Personal Exam Preparation Suite • Passcode Protected
        </p>

        <form onSubmit={handleUnlock}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: hasPinConfigured ? 'var(--bg-active)' : 'rgba(255, 255, 255, 0.02)',
                border: !hasPinConfigured
                  ? '1px solid var(--border-subtle)'
                  : passcodeError
                  ? '1px solid var(--accent-red)'
                  : '1px solid var(--border-default)',
                borderRadius: '6px',
                padding: '0.55rem 0.75rem',
                gap: '0.5rem',
                opacity: hasPinConfigured ? 1 : 0.45,
                cursor: hasPinConfigured ? 'text' : 'not-allowed'
              }}
            >
              <Lock size={16} color="var(--text-dim)" />
              <input
                type="password"
                placeholder={hasPinConfigured ? 'Enter 5-key PIN' : 'PIN Not Configured (Disabled)'}
                value={passcodeAttempt}
                onChange={(e) => {
                  if (hasPinConfigured) {
                    setPasscodeAttempt(e.target.value);
                    setPasscodeError(false);
                  }
                }}
                disabled={!hasPinConfigured}
                autoFocus={hasPinConfigured}
                maxLength={12}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-main)',
                  width: '100%',
                  fontSize: '1.05rem',
                  letterSpacing: hasPinConfigured ? '0.25em' : 'normal',
                  textAlign: 'center',
                  cursor: hasPinConfigured ? 'text' : 'not-allowed'
                }}
              />
            </div>

            {passcodeError && hasPinConfigured && (
              <div style={{ color: 'var(--accent-red)', fontSize: '0.72rem', marginTop: '0.45rem', textAlign: 'center' }}>
                Incorrect PIN. Please try again.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!hasPinConfigured || passcodeAttempt.trim().length === 0}
            style={{
              width: '100%',
              backgroundColor: hasPinConfigured ? 'var(--accent-blue)' : 'var(--bg-active)',
              color: hasPinConfigured ? 'var(--bg-base)' : 'var(--text-dim)',
              border: 'none',
              borderRadius: '6px',
              padding: '0.65rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: hasPinConfigured && passcodeAttempt.trim().length > 0 ? 'pointer' : 'not-allowed',
              opacity: hasPinConfigured && passcodeAttempt.trim().length > 0 ? 1 : 0.4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'opacity 0.15s ease'
            }}
          >
            <span>{hasPinConfigured ? 'Unlock Dashboard' : 'Access Disabled'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Warning banner when no PIN secret is detected in environment */}
        {!hasPinConfigured && (
          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.75rem 0.85rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(248, 113, 113, 0.08)',
              border: '1px solid rgba(248, 113, 113, 0.25)',
              fontSize: '0.73rem',
              color: 'var(--text-muted)',
              textAlign: 'left',
              lineHeight: 1.45,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem'
            }}
          >
            <AlertTriangle size={16} color="var(--accent-red)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <strong style={{ color: 'var(--accent-red)', display: 'block', marginBottom: '0.15rem' }}>
                No PIN Configured
              </strong>
              No security secret detected. To protect your data, access is disabled until the <code style={{ color: 'var(--accent-peach)' }}>PIN</code> environment variable is set in Vercel.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
