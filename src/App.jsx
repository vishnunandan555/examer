import React, { useState, useEffect, useMemo } from 'react';
import syllabusData from './data/syllabus_data.json';
import { getDaysLeft } from './utils/timeUtils';
import { getSubjectSyllabusStats } from './utils/syllabusUtils';
import { pullFromCloud, pushToCloud, getCloudConfig } from './services/cloudSync';

// Components
import Navbar from './components/common/Navbar';
import NavigationTabs from './components/common/NavigationTabs';
import PasscodeModal from './components/common/PasscodeModal';
import SettingsModal from './components/common/SettingsModal';

import DashboardView from './components/dashboard/DashboardView';
import SubjectSyllabusView from './components/syllabus/SubjectSyllabusView';
import ReferencesView from './components/references/ReferencesView';

// Production PIN is injected via PIN or VITE_PIN. If missing, no secret works.
const CONFIGURED_PIN = import.meta.env.VITE_PIN || '';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');

  // Syllabus Completion State
  const [completedMap, setCompletedMap] = useState(() => {
    try {
      const saved = localStorage.getItem('examer_syllabus_completed_v1');
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

  // Cloud Sync State
  const [cloudConfig, setCloudConfig] = useState(getCloudConfig);
  const [cloudSyncState, setCloudSyncState] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const [cloudMsg, setCloudMsg] = useState('');

  // Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem('examer_syllabus_completed_v1', JSON.stringify(completedMap));
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
          setCloudMsg('Pulled latest from cloud');
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

  // Dynamically compute syllabus stats for all 8 subjects
  const allSubjectStats = useMemo(() => {
    const statsMap = {};
    if (!syllabusData?.subjects) return statsMap;

    Object.entries(syllabusData.subjects).forEach(([key, subj]) => {
      const days = Math.max(1, getDaysLeft(subj.examDate));
      statsMap[key] = {
        data: subj,
        days,
        stats: getSubjectSyllabusStats(subj, completedMap, days)
      };
    });
    return statsMap;
  }, [completedMap]);

  // Active Subject Selection
  const currentSubject = useMemo(() => {
    if (activeTab && allSubjectStats[activeTab]) {
      return allSubjectStats[activeTab];
    }
    return null;
  }, [activeTab, allSubjectStats]);

  // Toggle Topic Completion with Subtopics and Smooth Animation
  const toggleComplete = (topicId, subtopicIds = []) => {
    const willBeCompleted = !completedMap[topicId];

    if (willBeCompleted && !showCompleted) {
      setAnimatingOutKeys((prev) => ({ ...prev, [topicId]: true }));
      setCompletedMap((prev) => {
        const next = { ...prev, [topicId]: true };
        subtopicIds.forEach((sid) => {
          next[sid] = true;
        });
        return next;
      });

      setTimeout(() => {
        setAnimatingOutKeys((prev) => {
          const next = { ...prev };
          delete next[topicId];
          return next;
        });
      }, 450);
    } else {
      if (animatingOutKeys[topicId]) {
        setAnimatingOutKeys((prev) => {
          const next = { ...prev };
          delete next[topicId];
          return next;
        });
      }
      setCompletedMap((prev) => {
        const next = { ...prev };
        if (willBeCompleted) {
          next[topicId] = true;
          subtopicIds.forEach((sid) => {
            next[sid] = true;
          });
        } else {
          delete next[topicId];
          subtopicIds.forEach((sid) => {
            delete next[sid];
          });
        }
        return next;
      });
    }
  };

  const toggleSubtopic = (topicId, subtopicId, allSubtopicIds = []) => {
    setCompletedMap((prev) => {
      const next = { ...prev };
      const willBeDone = !prev[subtopicId];

      if (willBeDone) {
        next[subtopicId] = true;
      } else {
        delete next[subtopicId];
      }

      // Check if all subtopics are completed
      const allDone = allSubtopicIds.length > 0 && allSubtopicIds.every((sid) => (sid === subtopicId ? willBeDone : !!next[sid]));
      if (allDone) {
        next[topicId] = true;
      } else {
        delete next[topicId];
      }

      return next;
    });
  };

  const markBatch = (topicIds, done) => {
    setCompletedMap((prev) => {
      const next = { ...prev };
      topicIds.forEach((id) => {
        if (done) next[id] = true;
        else delete next[id];
      });
      return next;
    });
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

  const availableSubjectIds = Object.keys(syllabusData.subjects);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Global Navigation Bar */}
      <Navbar
        lastUpdatedDisplay={syllabusData.lastUpdatedDisplay}
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
      />

      {/* 3. Main Views Container */}
      <main style={{ maxWidth: '1440px', width: '100%', margin: '1rem auto', padding: '0 1rem', flex: 1 }}>
        {activeTab === 'dashboard' && (
          <DashboardView
            allSubjectStats={allSubjectStats}
            timetable={syllabusData.examTimetable}
            lastUpdatedDisplay={syllabusData.lastUpdatedDisplay}
            availableSubjectIds={availableSubjectIds}
            onNavigate={(subjectId) => setActiveTab(subjectId)}
          />
        )}

        {currentSubject && (
          <SubjectSyllabusView
            subject={currentSubject.data}
            daysLeft={currentSubject.days}
            stats={currentSubject.stats}
            completedMap={completedMap}
            animatingOutKeys={animatingOutKeys}
            onToggleComplete={toggleComplete}
            onToggleSubtopic={toggleSubtopic}
            onMarkBatch={markBatch}
            showCompleted={showCompleted}
            setShowCompleted={setShowCompleted}
            lastUpdatedDisplay={syllabusData.lastUpdatedDisplay}
          />
        )}

        {activeTab === 'references' && (
          <ReferencesView lastUpdatedDisplay={syllabusData.lastUpdatedDisplay} />
        )}
      </main>

      {/* Settings Modal */}
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
        onInstallApp={handleInstallApp}
        canInstall={!!deferredPrompt}
      />
    </div>
  );
}
