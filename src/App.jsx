import React, { useState, useEffect, useMemo } from 'react';
import appData from './data/playlist_data.json';
import { getDaysLeft, formatTime } from './utils/timeUtils';
import { getItemKey, getSubjectStats, getTrackMetrics } from './utils/metricsUtils';
import { pullFromCloud, pushToCloud, getCloudConfig, saveCloudConfig } from './services/cloudSync';

// Common Components
import Navbar from './components/common/Navbar';
import NavigationTabs from './components/common/NavigationTabs';
import PasscodeModal from './components/common/PasscodeModal';
import SettingsModal from './components/common/SettingsModal';
import SyllabusModal from './components/common/SyllabusModal';

// Views
import DashboardView from './components/dashboard/DashboardView';
import SubjectView from './components/subject/SubjectView';
import DatasetsView from './components/datasets/DatasetsView';

export default function App() {
  // Navigation & View Mode State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeViewMode, setActiveViewMode] = useState(() => {
    try {
      return localStorage.getItem('examer_active_track_v1') || 'study';
    } catch (e) {
      return 'study';
    }
  });

  const [selectedModule, setSelectedModule] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Speed & Time Formatting Preferences
  const [playbackSpeed, setPlaybackSpeed] = useState(() => {
    try {
      const saved = localStorage.getItem('examer_playback_speed_v1');
      return saved ? parseFloat(saved) : 1.5;
    } catch (e) {
      return 1.5;
    }
  });

  const [timeUnitMode, setTimeUnitMode] = useState(() => {
    try {
      return localStorage.getItem('examer_time_unit_v1') || 'hrs';
    } catch (e) {
      return 'hrs';
    }
  });

  // Completion State
  const [completedMap, setCompletedMap] = useState(() => {
    try {
      const saved = localStorage.getItem('examer_completed_v1');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [showCompleted, setShowCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('examer_show_completed_v1');
      return saved !== null ? saved === 'true' : true;
    } catch (e) {
      return true;
    }
  });

  const [animatingOutKeys, setAnimatingOutKeys] = useState({});

  // Security Passcode State
  const [isUnlocked, setIsUnlocked] = useState(() => {
    try {
      return localStorage.getItem('examer_unlocked_v1') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [passcode, setPasscode] = useState(() => {
    try {
      return localStorage.getItem('examer_passcode_v1') || '2026';
    } catch (e) {
      return '2026';
    }
  });

  // Modal Dialogs State
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [expandedSyllabus, setExpandedSyllabus] = useState(false);

  // Multi-Device Cloud Sync State
  const [cloudConfig, setCloudConfig] = useState(getCloudConfig);
  const [cloudSyncState, setCloudSyncState] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const [cloudMsg, setCloudMsg] = useState('');

  // LocalStorage Synchronization Effects
  useEffect(() => {
    try {
      localStorage.setItem('examer_active_track_v1', activeViewMode);
    } catch (e) {}
  }, [activeViewMode]);

  useEffect(() => {
    try {
      localStorage.setItem('examer_playback_speed_v1', String(playbackSpeed));
    } catch (e) {}
  }, [playbackSpeed]);

  useEffect(() => {
    try {
      localStorage.setItem('examer_time_unit_v1', timeUnitMode);
    } catch (e) {}
  }, [timeUnitMode]);

  useEffect(() => {
    try {
      localStorage.setItem('examer_completed_v1', JSON.stringify(completedMap));
    } catch (e) {}

    // Auto-sync to cloud when online and configured
    if (cloudConfig.enabled && cloudConfig.endpoint && cloudConfig.token) {
      setCloudSyncState('syncing');
      pushToCloud(completedMap)
        .then(() => {
          setCloudSyncState('synced');
          setCloudMsg(`Synced at ${new Date().toLocaleTimeString()}`);
        })
        .catch((err) => {
          setCloudSyncState('error');
          setCloudMsg(err.message);
        });
    }
  }, [completedMap]);

  useEffect(() => {
    try {
      localStorage.setItem('examer_show_completed_v1', String(showCompleted));
    } catch (e) {}
  }, [showCompleted]);

  // Pull from Cloud on Initial Unlock
  useEffect(() => {
    if (!isUnlocked || !cloudConfig.enabled || !cloudConfig.endpoint) return;

    let isMounted = true;
    setCloudSyncState('syncing');
    pullFromCloud()
      .then((remoteData) => {
        if (!isMounted) return;
        if (remoteData && typeof remoteData === 'object') {
          setCompletedMap((prev) => ({
            ...prev,
            ...remoteData
          }));
          setCloudSyncState('synced');
          setCloudMsg(`Pulled latest from cloud`);
        } else {
          setCloudSyncState('synced');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setCloudSyncState('error');
        setCloudMsg(err.message);
      });

    return () => {
      isMounted = false;
    };
  }, [isUnlocked, cloudConfig.enabled]);

  // Pre-filter playlists
  const playlists = useMemo(() => {
    const dsaAll = appData.dsa_all;
    const cnAll = appData.cn_all;

    const cn = cnAll;
    const daa = dsaAll.filter((v) => v.Subject === 'S5 DAA' || v.Subject === 'Both');
    const dsa = dsaAll.filter((v) => v.Subject === 'S3 DSA' || v.Subject === 'Both');

    return { cn, daa, dsa, dsaAll };
  }, []);

  // Compute Subject Stats dynamically
  const cnStats = useMemo(() => getSubjectStats(playlists.cn, completedMap, playbackSpeed), [playlists.cn, completedMap, playbackSpeed]);
  const daaStats = useMemo(() => getSubjectStats(playlists.daa, completedMap, playbackSpeed), [playlists.daa, completedMap, playbackSpeed]);
  const dsaStats = useMemo(() => getSubjectStats(playlists.dsa, completedMap, playbackSpeed), [playlists.dsa, completedMap, playbackSpeed]);

  // Active Subject Metadata
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

  // Active Subject Pace calculation
  const activePaceData = useMemo(() => {
    if (!currentSubjectData) return { pace: 0, color: '#4ade80', stress: 'Relaxed', trackLabel: 'Core Track', hasWarning: false };
    const m = getTrackMetrics(currentSubjectData.stats, currentSubjectData.daysLeft, activeViewMode, playbackSpeed);
    return {
      pace: m.pace,
      color: m.paceColor,
      stress: m.stress,
      trackLabel: m.trackName,
      hasWarning: m.hasWarning
    };
  }, [currentSubjectData, activeViewMode, playbackSpeed]);

  // Filtered Video List for Active Tab
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

    // Filter out completed videos if showCompleted is off (unless currently animating out)
    if (!showCompleted) {
      items = items.filter((v) => {
        const key = getItemKey(v);
        const isDone = !!completedMap[key];
        const isAnimating = !!animatingOutKeys[key];
        return !isDone || isAnimating;
      });
    }

    return items;
  }, [currentSubjectData, activeViewMode, selectedModule, searchQuery, showCompleted, completedMap, animatingOutKeys]);

  // Video completion toggle with smooth removal animation
  const toggleComplete = (itemKey) => {
    const willBeCompleted = !completedMap[itemKey];

    if (willBeCompleted && !showCompleted) {
      setAnimatingOutKeys((prev) => ({ ...prev, [itemKey]: true }));
      setCompletedMap((prev) => ({
        ...prev,
        [itemKey]: true
      }));

      setTimeout(() => {
        setAnimatingOutKeys((prev) => {
          const next = { ...prev };
          delete next[itemKey];
          return next;
        });
      }, 450);
    } else {
      if (animatingOutKeys[itemKey]) {
        setAnimatingOutKeys((prev) => {
          const next = { ...prev };
          delete next[itemKey];
          return next;
        });
      }
      setCompletedMap((prev) => ({
        ...prev,
        [itemKey]: !prev[itemKey]
      }));
    }
  };

  const markBatch = (items, done) => {
    setCompletedMap((prev) => {
      const next = { ...prev };
      items.forEach((item) => {
        const key = getItemKey(item);
        if (done) next[key] = true;
        else delete next[key];
      });
      return next;
    });
  };

  const toggleTimeUnit = () => {
    setTimeUnitMode((prev) => (prev === 'days' ? 'hrs' : 'days'));
  };

  const handleManualPull = async () => {
    setCloudSyncState('syncing');
    try {
      const remote = await pullFromCloud();
      if (remote && typeof remote === 'object') {
        setCompletedMap((prev) => ({ ...prev, ...remote }));
        setCloudSyncState('synced');
        setCloudMsg(`Successfully pulled ${Object.keys(remote).length} completion records.`);
      }
    } catch (e) {
      setCloudSyncState('error');
      setCloudMsg(e.message);
    }
  };

  const handleManualPush = async () => {
    setCloudSyncState('syncing');
    try {
      await pushToCloud(completedMap);
      setCloudSyncState('synced');
      setCloudMsg(`Successfully pushed ${Object.keys(completedMap).length} records to cloud.`);
    } catch (e) {
      setCloudSyncState('error');
      setCloudMsg(e.message);
    }
  };

  const handleLockDashboard = () => {
    setIsUnlocked(false);
    try {
      localStorage.removeItem('examer_unlocked_v1');
    } catch (e) {}
    setShowSettingsModal(false);
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    try {
      localStorage.setItem('examer_unlocked_v1', 'true');
    } catch (e) {}
  };

  // If locked, render Minimalist Passcode Gate
  if (!isUnlocked) {
    return <PasscodeModal passcode={passcode} onUnlock={handleUnlock} />;
  }

  // Dashboard pre-computed metrics
  const cnDays = Math.max(1, getDaysLeft('2026-11-23'));
  const daaDays = Math.max(1, getDaysLeft('2026-11-27'));
  const dsaDays = Math.max(1, getDaysLeft('2026-11-30'));

  const cnMetrics = getTrackMetrics(cnStats, cnDays, activeViewMode, playbackSpeed);
  const daaMetrics = getTrackMetrics(daaStats, daaDays, activeViewMode, playbackSpeed);
  const dsaMetrics = getTrackMetrics(dsaStats, dsaDays, activeViewMode, playbackSpeed);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Global Navigation Bar */}
      <Navbar
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={setPlaybackSpeed}
        lastUpdatedDisplay={appData.lastUpdatedDisplay}
        cloudSyncState={cloudSyncState}
        cloudConfig={cloudConfig}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* 2. Primary Tab Switcher */}
      <NavigationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSyllabusModal={() => setExpandedSyllabus(true)}
      />

      {/* 3. Main Views Container */}
      <main style={{ maxWidth: '1440px', width: '100%', margin: '1rem auto', padding: '0 1rem', flex: 1 }}>
        {activeTab === 'dashboard' && (
          <DashboardView
            cnStats={cnStats}
            cnDays={cnDays}
            cnMetrics={cnMetrics}
            daaMetrics={daaMetrics}
            daaDays={daaDays}
            dsaMetrics={dsaMetrics}
            dsaDays={dsaDays}
            activeViewMode={activeViewMode}
            setActiveViewMode={setActiveViewMode}
            playbackSpeed={playbackSpeed}
            timeUnitMode={timeUnitMode}
            toggleTimeUnit={toggleTimeUnit}
            timetable={appData.examTimetable}
            lastUpdatedDisplay={appData.lastUpdatedDisplay}
            onNavigate={(tabId) => {
              setActiveTab(tabId);
              setSelectedModule('ALL');
            }}
          />
        )}

        {(activeTab === 'cn' || activeTab === 'daa' || activeTab === 'dsa') && currentSubjectData && (
          <SubjectView
            activeTab={activeTab}
            subjectData={currentSubjectData}
            activeViewMode={activeViewMode}
            setActiveViewMode={setActiveViewMode}
            activePaceData={activePaceData}
            selectedModule={selectedModule}
            setSelectedModule={setSelectedModule}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            displayedVideos={displayedVideos}
            completedMap={completedMap}
            animatingOutKeys={animatingOutKeys}
            onToggleComplete={toggleComplete}
            onMarkBatch={markBatch}
            showCompleted={showCompleted}
            setShowCompleted={setShowCompleted}
            playbackSpeed={playbackSpeed}
            timeUnitMode={timeUnitMode}
            toggleTimeUnit={toggleTimeUnit}
            lastUpdatedDisplay={appData.lastUpdatedDisplay}
            onOpenSyllabusModal={() => setExpandedSyllabus(true)}
          />
        )}

        {activeTab === 'datasets' && (
          <DatasetsView
            appData={appData}
            playlists={playlists}
            lastUpdatedDisplay={appData.lastUpdatedDisplay}
          />
        )}
      </main>

      {/* Modals */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        passcode={passcode}
        setPasscode={setPasscode}
        onLockDashboard={handleLockDashboard}
        cloudConfig={cloudConfig}
        setCloudConfig={setCloudConfig}
        onManualPull={handleManualPull}
        onManualPush={handleManualPush}
        cloudSyncState={cloudSyncState}
        cloudMsg={cloudMsg}
      />

      <SyllabusModal
        isOpen={expandedSyllabus}
        onClose={() => setExpandedSyllabus(false)}
      />
    </div>
  );
}
