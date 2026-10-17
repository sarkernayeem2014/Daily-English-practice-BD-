import React, { useState, useEffect, useRef } from 'react';
import { ViewMode, UserProgress } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  RotateCcw, 
  Library, 
  HelpCircle, 
  Flame, 
  CheckCircle2, 
  Target, 
  Trophy, 
  Zap, 
  Palette,
  LogIn,
  LogOut,
  X,
  RefreshCw,
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  progress: UserProgress;
  totalSentences: number;
  onOpenSettings: () => void;
  onResetProgress?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  progress,
  totalSentences: _totalSentences,
  onOpenSettings,
  onResetProgress,
}) => {
  const { currentUser, openAuthModal, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);

  const struggleCount = Object.keys(progress.struggleIds || {}).length;
  const bookmarkedCount = Object.keys(progress.bookmarkedIds || {}).length;
  const reviewCount = struggleCount + bookmarkedCount;

  const today = new Date().toISOString().split('T')[0];
  const isDailyDone = !!progress.completedDailyDates?.[today];

  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'শিক্ষার্থী';
  const userInitials = (userDisplayName[0] || 'U').toUpperCase();

  // Close dropdown on outside click or Esc key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

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
      id: 'certificate' as ViewMode,
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
              onClick={() => openAuthModal('signin')}
              className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ml-1"
            >
              <LogIn className="w-4 h-4" />
              <span>লগইন</span>
            </button>
          ) : (
            <div className="relative">
              <button
                ref={avatarButtonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-indigo-600 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer flex items-center justify-center"
                title={`${userDisplayName} - প্রোফাইল মেনু`}
                aria-label="ইউজার প্রোফাইল মেনু"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={userDisplayName}
                    className="w-full h-full rounded-full object-cover border border-white"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center border border-white">
                    {userInitials}
                  </div>
                )}
              </button>

              {/* Desktop Profile Dropdown Card */}
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 top-13 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  {/* Dropdown User Info */}
                  <div className="p-3 bg-slate-50/80 rounded-xl mb-2 flex items-center gap-3">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={userDisplayName}
                        className="w-11 h-11 rounded-full object-cover border border-blue-200 shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center shrink-0">
                        {userInitials}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {userDisplayName}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {currentUser.email}
                      </div>
                      <div className="text-[10px] text-blue-600 font-semibold flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> ক্লাউড সিঙ্কড
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        onNavigate('guide');
                        setIsDropdownOpen(false);
                      }}
                      className="min-h-[48px] w-full flex items-center justify-between px-3 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                        <span>সাহায্য ও ব্যবহার নির্দেশিকা</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        onOpenSettings();
                        setIsDropdownOpen(false);
                      }}
                      className="min-h-[48px] w-full flex items-center justify-between px-3 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Palette className="w-5 h-5 text-blue-600 shrink-0" />
                        <span>থিম ও সাউন্ড পরিবর্তন</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        onResetProgress?.();
                        setIsDropdownOpen(false);
                      }}
                      className="min-h-[48px] w-full flex items-center justify-between px-3 rounded-xl hover:bg-amber-50/70 text-amber-800 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <RefreshCw className="w-5 h-5 text-amber-600 shrink-0" />
                        <span>প্রগ্রেস রিসেট</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-amber-500" />
                    </button>
                  </div>

                  <div className="my-2 border-t border-slate-100" />

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      signOut();
                      setIsDropdownOpen(false);
                    }}
                    className="min-h-[48px] w-full flex items-center gap-3 px-3 rounded-xl hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <LogOut className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>লগআউট (Sign Out)</span>
                  </button>
                </div>
              )}
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

            {/* Profile Avatar Button (40x40, rounded-full, thin gradient ring) */}
            {!currentUser ? (
              <button
                onClick={() => openAuthModal('signin')}
                className="h-9 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1 shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>লগইন</span>
              </button>
            ) : (
              <button
                ref={avatarButtonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-indigo-600 active:scale-95 transition-all shadow-xs cursor-pointer flex items-center justify-center shrink-0"
                title={`${userDisplayName} - প্রোফাইল মেনু`}
                aria-label="ইউজার প্রোফাইল মেনু"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={userDisplayName}
                    className="w-full h-full rounded-full object-cover border border-white"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center border border-white">
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

      {/* ========================================================
          MOBILE PROFILE BOTTOM SHEET
         ======================================================== */}
      {isDropdownOpen && currentUser && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Dimmed Backdrop */}
          <div 
            onClick={() => setIsDropdownOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          />

          {/* Bottom Sheet Modal */}
          <div
            ref={dropdownRef}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t border-slate-100 p-5 z-50 animate-in slide-in-from-bottom duration-200 max-h-[85vh] overflow-y-auto"
          >
            {/* Drag Pill Handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

            {/* Sheet Header with Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={userDisplayName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shrink-0">
                    {userInitials}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {userDisplayName}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">
                    {currentUser.email}
                  </p>
                  <div className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> ক্লাউড সিঙ্কড
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsDropdownOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sheet Actions List (each item >= 48px tall) */}
            <div className="py-2 space-y-1">
              <button
                onClick={() => {
                  onNavigate('guide');
                  setIsDropdownOpen(false);
                }}
                className="min-h-[48px] w-full flex items-center justify-between px-3.5 rounded-2xl hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-semibold text-sm transition-colors text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">সাহায্য</div>
                    <div className="text-xs text-slate-500">অ্যাপের ব্যবহার নির্দেশিকা ও নিয়মাবলী</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  onOpenSettings();
                  setIsDropdownOpen(false);
                }}
                className="min-h-[48px] w-full flex items-center justify-between px-3.5 rounded-2xl hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-semibold text-sm transition-colors text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">থিম পরিবর্তন</div>
                    <div className="text-xs text-slate-500">ডার্ক মোড, কালার থিম ও সাউন্ড সেটিংস</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  onResetProgress?.();
                  setIsDropdownOpen(false);
                }}
                className="min-h-[48px] w-full flex items-center justify-between px-3.5 rounded-2xl hover:bg-amber-50 active:bg-amber-100/70 text-amber-900 font-semibold text-sm transition-colors text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-amber-950">প্রগ্রেস রিসেট</div>
                    <div className="text-xs text-amber-700">অগ্রগতি ও স্কোর পুনরায় নতুন করে শুরু করুন</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-500" />
              </button>
            </div>

            <div className="my-2 border-t border-slate-100" />

            {/* Logout Action */}
            <button
              onClick={() => {
                signOut();
                setIsDropdownOpen(false);
              }}
              className="min-h-[48px] w-full flex items-center gap-3.5 px-3.5 rounded-2xl bg-rose-50/70 hover:bg-rose-100/80 text-rose-600 font-bold text-sm transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <span>লগআউট (Sign Out)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
