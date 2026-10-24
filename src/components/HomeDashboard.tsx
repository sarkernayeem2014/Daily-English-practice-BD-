import React, { useState } from 'react';
import { CategoryId, Level, TierLevel, UserProgress } from '../types';
import { CATEGORIES } from '../data/categories';
import { ALL_SENTENCES, getSentencesByCategory } from '../data/sentences';
import { LEVEL_TIERS, getSentencesForTier, isTierUnlocked } from '../data/tiers';
import { BADGES } from '../data/badges';
import { BadgesShelf } from './BadgesShelf';
import { 
  Play, 
  RotateCcw, 
  Clock, 
  Home as HomeIcon, 
  GraduationCap, 
  ShoppingBag, 
  UtensilsCrossed, 
  Bus, 
  Users, 
  HelpCircle, 
  CalendarDays, 
  Sparkles,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Flame,
  ArrowRight,
  BookOpen,
  Filter,
  Zap,
  Lock,
  Unlock,
  Target,
  Award,
  Crown,
  Medal,
  ChevronRight,
  User,
  X
} from 'lucide-react';

interface HomeDashboardProps {
  progress: UserProgress;
  onStartTierPractice: (tier: TierLevel) => void;
  onStartCategoryPractice: (category: CategoryId | 'all', level: Level | 'all') => void;
  onOpenDailyChallenge: () => void;
  onOpenReview: () => void;
  onOpenBrowse: () => void;
  onOpenCertificate: () => void;
  onOpenLeaderboard?: () => void;
  onOpenGuide: () => void;
  isProfileCompleted?: boolean;
  onOpenProfile?: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Clock: <Clock className="w-5 h-5" />,
  Home: <HomeIcon className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5" />,
  UtensilsCrossed: <UtensilsCrossed className="w-5 h-5" />,
  Bus: <Bus className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  HelpCircle: <HelpCircle className="w-5 h-5" />,
  CalendarDays: <CalendarDays className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
};

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  progress,
  onStartTierPractice,
  onStartCategoryPractice,
  onOpenDailyChallenge,
  onOpenReview,
  onOpenBrowse,
  onOpenCertificate,
  onOpenLeaderboard,
  onOpenGuide,
  isProfileCompleted,
  onOpenProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'levels' | 'categories' | 'badges'>('levels');
  const [showProfileReminder, setShowProfileReminder] = useState(true);

  const totalSentences = ALL_SENTENCES.length;
  const attemptedCount = Object.keys(progress.attemptedIds).length;
  const correctCount = Object.keys(progress.correctIds).length;
  const struggleCount = Object.keys(progress.struggleIds).length;
  const accuracyRate = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  // Rank determination based on XP
  const getRankInfo = (xp: number) => {
    if (xp >= 3000) return { title: 'English Grandmaster', titleBn: 'ইংরেজি গ্র্যান্ডমাস্টার', level: 4, nextXp: 5000 };
    if (xp >= 1500) return { title: 'Fluency Champion', titleBn: 'সাবলীলতার চ্যাম্পিয়ন', level: 3, nextXp: 3000 };
    if (xp >= 500) return { title: 'Sentence Crafter', titleBn: 'দক্ষ বাক্য কারিগর', level: 2, nextXp: 1500 };
    return { title: 'Novice Explorer', titleBn: 'অনুসন্ধানী শিক্ষার্থী', level: 1, nextXp: 500 };
  };

  const rank = getRankInfo(progress.xp);
  const xpProgressPercent = Math.min(100, Math.round((progress.xp / rank.nextXp) * 100));

  const today = new Date().toISOString().split('T')[0];
  const isDailyDone = !!progress.completedDailyDates[today];

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Dismissible Profile Reminder Card */}
      {!isProfileCompleted && showProfileReminder && (
        <div className="rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-amber-50 border border-blue-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                আপনার প্রোফাইল এখনো সম্পূর্ণ করা হয়নি
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                স্কুল/কলেজ ও শ্রেণি যুক্ত করে আপনার লার্নিং প্রোফাইলটি সম্পূর্ণ করুন।
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <button
              onClick={onOpenProfile}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all active:scale-98 cursor-pointer whitespace-nowrap"
            >
              প্রোফাইল সম্পূর্ণ করুন
            </button>
            <button
              onClick={() => setShowProfileReminder(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
              title="রিমাইন্ডার বন্ধ করুন"
              aria-label="রিমাইন্ডার বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Gamified Hero Banner with XP Progress & Streak */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-900 text-white p-6 sm:p-10 shadow-xl shadow-blue-900/10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-blue-100 text-xs font-semibold border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>গ্যামিফাইড ইংরেজি অনুবাদ ও দক্ষতা অর্জন প্ল্যাটফর্ম</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              বাংলা থেকে ইংরেজি প্র্যাকটিস করে লেভেল আপ করুন!
            </h1>

            <p className="text-blue-100 text-sm sm:text-base leading-relaxed font-normal">
              ৬টি প্রগ্রেসিভ লেভেল, বাস্তব বাক্য এবং দৈনিক চ্যালেঞ্জ সমাধানের মাধ্যমে XP অর্জন করুন, ব্যাজ আনলক করুন ও অর্জন করুন কোর্স প্রশংসাপত্র।
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onStartTierPractice(progress.lastLevel || 1)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-blue-800 font-extrabold text-sm sm:text-base shadow-lg shadow-blue-950/20 hover:bg-blue-50 active:scale-98 transition-all"
              >
                <Play className="w-5 h-5 fill-blue-800" />
                <span>{progress.lastSentenceId ? 'যেখান থেকে ছেড়েছিলেন প্র্যাকটিস করুন' : 'লেভেল অনুশীলন শুরু করুন'}</span>
              </button>

              <button
                onClick={onOpenDailyChallenge}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm sm:text-base shadow-md active:scale-98 transition-all"
              >
                <Target className="w-5 h-5" />
                <span>আজকের দৈনিক চ্যালেঞ্জ</span>
              </button>

              {struggleCount > 0 && (
                <button
                  onClick={onOpenReview}
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-amber-500/90 hover:bg-amber-500 text-white font-bold text-sm active:scale-98 transition-all shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>ভুল সংশোধন ({struggleCount})</span>
                </button>
              )}
            </div>
          </div>

          {/* Gamified Profile Card */}
          <div className="w-full lg:w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 space-y-4 shrink-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-black shadow-md">
                  <Crown className="w-6 h-6 text-amber-950" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-blue-200">বর্তমান পদবী:</div>
                  <div className="text-sm font-extrabold text-white">{rank.titleBn}</div>
                </div>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-400 text-amber-950">
                Lvl {rank.level}
              </span>
            </div>

            {/* XP Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-blue-100 font-semibold">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> {progress.xp} XP
                </span>
                <span>লক্ষ্য: {rank.nextXp} XP</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${xpProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Streak & Personal Best */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/15 text-center text-xs">
              <div className="bg-white/10 p-2 rounded-xl">
                <span className="text-blue-200 block text-[10px]">চলতি স্ট্রিক</span>
                <span className="font-extrabold text-amber-300 flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" /> {progress.streakCount} দিন
                </span>
              </div>
              <div className="bg-white/10 p-2 rounded-xl">
                <span className="text-blue-200 block text-[10px]">ব্যক্তিগত সেরা</span>
                <span className="font-extrabold text-white flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" /> {progress.personalBestStreak} দিন
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 gap-2 w-full max-w-full">
        <div className="w-full sm:w-auto overflow-x-auto scrollbar-none py-0.5">
          <div className="inline-flex sm:flex items-center gap-1.5 sm:gap-2 p-1 bg-slate-100 rounded-2xl min-w-max">
            <button
              onClick={() => setActiveTab('levels')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                activeTab === 'levels'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-4 h-4 text-blue-600 shrink-0" />
              <span>প্রগ্রেসিভ লেভেলসমূহ <span className="hidden sm:inline">(Progressive Levels)</span></span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>১০টি বিষয়ভিত্তিক ক্যাটাগরি</span>
            </button>

            <button
              onClick={() => setActiveTab('badges')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                activeTab === 'badges'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500 shrink-0" />
              <span>সম্মাননা ব্যাজ ({Object.keys(progress.earnedBadges || {}).length}/{BADGES.length})</span>
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          {onOpenLeaderboard && (
            <button
              onClick={onOpenLeaderboard}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-blue-600" />
              <span>লিডারবোর্ড</span>
            </button>
          )}
          <button
            onClick={onOpenCertificate}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span>সার্টিফিকেট দেখুন</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Progressive Learning Levels */}
      {activeTab === 'levels' && (
        <section className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                ক্রমান্বয়ে আনলক হওয়া ৫টি লার্নিং লেভেল
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                প্রতিটি লেভেলের লক্ষ্য পূরণ করে পরবর্তী চ্যালেঞ্জ ও নতুন ব্যাজ আনলক করুন
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              মোট {totalSentences} বাক্য
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LEVEL_TIERS.map((tierInfo) => {
              const tierSentences = getSentencesForTier(tierInfo.tier);
              const tierCompleted = tierSentences.filter((s) => progress.correctIds[s.id]).length;
              const isUnlocked = isTierUnlocked(tierInfo.tier, progress.unlockedTiers);
              const percent = Math.min(100, Math.round((tierCompleted / tierInfo.targetCount) * 100));
              const isFinished = tierCompleted >= tierInfo.targetCount;

              return (
                <div
                  key={tierInfo.tier}
                  className={`relative bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all ${
                    isUnlocked
                      ? 'border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400'
                      : 'border-slate-200 bg-slate-50/60 opacity-80'
                  }`}
                >
                  <div>
                    {/* Header: Level Number & Lock / Unlock Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg bg-gradient-to-tr ${tierInfo.color} shadow-sm`}
                        >
                          L{tierInfo.tier}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">
                              {tierInfo.titleBn}
                            </h3>
                          </div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            {tierInfo.titleEn} • {tierInfo.targetCount}টি বাক্য
                          </p>
                        </div>
                      </div>

                      {isUnlocked ? (
                        isFinished ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> সম্পন্ন
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                            <Unlock className="w-3.5 h-3.5 text-blue-600" /> উন্মুক্ত
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-200 px-2.5 py-1 rounded-full">
                          <Lock className="w-3.5 h-3.5 text-slate-400" /> লকড
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                      {tierInfo.subtitleBn}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>অগ্রগতি:</span>
                      <span className="font-bold text-slate-800">
                        {tierCompleted} / {tierInfo.targetCount} সম্পন্ন ({percent}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 bg-gradient-to-r ${tierInfo.color}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {isUnlocked ? (
                      <button
                        onClick={() => onStartTierPractice(tierInfo.tier)}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                          isFinished
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 active:scale-98'
                        }`}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>{isFinished ? 'পুনরায় প্র্যাকটিস করুন' : 'লেভেল অনুশীলন করুন'}</span>
                      </button>
                    ) : (
                      <div className="p-2.5 bg-slate-100 rounded-xl text-center text-xs text-slate-500 font-medium">
                        🔒 আনলক শর্ত: লেভেল {tierInfo.tier - 1}-এর কমপক্ষে {tierInfo.requiredPrevCompleted}টি অনন্য বাক্য সম্পন্ন করতে হবে
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 2: Categories Grid */}
      {activeTab === 'categories' && (
        <section className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                ১০টি বিষয়ভিত্তিক ক্ষেত্র
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                যেকোনো নির্দিষ্ট বিষয় বেছে নিয়ে অনুশীলন করতে পারেন
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              মোট {totalSentences} বাক্য
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => {
              const catSentences = getSentencesByCategory(cat.id);
              const catCorrect = catSentences.filter((s) => progress.correctIds[s.id]).length;
              const percentage = Math.round((catCorrect / catSentences.length) * 100);

              return (
                <div
                  key={cat.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        {ICON_MAP[cat.iconName] || <BookOpen className="w-5 h-5" />}
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {catCorrect}/{catSentences.length}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{cat.nameBn}</h3>
                    <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {cat.nameEn}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {cat.descriptionBn}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3 overflow-hidden">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <button
                      onClick={() => onStartCategoryPractice(cat.id, 'all')}
                      className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>অনুশীলন করুন ({catSentences.length} বাক্য)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 3: Badges Shelf */}
      {activeTab === 'badges' && (
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs animate-in fade-in duration-200">
          <BadgesShelf progress={progress} />
        </section>
      )}

      {/* Daily Challenge Highlight Footer Box */}
      <section className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100 border border-orange-200/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-200 text-orange-900 text-xs font-bold">
            <Target className="w-3.5 h-3.5 text-orange-700" />
            <span>আজকের দৈনিক চ্যালেঞ্জ</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            প্রতিদিন ৫টি বাক্য প্র্যাকটিস করে ৭৫ XP ও ব্যাজ অর্জন করুন
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            কোনো দিন মিস করলেও কোনো নেগেটিভ পেনাল্টি নেই। নিজের সময়মতো ধারাবাহিকতা রক্ষা করুন।
          </p>
        </div>

        <button
          onClick={onOpenDailyChallenge}
          className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/20 active:scale-98 transition-all shrink-0 flex items-center gap-2"
        >
          <span>{isDailyDone ? 'আজকের চ্যালেঞ্জ পর্যালোচনা করুন' : '৫টি বাক্য শুরু করুন'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
