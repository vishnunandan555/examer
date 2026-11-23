import React from 'react';
import { Calendar, ArrowRight, Check } from 'lucide-react';
import { getDaysLeft, isExamCompleted } from '../../utils/timeUtils';

export default function ExamTimetable({
  timetable,
  lastUpdatedDisplay,
  availableSubjectIds = [],
  nextExam,
  onNavigate
}) {
  return (
    <div className="card" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.85rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
            <Calendar size={16} color="var(--accent-blue)" /> Official Examination Schedule
          </h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
            Full examination timeline (KTU 2026 Series)
          </p>
        </div>
        <span className="badge badge-optional mono">Updated: {lastUpdatedDisplay}</span>
      </div>

      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', minWidth: '550px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.55rem 0.65rem' }}>Date</th>
              <th style={{ padding: '0.55rem 0.65rem' }}>Subject</th>
              <th style={{ padding: '0.55rem 0.65rem' }}>Code</th>
              <th style={{ padding: '0.55rem 0.65rem' }}>Type</th>
              <th style={{ padding: '0.55rem 0.65rem' }}>Countdown</th>
              <th style={{ padding: '0.55rem 0.65rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((item, idx) => {
              const days = getDaysLeft(item.date);
              const isPast = isExamCompleted(item.date) || item.status === 'completed';
              const isNext = nextExam?.date === item.date;
              const hasSyllabus = item.subjectId && availableSubjectIds.includes(item.subjectId);

              return (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    backgroundColor: isNext ? 'rgba(248, 113, 113, 0.05)' : isPast ? 'rgba(255, 255, 255, 0.01)' : 'transparent',
                    opacity: isPast ? 0.65 : 1
                  }}
                >
                  <td style={{ padding: '0.55rem 0.65rem', fontWeight: 600 }} className="mono">
                    {item.displayDate}
                  </td>
                  <td
                    style={{
                      padding: '0.55rem 0.65rem',
                      fontWeight: isNext ? 700 : 500,
                      color: isNext ? 'var(--accent-red)' : isPast ? 'var(--text-muted)' : 'var(--text-main)'
                    }}
                  >
                    {item.subject}
                  </td>
                  <td style={{ padding: '0.55rem 0.65rem', color: 'var(--text-dim)' }} className="mono">
                    {item.code}
                  </td>
                  <td style={{ padding: '0.55rem 0.65rem' }}>
                    <span className={`badge badge-${item.type.toLowerCase()}`}>{item.type}</span>
                  </td>
                  <td style={{ padding: '0.55rem 0.65rem' }}>
                    {isPast ? (
                      <span style={{ color: 'var(--accent-green)', fontSize: '0.75rem', fontWeight: 600 }}>Completed</span>
                    ) : days === 0 ? (
                      <span className="badge badge-critical">Today!</span>
                    ) : (
                      <span
                        className="mono"
                        style={{
                          fontWeight: 600,
                          color: days <= 4 ? 'var(--accent-red)' : days <= 8 ? 'var(--accent-peach)' : 'var(--text-main)'
                        }}
                      >
                        {days} day{days > 1 ? 's' : ''} left
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.55rem 0.65rem' }}>
                    {hasSyllabus ? (
                      <button
                        onClick={() => onNavigate(item.subjectId)}
                        style={{
                          background: 'var(--bg-active)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--accent-blue)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        Syllabus <ArrowRight size={11} />
                      </button>
                    ) : isPast ? (
                      <span style={{ color: 'var(--accent-green)', fontSize: '0.75rem', fontWeight: 600 }}>✓ Done</span>
                    ) : (
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>Awaiting Syllabus</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
