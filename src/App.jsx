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
  RefreshCw,
  FolderTree
} from 'lucide-react';

const CURRENT_DATE = new Date('2026-11-19T08:51:00+05:30');

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeViewMode, setActiveViewMode] = useState('study'); // 'study', 'core', 'optional', 'removed', 'original'
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [playbackSpeed, setPlaybackSpeed] = useState(1.5);
  const [completedMap, setCompletedMap] = useState(() => {
    try {
      const saved = localStorage.getItem('examer_completed_v1');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [expandedSyllabus, setExpandedSyllabus] = useState(false);

  // Sync completedMap to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('examer_completed_v1', JSON.stringify(completedMap));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [completedMap]);

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
        title: 'Data Structures and Algorithms (Supply)',
        code: 'PCCST303',
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

    // View mode filter
    if (activeViewMode === 'study') {
      items = items.filter((v) => v.Status === 'Core' || v.Status === 'Optional');
    } else if (activeViewMode === 'core') {
      items = items.filter((v) => v.Status === 'Core');
    } else if (activeViewMode === 'optional') {
      items = items.filter((v) => v.Status === 'Optional');
    } else if (activeViewMode === 'removed') {
      items = items.filter((v) => v.Status === 'Removed');
    }

    // Module filter
    if (selectedModule !== 'ALL') {
      items = items.filter((v) => v.Module && v.Module.includes(selectedModule));
    }

    // Search query
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
          padding: '0.75rem 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: 'var(--accent-blue)',
                color: 'var(--bg-base)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.1rem'
              }}
            >
              E
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                  EXAMER
                </span>
                <span className="badge badge-module">KTU CSE Suite</span>
                <span className="badge badge-optional mono" style={{ fontSize: '0.65rem' }}>
                  Updated: {appData.lastUpdatedDisplay || '2026-11-19 08:51 IST'}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Personal Exam Preparation & Curated GATE Playlist Suite</p>
            </div>
          </div>

          {/* Right Header Controls: Speed, Urgency Banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Speed Selector */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'var(--bg-overlay)',
                padding: '0.3rem 0.6rem',
                borderRadius: '6px',
                border: '1px solid var(--border-default)'
              }}
            >
              <Zap size={14} color="var(--accent-yellow)" />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pace:</span>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--accent-yellow)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value={1.0} style={{ background: '#11131b' }}>1.0x Normal</option>
                <option value={1.25} style={{ background: '#11131b' }}>1.25x Swift</option>
                <option value={1.5} style={{ background: '#11131b' }}>1.5x Recommended</option>
                <option value={1.75} style={{ background: '#11131b' }}>1.75x Rapid</option>
                <option value={2.0} style={{ background: '#11131b' }}>2.0x Double</option>
              </select>
            </div>

            {/* Next Exam Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(231, 130, 132, 0.1)',
                border: '1px solid rgba(231, 130, 132, 0.3)',
                padding: '0.3rem 0.75rem',
                borderRadius: '6px'
              }}
            >
              <Flame size={15} color="var(--accent-red)" />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-main)' }}>
                Next: <strong style={{ color: 'var(--accent-red)' }}>CN Theory</strong> in <strong>4 Days</strong> (Nov 23)
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', gap: '0.5rem', padding: '0 1.5rem', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              fontWeight: activeTab === 'dashboard' ? 600 : 500,
              color: activeTab === 'dashboard' ? 'var(--accent-blue)' : 'var(--text-muted)',
              borderBottom: activeTab === 'dashboard' ? '2px solid var(--accent-blue)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Layers size={16} /> Main Dashboard
          </button>

          <button
            onClick={() => {
              setActiveTab('cn');
              setSelectedModule('ALL');
            }}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              fontWeight: activeTab === 'cn' ? 600 : 500,
              color: activeTab === 'cn' ? 'var(--accent-red)' : 'var(--text-muted)',
              borderBottom: activeTab === 'cn' ? '2px solid var(--accent-red)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Clock size={15} color="var(--accent-red)" />
            Computer Networks (Nov 23)
            <span className="badge badge-critical" style={{ fontSize: '0.65rem', padding: '0.05rem 0.35rem' }}>4d</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('daa');
              setSelectedModule('ALL');
            }}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              fontWeight: activeTab === 'daa' ? 600 : 500,
              color: activeTab === 'daa' ? 'var(--accent-peach)' : 'var(--text-muted)',
              borderBottom: activeTab === 'daa' ? '2px solid var(--accent-peach)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Sparkles size={15} color="var(--accent-peach)" />
            DAA (Nov 27)
            <span className="badge badge-theory" style={{ fontSize: '0.65rem', padding: '0.05rem 0.35rem' }}>8d</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('dsa');
              setSelectedModule('ALL');
            }}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              fontWeight: activeTab === 'dsa' ? 600 : 500,
              color: activeTab === 'dsa' ? 'var(--accent-green)' : 'var(--text-muted)',
              borderBottom: activeTab === 'dsa' ? '2px solid var(--accent-green)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap'
            }}
          >
            <BookOpen size={15} color="var(--accent-green)" />
            S3 DSA Supply (Nov 30)
            <span className="badge badge-supply" style={{ fontSize: '0.65rem', padding: '0.05rem 0.35rem' }}>11d</span>
          </button>

          <button
            onClick={() => setActiveTab('syllabus')}
            style={{
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              fontWeight: activeTab === 'syllabus' ? 600 : 500,
              color: activeTab === 'syllabus' ? 'var(--accent-purple)' : 'var(--text-muted)',
              borderBottom: activeTab === 'syllabus' ? '2px solid var(--accent-purple)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap'
            }}
          >
            <FolderTree size={15} /> Directory & Datasets
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main style={{ maxWidth: '1440px', width: '100%', margin: '1.5rem auto', padding: '0 1.5rem', flex: 1 }}>
        {/* ===================== VIEW 1: DASHBOARD ===================== */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Urgency Highlight Banner */}
            <div
              className="card"
              style={{
                padding: '1.25rem',
                marginBottom: '1.5rem',
                borderLeft: '4px solid var(--accent-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="badge badge-critical">IMMEDIATE FOCUS</span>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Computer Networks (Theory) on Monday, Nov 23</h2>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  You have <strong>4 days remaining</strong>. Filtered core watch time is <strong>{cnStats.coreHours.toFixed(1)} hrs</strong> at 1.0x, or <strong>{(cnStats.coreHours / playbackSpeed).toFixed(1)} hrs</strong> at {playbackSpeed}x speed ({((cnStats.coreHours / playbackSpeed) / 4).toFixed(1)} hrs/day target).
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
                  borderRadius: '6px',
                  padding: '0.6rem 1.25rem',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                Start CN Fast Track <ArrowRight size={16} />
              </button>
            </div>

            {/* Quick KPI Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* Card 1: CN */}
              <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid var(--accent-red)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Computer Networks</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Nov 23 • S5 Theory (PCCST501)</span>
                  </div>
                  <span className="badge badge-critical">4 Days Left</span>
                </div>
                <div style={{ margin: '1rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Progress: {cnStats.completedVideos} / {cnStats.totalVideos} videos</span>
                    <span className="mono" style={{ color: 'var(--accent-red)', fontWeight: 600 }}>{cnStats.completionRate.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-active)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${cnStats.completionRate}%`, background: 'var(--accent-red)', height: '100%' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span>Core: <strong>{cnStats.coreVideos} vids</strong> ({cnStats.coreHours.toFixed(1)}h)</span>
                  <span>At {playbackSpeed}x: <strong style={{ color: 'var(--text-main)' }}>{(cnStats.coreHours / playbackSpeed).toFixed(1)}h</strong></span>
                </div>
              </div>

              {/* Card 2: DAA */}
              <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid var(--accent-peach)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>DAA (Algorithms)</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Nov 27 • S5 Theory (PCCST502)</span>
                  </div>
                  <span className="badge badge-theory">8 Days Left</span>
                </div>
                <div style={{ margin: '1rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Progress: {daaStats.completedVideos} / {daaStats.totalVideos} videos</span>
                    <span className="mono" style={{ color: 'var(--accent-peach)', fontWeight: 600 }}>{daaStats.completionRate.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-active)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${daaStats.completionRate}%`, background: 'var(--accent-peach)', height: '100%' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span>Core: <strong>{daaStats.coreVideos} vids</strong> ({daaStats.coreHours.toFixed(1)}h)</span>
                  <span>At {playbackSpeed}x: <strong style={{ color: 'var(--text-main)' }}>{(daaStats.coreHours / playbackSpeed).toFixed(1)}h</strong></span>
                </div>
              </div>

              {/* Card 3: S3 DSA */}
              <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid var(--accent-green)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>S3 DSA (Data Structures)</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Nov 30 • S3 Supply (PCCST303)</span>
                  </div>
                  <span className="badge badge-supply">11 Days Left</span>
                </div>
                <div style={{ margin: '1rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Progress: {dsaStats.completedVideos} / {dsaStats.totalVideos} videos</span>
                    <span className="mono" style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{dsaStats.completionRate.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-active)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${dsaStats.completionRate}%`, background: 'var(--accent-green)', height: '100%' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span>Core: <strong>{dsaStats.coreVideos} vids</strong> ({dsaStats.coreHours.toFixed(1)}h)</span>
                  <span>At {playbackSpeed}x: <strong style={{ color: 'var(--text-main)' }}>{(dsaStats.coreHours / playbackSpeed).toFixed(1)}h</strong></span>
                </div>
              </div>
            </div>

            {/* Complete Examination Timetable Schedule Table */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={18} color="var(--accent-blue)" /> Official Examination Schedule
                  </h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>Matches your official updated examination timeline (KTU 2026)</p>
                </div>
                <span className="badge badge-optional mono">Updated: {appData.lastUpdatedDisplay}</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Date</th>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Subject</th>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Code</th>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Type</th>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Days Remaining</th>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Status / Action</th>
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
                            backgroundColor: isNext ? 'rgba(231, 130, 132, 0.05)' : isPast ? 'rgba(255, 255, 255, 0.01)' : 'transparent'
                          }}
                        >
                          <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }} className="mono">
                            {item.displayDate}
                          </td>
                          <td style={{ padding: '0.65rem 0.75rem', fontWeight: isNext ? 700 : 500, color: isNext ? 'var(--accent-red)' : 'var(--text-main)' }}>
                            {item.subject}
                          </td>
                          <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-dim)' }} className="mono">
                            {item.code}
                          </td>
                          <td style={{ padding: '0.65rem 0.75rem' }}>
                            <span className={`badge badge-${item.type.toLowerCase()}`}>{item.type}</span>
                          </td>
                          <td style={{ padding: '0.65rem 0.75rem' }}>
                            {isPast ? (
                              <span style={{ color: 'var(--text-dim)' }}>Completed</span>
                            ) : days === 0 ? (
                              <span className="badge badge-critical">Today!</span>
                            ) : (
                              <span className="mono" style={{ fontWeight: 600, color: days <= 4 ? 'var(--accent-red)' : days <= 8 ? 'var(--accent-peach)' : 'var(--text-main)' }}>
                                {days} day{days > 1 ? 's' : ''} left
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '0.65rem 0.75rem' }}>
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
                                  padding: '0.25rem 0.6rem',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}
                              >
                                View Plan <ArrowRight size={12} />
                              </button>
                            ) : isPast ? (
                              <span style={{ color: 'var(--accent-green)', fontSize: '0.75rem' }}>✓ Finished</span>
                            ) : (
                              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Self Study</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reduction Analysis / Pedagogical Impact Card */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} color="var(--accent-green)" /> Syllabus Filtering Impact Summary
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>
                By removing redundant GATE PYQs, isolated competitive coding tricks, and non-KTU topics, we extracted pure university syllabus portions:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--bg-overlay)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Original Raw Playlists</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>500 Videos</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>260.2 Hours watch time</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-overlay)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Curated Core (Must-Watch)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-green)' }}>290 Videos</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>152.0 Hours (42% Load Cut)</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-overlay)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Optional In-Depth Practice</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-yellow)' }}>155 Videos</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-yellow)' }}>85.9 Hours extra practice</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-overlay)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Eliminated Overkill</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-red)' }}>55 Videos</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-red)' }}>22.3 Hours saved directly</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== VIEW 2: SUBJECT SPECIFIC TABS (CN, DAA, DSA) ===================== */}
        {(activeTab === 'cn' || activeTab === 'daa' || activeTab === 'dsa') && currentSubjectData && (
          <div>
            {/* Subject Header Banner */}
            <div
              className="card"
              style={{
                padding: '1.25rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>{currentSubjectData.title}</h2>
                  <span className="badge badge-module mono">{currentSubjectData.code}</span>
                  <span className="badge badge-critical">{currentSubjectData.daysLeft} Days Left</span>
                  <span className="badge badge-optional mono" style={{ fontSize: '0.68rem' }}>Updated: {appData.lastUpdatedDisplay}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  Exam Date: <strong>{currentSubjectData.displayDate}</strong> • {currentSubjectData.syllabusNote}
                </p>
              </div>

              {/* Progress Summary Pill */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Subject Progress</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }} className="mono">
                  {currentSubjectData.stats.completedVideos} / {currentSubjectData.stats.totalVideos}{' '}
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-green)' }}>
                    ({currentSubjectData.stats.completionRate.toFixed(1)}%)
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Remaining Core: <strong>{currentSubjectData.stats.remainingCoreHours.toFixed(1)}h</strong> at {playbackSpeed}x
                </div>
              </div>
            </div>

            {/* Subject Stats & Speed Breakdown Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}
            >
              <div className="card" style={{ padding: '0.85rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Core Watch Time (1.0x)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }} className="mono">
                  {currentSubjectData.stats.coreHours.toFixed(1)} hrs
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-green)' }}>{currentSubjectData.stats.coreVideos} Must-Watch videos</div>
              </div>

              <div className="card" style={{ padding: '0.85rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Core at 1.5x Speed</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-yellow)' }} className="mono">
                  {(currentSubjectData.stats.coreHours / 1.5).toFixed(1)} hrs
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Saves {((currentSubjectData.stats.coreHours * 0.33)).toFixed(1)} hrs!</div>
              </div>

              <div className="card" style={{ padding: '0.85rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Required Study Pace</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-red)' }} className="mono">
                  {currentSubjectData.daysLeft > 0 ? ((currentSubjectData.stats.coreHours / playbackSpeed) / currentSubjectData.daysLeft).toFixed(1) : 0} hrs/day
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Over next {currentSubjectData.daysLeft} days at {playbackSpeed}x</div>
              </div>

              <div className="card" style={{ padding: '0.85rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Optional Deep Dive</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }} className="mono">
                  {currentSubjectData.stats.optHours.toFixed(1)} hrs
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-yellow)' }}>{currentSubjectData.stats.optVideos} practice videos</div>
              </div>

              <div className="card" style={{ padding: '0.85rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Removed Overkill</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-red)' }} className="mono">
                  {currentSubjectData.stats.remHours.toFixed(1)} hrs
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-red)' }}>{currentSubjectData.stats.remVideos} unnecessary videos cut</div>
              </div>
            </div>

            {/* Syllabus Details Accordion */}
            <div className="card" style={{ marginBottom: '1rem', overflow: 'hidden' }}>
              <button
                onClick={() => setExpandedSyllabus(!expandedSyllabus)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-overlay)',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={16} color="var(--accent-blue)" /> View Official KTU Course Syllabus Breakdown
                </span>
                {expandedSyllabus ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedSyllabus && (
                <div style={{ padding: '1rem', borderTop: '1px solid var(--border-default)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {activeTab === 'cn' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                      <div>
                        <strong style={{ color: 'var(--accent-blue)' }}>Module 1 (6 Hours):</strong> Overview of Internet, Protocol layering; Application Layer: HTTP, FTP, Email (SMTP, POP, IMAP), DNS, Peer-to-Peer & BitTorrent.
                      </div>
                      <div>
                        <strong style={{ color: 'var(--accent-blue)' }}>Module 2 (18 Hours):</strong> Transport Layer: UDP, TCP Header, 3-Way Handshake, Flow & Congestion Control (AIMD); Network Layer: IPv4, IPv6, ICMP, ARP, Unicast Routing (Distance Vector, Link State), QoS (Leaky/Token Bucket).
                      </div>
                      <div>
                        <strong style={{ color: 'var(--accent-blue)' }}>Module 3 (11 Hours):</strong> Data-Link Layer: Framing, CRC, Hamming, Flow Control (Stop & Wait, GBN, SR); MAC Protocols (ALOHA, CSMA/CD, CSMA/CA, Polling); Connecting Devices (Hub, Switch, Router); Wireless LANs 802.11.
                      </div>
                      <div>
                        <strong style={{ color: 'var(--accent-blue)' }}>Module 4 (9 Hours):</strong> Physical Layer: Analog & Digital signals, Line coding (NRZ, RZ, Manchester), Multiplexing (FDM, TDM, WDM), Transmission media; SNMP & ASN.1.
                      </div>
                    </div>
                  )}

                  {activeTab === 'daa' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                      <div>
                        <strong style={{ color: 'var(--accent-peach)' }}>Module 1 (11 Hours):</strong> Algorithms criteria, Asymptotic Notations & properties; Recurrence relations: Substitution, Recursion Tree, Master's Theorem; Balanced Search Trees: AVL Trees (Insert/Delete with all rotations).
                      </div>
                      <div>
                        <strong style={{ color: 'var(--accent-peach)' }}>Module 2 (11 Hours):</strong> Disjoint Sets (Union-find, path compression); Graph Traversals (BFS, DFS, SCC); Topological Sorting; Divide and Conquer (Merge Sort, Strassen's Matrix Multiplication).
                      </div>
                      <div>
                        <strong style={{ color: 'var(--accent-peach)' }}>Module 3 (11 Hours):</strong> Greedy Strategy (Fractional Knapsack, Kruskal's & Prim's MST, Dijkstra); Dynamic Programming (MCM, Floyd-Warshall); Backtracking (N-Queens).
                      </div>
                      <div>
                        <strong style={{ color: 'var(--accent-peach)' }}>Module 4 (11 Hours):</strong> Branch & Bound (TSP); Complexity Classes: P, NP, NP-Hard, NP-Complete (Clique & Vertex Cover proofs); Approximation (Bin Packing); Randomized Quick Sort.
                      </div>
                    </div>
                  )}

                  {activeTab === 'dsa' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                      <div>
                        <strong style={{ color: 'var(--accent-green)' }}>Module 1 (11 Hours):</strong> Basic Concepts, Time & Space Complexity, Asymptotic Notations; Polynomials & Sparse Matrix; Stacks, Queues, Circular Queues, Deque; Infix to Postfix & Evaluation.
                      </div>
                      <div>
                        <strong style={{ color: 'var(--accent-green)' }}>Module 2 (11 Hours):</strong> Singly, Doubly, and Circular Linked Lists; Stack & Queue using Linked List; Memory Allocation Schemes (First-fit, Best-fit, Worst-fit), Garbage collection.
                      </div>
                      <div>
                        <strong style={{ color: 'var(--accent-green)' }}>Module 3 (11 Hours):</strong> Trees: Binary Trees & properties, Traversals; Expression Trees; BST Operations; Binary Heaps & Priority Queues; Graph Definitions, BFS, DFS, Single-Source Shortest Path.
                      </div>
                      <div>
                        <strong style={{ color: 'var(--accent-green)' }}>Module 4 (11 Hours):</strong> Sorting: Selection, Insertion, Quick, Merge, Heap, Radix Sort; Searching: Linear Search, Binary Search; Hashing & Collision Resolution (Linear/Quadratic probing, Double hashing, Chaining).
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Filter Bar: Views, Module, Search */}
            <div
              className="card"
              style={{
                padding: '0.85rem 1rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              {/* View Switcher Buttons */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setActiveViewMode('study')}
                  style={{
                    backgroundColor: activeViewMode === 'study' ? 'var(--accent-blue)' : 'var(--bg-active)',
                    color: activeViewMode === 'study' ? 'var(--bg-base)' : 'var(--text-main)',
                    border: '1px solid var(--border-default)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '5px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  🎯 Study Plan ({currentSubjectData.stats.coreVideos + currentSubjectData.stats.optVideos})
                </button>

                <button
                  onClick={() => setActiveViewMode('core')}
                  style={{
                    backgroundColor: activeViewMode === 'core' ? 'var(--accent-green)' : 'var(--bg-active)',
                    color: activeViewMode === 'core' ? 'var(--bg-base)' : 'var(--text-main)',
                    border: '1px solid var(--border-default)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '5px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Core Only ({currentSubjectData.stats.coreVideos})
                </button>

                <button
                  onClick={() => setActiveViewMode('optional')}
                  style={{
                    backgroundColor: activeViewMode === 'optional' ? 'var(--accent-yellow)' : 'var(--bg-active)',
                    color: activeViewMode === 'optional' ? 'var(--bg-base)' : 'var(--text-main)',
                    border: '1px solid var(--border-default)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '5px',
                    fontSize: '0.78rem',
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
                    padding: '0.35rem 0.75rem',
                    borderRadius: '5px',
                    fontSize: '0.78rem',
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
                    padding: '0.35rem 0.75rem',
                    borderRadius: '5px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  📜 Original ({currentSubjectData.stats.totalVideos})
                </button>
              </div>

              {/* Right Side: Search and Batch Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                {/* Search Box */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: 'var(--bg-overlay)',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-default)'
                  }}
                >
                  <Search size={14} color="var(--text-dim)" />
                  <input
                    type="text"
                    placeholder="Search topic or video..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--text-main)',
                      fontSize: '0.8rem',
                      width: '160px'
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Batch Mark Buttons */}
                <button
                  onClick={() => markBatch(displayedVideos, true)}
                  title="Mark all currently shown videos as completed"
                  style={{
                    backgroundColor: 'var(--bg-active)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--accent-green)',
                    borderRadius: '4px',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <CheckCircle2 size={13} /> Check All
                </button>

                <button
                  onClick={() => markBatch(displayedVideos, false)}
                  title="Uncheck all currently shown videos"
                  style={{
                    backgroundColor: 'var(--bg-active)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-dim)',
                    borderRadius: '4px',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <RotateCcw size={13} /> Reset
                </button>
              </div>
            </div>

            {/* Video Table List */}
            <div className="card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--bg-overlay)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.65rem 0.75rem', width: '45px' }}>Done</th>
                    <th style={{ padding: '0.65rem 0.75rem', width: '50px' }}>#</th>
                    <th style={{ padding: '0.65rem 0.75rem', width: '110px' }}>Module</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Video Title & Details</th>
                    <th style={{ padding: '0.65rem 0.75rem', width: '100px' }}>Duration</th>
                    <th style={{ padding: '0.65rem 0.75rem', width: '90px' }}>Status</th>
                    <th style={{ padding: '0.65rem 0.75rem', width: '85px' }}>Link</th>
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
                          {/* Checkbox */}
                          <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>
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
                              {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                            </button>
                          </td>

                          {/* Index */}
                          <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-dim)' }} className="mono">
                            {item.Index}
                          </td>

                          {/* Module Badge */}
                          <td style={{ padding: '0.65rem 0.75rem' }}>
                            <span className="badge badge-module" style={{ fontSize: '0.7rem' }}>
                              {item.Module || 'General'}
                            </span>
                          </td>

                          {/* Title & Topic Description */}
                          <td style={{ padding: '0.65rem 0.75rem' }}>
                            <div style={{ fontWeight: 600, color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: isCompleted ? 'line-through' : 'none' }}>
                              {item.Title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                              <span style={{ color: 'var(--accent-blue)', fontWeight: 500 }}>{item.Topic}</span>
                              {item.Reason && (
                                <span style={{ marginLeft: '0.5rem', color: 'var(--text-muted)' }}>
                                  — {item.Reason}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Duration */}
                          <td style={{ padding: '0.65rem 0.75rem', whiteSpace: 'nowrap' }} className="mono">
                            <div>{item.Duration} min</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                              {(item.Duration / playbackSpeed).toFixed(1)}m @ {playbackSpeed}x
                            </div>
                          </td>

                          {/* Status */}
                          <td style={{ padding: '0.65rem 0.75rem' }}>
                            <span className={`badge badge-${item.Status.toLowerCase()}`}>{item.Status}</span>
                          </td>

                          {/* YouTube Link */}
                          <td style={{ padding: '0.65rem 0.75rem' }}>
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
                                fontSize: '0.78rem',
                                padding: '0.2rem 0.45rem',
                                borderRadius: '4px',
                                backgroundColor: 'var(--bg-active)'
                              }}
                            >
                              Watch <ExternalLink size={12} />
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================== VIEW 3: DIRECTORY & DATASETS VIEW ===================== */}
        {activeTab === 'syllabus' && (
          <div>
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                  Curated Datasets & Refined Directory
                </h2>
                <span className="badge badge-optional mono">Last Updated: {appData.lastUpdatedDisplay}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                All filtered CSV datasets have been systematically compiled with pedagogical classification, YouTube links, and KTU module mappings, organized into clean subdirectories:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {/* File 1 */}
                <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--accent-blue)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Data_Structures_and_Algorithms_Study_Portions.csv</h4>
                    <span className="badge badge-core">270 Rows</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
                    Combined master study list for both S3 DSA and S5 DAA, classified by module, core/optional status, and YouTube links.
                  </p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }} className="mono">data/processed/Data_Structures_and_Algorithms_Study_Portions.csv</span>
                </div>

                {/* File 2 */}
                <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--accent-red)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Computer_Networks_Study_Portions.csv</h4>
                    <span className="badge badge-core">175 Rows</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
                    Curated study portions for S5 Computer Networks (PCCST501), classified into Modules 1 to 4 with core and optional badges.
                  </p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }} className="mono">data/processed/Computer_Networks_Study_Portions.csv</span>
                </div>

                {/* File 3 */}
                <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--accent-peach)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>S5_DAA_Study_Portions.csv</h4>
                    <span className="badge badge-theory">164 Rows</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
                    Standalone study playlist specifically for the S5 DAA Theory exam (Nov 27), including recurrences, AVL trees, and greedy/DP.
                  </p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }} className="mono">data/processed/S5_DAA_Study_Portions.csv</span>
                </div>

                {/* File 4 */}
                <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--accent-green)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>S3_DSA_Study_Portions.csv</h4>
                    <span className="badge badge-supply">163 Rows</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
                    Standalone study playlist specifically for S3 DSA Supply (Nov 30), focusing on Stacks, Queues, Trees, Heaps, and Sorting.
                  </p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }} className="mono">data/processed/S3_DSA_Study_Portions.csv</span>
                </div>

                {/* File 5 */}
                <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--accent-red)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Computer_Networks_Removed_Portions.csv</h4>
                    <span className="badge badge-removed">27 Rows</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
                    All eliminated CN videos (isolated GATE PYQ snippets, syllabus intro) with detailed reasons for removal.
                  </p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }} className="mono">data/processed/Computer_Networks_Removed_Portions.csv</span>
                </div>

                {/* File 6 */}
                <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--accent-red)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Data_Structures_and_Algorithms_Removed_Portions.csv</h4>
                    <span className="badge badge-removed">28 Rows</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
                    All eliminated DSA/DAA videos (excessive placement problems, LeetCode questions, multistage graphs) with reasons.
                  </p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }} className="mono">data/processed/Data_Structures_and_Algorithms_Removed_Portions.csv</span>
                </div>
              </div>
            </div>

            {/* Markdown Documentation Reference */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={18} color="var(--accent-purple)" /> Comprehensive Study Plan Documentation
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                A complete markdown breakdown is available at <strong>docs/SYLLABUS_ANALYSIS_AND_STUDY_PLAN.md</strong> with full course syllabus descriptions, pedagogical filtering criteria, and day-by-day exam roadmaps.
              </p>
              <div style={{ backgroundColor: 'var(--bg-overlay)', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--accent-blue)' }} className="mono">
                docs/SYLLABUS_ANALYSIS_AND_STUDY_PLAN.md
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-default)', backgroundColor: 'var(--bg-surface)', padding: '1rem 1.5rem', marginTop: '2rem' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          <div>
            <strong>EXAMER</strong> • Prepared for Vishnu Nandan • KTU CSE B.Tech Examination Suite • <span className="mono">Updated: {appData.lastUpdatedDisplay}</span>
          </div>
          <div>
            Repository: <code className="mono" style={{ color: 'var(--accent-blue)' }}>git@github.com:vishnunandan555/examer.git</code>
          </div>
        </div>
      </footer>
    </div>
  );
}
