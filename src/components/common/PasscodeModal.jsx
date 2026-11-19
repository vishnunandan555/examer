import React, { useState } from 'react';
import { Lock, ArrowRight, KeyRound } from 'lucide-react';

export default function PasscodeModal({
  passcode,
  onUnlock
}) {
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const handleUnlock = (e) => {
    if (e) e.preventDefault();
    if (passcodeAttempt.trim() === String(passcode).trim()) {
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
            backgroundColor: 'var(--accent-blue)',
            color: 'var(--bg-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.4rem',
            margin: '0 auto 1.15rem'
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
                backgroundColor: 'var(--bg-active)',
                border: passcodeError ? '1px solid var(--accent-red)' : '1px solid var(--border-default)',
                borderRadius: '6px',
                padding: '0.55rem 0.75rem',
                gap: '0.5rem'
              }}
            >
              <Lock size={16} color="var(--text-dim)" />
              <input
                type="password"
                placeholder="Enter 5-key PIN"
                value={passcodeAttempt}
                onChange={(e) => {
                  setPasscodeAttempt(e.target.value);
                  setPasscodeError(false);
                }}
                autoFocus
                maxLength={12}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-main)',
                  width: '100%',
                  fontSize: '1.05rem',
                  letterSpacing: '0.25em',
                  textAlign: 'center'
                }}
              />
            </div>
            {passcodeError && (
              <div style={{ color: 'var(--accent-red)', fontSize: '0.72rem', marginTop: '0.45rem', textAlign: 'center' }}>
                Incorrect PIN. Please try again.
              </div>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: 'var(--accent-blue)',
              color: 'var(--bg-base)',
              border: 'none',
              borderRadius: '6px',
              padding: '0.65rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'opacity 0.15s ease'
            }}
          >
            <span>Unlock Dashboard</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
          Desktop default PIN: <code style={{ color: 'var(--accent-blue)' }}>0000</code>. Production PIN loaded from <code style={{ color: 'var(--accent-peach)' }}>PIN</code> env.
        </div>
      </div>
    </div>
  );
}
