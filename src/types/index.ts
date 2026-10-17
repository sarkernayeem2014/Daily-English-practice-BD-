export type Level = 'beginner' | 'intermediate' | 'advanced';

export type TierLevel = 1 | 2 | 3 | 4 | 5;

export type CategoryId =
  | 'daily-routine'
  | 'family'
  | 'school-college'
  | 'shopping'
  | 'food-cooking'
  | 'travel'
  | 'friends-social'
  | 'questions-requests'
  | 'tenses-activities'
  | 'common-expressions';

export interface CategoryInfo {
  id: CategoryId;
  nameEn: string;
  nameBn: string;
  iconName: string;
  descriptionBn: string;
  color: string;
}

export interface SentenceItem {
  id: string;
  category: CategoryId;
  level: Level;
  tier?: TierLevel;
  bn: string;
  enPrimary: string;
  enAlternatives: string[];
  grammarTipBn: string;
  explanationBn: string;
  commonMistakeBn?: string;
  vocabulary?: { bn: string; en: string }[];
}

export type BadgeId =
  | 'first-10'
  | 'grammar-master'
  | 'century-100'
  | 'streak-7'
  | 'perfect-score'
  | 'level-1-complete'
  | 'level-2-complete'
  | 'level-3-complete'
  | 'level-4-complete'
  | 'daily-champion';

export interface BadgeInfo {
  id: BadgeId;
  titleEn: string;
  titleBn: string;
  descriptionBn: string;
  iconName: string;
  xpBonus: number;
}

export interface LevelTierInfo {
  tier: TierLevel;
  titleEn: string;
  titleBn: string;
  subtitleBn: string;
  targetCount: number;
  requiredPrevCompleted: number;
  minAccuracyRequired: number;
  badgeId: BadgeId;
  color: string;
  accentBg: string;
}

export type AppTheme = 'classic' | 'emerald' | 'indigo-gold' | 'midnight';

export interface UserProgress {
  attemptedIds: Record<string, boolean>;
  correctIds: Record<string, boolean>;
  struggleIds: Record<string, boolean>;
  bookmarkedIds: Record<string, boolean>;
  userAnswers: Record<string, string>;
  awardedXpIds: Record<string, number>; // sentenceId -> timestamp (prevents duplicate XP)
  xp: number;
  streakCount: number;
  personalBestStreak: number;
  lastActiveDate: string;
  totalScore: number;
  consecutiveCorrect: number;
  maxConsecutiveCorrect: number;
  grammarTipsViewedIds: Record<string, boolean>;
  unlockedTiers: number[]; // e.g. [1, 2]
  earnedBadges: Record<string, { earnedAt: string }>;
  completedDailyDates: Record<string, boolean>;
  todayDailyAnswers: Record<string, boolean>;
  studentName: string;
  theme: AppTheme;
  soundEnabled: boolean;
  reducedMotion: boolean;
  lastLevel?: TierLevel;
  lastSentenceId?: string;
}

export type ViewMode =
  | 'dashboard'
  | 'practice'
  | 'review'
  | 'browse'
  | 'daily'
  | 'certificate'
  | 'guide'
  | 'profile';

export const CLASS_LEVEL_OPTIONS = [
  '৬ষ্ঠ',
  '৭ম',
  '৮ম',
  '৯ম',
  '১০ম',
  'একাদশ',
  'দ্বাদশ',
  'ডিগ্রি/অনার্স',
  'মাস্টার্স',
  'চাকরিজীবী',
  'অন্যান্য',
] as const;

export type ClassLevel = (typeof CLASS_LEVEL_OPTIONS)[number];

