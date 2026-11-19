import React from 'react';
import { Search, Filter, CheckCircle2, RotateCcw, Eye, EyeOff } from 'lucide-react';

export default function SubjectFilterToolbar({
  activeViewMode,
  setActiveViewMode,
  stats,
  modules,
  selectedModule,
  setSelectedModule,
  searchQuery,
  setSearchQuery,
  displayedVideos,
  onMarkBatch,
  showCompleted,
  setShowCompleted
}) {
  return (
    <div
      className="card"
      style={{
        padding: '0.75rem',
        marginBottom: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.65rem'
      }}
    >
      {/* Left: View Switcher Pills */}
      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
        {/* 1. Selected Track */}
        <button
          onClick={() => setActiveViewMode('study')}
          style={{
            backgroundColor: activeViewMode === 'study' ? 'var(--accent-blue)' : 'var(--bg-active)',
            color: activeViewMode === 'study' ? 'var(--bg-base)' : 'var(--text-main)',
            border: '1px solid var(--border-default)',
            padding: '0.3rem 0.65rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          🎯 Selected ({stats.selectedVideos})
        </button>

        {/* 2. Core Track */}
        <button
          onClick={() => setActiveViewMode('core')}
          style={{
            backgroundColor: activeViewMode === 'core' ? 'var(--accent-green)' : 'var(--bg-active)',
            color: activeViewMode === 'core' ? 'var(--bg-base)' : 'var(--text-main)',
            border: '1px solid var(--border-default)',
            padding: '0.3rem 0.65rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          ⚡ Core ({stats.coreVideos})
        </button>

        {/* 3. Full Track */}
        <button
          onClick={() => setActiveViewMode('original')}
          style={{
            backgroundColor: activeViewMode === 'original' ? 'var(--text-main)' : 'var(--bg-active)',
            color: activeViewMode === 'original' ? 'var(--bg-base)' : 'var(--text-main)',
            border: '1px solid var(--border-default)',
            padding: '0.3rem 0.65rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          📜 Full ({stats.totalVideos})
        </button>

        {/* 4. Optional Practice */}
        <button
          onClick={() => setActiveViewMode('optional')}
          style={{
            backgroundColor: activeViewMode === 'optional' ? 'var(--accent-yellow)' : 'var(--bg-active)',
            color: activeViewMode === 'optional' ? 'var(--bg-base)' : 'var(--text-main)',
            border: '1px solid var(--border-default)',
            padding: '0.3rem 0.65rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          💡 Optional ({stats.optVideos})
        </button>

        {/* 5. Removed Overkill */}
        <button
          onClick={() => setActiveViewMode('removed')}
          style={{
            backgroundColor: activeViewMode === 'removed' ? 'var(--accent-red)' : 'var(--bg-active)',
            color: activeViewMode === 'removed' ? '#fff' : 'var(--text-main)',
            border: '1px solid var(--border-default)',
            padding: '0.3rem 0.65rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          🗑️ Removed ({stats.remVideos})
        </button>
      </div>

      {/* Right: Search and Batch Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', width: 'auto' }}>
        {/* Search Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: 'var(--bg-overlay)',
            padding: '0.25rem 0.55rem',
            borderRadius: '5px',
            border: '1px solid var(--border-default)',
            flexGrow: 1
          }}
        >
          <Search size={13} color="var(--text-dim)" />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '0.75rem',
              width: '120px'
            }}
          />
        </div>

        {/* Module Filter Dropdown */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: 'var(--bg-overlay)',
            padding: '0.25rem 0.55rem',
            borderRadius: '5px',
            border: '1px solid var(--border-default)'
          }}
        >
          <Filter size={12} color="var(--text-dim)" />
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              fontSize: '0.75rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL" style={{ background: 'var(--bg-surface)' }}>All Modules</option>
            {modules.map((m) => (
              <option key={m} value={m} style={{ background: 'var(--bg-surface)' }}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Check All */}
        <button
          onClick={() => onMarkBatch(displayedVideos, true)}
          title="Mark visible videos completed"
          style={{
            backgroundColor: 'var(--bg-active)',
            border: '1px solid var(--border-default)',
            color: 'var(--accent-green)',
            borderRadius: '4px',
            padding: '0.25rem 0.5rem',
            fontSize: '0.72rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <CheckCircle2 size={12} /> Check All
        </button>

        {/* Reset */}
        <button
          onClick={() => onMarkBatch(displayedVideos, false)}
          title="Uncheck visible videos"
          style={{
            backgroundColor: 'var(--bg-active)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-dim)',
            borderRadius: '4px',
            padding: '0.25rem 0.5rem',
            fontSize: '0.72rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <RotateCcw size={12} /> Reset
        </button>

        {/* Show / Hide Completed Toggle */}
        <button
          onClick={() => setShowCompleted((prev) => !prev)}
          title={showCompleted ? 'Click to hide completed videos' : 'Click to show all completed videos'}
          style={{
            backgroundColor: showCompleted ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-active)',
            border: showCompleted ? '1px solid var(--accent-blue)' : '1px solid var(--border-default)',
            color: showCompleted ? 'var(--accent-blue)' : 'var(--text-dim)',
            borderRadius: '4px',
            padding: '0.25rem 0.55rem',
            fontSize: '0.72rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontWeight: showCompleted ? 600 : 400,
            transition: 'all 0.15s ease'
          }}
        >
          {showCompleted ? <Eye size={12} /> : <EyeOff size={12} />}
          <span>Show Completed</span>
        </button>
      </div>
    </div>
  );
}
