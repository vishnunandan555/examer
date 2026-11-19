import React, { useState, useEffect, useMemo } from 'react';
import appData from './data/playlist_data.json';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  Filter,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Download,
  Info,
  ChevronDown,
  ChevronUp,
  Zap,
  ShieldCheck,
  Flame,
  FolderTree,
  FileText,
  Copy,
  Check
} from 'lucide-react';

const CURRENT_DATE = new Date('2026-11-19T08:51:00+05:30');

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeViewMode, setActiveViewMode] = useState('study'); // 'study', 'core', 'optional', 'removed', 'original'
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [playbackSpeed, setPlaybackSpeed] = useState(1.5);
  const [copiedKey, setCopiedKey] = useState(null);
  const [selectedSyllabusTab, setSelectedSyllabusTab] = useState('cn');

  // Time unit display: 'hrs' or 'days'
  const [timeUnitMode, setTimeUnitMode] = useState(() => {
    try {
      return localStorage.getItem('examer_time_unit_v1') || 'hrs';
    } catch (e) {
      return 'hrs';
    }
  });

  const [completedMap, setCompletedMap] = useState(() => {
    try {
      const saved = localStorage.getItem('examer_completed_v1');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [expandedSyllabus, setExpandedSyllabus] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('examer_completed_v1', JSON.stringify(completedMap));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [completedMap]);

  useEffect(() => {
    try {
      localStorage.setItem('examer_time_unit_v1', timeUnitMode);
    } catch (e) {
      console.error('Failed to save time unit', e);
    }
  }, [timeUnitMode]);

  const toggleTimeUnit = () => {
    setTimeUnitMode((prev) => (prev === 'hrs' ? 'days' : 'hrs'));
  };

  // Format hours vs days: if >= 12 hrs in days mode, convert to Days (i.e. 12 hrs = 0.5 Days)
  const formatTime = (hours) => {
    if (typeof hours !== 'number' || isNaN(hours)) return '0 hrs';
    if (timeUnitMode === 'days') {
      if (hours >= 12) {
        const days = (hours / 24).toFixed(1);
        return `${days} Days`;
      }
      return `${hours.toFixed(1)} hrs`;
    }
    return `${hours.toFixed(1)} hrs`;
  };

  const toggleComplete = (itemKey) => {
    setCompletedMap((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  const markBatch = (items, done) => {
    setCompletedMap((prev) => {
      const next = { ...prev };
      items.forEach((item) => {
        const key = `${item.Subject}_${item.Index}`;
        if (done) next[key] = true;
        else delete next[key];
      });
      return next;
    });
  };

  // CSV Download utility
  const downloadCSV = (filename, rows) => {
    if (!rows || !rows.length) return;
    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','),
      ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy to clipboard helper
  const copyPath = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Pre-filter playlists
  const playlists = useMemo(() => {
    const dsaAll = appData.dsa_all;
    const cnAll = appData.cn_all;

    const cn = cnAll;
    const daa = dsaAll.filter((v) => v.Subject === 'S5 DAA' || v.Subject === 'Both');
    const dsa = dsaAll.filter((v) => v.Subject === 'S3 DSA' || v.Subject === 'Both');

    return { cn, daa, dsa, dsaAll };
  }, []);

  // Compute Days Remaining helper
  const getDaysLeft = (dateStr) => {
    const target = new Date(dateStr + 'T09:30:00+05:30');
    const diffTime = target - CURRENT_DATE;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Stats computation for a subject list
  const getSubjectStats = (list, subjectKey) => {
    const totalVideos = list.length;
    const totalMinutes = list.reduce((acc, v) => acc + v.Duration, 0);

    const coreVideos = list.filter((v) => v.Status === 'Core');
    const coreMinutes = coreVideos.reduce((acc, v) => acc + v.Duration, 0);

    const optVideos = list.filter((v) => v.Status === 'Optional');
    const optMinutes = optVideos.reduce((acc, v) => acc + v.Duration, 0);

    const remVideos = list.filter((v) => v.Status === 'Removed');
    const remMinutes = remVideos.reduce((acc, v) => acc + v.Duration, 0);

    const completedVideos = list.filter((v) => {
      const key = `${v.Subject}_${v.Index}`;
      return !!completedMap[key];
    });
    const completedMinutes = completedVideos.reduce((acc, v) => acc + v.Duration, 0);

    const remainingCoreMinutes = coreVideos
      .filter((v) => !completedMap[`${v.Subject}_${v.Index}`])
      .reduce((acc, v) => acc + v.Duration, 0);

    const remainingCoreHoursAdjusted = remainingCoreMinutes / (60 * playbackSpeed);

    return {
      totalVideos,
      totalHours: totalMinutes / 60,
      coreVideos: coreVideos.length,
      coreHours: coreMinutes / 60,
      optVideos: optVideos.length,
      optHours: optMinutes / 60,
      remVideos: remVideos.length,
      remHours: remMinutes / 60,
      completedVideos: completedVideos.length,
      completedHours: completedMinutes / 60,
      completionRate: totalVideos > 0 ? (completedVideos.length / totalVideos) * 100 : 0,
      remainingCoreHours: remainingCoreHoursAdjusted
    };
  };

  const cnStats = useMemo(() => getSubjectStats(playlists.cn, 'cn'), [playlists.cn, completedMap, playbackSpeed]);
  const daaStats = useMemo(() => getSubjectStats(playlists.daa, 'daa'), [playlists.daa, completedMap, playbackSpeed]);
  const dsaStats = useMemo(() => getSubjectStats(playlists.dsa, 'dsa'), [playlists.dsa, completedMap, playbackSpeed]);

  // Active Subject List depending on active tab
  const currentSubjectData = useMemo(() => {
    if (activeTab === 'cn') {
      return {
        title: 'Computer Networks',
        code: 'PCCST501',
        examDate: '2026-11-23',
        displayDate: 'Nov 23, 2026',
        daysLeft: getDaysLeft('2026-11-23'),
        list: playlists.cn,
        stats: cnStats,
        modules: ['Module 1', 'Module 2', 'Module 3', 'Module 4'],
        syllabusNote: 'KTU S5 CSE Syllabus: Application Layer, Transport & Network Layer, Data Link & MAC, Physical Layer & SNMP.'
      };
    } else if (activeTab === 'daa') {
      return {
        title: 'Design and Analysis of Algorithms',
        code: 'PCCST502',
        examDate: '2026-11-27',
        displayDate: 'Nov 27, 2026',
        daysLeft: getDaysLeft('2026-11-27'),
        list: playlists.daa,
        stats: daaStats,
        modules: ['S5-M1', 'S5-M2', 'S5-M3', 'S5-M4', 'S3-M1 / S5-M1', 'S3-M3 / S5-M2', 'S3-M4 / S5-M2', 'S3-M3 / S5-M3'],
        syllabusNote: 'KTU S5 CSE Syllabus: Recurrences & AVL Trees, Disjoint Sets & Graph Traversals/D&C, Greedy (Knapsack, MST, Dijkstra) & DP (MCM, Floyd-Warshall), Branch & Bound (TSP), Complexity Classes (P/NP).'
      };
    } else if (activeTab === 'dsa') {
      return {
        title: 'Data Structures and Algorithms',
        code: 'PCCST303 (Supply)',
        examDate: '2026-11-30',
        displayDate: 'Nov 30, 2026',
        daysLeft: getDaysLeft('2026-11-30'),
        list: playlists.dsa,
        stats: dsaStats,
        modules: ['S3-M1', 'S3-M2', 'S3-M3', 'S3-M4', 'S3-M1 / S5-M1', 'S3-M3 / S5-M2', 'S3-M4 / S5-M2', 'S3-M3 / S5-M3'],
        syllabusNote: 'KTU S3 CSE Syllabus: Arrays, Stacks, Queues, Expression Evaluation; Singly/Doubly/Circular Linked Lists; Trees, BST, Binary Heaps; Sorting (Selection, Insertion, Quick, Merge, Heap, Radix), Searching & Hashing.'
      };
    }
    return null;
  }, [activeTab, playlists, cnStats, daaStats, dsaStats]);

  // Filter videos for the current active tab
  const displayedVideos = useMemo(() => {
    if (!currentSubjectData) return [];
    let items = currentSubjectData.list;

    if (activeViewMode === 'study') {
      items = items.filter((v) => v.Status === 'Core' || v.Status === 'Optional');
    } else if (activeViewMode === 'core') {
      items = items.filter((v) => v.Status === 'Core');
    } else if (activeViewMode === 'optional') {
      items = items.filter((v) => v.Status === 'Optional');
    } else if (activeViewMode === 'removed') {
      items = items.filter((v) => v.Status === 'Removed');
    }

    if (selectedModule !== 'ALL') {
      items = items.filter((v) => v.Module && v.Module.includes(selectedModule));
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (v) =>
          v.Title.toLowerCase().includes(q) ||
          v.Topic.toLowerCase().includes(q) ||
          v.Reason.toLowerCase().includes(q) ||
          String(v.Index).includes(q)
      );
    }

    return items;
  }, [currentSubjectData, activeViewMode, selectedModule, searchQuery]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header
        style={{
          borderBottom: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-surface)',
          padding: '0.65rem 1rem',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Logo & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '6px',
                backgroundColor: 'var(--accent-blue)',
                color: 'var(--bg-base)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.05rem',
                flexShrink: 0
              }}
            >
              E
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                  EXAMER
                </span>
                <span className="badge badge-module">KTU CSE</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: 1.2 }}>Personal Exam Suite & Playlist Tracker</p>
            </div>
          </div>

          {/* Right Header Controls: Unit Toggle, Speed & Next Exam */}
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {/* Global Time Format Toggle (Hrs vs Days) */}
            <button
              onClick={toggleTimeUnit}
              title="Click to toggle time units (Hours vs Days if >= 12hrs)"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'var(--bg-overlay)',
                padding: '0.3rem 0.6rem',
                borderRadius: '5px',
                border: '1px solid var(--border-default)',
                color: timeUnitMode === 'days' ? 'var(--accent-green)' : 'var(--accent-blue)',
                fontWeight: 600,
                fontSize: '0.76rem',
                cursor: 'pointer'
              }}
            >
              <Clock size={13} />
              <span>Format: <strong>{timeUnitMode === 'days' ? 'Days (0.5d+)' : 'Hours'}</strong></span>
            </button>

            {/* Speed Selector */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'var(--bg-overlay)',
                padding: '0.25rem 0.5rem',
                borderRadius: '5px',
                border: '1px solid var(--border-default)'
              }}
            >
              <Zap size={13} color="var(--accent-yellow)" />
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--accent-yellow)',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value={1.0} style={{ background: '#11131b' }}>1.0x Normal</option>
                <option value={1.25} style={{ background: '#11131b' }}>1.25x Swift</option>
                <option value={1.5} style={{ background: '#11131b' }}>1.5x Rec.</option>
                <option value={1.75} style={{ background: '#11131b' }}>1.75x Rapid</option>
                <option value={2.0} style={{ background: '#11131b' }}>2.0x Double</option>
              </select>
            </div>

            {/* Next Exam Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(248, 113, 113, 0.1)',
                border: '1px solid rgba(248, 113, 113, 0.25)',
                padding: '0.25rem 0.6rem',
                borderRadius: '5px'
              }}
            >
              <Flame size={14} color="var(--accent-red)" />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                <strong>CN Theory</strong> in <strong style={{ color: 'var(--accent-red)' }}>4 Days</strong> (Nov 23)
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation Bar */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)' }}>
        <div
          className="no-scrollbar"
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            gap: '0.35rem',
            padding: '0 0.75rem',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              padding: '0.7rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'dashboard' ? 700 : 500,
              color: activeTab === 'dashboard' ? 'var(--accent-blue)' : 'var(--text-muted)',
              borderBottom: activeTab === 'dashboard' ? '2px solid var(--accent-blue)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Layers size={15} /> Dashboard
          </button>

          <button
            onClick={() => {
              setActiveTab('cn');
              setSelectedModule('ALL');
            }}
            style={{
              padding: '0.7rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'cn' ? 700 : 500,
              color: activeTab === 'cn' ? 'var(--accent-red)' : 'var(--text-muted)',
              borderBottom: activeTab === 'cn' ? '2px solid var(--accent-red)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Clock size={14} color="var(--accent-red)" />
            CN (Nov 23)
            <span className="badge badge-critical" style={{ fontSize: '0.62rem', padding: '0.05rem 0.3rem' }}>4d</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('daa');
              setSelectedModule('ALL');
            }}
            style={{
              padding: '0.7rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'daa' ? 700 : 500,
              color: activeTab === 'daa' ? 'var(--accent-peach)' : 'var(--text-muted)',
              borderBottom: activeTab === 'daa' ? '2px solid var(--accent-peach)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Sparkles size={14} color="var(--accent-peach)" />
            DAA (Nov 27)
            <span className="badge badge-theory" style={{ fontSize: '0.62rem', padding: '0.05rem 0.3rem' }}>8d</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('dsa');
              setSelectedModule('ALL');
            }}
            style={{
              padding: '0.7rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'dsa' ? 700 : 500,
              color: activeTab === 'dsa' ? 'var(--accent-green)' : 'var(--text-muted)',
              borderBottom: activeTab === 'dsa' ? '2px solid var(--accent-green)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <BookOpen size={14} color="var(--accent-green)" />
            S3 DSA Supply (Nov 30)
            <span className="badge badge-supply" style={{ fontSize: '0.62rem', padding: '0.05rem 0.3rem' }}>11d</span>
          </button>

          <button
            onClick={() => setActiveTab('syllabus')}
            style={{
              padding: '0.7rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'syllabus' ? 700 : 500,
              color: activeTab === 'syllabus' ? 'var(--accent-purple)' : 'var(--text-muted)',
              borderBottom: activeTab === 'syllabus' ? '2px solid var(--accent-purple)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Download size={14} color="var(--accent-purple)" /> Study Files & Syllabi
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main style={{ maxWidth: '1440px', width: '100%', margin: '1rem auto', padding: '0 1rem', flex: 1 }}>
        {/* ===================== VIEW 1: DASHBOARD ===================== */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Urgency Banner */}
            <div
              className="card"
              style={{
                padding: '1.15rem 1.25rem',
                marginBottom: '1rem',
                borderLeft: '4px solid var(--accent-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.85rem'
              }}
            >
              <div style={{ flex: '1 1 auto', minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <span className="badge badge-critical">IMMEDIATE FOCUS</span>
                  <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Computer Networks (Theory) • Nov 23</h2>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
                  <strong>4 days remaining</strong>. Filtered core watch time is <strong>{formatTime(cnStats.coreHours)}</strong> at 1.0x, or <strong>{formatTime(cnStats.coreHours / playbackSpeed)}</strong> at {playbackSpeed}x speed ({((cnStats.coreHours / playbackSpeed) / 4).toFixed(1)} hrs/day target).
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('cn');
                  setActiveViewMode('core');
                }}
                style={{
                  backgroundColor: 'var(--accent-red)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '0.55rem 1rem',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  flexShrink: 0
                }}
              >
                Start CN Core Fast Track <ArrowRight size={14} />
              </button>
            </div>

            {/* Quick KPI Grid - Clickable boxes to toggle Days format */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
              {/* Card 1: CN */}
              <div
                className="card card-hover"
                onClick={toggleTimeUnit}
                title="Click box to toggle Hours / Days format"
                style={{ padding: '1rem', borderTop: '3px solid var(--accent-red)', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Computer Networks</h3>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Nov 23 • S5 Theory (PCCST501)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span className="badge badge-critical">4 Days Left</span>
                    <span style={{ fontSize: '0.62rem', color: 'var(--accent-blue)', opacity: 0.8 }}>
                      {timeUnitMode === 'days' ? '📅 Days' : '⏱️ Hrs'}
                    </span>
                  </div>
                </div>
                <div style={{ margin: '0.75rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Progress: {cnStats.completedVideos} / {cnStats.totalVideos} videos</span>
                    <span className="mono" style={{ color: 'var(--accent-red)', fontWeight: 700 }}>{cnStats.completionRate.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: '5px', background: 'var(--bg-active)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${cnStats.completionRate}%`, background: 'var(--accent-red)', height: '100%' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span>Core: <strong>{cnStats.coreVideos} vids</strong> ({formatTime(cnStats.coreHours)})</span>
                  <span>At {playbackSpeed}x: <strong style={{ color: 'var(--text-main)' }}>{formatTime(cnStats.coreHours / playbackSpeed)}</strong></span>
                </div>
              </div>

              {/* Card 2: DAA */}
              <div
                className="card card-hover"
                onClick={toggleTimeUnit}
                title="Click box to toggle Hours / Days format"
                style={{ padding: '1rem', borderTop: '3px solid var(--accent-peach)', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>DAA (Algorithms)</h3>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Nov 27 • S5 Theory (PCCST502)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span className="badge badge-theory">8 Days Left</span>
                    <span style={{ fontSize: '0.62rem', color: 'var(--accent-blue)', opacity: 0.8 }}>
                      {timeUnitMode === 'days' ? '📅 Days' : '⏱️ Hrs'}
                    </span>
                  </div>
                </div>
                <div style={{ margin: '0.75rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Progress: {daaStats.completedVideos} / {daaStats.totalVideos} videos</span>
                    <span className="mono" style={{ color: 'var(--accent-peach)', fontWeight: 700 }}>{daaStats.completionRate.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: '5px', background: 'var(--bg-active)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${daaStats.completionRate}%`, background: 'var(--accent-peach)', height: '100%' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span>Core: <strong>{daaStats.coreVideos} vids</strong> ({formatTime(daaStats.coreHours)})</span>
                  <span>At {playbackSpeed}x: <strong style={{ color: 'var(--text-main)' }}>{formatTime(daaStats.coreHours / playbackSpeed)}</strong></span>
                </div>
              </div>

              {/* Card 3: S3 DSA */}
              <div
                className="card card-hover"
                onClick={toggleTimeUnit}
                title="Click box to toggle Hours / Days format"
                style={{ padding: '1rem', borderTop: '3px solid var(--accent-green)', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>S3 DSA (Supply)</h3>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Nov 30 • S3 Supply (PCCST303)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span className="badge badge-supply">11 Days Left</span>
                    <span style={{ fontSize: '0.62rem', color: 'var(--accent-blue)', opacity: 0.8 }}>
                      {timeUnitMode === 'days' ? '📅 Days' : '⏱️ Hrs'}
                    </span>
                  </div>
                </div>
                <div style={{ margin: '0.75rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Progress: {dsaStats.completedVideos} / {dsaStats.totalVideos} videos</span>
                    <span className="mono" style={{ color: 'var(--accent-green)', fontWeight: 700 }}>{dsaStats.completionRate.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: '5px', background: 'var(--bg-active)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${dsaStats.completionRate}%`, background: 'var(--accent-green)', height: '100%' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span>Core: <strong>{dsaStats.coreVideos} vids</strong> ({formatTime(dsaStats.coreHours)})</span>
                  <span>At {playbackSpeed}x: <strong style={{ color: 'var(--text-main)' }}>{formatTime(dsaStats.coreHours / playbackSpeed)}</strong></span>
                </div>
              </div>
            </div>

            {/* Timetable Schedule Table (Clean & Responsive) */}
            <div className="card" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={16} color="var(--accent-blue)" /> Official Examination Schedule
                  </h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Full examination timeline (KTU 2026)</p>
                </div>
                <span className="badge badge-optional mono">Updated: {appData.lastUpdatedDisplay}</span>
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
                    {appData.examTimetable.map((item, idx) => {
                      const days = getDaysLeft(item.date);
                      const isPast = days < 0;
                      const isNext = item.date === '2026-11-23';

                      return (
                        <tr
                          key={idx}
                          style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            backgroundColor: isNext ? 'rgba(248, 113, 113, 0.05)' : isPast ? 'rgba(255, 255, 255, 0.01)' : 'transparent'
                          }}
                        >
                          <td style={{ padding: '0.55rem 0.65rem', fontWeight: 600 }} className="mono">
                            {item.displayDate}
                          </td>
                          <td style={{ padding: '0.55rem 0.65rem', fontWeight: isNext ? 700 : 500, color: isNext ? 'var(--accent-red)' : 'var(--text-main)' }}>
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
                              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Completed</span>
                            ) : days === 0 ? (
                              <span className="badge badge-critical">Today!</span>
                            ) : (
                              <span className="mono" style={{ fontWeight: 600, color: days <= 4 ? 'var(--accent-red)' : days <= 8 ? 'var(--accent-peach)' : 'var(--text-main)' }}>
                                {days} day{days > 1 ? 's' : ''} left
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '0.55rem 0.65rem' }}>
                            {item.playlistKey ? (
                              <button
                                onClick={() => {
                                  setActiveTab(item.playlistKey);
                                  setSelectedModule('ALL');
                                }}
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
                                View <ArrowRight size={11} />
                              </button>
                            ) : isPast ? (
                              <span style={{ color: 'var(--accent-green)', fontSize: '0.72rem' }}>✓ Done</span>
                            ) : (
                              <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>Self Study</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reduction Analysis Summary */}
            <div className="card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <TrendingUp size={16} color="var(--accent-green)" /> Syllabus Filtering Impact Summary
                </h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)' }}>(Click any box to toggle Days / Hours)</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.85rem' }}>
                Eliminated repetitive competitive programming and isolated 2-minute GATE questions to isolate pure university syllabus portions:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                <div
                  className="card card-hover"
                  onClick={toggleTimeUnit}
                  title="Click to toggle Days format"
                  style={{ backgroundColor: 'var(--bg-overlay)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Original Raw Playlists</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>500 Videos</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{formatTime(260.2)} total watch time</div>
                </div>

                <div
                  className="card card-hover"
                  onClick={toggleTimeUnit}
                  title="Click to toggle Days format"
                  style={{ backgroundColor: 'var(--bg-overlay)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Curated Core (Must-Watch)</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-green)' }}>290 Videos</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-green)' }}>{formatTime(152.0)} (42% Load Cut)</div>
                </div>

                <div
                  className="card card-hover"
                  onClick={toggleTimeUnit}
                  title="Click to toggle Days format"
                  style={{ backgroundColor: 'var(--bg-overlay)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Optional Practice</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-yellow)' }}>155 Videos</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-yellow)' }}>{formatTime(85.9)} extra practice</div>
                </div>

                <div
                  className="card card-hover"
                  onClick={toggleTimeUnit}
                  title="Click to toggle Days format"
                  style={{ backgroundColor: 'var(--bg-overlay)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Eliminated Overkill</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-red)' }}>55 Videos</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-red)' }}>{formatTime(22.3)} saved directly</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== VIEW 2: SUBJECT SPECIFIC TABS (CN, DAA, DSA) ===================== */}
        {(activeTab === 'cn' || activeTab === 'daa' || activeTab === 'dsa') && currentSubjectData && (
          <div>
            {/* Subject Header Banner - FIXED TO ALWAYS MATCH SECOND IMAGE (Horizontal Side-by-Side) */}
            <div className="card subject-header-banner">
              <div className="subject-header-left">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{currentSubjectData.title}</h2>
                  <span className="badge badge-module mono">{currentSubjectData.code}</span>
                  <span className="badge badge-critical">{currentSubjectData.daysLeft} Days Left</span>
                  <span className="badge badge-optional mono" style={{ fontSize: '0.68rem' }}>Updated: {appData.lastUpdatedDisplay}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0, lineHeight: 1.45 }}>
                  Exam Date: <strong>{currentSubjectData.displayDate}</strong> • {currentSubjectData.syllabusNote}
                </p>
              </div>

              {/* Progress Summary Pill on Right (Image 2 style) */}
              <div className="subject-header-right">
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                  Subject Progress
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.1rem 0' }} className="mono">
                  {currentSubjectData.stats.completedVideos} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>/</span> {currentSubjectData.stats.totalVideos}{' '}
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                    ({currentSubjectData.stats.completionRate.toFixed(1)}%)
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  Remaining Core: <strong style={{ color: 'var(--text-main)' }}>{formatTime(currentSubjectData.stats.remainingCoreHours)}</strong> at {playbackSpeed}x
                </div>
              </div>
            </div>

            {/* Subject Stats Strip - 5 BOXES IN A SINGLE HORIZONTAL ROW (stats-grid-5) */}
            <div className="stats-grid-5">
              {/* Box 1 */}
              <div
                className="card card-hover"
                onClick={toggleTimeUnit}
                title="Click box to toggle Days format (>= 12 hrs converts to Days)"
                style={{ padding: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Core Watch Time (1.0x)</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--accent-blue)', opacity: 0.8 }}>
                    {timeUnitMode === 'days' ? '📅 Days' : '⏱️ Hrs'}
                  </span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700 }} className="mono">
                  {formatTime(currentSubjectData.stats.coreHours)}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--accent-green)' }}>{currentSubjectData.stats.coreVideos} Must-Watch videos</div>
              </div>

              {/* Box 2 */}
              <div
                className="card card-hover"
                onClick={toggleTimeUnit}
                title="Click box to toggle Days format (>= 12 hrs converts to Days)"
                style={{ padding: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Core at {playbackSpeed}x Speed</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--accent-yellow)', opacity: 0.8 }}>
                    {timeUnitMode === 'days' ? '📅 Days' : '⏱️ Hrs'}
                  </span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-yellow)' }} className="mono">
                  {formatTime(currentSubjectData.stats.coreHours / playbackSpeed)}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Saves {formatTime(currentSubjectData.stats.coreHours * (1 - 1 / playbackSpeed))}!
                </div>
              </div>

              {/* Box 3 */}
              <div
                className="card card-hover"
                onClick={toggleTimeUnit}
                title="Click box to toggle Days format"
                style={{ padding: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Required Study Pace</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--accent-red)', opacity: 0.8 }}>
                    {timeUnitMode === 'days' ? '📅 Days' : '⏱️ Hrs'}
                  </span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-red)' }} className="mono">
                  {currentSubjectData.daysLeft > 0
                    ? `${((currentSubjectData.stats.coreHours / playbackSpeed) / currentSubjectData.daysLeft).toFixed(1)} hrs/day`
                    : '0 hrs/day'}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                  Over next {currentSubjectData.daysLeft} days at {playbackSpeed}x
                </div>
              </div>

              {/* Box 4 */}
              <div
                className="card card-hover"
                onClick={toggleTimeUnit}
                title="Click box to toggle Days format (>= 12 hrs converts to Days)"
                style={{ padding: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Optional Deep Dive</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--accent-yellow)', opacity: 0.8 }}>
                    {timeUnitMode === 'days' ? '📅 Days' : '⏱️ Hrs'}
                  </span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700 }} className="mono">
                  {formatTime(currentSubjectData.stats.optHours)}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--accent-yellow)' }}>{currentSubjectData.stats.optVideos} practice videos</div>
              </div>

              {/* Box 5 */}
              <div
                className="card card-hover"
                onClick={toggleTimeUnit}
                title="Click box to toggle Days format (>= 12 hrs converts to Days)"
                style={{ padding: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Removed Overkill</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--accent-red)', opacity: 0.8 }}>
                    {timeUnitMode === 'days' ? '📅 Days' : '⏱️ Hrs'}
                  </span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-red)' }} className="mono">
                  {formatTime(currentSubjectData.stats.remHours)}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--accent-red)' }}>{currentSubjectData.stats.remVideos} unnecessary videos cut</div>
              </div>
            </div>

            {/* Filter Bar: Views, Module, Search */}
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
              {/* View Switcher Pills */}
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
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
                  🎯 Study ({currentSubjectData.stats.coreVideos + currentSubjectData.stats.optVideos})
                </button>

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
                  ⚡ Core ({currentSubjectData.stats.coreVideos})
                </button>

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
                  💡 Optional ({currentSubjectData.stats.optVideos})
                </button>

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
                  🗑️ Removed ({currentSubjectData.stats.remVideos})
                </button>

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
                  📜 All ({currentSubjectData.stats.totalVideos})
                </button>
              </div>

              {/* Right Side: Search and Batch Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', width: 'auto' }}>
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
                      fontSize: '0.78rem',
                      width: '130px'
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.72rem' }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Batch Mark Buttons */}
                <button
                  onClick={() => markBatch(displayedVideos, true)}
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

                <button
                  onClick={() => markBatch(displayedVideos, false)}
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
              </div>
            </div>

            {/* DESKTOP TABLE VIEW (>= 769px) */}
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
                        No videos found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    displayedVideos.map((item) => {
                      const itemKey = `${item.Subject}_${item.Index}`;
                      const isCompleted = !!completedMap[itemKey];

                      return (
                        <tr
                          key={itemKey}
                          className={isCompleted ? 'table-row-completed' : ''}
                          style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            transition: 'background-color 0.15s ease'
                          }}
                        >
                          <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                            <button
                              onClick={() => toggleComplete(itemKey)}
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
                            <span className="badge badge-module" style={{ fontSize: '0.68rem' }}>
                              {item.Module || 'General'}
                            </span>
                          </td>

                          <td style={{ padding: '0.6rem 0.75rem' }}>
                            <div style={{ fontWeight: 600, color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: isCompleted ? 'line-through' : 'none' }}>
                              {item.Title}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                              <span style={{ color: 'var(--accent-blue)', fontWeight: 500 }}>{item.Topic}</span>
                              {item.Reason && (
                                <span style={{ marginLeft: '0.4rem', color: 'var(--text-muted)' }}>
                                  — {item.Reason}
                                </span>
                              )}
                            </div>
                          </td>

                          <td style={{ padding: '0.6rem 0.75rem', whiteSpace: 'nowrap' }} className="mono">
                            <div>{item.Duration}m</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                              {(item.Duration / playbackSpeed).toFixed(1)}m @ {playbackSpeed}x
                            </div>
                          </td>

                          <td style={{ padding: '0.6rem 0.75rem' }}>
                            <span className={`badge badge-${item.Status.toLowerCase()}`}>{item.Status}</span>
                          </td>

                          <td style={{ padding: '0.6rem 0.75rem' }}>
                            <a
                              href={item['Video url']}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                color: 'var(--accent-blue)',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                padding: '0.2rem 0.45rem',
                                borderRadius: '4px',
                                backgroundColor: 'var(--bg-active)'
                              }}
                            >
                              Watch <ExternalLink size={11} />
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARD VIEW (< 769px) - Zero horizontal scroll, touch-friendly */}
            <div className="mobile-card-view">
              {displayedVideos.length === 0 ? (
                <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                  No videos found matching your filter criteria.
                </div>
              ) : (
                displayedVideos.map((item) => {
                  const itemKey = `${item.Subject}_${item.Index}`;
                  const isCompleted = !!completedMap[itemKey];

                  return (
                    <div
                      key={itemKey}
                      className="card"
                      style={{
                        padding: '0.75rem',
                        backgroundColor: isCompleted ? 'rgba(74, 222, 128, 0.03)' : 'var(--bg-surface)',
                        borderLeft: isCompleted ? '3px solid var(--accent-green)' : '3px solid var(--border-default)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => toggleComplete(itemKey)}
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
                          <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>#{item.Index}</span>
                          <span className="badge badge-module" style={{ fontSize: '0.65rem' }}>{item.Module}</span>
                          <span className={`badge badge-${item.Status.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>{item.Status}</span>
                        </div>

                        <a
                          href={item['Video url']}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: 'var(--accent-blue)',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: 'var(--bg-active)',
                            flexShrink: 0
                          }}
                        >
                          Watch <ExternalLink size={11} />
                        </a>
                      </div>

                      <div style={{ fontWeight: 600, fontSize: '0.84rem', color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: isCompleted ? 'line-through' : 'none', marginBottom: '0.25rem' }}>
                        {item.Title}
                      </div>

                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                        <span style={{ color: 'var(--accent-blue)' }}>{item.Topic}</span>
                        {item.Reason && <span> — {item.Reason}</span>}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', paddingTop: '0.35rem', borderTop: '1px solid var(--border-subtle)' }}>
                        <span className="mono">Duration: <strong>{item.Duration}m</strong></span>
                        <span className="mono" style={{ color: 'var(--accent-yellow)' }}>{(item.Duration / playbackSpeed).toFixed(1)}m @ {playbackSpeed}x</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ===================== VIEW 3: STUDY FILES & SYLLABI ===================== */}
        {activeTab === 'syllabus' && (
          <div>
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Download size={18} color="var(--accent-purple)" /> Curated Study Files & Datasets
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    Export complete filtered study portions and review official syllabi directly in your browser.
                  </p>
                </div>
                <span className="badge badge-optional mono">Last Synced: {appData.lastUpdatedDisplay}</span>
              </div>

              {/* Grid of Actionable Resource Cards with Direct Download */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem', marginTop: '1rem' }}>
                {/* 1. Combined Master Plan */}
                <div className="card" style={{ padding: '0.85rem', borderLeft: '3px solid var(--accent-blue)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>DSA & DAA Master Study Plan</h4>
                      <span className="badge badge-core">{appData.dsa_all.filter((v) => v.Status !== 'Removed').length} Vids</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Combined master curriculum covering S3 DSA and S5 DAA university portions with YouTube links.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => downloadCSV('Data_Structures_and_Algorithms_Study_Portions.csv', appData.dsa_all.filter((v) => v.Status !== 'Removed'))}
                      style={{
                        backgroundColor: 'var(--accent-blue)',
                        color: 'var(--bg-base)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Download size={12} /> Download CSV
                    </button>
                    <button
                      onClick={() => copyPath('data/processed/Data_Structures_and_Algorithms_Study_Portions.csv', 'dsa_study')}
                      style={{
                        backgroundColor: 'var(--bg-active)',
                        border: '1px solid var(--border-default)',
                        color: 'var(--text-muted)',
                        borderRadius: '4px',
                        padding: '0.3rem 0.55rem',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {copiedKey === 'dsa_study' ? <Check size={12} color="var(--accent-green)" /> : <Copy size={12} />}
                      {copiedKey === 'dsa_study' ? 'Copied' : 'Path'}
                    </button>
                  </div>
                </div>

                {/* 2. Computer Networks Study Plan */}
                <div className="card" style={{ padding: '0.85rem', borderLeft: '3px solid var(--accent-red)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>Computer Networks Study Plan</h4>
                      <span className="badge badge-critical">{appData.cn_all.filter((v) => v.Status !== 'Removed').length} Vids</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Complete S5 CN (PCCST501) curated course playlist mapped to KTU Modules 1 through 4.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => downloadCSV('Computer_Networks_Study_Portions.csv', appData.cn_all.filter((v) => v.Status !== 'Removed'))}
                      style={{
                        backgroundColor: 'var(--accent-red)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Download size={12} /> Download CSV
                    </button>
                    <button
                      onClick={() => copyPath('data/processed/Computer_Networks_Study_Portions.csv', 'cn_study')}
                      style={{
                        backgroundColor: 'var(--bg-active)',
                        border: '1px solid var(--border-default)',
                        color: 'var(--text-muted)',
                        borderRadius: '4px',
                        padding: '0.3rem 0.55rem',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {copiedKey === 'cn_study' ? <Check size={12} color="var(--accent-green)" /> : <Copy size={12} />}
                      {copiedKey === 'cn_study' ? 'Copied' : 'Path'}
                    </button>
                  </div>
                </div>

                {/* 3. DAA Theory Plan */}
                <div className="card" style={{ padding: '0.85rem', borderLeft: '3px solid var(--accent-peach)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>DAA (Algorithms) Focused Plan</h4>
                      <span className="badge badge-theory">{playlists.daa.filter((v) => v.Status !== 'Removed').length} Vids</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Specific playlist for S5 DAA Theory exam (Nov 27): recurrences, AVL trees, and greedy/DP.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => downloadCSV('S5_DAA_Study_Portions.csv', playlists.daa.filter((v) => v.Status !== 'Removed'))}
                      style={{
                        backgroundColor: 'var(--accent-peach)',
                        color: 'var(--bg-base)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Download size={12} /> Download CSV
                    </button>
                    <button
                      onClick={() => copyPath('data/processed/S5_DAA_Study_Portions.csv', 'daa_study')}
                      style={{
                        backgroundColor: 'var(--bg-active)',
                        border: '1px solid var(--border-default)',
                        color: 'var(--text-muted)',
                        borderRadius: '4px',
                        padding: '0.3rem 0.55rem',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {copiedKey === 'daa_study' ? <Check size={12} color="var(--accent-green)" /> : <Copy size={12} />}
                      {copiedKey === 'daa_study' ? 'Copied' : 'Path'}
                    </button>
                  </div>
                </div>

                {/* 4. S3 DSA Supply Plan */}
                <div className="card" style={{ padding: '0.85rem', borderLeft: '3px solid var(--accent-green)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>S3 DSA Supply Plan</h4>
                      <span className="badge badge-supply">{playlists.dsa.filter((v) => v.Status !== 'Removed').length} Vids</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Targeted playlist for S3 DSA Supply exam (Nov 30): Stacks, Queues, Trees, Heaps, and Sorting.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => downloadCSV('S3_DSA_Study_Portions.csv', playlists.dsa.filter((v) => v.Status !== 'Removed'))}
                      style={{
                        backgroundColor: 'var(--accent-green)',
                        color: 'var(--bg-base)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Download size={12} /> Download CSV
                    </button>
                    <button
                      onClick={() => copyPath('data/processed/S3_DSA_Study_Portions.csv', 'dsa_supply')}
                      style={{
                        backgroundColor: 'var(--bg-active)',
                        border: '1px solid var(--border-default)',
                        color: 'var(--text-muted)',
                        borderRadius: '4px',
                        padding: '0.3rem 0.55rem',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {copiedKey === 'dsa_supply' ? <Check size={12} color="var(--accent-green)" /> : <Copy size={12} />}
                      {copiedKey === 'dsa_supply' ? 'Copied' : 'Path'}
                    </button>
                  </div>
                </div>

                {/* 5. CN Removed Topics */}
                <div className="card" style={{ padding: '0.85rem', borderLeft: '3px solid var(--accent-red)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>CN Filtered Out Topics</h4>
                      <span className="badge badge-removed">{appData.cn_all.filter((v) => v.Status === 'Removed').length} Vids</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      All removed videos from the CN playlist with reasons explaining why they were excluded.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => downloadCSV('Computer_Networks_Removed_Portions.csv', appData.cn_all.filter((v) => v.Status === 'Removed'))}
                      style={{
                        backgroundColor: 'var(--bg-active)',
                        border: '1px solid var(--border-default)',
                        color: 'var(--accent-red)',
                        borderRadius: '4px',
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Download size={12} /> Download CSV
                    </button>
                    <button
                      onClick={() => copyPath('data/processed/Computer_Networks_Removed_Portions.csv', 'cn_rem')}
                      style={{
                        backgroundColor: 'var(--bg-active)',
                        border: '1px solid var(--border-default)',
                        color: 'var(--text-muted)',
                        borderRadius: '4px',
                        padding: '0.3rem 0.55rem',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {copiedKey === 'cn_rem' ? <Check size={12} color="var(--accent-green)" /> : <Copy size={12} />}
                      {copiedKey === 'cn_rem' ? 'Copied' : 'Path'}
                    </button>
                  </div>
                </div>

                {/* 6. DSA/DAA Removed Topics */}
                <div className="card" style={{ padding: '0.85rem', borderLeft: '3px solid var(--accent-red)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>DSA/DAA Filtered Out Topics</h4>
                      <span className="badge badge-removed">{appData.dsa_all.filter((v) => v.Status === 'Removed').length} Vids</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      All removed DSA/DAA videos with reasons explaining why they were excluded.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => downloadCSV('Data_Structures_and_Algorithms_Removed_Portions.csv', appData.dsa_all.filter((v) => v.Status === 'Removed'))}
                      style={{
                        backgroundColor: 'var(--bg-active)',
                        border: '1px solid var(--border-default)',
                        color: 'var(--accent-red)',
                        borderRadius: '4px',
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Download size={12} /> Download CSV
                    </button>
                    <button
                      onClick={() => copyPath('data/processed/Data_Structures_and_Algorithms_Removed_Portions.csv', 'dsa_rem')}
                      style={{
                        backgroundColor: 'var(--bg-active)',
                        border: '1px solid var(--border-default)',
                        color: 'var(--text-muted)',
                        borderRadius: '4px',
                        padding: '0.3rem 0.55rem',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {copiedKey === 'dsa_rem' ? <Check size={12} color="var(--accent-green)" /> : <Copy size={12} />}
                      {copiedKey === 'dsa_rem' ? 'Copied' : 'Path'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CRITICAL SYLLABUS REVERIFICATION & GAP ADVISORY CARD */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem', borderLeft: '4px solid var(--accent-yellow)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-critical" style={{ fontSize: '0.75rem' }}>CRITICAL REVERIFICATION ADVISORY</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                  Topics Missing from GATE Playlists (Must Read from College Notes / Textbooks)
                </h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                The GATE playlists cover <strong>~85–90% of numerical and algorithmic concepts</strong>, but competitive GATE videos intentionally skip certain university theory questions. Make sure to supplement these specific items from textbooks (Forouzan / Horowitz-Sahni / Cormen):
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '0.85rem' }}>
                {/* Gap 1: CN */}
                <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <strong style={{ color: 'var(--accent-red)', fontSize: '0.85rem' }}>S5 Computer Networks (Nov 23)</strong>
                    <span className="badge badge-critical">3 Gaps</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <li>
                      <strong style={{ color: 'var(--text-main)' }}>Module 4 - SNMP & ASN.1</strong>: Structure of Management Info (SMI), MIB, SNMP PDUs, ASN.1 encoding. <em>(Forouzan Ch 9)</em>
                    </li>
                    <li>
                      <strong style={{ color: 'var(--text-main)' }}>Module 1 - C Socket Calls</strong>: Elementary TCP/UDP socket system calls (<code style={{ color: 'var(--accent-cyan)' }}>socket</code>, <code style={{ color: 'var(--accent-cyan)' }}>bind</code>, <code style={{ color: 'var(--accent-cyan)' }}>listen</code>, <code style={{ color: 'var(--accent-cyan)' }}>accept</code>, <code style={{ color: 'var(--accent-cyan)' }}>select</code>, <code style={{ color: 'var(--accent-cyan)' }}>poll</code>).
                    </li>
                    <li>
                      <strong style={{ color: 'var(--text-main)' }}>Module 1 - P2P & BitTorrent</strong>: P2P architecture & BitTorrent choking algorithm.
                    </li>
                  </ul>
                </div>

                {/* Gap 2: DAA */}
                <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <strong style={{ color: 'var(--accent-peach)', fontSize: '0.85rem' }}>S5 DAA (Nov 27)</strong>
                    <span className="badge badge-theory">Entire Module 4</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <li>
                      <strong style={{ color: 'var(--text-main)' }}>Module 4 - Complexity & NP Proofs</strong>: Tractable/Intractable, P, NP, NP-Hard, NP-Complete; Clique & Vertex Cover NP-Completeness proofs; Bin Packing; Monte Carlo & Las Vegas definitions. <em>(Cormen Ch 34/35)</em>
                    </li>
                    <li>
                      <strong style={{ color: 'var(--text-main)' }}>Module 2 - Disjoint Sets</strong>: Union-Find, Union by rank with path compression.
                    </li>
                    <li>
                      <strong style={{ color: 'var(--text-main)' }}>Module 3 & 4 - Backtracking & B&B</strong>: N-Queens problem state space tree, TSP using Branch & Bound (reduced matrix).
                    </li>
                  </ul>
                </div>

                {/* Gap 3: S3 DSA */}
                <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <strong style={{ color: 'var(--accent-green)', fontSize: '0.85rem' }}>S3 DSA Supply (Nov 30)</strong>
                    <span className="badge badge-supply">3 Gaps</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <li>
                      <strong style={{ color: 'var(--text-main)' }}>Module 1 - Sparse Matrix & Polynomials</strong>: Tuple representation (row, col, value), sparse transpose algorithm, polynomial addition using arrays/linked lists.
                    </li>
                    <li>
                      <strong style={{ color: 'var(--text-main)' }}>Module 2 - Memory Management</strong>: First-fit, Best-fit, Worst-fit allocation; Garbage collection and compaction.
                    </li>
                    <li>
                      <strong style={{ color: 'var(--text-main)' }}>Module 1 - Multi-Stacks & Deque</strong>: Implementing multiple stacks in a single array, Double Ended Queues.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Interactive Syllabus Reader */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileText size={16} color="var(--accent-blue)" /> Official University Syllabus Viewer
                </h3>

                {/* Syllabus Switcher Tabs */}
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setSelectedSyllabusTab('cn')}
                    style={{
                      backgroundColor: selectedSyllabusTab === 'cn' ? 'var(--accent-red)' : 'var(--bg-active)',
                      color: selectedSyllabusTab === 'cn' ? '#fff' : 'var(--text-muted)',
                      border: '1px solid var(--border-default)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    S5 CN
                  </button>
                  <button
                    onClick={() => setSelectedSyllabusTab('daa')}
                    style={{
                      backgroundColor: selectedSyllabusTab === 'daa' ? 'var(--accent-peach)' : 'var(--bg-active)',
                      color: selectedSyllabusTab === 'daa' ? '#fff' : 'var(--text-muted)',
                      border: '1px solid var(--border-default)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    S5 DAA
                  </button>
                  <button
                    onClick={() => setSelectedSyllabusTab('dsa')}
                    style={{
                      backgroundColor: selectedSyllabusTab === 'dsa' ? 'var(--accent-green)' : 'var(--bg-active)',
                      color: selectedSyllabusTab === 'dsa' ? '#fff' : 'var(--text-muted)',
                      border: '1px solid var(--border-default)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    S3 DSA
                  </button>
                </div>
              </div>

              {/* Syllabus Content Display */}
              <div style={{ backgroundColor: 'var(--bg-overlay)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {selectedSyllabusTab === 'cn' && (
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-red)', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                      KTU S5 Computer Networks (PCCST501) • ESE: 60 Marks, CIE: 40 Marks
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>Module 1 (6 Hours):</strong> Overview of Internet, Protocol layering; Application Layer: World Wide Web and HTTP, FTP, Email (SMTP, POP, IMAP), DNS, Peer-to-peer paradigm & BitTorrent.
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>Module 2 (18 Hours):</strong> Transport Layer: UDP, TCP Header, Connection Establishment/Termination, Flow Control, Congestion Control (AIMD); Network Layer: IPv4, IPv6, ICMP, ARP, Unicast Routing (Distance Vector, Link State), Multicast, QoS (Leaky/Token Bucket).
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>Module 3 (11 Hours):</strong> Data-Link Layer: Data link control (DLC), Framing, Flow & Error Control (CRC, Hamming, Stop-and-wait, GBN, SR); Multiple Access Protocols (ALOHA, CSMA/CD, CSMA/CA); Ethernet; Connecting Devices (Hub, Switch, Router); Wireless LANs 802.11.
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>Module 4 (9 Hours):</strong> SNMP, ASN.1; Physical Layer: Data & Signals, Digital transmission (NRZ, RZ, Manchester), Analog transmission, Bandwidth utilization (FDM, TDM, WDM), Transmission media.
                      </div>
                    </div>
                  </div>
                )}

                {selectedSyllabusTab === 'daa' && (
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-peach)', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                      KTU S5 Design and Analysis of Algorithms (PCCST502) • ESE: 60 Marks, CIE: 40 Marks
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>Module 1 (11 Hours):</strong> Algorithms criteria; Asymptotic Notations & properties; Recurrence Equations: Iteration Method, Recursion Tree Method, Substitution Method, Master's Theorem; Balanced Search Trees: AVL Trees (Insertion & Deletion with all rotations).
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>Module 2 (11 Hours):</strong> Disjoint Sets: Union and find, Union by rank with path compression, Connected components; Graph Traversals (BFS, DFS, SCC); Topological Sorting; Divide and Conquer (Control Abstraction, Merge Sort, Strassen's Matrix Multiplication).
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>Module 3 (11 Hours):</strong> Greedy Strategy (Control Abstraction, Fractional Knapsack, Kruskal's and Prim's MST, Dijkstra Shortest Path); Dynamic Programming (Control Abstraction, Optimality Principle, Matrix Chain Multiplication, Floyd-Warshall); Backtracking (N-Queens Problem).
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>Module 4 (11 Hours):</strong> Branch and Bound (Traveling Salesman Problem); Complexity Classes (P, NP, NP-Hard, NP-Complete, Clique & Vertex Cover proofs); Approximation (Bin Packing); Randomized Quick Sort with analysis.
                      </div>
                    </div>
                  </div>
                )}

                {selectedSyllabusTab === 'dsa' && (
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-green)', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                      KTU S3 Data Structures and Algorithms (PCCST303) • ESE: 60 Marks, CIE: 40 Marks
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>Module 1 (11 Hours):</strong> Basic Concepts, Time & Space Complexity, Asymptotic Notations; Polynomial representation using Arrays, Sparse matrix; Stacks, Queues, Circular Queues, Deque; Expression Evaluation (Infix to Postfix, Postfix evaluation).
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>Module 2 (11 Hours):</strong> Singly Linked List, Stacks & Queues using Linked List, Polynomials; Doubly Linked List, Circular Linked List; Memory Allocation (First-fit, Best-fit, Worst-fit), Garbage collection and compaction.
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>Module 3 (11 Hours):</strong> Trees: Binary Trees & properties, Traversals; Expression Trees; BST Operations; Binary Heaps & Priority Queues; Graphs (Definitions, Adjacency Matrix & List, BFS, DFS, Single-Source Shortest Path).
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>Module 4 (11 Hours):</strong> Sorting: Selection, Insertion, Quick, Merge, Heap, Radix Sort; Searching: Linear Search, Binary Search; Hashing & Collision Resolution (Linear probing, Quadratic probing, Double hashing, Chaining).
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-default)', backgroundColor: 'var(--bg-surface)', padding: '0.85rem 1rem', marginTop: '1.5rem' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.74rem', color: 'var(--text-dim)' }}>
          <div>
            <strong>EXAMER</strong> • Prepared for Vishnu Nandan • KTU CSE B.Tech Suite • <span className="mono">Updated: {appData.lastUpdatedDisplay}</span>
          </div>
          <div>
            Repository: <code className="mono" style={{ color: 'var(--accent-blue)' }}>git@github.com:vishnunandan555/examer.git</code>
          </div>
        </div>
      </footer>
    </div>
  );
}
