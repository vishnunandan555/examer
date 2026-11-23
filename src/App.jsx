import React, { useState, useEffect, useMemo } from 'react';
import appData from './data/playlist_data.json';
import { SUBJECTS, UPCOMING_TIMETABLE } from './config/subjects';
import { getDaysLeft, formatTime } from './utils/timeUtils';
import { getItemKey, getSubjectStats, getTrackMetrics } from './utils/metricsUtils';
import { pullFromCloud, pushToCloud, getCloudConfig } from './services/cloudSync';

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

// Production PIN is injected via PIN or VITE_PIN. If missing, no secret works.
const CONFIGURED_PIN = import.meta.env.VITE_PIN || '';

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

  // Security Passcode State: Locks on reload/refresh for privacy
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Clean up legacy persistent unlock if present
  useEffect(() => {
    try {
      localStorage.removeItem('examer_unlocked_v1');
    } catch (e) {}
  }, []);

  const [passcode, setPasscode] = useState(() => {
    try {
      return localStorage.getItem('examer_passcode_v1') || CONFIGURED_PIN;
    } catch (e) {
      return CONFIGURED_PIN;
    }
  });

  const hasPinConfigured = Boolean(passcode && passcode.trim().length > 0);

  // Modal Dialogs State
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [expandedSyllabus, setExpandedSyllabus] = useState(false);

  // Multi-Device Cloud Sync State
  const [cloudConfig, setCloudConfig] = useState(getCloudConfig);
  const [cloudSyncState, setCloudSyncState] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const [cloudMsg, setCloudMsg] = useState('');

  // Progressive Web App (PWA) Install Prompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

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
    if (cloudConfig.enabled && cloudConfig.endpoint) {
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
  }, [completedMap, cloudConfig.enabled, cloudConfig.endpoint]);

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
  }, [isUnlocked, cloudConfig.enabled, cloudConfig.endpoint]);

  // Pre-filter playlists for all 7 subjects (No fake data for upcoming ones)
  const playlists = useMemo(() => {
    return {
      os: [],
      dbms: [],
      coa: [],
      cn: appData.cn_all || [],
      dsa: appData.dsa_all || [], // Unified Amit Khurana playlist
      aptitude: [],
      cprog: []
    };
  }, []);

  // Compute Subject Stats dynamically for all subjects
  const subjectsData = useMemo(() => {
    return SUBJECTS.map((sub) => {
      const list = playlists[sub.id] || [];
      const stats = getSubjectStats(list, completedMap, playbackSpeed);
      const days = Math.max(1, getDaysLeft(sub.targetDate));
      const metrics = getTrackMetrics(stats, days, activeViewMode, playbackSpeed);

      return {
        ...sub,
        list,
        stats,
        days,
        metrics,
        viewLabel: `View ${sub.shortName}`
      };
    });
  }, [playlists, completedMap, playbackSpeed, activeViewMode]);

  // Active Subject Metadata
  const currentSubjectData = useMemo(() => {
    const found = subjectsData.find((s) => s.id === activeTab);
    if (!found) return null;
    return {
      ...found,
      daysLeft: found.days,
      syllabusNote: found.sourceNote
    };
  }, [activeTab, subjectsData]);

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
  };

  // If locked, render Minimalist Passcode Gate
  if (!isUnlocked) {
    return (
      <PasscodeModal
        passcode={passcode}
        hasPinConfigured={hasPinConfigured}
        onUnlock={handleUnlock}
      />
    );
  }

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
        onInstallApp={handleInstallApp}
        canInstall={!!deferredPrompt}
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
            subjectsData={subjectsData}
            activeViewMode={activeViewMode}
            setActiveViewMode={setActiveViewMode}
            playbackSpeed={playbackSpeed}
            timeUnitMode={timeUnitMode}
            toggleTimeUnit={toggleTimeUnit}
            timetable={UPCOMING_TIMETABLE}
            lastUpdatedDisplay={appData.lastUpdatedDisplay}
            onNavigate={(tabId) => {
              setActiveTab(tabId);
              setSelectedModule('ALL');
            }}
          />
        )}

        {currentSubjectData && (
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
        onLockNow={handleLockDashboard}
        cloudConfig={cloudConfig}
        onManualPull={handleManualPull}
        onManualPush={handleManualPush}
        cloudSyncState={cloudSyncState}
        cloudMsg={cloudMsg}
        onInstallApp={handleInstallApp}
        canInstall={!!deferredPrompt}
      />

      <SyllabusModal
        isOpen={expandedSyllabus}
        onClose={() => setExpandedSyllabus(false)}
      />
    </div>
  );
}
