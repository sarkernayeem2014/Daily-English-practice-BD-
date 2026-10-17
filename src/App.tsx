import React, { useState, useEffect } from 'react';
import { CategoryId, Level, TierLevel, UserProgress, ViewMode } from './types';
import { DEFAULT_PROGRESS, loadProgress, saveProgress } from './utils/storage';
import { ALL_SENTENCES } from './data/sentences';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { PracticeView } from './components/PracticeView';
import { DailyChallengeView } from './components/DailyChallengeView';
import { ReviewView } from './components/ReviewView';
import { CategoryBrowser } from './components/CategoryBrowser';
import { CertificateView } from './components/CertificateView';
import { GuideView } from './components/GuideView';
import { ThemeSettingsModal } from './components/ThemeSettingsModal';
import { AuthModal } from './components/AuthModal';
import { AuthPage } from './components/AuthPage';
import { useAuth } from './context/AuthContext';
import {
  loadUserProgressFromFirestore,
  saveUserProgressToFirestore,
  mergeLocalAndCloudProgress,
} from './firebase/progressService';
import { BookOpen, Sparkles, Trophy } from 'lucide-react';

export default function App() {
  const { currentUser, loading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem('daily_english_practice_current_view');
      if (saved && ['dashboard', 'practice', 'daily', 'review', 'browse', 'certificate', 'guide'].includes(saved)) {
        return saved as ViewMode;
      }
    } catch {}
    return 'dashboard';
  });
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [practiceTier, setPracticeTier] = useState<TierLevel | undefined>(() => progress.lastLevel || 1);
  const [practiceCategory, setPracticeCategory] = useState<CategoryId | 'all'>('all');
  const [practiceLevel, setPracticeLevel] = useState<Level | 'all'>('all');
  const [isProgressLoading, setIsProgressLoading] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync currentView to localStorage for seamless refresh
  useEffect(() => {
    try {
      localStorage.setItem('daily_english_practice_current_view', currentView);
    } catch {}
  }, [currentView]);

  // Sync progress immediately to localStorage on any state change
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Synchronize with Firestore when user authenticates or changes
  useEffect(() => {
    if (!currentUser) {
      setIsProgressLoading(false);
      return;
    }

    let isMounted = true;
    setIsProgressLoading(true);

    const syncCloudProgress = async () => {
      try {
        const cloudProgress = await loadUserProgressFromFirestore(currentUser.uid);
        if (!isMounted) return;

        // Safely merge local and cloud progress (no XP loss)
        const merged = mergeLocalAndCloudProgress(loadProgress(), cloudProgress);
        setProgress(merged);
        saveProgress(merged);
        if (merged.lastLevel) {
          setPracticeTier(merged.lastLevel);
        }
        await saveUserProgressToFirestore(currentUser.uid, merged);
      } catch (err) {
        console.error('Failed to sync progress with Firestore:', err);
      } finally {
        if (isMounted) {
          setIsProgressLoading(false);
        }
      }
    };

    syncCloudProgress();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.uid]);

  // Synchronize across browser tabs or windows
  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if (
        e.key === 'daily_english_practice_bd_v2' ||
        e.key === 'daily_english_practice_xp' ||
        e.key === 'daily_english_practice_completed_ids'
      ) {
        setProgress(loadProgress());
      }
    };
    const handleBeforeUnload = () => {
      saveProgress(progress);
    };

    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [progress]);

  // Immediately and synchronously commit updates to localStorage and Firestore
  const updateProgress = (updater: (prev: UserProgress) => UserProgress) => {
    setProgress((prev) => {
      const next = updater(prev);
      saveProgress(next);
      if (currentUser?.uid) {
        saveUserProgressToFirestore(currentUser.uid, next).catch((err) => {
          console.error('Failed to sync updated progress to Firestore:', err);
        });
      }
      return next;
    });
  };

  const handleStartTierPractice = (tier: TierLevel) => {
    setPracticeTier(tier);
    setPracticeCategory('all');
    setPracticeLevel('all');
    setCurrentView('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartCategoryPractice = (category: CategoryId | 'all', level: Level | 'all') => {
    setPracticeTier(undefined);
    setPracticeCategory(category);
    setPracticeLevel(level);
    setCurrentView('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartPracticeSpecific = (_sentenceIds: string[]) => {
    setPracticeTier(undefined);
    setPracticeCategory('all');
    setPracticeLevel('all');
    setCurrentView('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Theme styling mapping
  const getThemeClasses = () => {
    switch (progress.theme) {
      case 'emerald':
        return 'bg-emerald-50/50 text-slate-800 selection:bg-emerald-600 selection:text-white';
      case 'indigo-gold':
        return 'bg-indigo-50/40 text-slate-800 selection:bg-indigo-700 selection:text-white';
      case 'midnight':
        return 'bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white';
      case 'classic':
      default:
        return 'bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white';
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('আপনি কি সত্যিই আপনার অগ্রগতি ও সমস্ত XP রিসেট করতে চান? এই কাজটির পর পূর্বের ডাটা ফেরত পাওয়া যাবে না।')) {
      const fresh = { ...DEFAULT_PROGRESS };
      setProgress(fresh);
      saveProgress(fresh);
      if (currentUser) {
        saveUserProgressToFirestore(currentUser.uid, fresh).catch((err) => {
          console.error('Failed to reset cloud progress:', err);
        });
      }
    }
  };

  // 1. Loading state while checking auth state with onAuthStateChanged OR loading user cloud progress (prevents flicker)
  if (loading || (currentUser && isProgressLoading)) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4" />
        <div className="text-center space-y-1">
          <h2 className="text-base font-bold text-slate-800">Daily English Practice BD</h2>
          <p className="text-xs text-slate-500 font-medium">আপনার অগ্রগতি ও লেভেল লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
        </div>
      </div>
    );
  }

  // 2. Login Gate: If user is NOT signed in, show only the full-screen Sign In / Sign Up page
  if (!currentUser) {
    return <AuthPage />;
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased ${getThemeClasses()}`}>
      {/* Top Gamified Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'practice') {
            setPracticeTier(progress.lastLevel || 1);
            setPracticeCategory('all');
            setPracticeLevel('all');
          }
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        progress={progress}
        totalSentences={ALL_SENTENCES.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetProgress={handleResetProgress}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {currentView === 'dashboard' && (
          <HomeDashboard
            progress={progress}
            onStartTierPractice={handleStartTierPractice}
            onStartCategoryPractice={handleStartCategoryPractice}
            onOpenDailyChallenge={() => {
              setCurrentView('daily');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenReview={() => {
              setCurrentView('review');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBrowse={() => {
              setCurrentView('browse');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCertificate={() => {
              setCurrentView('certificate');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenGuide={() => {
              setCurrentView('guide');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'practice' && (
          <PracticeView
            initialTier={practiceTier}
            initialCategory={practiceCategory}
            initialLevel={practiceLevel}
            progress={progress}
            onUpdateProgress={updateProgress}
            onBackToDashboard={() => setCurrentView('dashboard')}
            onOpenReview={() => setCurrentView('review')}
            onOpenCertificate={() => setCurrentView('certificate')}
          />
        )}

        {currentView === 'daily' && (
          <DailyChallengeView
            progress={progress}
            onUpdateProgress={updateProgress}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'review' && (
          <ReviewView
            progress={progress}
            onUpdateProgress={updateProgress}
            onStartPracticeSpecific={handleStartPracticeSpecific}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'browse' && (
          <CategoryBrowser
            progress={progress}
            onUpdateProgress={updateProgress}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'certificate' && (
          <CertificateView
            progress={progress}
            onUpdateProgress={updateProgress}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'guide' && (
          <GuideView
            progress={progress}
            onUpdateProgress={updateProgress}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}
      </main>

      {/* Theme and Accessibility Settings Modal */}
      {isSettingsOpen && (
        <ThemeSettingsModal
          progress={progress}
          onUpdateProgress={updateProgress}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal />


      {/* Footer */}
      <footer className="print:hidden bg-white/80 backdrop-blur-xs border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-800 text-sm">
              Daily English Practice BD
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500 font-medium">
              গ্যামিফাইড ইংরেজি অনুবাদ ও দক্ষতা অর্জন প্ল্যাটফর্ম
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
            <button
              onClick={() => {
                setCurrentView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-blue-600 transition-colors"
            >
              ড্যাশবোর্ড
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setCurrentView('daily');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-blue-600 transition-colors"
            >
              দৈনিক চ্যালেঞ্জ
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setCurrentView('certificate');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-blue-600 transition-colors"
            >
              প্রশংসাপত্র
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setCurrentView('guide');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-blue-600 transition-colors"
            >
              সেটআপ ও গিটহাব গাইড
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} Daily English Practice BD. উন্মুক্ত ও উৎসাহব্যঞ্জক ইংরেজি শিক্ষার উদ্যোগ।</p>
          <p>
            ইউনিকোড বাংলা ফন্ট • ব্রাউজার স্পিচ সিন্থেসাইজার • অফলাইন লোকালস্টোরেজ
          </p>
        </div>
      </footer>
    </div>
  );
}
