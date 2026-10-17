import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BadgeId, LevelTierInfo } from '../types';
import { BADGES } from '../data/badges';
import { playLevelUpSound } from '../utils/soundEffects';
import { 
  Trophy, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Award,
  Crown
} from 'lucide-react';

interface LevelCompleteModalProps {
  tierInfo: LevelTierInfo;
  completedCount: number;
  accuracyRate: number;
  xpEarned: number;
  unlockedBadgeIds: BadgeId[];
  soundEnabled: boolean;
  reducedMotion: boolean;
  onContinueNext: () => void;
  onReplayLevel: () => void;
  onClose: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  tierInfo,
  completedCount,
  accuracyRate,
  xpEarned,
  unlockedBadgeIds,
  soundEnabled,
  reducedMotion,
  onContinueNext,
  onReplayLevel,
  onClose,
}) => {
  useEffect(() => {
    // Play triumphal level up sound
    playLevelUpSound(soundEnabled);

    // Launch confetti if motion not reduced
    if (!reducedMotion) {
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [soundEnabled, reducedMotion]);

  const unlockedBadges = BADGES.filter((b) => unlockedBadgeIds.includes(b.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-blue-100 p-6 sm:p-8 text-center space-y-6 overflow-hidden">
        {/* Decorative Top Accent */}
        <div className={`absolute top-0 inset-x-0 h-3 bg-gradient-to-r ${tierInfo.color}`} />

        {/* Big Trophy / Crown Icon with Glow */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Trophy className="w-10 h-10 animate-bounce duration-1000" />
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Titles & Encouraging Bengali Copy */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>লেভেল সমাপ্তির গৌরবোজ্জ্বল মুহূর্ত!</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            অভিনন্দন! {tierInfo.titleBn} সম্পূর্ণ হয়েছে 🎉
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            অসাধারণ অধ্যবসায়! আপনি নিষ্ঠার সাথে বাক্যগুলো অনুবাদ করে নিজের ভাষাগত দক্ষতাকে এক অনন্য উচ্চতায় নিয়ে গেছেন।
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              সম্পন্ন বাক্য
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {completedCount}
            </div>
            <span className="text-[10px] text-slate-400">/{tierInfo.targetCount} লক্ষ্য</span>
          </div>

          <div className="space-y-1 border-x border-slate-200 px-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              নির্ভুলতা হার
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">
              {accuracyRate}%
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">চমৎকার স্কোর</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              অর্জিত XP
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-600 flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 fill-amber-500" />
              <span>+{xpEarned}</span>
            </div>
            <span className="text-[10px] text-amber-700 font-semibold">বোনাস সহ</span>
          </div>
        </div>

        {/* Unlocked Badges Section */}
        {unlockedBadges.length > 0 && (
          <div className="space-y-2 pt-1 text-left bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Award className="w-4 h-4 text-amber-600" />
              <span>নতুন আনলক হওয়া ব্যাজসমূহ:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {unlockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xs"
                >
                  <Award className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{badge.titleBn}</div>
                    <div className="text-[10px] text-slate-500">+{badge.xpBonus} XP বোনাস</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {tierInfo.tier < 5 ? (
            <button
              onClick={onContinueNext}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/25 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>পরবর্তী লেভেলে প্রবেশ করুন (Level {tierInfo.tier + 1})</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onContinueNext}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-amber-600/25 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              <span>সার্টিফিকেট সংগ্রহ করুন (Course Completed)</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onReplayLevel}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm active:scale-98 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>এই লেভেল পুনরায় অনুশীলন করুন</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-800 text-xs sm:text-sm font-semibold transition-colors"
            >
              ড্যাশবোর্ডে ফিরুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
