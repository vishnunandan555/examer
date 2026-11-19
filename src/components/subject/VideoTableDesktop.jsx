import React from 'react';
import { CheckCircle2, Circle, ExternalLink } from 'lucide-react';
import { getItemKey } from '../../utils/metricsUtils';
import { formatTime } from '../../utils/timeUtils';

export default function VideoTableDesktop({
  displayedVideos,
  completedMap,
  animatingOutKeys,
  onToggleComplete,
  showCompleted,
  playbackSpeed
}) {
  return (
    <div className="card desktop-table-view" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--bg-overlay)', color: 'var(--text-muted)' }}>
            <th style={{ padding: '0.6rem 0.75rem', width: '45px' }}>Done</th>
            <th style={{ padding: '0.6rem 0.75rem', width: '45px' }}>#</th>
            <th style={{ padding: '0.6rem 0.75rem', width: '105px' }}>Module</th>
            <th style={{ padding: '0.6rem 0.75rem' }}>Video Title & Details</th>
            <th style={{ padding: '0.6rem 0.75rem', width: '95px' }}>Duration</th>
            <th style={{ padding: '0.6rem 0.75rem', width: '85px' }}>Status</th>
            <th style={{ padding: '0.6rem 0.75rem', width: '80px' }}>Link</th>
          </tr>
        </thead>
        <tbody>
          {displayedVideos.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                {showCompleted
                  ? 'No videos found matching your filter criteria.'
                  : 'All matching videos completed! (Click "Show Completed" to reveal them)'}
              </td>
            </tr>
          ) : (
            displayedVideos.map((item) => {
              const itemKey = getItemKey(item);
              const isCompleted = !!completedMap[itemKey];
              const isAnimatingOut = !!animatingOutKeys[itemKey];

              return (
                <tr
                  key={itemKey}
                  className={`${isCompleted ? 'table-row-completed' : ''} ${isAnimatingOut ? 'row-animating-out' : ''}`.trim()}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background-color 0.15s ease, opacity 0.45s ease, transform 0.45s ease'
                  }}
                >
                  <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                    <button
                      onClick={() => onToggleComplete(itemKey)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: isCompleted ? 'var(--accent-green)' : 'var(--text-dim)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {isCompleted ? <CheckCircle2 size={17} /> : <Circle size={17} />}
                    </button>
                  </td>

                  <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-dim)' }} className="mono">
                    {item.Index}
                  </td>

                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <span className="badge badge-module">{item.Module || 'General'}</span>
                  </td>

                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <div style={{ fontWeight: 600, color: isCompleted ? 'var(--text-dim)' : 'var(--text-main)', textDecoration: isCompleted ? 'line-through' : 'none' }}>
                      {item.Title}
                    </div>
                    {item.Topic && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {item.Topic}
                      </div>
                    )}
                    {item.Reason && (
                      <div style={{ fontSize: '0.7rem', color: item.Status === 'Removed' ? 'var(--accent-red)' : 'var(--text-dim)', marginTop: '0.15rem', fontStyle: 'italic' }}>
                        Note: {item.Reason}
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '0.6rem 0.75rem' }} className="mono">
                    <div>{(item.Duration / 60).toFixed(1)}h</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                      {(item.Duration / (60 * playbackSpeed)).toFixed(1)}h @ {playbackSpeed}x
                    </div>
                  </td>

                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <span className={`badge badge-${item.Status.toLowerCase()}`}>{item.Status}</span>
                  </td>

                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    {item['Video url'] ? (
                      <a
                        href={item['Video url']}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'var(--accent-blue)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          fontSize: '0.75rem',
                          textDecoration: 'none'
                        }}
                      >
                        Watch <ExternalLink size={11} />
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
