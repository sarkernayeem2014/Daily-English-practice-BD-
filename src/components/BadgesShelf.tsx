import React from 'react';
import { UserProgress } from '../types';
import { BADGES } from '../data/badges';
import { 
  Award, 
  Sparkles, 
  GraduationCap, 
  Flame, 
  Trophy, 
  Target, 
  Medal, 
  ShieldCheck, 
  Crown, 
  Star,
  Lock,
  CheckCircle2,
  Zap
} from 'lucide-react';

interface BadgesShelfProps {
  progress: UserProgress;
  onClose?: () => void;
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-6 h-6" />,
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  Award: <Award className="w-6 h-6" />,
  Flame: <Flame className="w-6 h-6" />,
  Trophy: <Trophy className="w-6 h-6" />,
  Target: <Target className="w-6 h-6" />,
  Medal: <Medal className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
  Crown: <Crown className="w-6 h-6" />,
  Star: <Star className="w-6 h-6" />,
};

export const BadgesShelf: React.FC<BadgesShelfProps> = ({ progress, onClose }) => {
  const earnedCount = Object.keys(progress.earnedBadges || {}).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span>অর্জিত সম্মাননা ব্যাজসমূহ (Badges Showcase)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            মোট ১০টি ব্যাজের মধ্যে {earnedCount}টি আনলক হয়েছে
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          {earnedCount}/১০ আনলক
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BADGES.map((badge) => {
          const isEarned = !!progress.earnedBadges[badge.id];
          const earnedInfo = progress.earnedBadges[badge.id];

          return (
            <div
              key={badge.id}
              className={`relative p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                isEarned
                  ? 'bg-white border-amber-200/90 shadow-md shadow-amber-500/5 ring-1 ring-amber-300/50'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isEarned
                        ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-white shadow-md shadow-amber-500/20'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isEarned ? (
                      BADGE_ICONS[badge.iconName] || <Award className="w-6 h-6" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      isEarned
                        ? 'bg-amber-100/70 text-amber-900 border border-amber-300'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <Zap className="w-3 h-3 fill-amber-500" />
                    <span>+{badge.xpBonus} XP</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{badge.titleBn}</h3>
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {badge.titleEn}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {badge.descriptionBn}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                {isEarned ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> অর্জিত হয়েছে
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-400 font-medium">
                    <Lock className="w-3.5 h-3.5" /> লক্ষ্য পূরণ বাকি
                  </span>
                )}

                {earnedInfo?.earnedAt && (
                  <span className="text-slate-400 text-[10px]">
                    {new Date(earnedInfo.earnedAt).toLocaleDateString('bn-BD')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
