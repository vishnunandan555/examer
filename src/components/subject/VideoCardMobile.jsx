import React from 'react';
import { CheckCircle2, Circle, ExternalLink } from 'lucide-react';
import { getItemKey } from '../../utils/metricsUtils';

export default function VideoCardMobile({
  displayedVideos,
  completedMap,
  animatingOutKeys,
  onToggleComplete,
  showCompleted,
  playbackSpeed
}) {
  return (
    <div className="mobile-card-view">
      {displayedVideos.length === 0 ? (
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)' }}>
          {showCompleted
            ? 'No videos found matching your filter criteria.'
            : 'All matching videos completed! (Click "Show Completed" to reveal them)'}
        </div>
      ) : (
        displayedVideos.map((item) => {
          const itemKey = getItemKey(item);
          const isCompleted = !!completedMap[itemKey];
          const isAnimatingOut = !!animatingOutKeys[itemKey];

          return (
            <div
              key={itemKey}
              className={`card ${isAnimatingOut ? 'card-animating-out' : ''}`.trim()}
              style={{
                padding: '0.75rem',
                backgroundColor: isCompleted ? 'rgba(74, 222, 128, 0.03)' : 'var(--bg-surface)',
                borderLeft: isCompleted ? '3px solid var(--accent-green)' : '3px solid var(--border-default)',
                transition: 'opacity 0.45s ease, transform 0.45s ease, max-height 0.45s ease, padding 0.45s ease, margin 0.45s ease'
              }}
            >
              {/* Card Header: Checkbox + Index + Badges */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onToggleComplete(itemKey)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: isCompleted ? 'var(--accent-green)' : 'var(--text-dim)',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </button>
                  <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    #{item.Index}
                  </span>
                  <span className="badge badge-module" style={{ fontSize: '0.65rem' }}>
                    {item.Module || 'General'}
                  </span>
                  <span className={`badge badge-${item.Status.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                    {item.Status}
                  </span>
                </div>

                <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div>{(item.Duration / 60).toFixed(1)}h</div>
                  <div style={{ fontSize: '0.62rem' }}>
                    {(item.Duration / (60 * playbackSpeed)).toFixed(1)}h @ {playbackSpeed}x
                  </div>
                </div>
              </div>

              {/* Title & Topic */}
              <div style={{ marginBottom: '0.45rem' }}>
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: isCompleted ? 'var(--text-dim)' : 'var(--text-main)',
                    textDecoration: isCompleted ? 'line-through' : 'none',
                    lineHeight: 1.35
                  }}
                >
                  {item.Title}
                </div>
                {item.Topic && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {item.Topic}
                  </div>
                )}
                {item.Reason && (
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: item.Status === 'Removed' ? 'var(--accent-red)' : 'var(--text-dim)',
                      marginTop: '0.15rem',
                      fontStyle: 'italic'
                    }}
                  >
                    Note: {item.Reason}
                  </div>
                )}
              </div>

              {/* Watch Link */}
              {item['Video url'] && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.35rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <a
                    href={item['Video url']}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--accent-blue)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                  >
                    Watch on YouTube <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
