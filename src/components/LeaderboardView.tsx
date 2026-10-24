import React, { useState, useEffect } from 'react';
import { UserProgress, LeaderboardEntry } from '../types';
import { fetchLeaderboardEntries, syncUserToLeaderboard, getSavedNickname } from '../services/leaderboardService';
import { computeCompletedLevelsCount } from '../data/tiers';
import { NicknameModal } from './NicknameModal';
import { useAuth } from '../context/AuthContext';
import { 
  Trophy, 
  ArrowLeft, 
  Zap, 
  RotateCcw, 
  Edit3, 
  Medal, 
  Crown, 
  Award, 
  ArrowUpRight, 
  ShieldCheck, 
  Play,
  Users
} from 'lucide-react';

interface LeaderboardViewProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onBackToDashboard: () => void;
  onStartPractice: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  progress,
  onUpdateProgress,
  onBackToDashboard,
  onStartPractice,
}) => {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentUserEntry, setCurrentUserEntry] = useState<LeaderboardEntry | undefined>(undefined);
  const [currentUserRank, setCurrentUserRank] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState<boolean>(false);

  const currentUserId = currentUser?.uid;
  const effectiveName = currentUser?.displayName || progress.nickname || getSavedNickname() || 'শিক্ষার্থী';
  const levelCompleted = computeCompletedLevelsCount(progress.correctIds, progress.earnedBadges);

  const loadData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      // 1. Sync current authenticated user's latest points and level to Firestore
      if (currentUserId) {
        await syncUserToLeaderboard(
          currentUserId,
          effectiveName,
          progress.xp,
          levelCompleted
        );
      }

      // 2. Fetch top 10 from Firestore leaderboard collection
      const result = await fetchLeaderboardEntries(currentUserId);
      setEntries(result.top10);
      setCurrentUserRank(result.currentUserRank);
      setCurrentUserEntry(result.currentUserEntry);
    } catch (err) {
      console.error('Failed to load Firestore leaderboard data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-prompt nickname modal on first visit if user has no saved nickname or profile name
    if (!progress.nickname && !getSavedNickname() && !currentUser?.displayName) {
      setIsNicknameModalOpen(true);
    }
  }, [currentUserId, progress.xp]);

  const handleSaveNickname = async (newNickname: string) => {
    onUpdateProgress((prev) => ({
      ...prev,
      nickname: newNickname,
    }));

    if (currentUserId) {
      await syncUserToLeaderboard(
        currentUserId,
        newNickname,
        progress.xp,
        levelCompleted
      );
    }

    await loadData();
    setIsNicknameModalOpen(false);
  };

  // Helper for medal icon rendering with 🥇, 🥈, 🥉
  const renderMedal = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center">
          <span className="text-2xl drop-shadow-xs" role="img" aria-label="1st place gold medal">🥇</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center">
          <span className="text-2xl drop-shadow-xs" role="img" aria-label="2nd place silver medal">🥈</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center">
          <span className="text-2xl drop-shadow-xs" role="img" aria-label="3rd place bronze medal">🥉</span>
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center border border-slate-200">
        #{rank}
      </div>
    );
  };

  // Check if current user is present in top 10
  const isUserInTop10 = entries.some(
    (e) => (currentUserId && e.uid === currentUserId) || (currentUserRank && currentUserRank <= 10)
  );
  const tenthPlacePoints = entries.length >= 10 ? entries[9].totalPoints : 0;
  const pointsNeededForTop10 = Math.max(0, tenthPlacePoints - progress.xp + 15);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2.5 rounded-2xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="ড্যাশবোর্ডে ফিরুন"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>লিডারবোর্ড (Leaderboard)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              শীর্ষ অনুবাদক ও স্কোরবোর্ড
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              বাংলা থেকে ইংরেজি অনুবাদের শীর্ষ ১০ জনের রিয়েল-টাইম অবস্থান ও পয়েন্ট
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          <button
            onClick={() => setIsNicknameModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            title="ডাকনাম পরিবর্তন করুন"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
            <span>ডাকনাম পরিবর্তন</span>
          </button>

          <button
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            title="স্কোর রিফ্রেশ করুন"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          <button
            onClick={onStartPractice}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-98 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>অনুশীলন করুন</span>
          </button>
        </div>
      </div>

      {/* Top 3 Podium Highlights Grid (renders when entries exist) */}
      {entries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 2nd Place (Silver) */}
          {entries[1] ? (
            <div className="order-2 sm:order-1 bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-slate-200 p-5 text-center flex flex-col justify-between shadow-xs relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-300" />
              <div className="flex flex-col items-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-xl ring-4 ring-slate-100 shadow-sm">
                  🥈
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  ২য় স্থান (Silver)
                </span>
                <h3 className="font-extrabold text-slate-900 text-base truncate max-w-[180px]">
                  {entries[1].name}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-800 font-extrabold text-sm">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-600" />
                <span>{entries[1].totalPoints} XP</span>
                {entries[1].levelCompleted > 0 && (
                  <span className="text-xs text-slate-400 font-medium">({entries[1].levelCompleted} লেভেল সম্পন্ন)</span>
                )}
              </div>
            </div>
          ) : (
            <div className="order-2 sm:order-1 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 p-5 text-center flex flex-col items-center justify-center min-h-[160px] text-slate-400">
              <span className="text-2xl mb-1">🥈</span>
              <p className="text-xs font-semibold">২য় স্থান এখনও খালি</p>
            </div>
          )}

          {/* 1st Place (Gold) - Elevated & Prominent */}
          {entries[0] && (
            <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-50/70 via-white to-amber-50/30 rounded-3xl border-2 border-amber-300 p-5 text-center flex flex-col justify-between shadow-md shadow-amber-500/10 relative overflow-hidden sm:-translate-y-2">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />
              <div className="flex flex-col items-center space-y-2">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/30 ring-4 ring-amber-200 animate-pulse duration-1000">
                    👑
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                    #১
                  </div>
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/80 px-3 py-0.5 rounded-full border border-amber-300">
                  🥇 চ্যাম্পিয়ন (Gold)
                </span>
                <h3 className="font-black text-slate-900 text-lg truncate max-w-[200px]">
                  {entries[0].name}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-200/80 flex items-center justify-center gap-1.5 text-amber-900 font-black text-base">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-600" />
                <span>{entries[0].totalPoints} XP</span>
                {entries[0].levelCompleted > 0 && (
                  <span className="text-xs text-amber-700 font-bold">({entries[0].levelCompleted} লেভেল সম্পন্ন)</span>
                )}
              </div>
            </div>
          )}

          {/* 3rd Place (Bronze) */}
          {entries[2] ? (
            <div className="order-3 bg-gradient-to-b from-amber-50/30 to-white rounded-3xl border border-amber-200/70 p-5 text-center flex flex-col justify-between shadow-xs relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-600" />
              <div className="flex flex-col items-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xl ring-4 ring-amber-50 shadow-sm">
                  🥉
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/60 px-2.5 py-0.5 rounded-full">
                  ৩য় স্থান (Bronze)
                </span>
                <h3 className="font-extrabold text-slate-900 text-base truncate max-w-[180px]">
                  {entries[2].name}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-800 font-extrabold text-sm">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-600" />
                <span>{entries[2].totalPoints} XP</span>
                {entries[2].levelCompleted > 0 && (
                  <span className="text-xs text-slate-400 font-medium">({entries[2].levelCompleted} লেভেল সম্পন্ন)</span>
                )}
              </div>
            </div>
          ) : (
            <div className="order-3 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 p-5 text-center flex flex-col items-center justify-center min-h-[160px] text-slate-400">
              <span className="text-2xl mb-1">🥉</span>
              <p className="text-xs font-semibold">৩য় স্থান এখনও খালি</p>
            </div>
          )}
        </div>
      )}

      {/* Main Leaderboard Table: Top 10 */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              শীর্ষ ১০ জন শিক্ষার্থীর র‍্যাংকিং তালিকা
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            প্রতিটি সঠিক অনুবাদ = ১৫ পয়েন্ট
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">লিডারবোর্ডের ফলাফল লোড হচ্ছে...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto ring-8 ring-blue-50/50">
              <Users className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h4 className="text-base font-extrabold text-slate-900">
                এখনও কোনো প্রতিযোগী স্কোর সেভ করেননি
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                অনুশীলন শুরু করে সঠিক উত্তর দিন এবং লিডারবোর্ডের প্রথম স্থানটি অর্জন করুন!
              </p>
            </div>
            <button
              onClick={onStartPractice}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 active:scale-98 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>প্রথম স্থান দখল করতে অনুশীলন শুরু করুন</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {/* Table Header Row */}
            <div className="grid grid-cols-12 gap-2 px-4 sm:px-6 py-3 text-[11px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/50 min-w-[500px]">
              <div className="col-span-2 text-center">র‍্যাংক</div>
              <div className="col-span-6">শিক্ষার্থী (নাম/ডাকনাম)</div>
              <div className="col-span-2 text-center">সম্পন্ন লেভেল</div>
              <div className="col-span-2 text-right">পয়েন্ট (XP)</div>
            </div>

            {/* Top 10 Participant Rows */}
            {entries.map((entry, index) => {
              const rank = index + 1;
              const isCurrent = (currentUserId && entry.uid === currentUserId) || entry.isCurrentUser;

              return (
                <div
                  key={entry.uid || index}
                  className={`grid grid-cols-12 gap-2 px-4 sm:px-6 py-3.5 items-center transition-all min-w-[500px] ${
                    isCurrent
                      ? 'bg-blue-50/90 border-l-4 border-l-blue-600 shadow-xs'
                      : index % 2 === 0
                      ? 'bg-white hover:bg-slate-50/80'
                      : 'bg-slate-50/40 hover:bg-slate-50'
                  }`}
                >
                  {/* Rank Column */}
                  <div className="col-span-2 flex items-center justify-center">
                    {renderMedal(rank)}
                  </div>

                  {/* Learner Column */}
                  <div className="col-span-6 flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      {entry.name[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm truncate ${isCurrent ? 'font-black text-blue-950' : 'font-bold text-slate-800'}`}>
                          {entry.name}
                        </span>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-2xs shrink-0">
                            আপনি (You)
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(entry.updatedAt).toLocaleDateString('bn-BD')} সিঙ্কড
                      </span>
                    </div>
                  </div>

                  {/* Level Completed Column */}
                  <div className="col-span-2 text-center text-xs sm:text-sm font-bold text-slate-600">
                    {entry.levelCompleted > 0 ? `${entry.levelCompleted}টি লেভেল` : 'চলমান'}
                  </div>

                  {/* Points Column */}
                  <div className="col-span-2 text-right flex items-center justify-end gap-1">
                    <Zap className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                    <span className="text-sm sm:text-base font-black text-amber-700">
                      {entry.totalPoints}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Persistent Current User Status Banner (Highlighted Row if outside Top 10 or whenever viewing) */}
      {!isUserInTop10 && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-2xl border-2 border-blue-300 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              #{currentUserRank || '১০+'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  আপনার বর্তমান অবস্থান
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black">
                  আপনি
                </span>
              </div>
              <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                {effectiveName} • {progress.xp} XP ({levelCompleted > 0 ? `${levelCompleted}টি লেভেল সম্পন্ন` : 'লেভেল অনুশীলন চলছে'})
              </h4>
              {pointsNeededForTop10 > 0 && entries.length >= 10 && (
                <p className="text-xs text-blue-900 mt-0.5">
                  শীর্ষ ১০-এ প্রবেশ করতে আর মাত্র <strong>{pointsNeededForTop10} পয়েন্ট</strong> প্রয়োজন!
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onStartPractice}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>পয়েন্ট অর্জন করতে অনুশীলন করুন</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Rules & Points Explanation Card */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>লিডারবোর্ড পয়েন্ট ও র‍্যাংকিং নিয়মাবলী:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
          <li>প্রতিটি সঠিক বাক্য অনুবাদের জন্য <strong>১৫ পয়েন্ট</strong> যুক্ত হয়।</li>
          <li>প্রতিদিনের ৫টি দৈনিক চ্যালেঞ্জ সম্পূর্ণ করলে <strong>+৭৫ বোনাস পয়েন্ট</strong> অর্জিত হয়।</li>
          <li>লেভেল ১ থেকে ৫ সমাপ্ত করলে বিশেষ ব্যাজ ও <strong>+১০০ থেকে +৫০০ পর্যন্ত এক্সট্রা XP</strong> প্রদান করা হয়।</li>
          <li>প্রতিটি সঠিক উত্তরের সাথে সাথে স্কোর সরাসরি ক্লাউড ডাটাবেসে (Firestore) সংরক্ষিত হয়।</li>
        </ul>
      </div>

      {/* Nickname Modal */}
      <NicknameModal
        isOpen={isNicknameModalOpen}
        initialNickname={progress.nickname || getSavedNickname() || currentUser?.displayName || ''}
        onSave={handleSaveNickname}
        onClose={() => setIsNicknameModalOpen(false)}
        canDismiss={Boolean(progress.nickname || getSavedNickname() || currentUser?.displayName)}
      />
    </div>
  );
};
