import React from 'react';
import { Info, BookOpen } from 'lucide-react';

export default function SyllabusNotice({ activeTab, subjectData, onOpenSyllabusModal }) {
  return (
    <div
      className="card"
      style={{
        padding: '0.65rem 0.95rem',
        marginBottom: '0.85rem',
        backgroundColor: 'var(--bg-overlay)',
        borderLeft: '3px solid var(--accent-blue)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '0.74rem',
        color: 'var(--text-muted)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
        <Info size={14} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
        <span>
          <strong>{subjectData?.title || 'Subject'} Curriculum Note:</strong>{' '}
          {subjectData?.sourceNote || 'Structured for GATE and university curriculum mastery.'}
        </span>
      </div>

      <button
        onClick={onOpenSyllabusModal}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--accent-blue)',
          fontSize: '0.72rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: 0
        }}
      >
        <BookOpen size={12} /> View Syllabus Details
      </button>
    </div>
  );
}
