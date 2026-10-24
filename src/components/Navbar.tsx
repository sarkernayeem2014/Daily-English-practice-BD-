import React from 'react';
import { ViewMode, UserProgress } from '../types';
import { useAuth } from '../context/AuthContext';
import { UserProfileData } from '../firebase/authService';
import { 
  BookOpen, 
  RotateCcw, 
  Library, 
  Flame, 
  CheckCircle2, 
  Target, 
  Trophy, 
  Zap, 
  Palette,
  LogIn,
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  progress: UserProgress;
  totalSentences: number;
  onOpenSettings: () => void;
  onResetProgress?: () => void;
  onRequestLogout?: () => void;
  userProfile?: UserProfileData | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  progress,
  totalSentences: _totalSentences,
  onOpenSettings,
  userProfile,
}) => {
  const { currentUser, openAuthModal } = useAuth();

  const struggleCount = Object.keys(progress.struggleIds || {}).length;
  const bookmarkedCount = Object.keys(progress.bookmarkedIds || {}).length;
  const reviewCount = struggleCount + bookmarkedCount;

  const today = new Date().toISOString().split('T')[0];
  const isDailyDone = !!progress.completedDailyDates?.[today];

  const userDisplayName = userProfile?.fullName || userProfile?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'শিক্ষার্থী';
  const userInitials = (userDisplayName[0] || 'U').toUpperCase();
  const photoURL = userProfile?.photoURL || currentUser?.photoURL;

  // Navigation items specification
  const navItems = [
    {
      id: 'practice' as ViewMode,
      label: 'প্র্যাকটিস',
      icon: CheckCircle2,
      badge: null,
    },
    {
      id: 'daily' as ViewMode,
      label: 'দৈনিক চ্যালেঞ্জ',
      icon: Target,
      badge: !isDailyDone ? 'pulse' : 'done',
    },
    {
      id: 'review' as ViewMode,
      label: 'ভুল সংশোধন',
      icon: RotateCcw,
      badge: reviewCount > 0 ? reviewCount : null,
    },
    {
      id: 'browse' as ViewMode,
      label: 'লাইব্রেরি',
      icon: Library,
      badge: null,
    },
    {
      id: 'leaderboard' as ViewMode,
      label: 'লিডারবোর্ড',
      icon: Trophy,
      badge: null,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-100 w-full max-w-full">
      {/* ========================================================
          DESKTOP (768px and above): SINGLE-ROW LAYOUT
         ======================================================== */}
      <div className="hidden md:flex items-center justify-between h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-4">
        {/* Left: App Logo & Name */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-slate-900 tracking-tight whitespace-nowrap">
                Daily English Practice <span className="text-blue-600">BD</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden lg:block leading-none mt-0.5">
              বাংলা থেকে ইংরেজি অনুবাদ ও গ্যামিফাইড লার্নিং
            </p>
          </div>
        </div>

        {/* Center: Inline Navigation Bar */}
        <nav className="flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all cursor-pointer h-11 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  {item.badge === 'pulse' && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-white animate-pulse" />
                  )}
                  {item.badge === 'done' && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                  {typeof item.badge === 'number' && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: XP, Streak, Avatar (8px gap) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* XP Pill */}
          <div 
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-yellow-100/70 border border-amber-200/80 px-3 py-1.5 rounded-full text-amber-900 text-xs font-black shadow-2xs shrink-0"
            title="অর্জিত মোট অভিজ্ঞতা পয়েন্ট (XP)"
          >
            <Zap className="w-4 h-4 fill-amber-500 text-amber-600 shrink-0" />
            <span>{progress.xp} XP</span>
          </div>

          {/* Streak Pill */}
          <div 
            className="flex items-center gap-1 bg-gradient-to-r from-orange-50 to-amber-100/70 border border-orange-200/80 px-3 py-1.5 rounded-full text-orange-900 text-xs font-black shadow-2xs shrink-0"
            title={`বর্তমান স্ট্রিক: ${progress.streakCount} দিন`}
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 shrink-0" />
            <span>{progress.streakCount}</span>
          </div>

          {/* Profile Avatar Button / Sign In */}
          {!currentUser ? (
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ml-1 select-none touch-manipulation active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>লগইন</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {/* Theme Settings Button */}
              <button
                type="button"
                onClick={onOpenSettings}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                title="থিম ও সেটিংস"
                aria-label="থিম ও সেটিংস"
              >
                <Palette className="w-4 h-4" />
              </button>

              {/* Profile Avatar Button: Directly opens full Profile page */}
              <button
                type="button"
                onClick={() => onNavigate('profile')}
                className={`relative z-20 w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-indigo-600 transition-all shadow-sm cursor-pointer flex items-center justify-center select-none touch-manipulation hover:scale-105 active:scale-95 active:ring-2 active:ring-blue-400 active:ring-offset-2 ${
                  currentView === 'profile' ? 'ring-2 ring-blue-600 ring-offset-2 scale-105' : ''
                }`}
                title="আমার প্রোফাইল পেজ"
                aria-label="আমার প্রোফাইল পেজ"
              >
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt={userDisplayName}
                    className="w-full h-full rounded-full object-cover border border-white pointer-events-none select-none"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center border border-white pointer-events-none select-none">
                    {userInitials}
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          MOBILE (Under 768px): TWO-ROW CLEAN LAYOUT
         ======================================================== */}
      <div className="md:hidden flex flex-col w-full">
        {/* ROW 1: Height 60px */}
        <div className="h-[60px] flex items-center justify-between px-3 sm:px-4 w-full">
          {/* Left: Logo + "DEP BD" (or full name on 640px+) */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="sm:hidden font-black text-base tracking-tight text-slate-900 whitespace-nowrap">
                DEP <span className="text-blue-600">BD</span>
              </span>
              <span className="hidden sm:inline font-black text-lg tracking-tight text-slate-900 whitespace-nowrap">
                Daily English Practice <span className="text-blue-600">BD</span>
              </span>
            </div>
          </div>

          {/* Right: 8px gap: XP pill, Streak pill, Profile avatar button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* XP Pill */}
            <div 
              className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-yellow-100/80 border border-amber-200/80 px-2.5 py-1 rounded-full text-amber-900 text-xs font-black shadow-2xs shrink-0"
              title="অর্জিত মোট XP"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-600 shrink-0" />
              <span>{progress.xp}</span>
            </div>

            {/* Streak Pill */}
            <div 
              className="flex items-center gap-1 bg-gradient-to-r from-orange-50 to-amber-100/70 border border-orange-200/80 px-2.5 py-1 rounded-full text-orange-900 text-xs font-black shadow-2xs shrink-0"
              title={`স্ট্রিক: ${progress.streakCount} দিন`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 shrink-0" />
              <span>{progress.streakCount}</span>
            </div>

            {/* Theme Settings Button */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 transition-colors"
              title="থিম ও সেটিংস"
              aria-label="থিম ও সেটিংস"
            >
              <Palette className="w-4 h-4" />
            </button>

            {/* Profile Avatar Button (Directly opens full Profile page) */}
            {!currentUser ? (
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="h-9 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1 shrink-0 select-none touch-manipulation active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>লগইন</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('profile')}
                className={`relative z-20 w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-indigo-600 transition-all shadow-xs cursor-pointer flex items-center justify-center shrink-0 select-none touch-manipulation hover:scale-105 active:scale-95 active:ring-2 active:ring-blue-400 active:ring-offset-2 ${
                  currentView === 'profile' ? 'ring-2 ring-blue-600 ring-offset-2 scale-105' : ''
                }`}
                title="আমার প্রোফাইল পেজ"
                aria-label="আমার প্রোফাইল পেজ"
              >
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt={userDisplayName}
                    className="w-full h-full rounded-full object-cover border border-white pointer-events-none select-none"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center border border-white pointer-events-none select-none">
                    {userInitials}
                  </div>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ROW 2: Height 56px, full width, light gray-blue background strip */}
        <div className="h-[56px] w-full bg-slate-50/90 border-t border-slate-100 flex items-center">
          <div className="w-full overflow-x-auto scrollbar-none px-2">
            <nav className="grid grid-cols-5 w-full min-w-[340px] max-w-md mx-auto items-center h-full gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`relative flex flex-col items-center justify-center py-1 h-12 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-100/70 text-blue-700 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                      {item.badge === 'pulse' && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white animate-pulse" />
                      )}
                      {item.badge === 'done' && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                      {typeof item.badge === 'number' && (
                        <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center ring-1.5 ring-white shadow-xs">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] leading-tight font-semibold mt-0.5 whitespace-nowrap">
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
