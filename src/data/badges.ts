import { BadgeId, BadgeInfo, UserProgress } from '../types';

export const BADGES: BadgeInfo[] = [
  {
    id: 'first-10',
    titleEn: 'First 10 Sentences',
    titleBn: 'প্রথম ১০টি বাক্য বিজয়',
    descriptionBn: 'সফলভাবে যেকোনো ১০টি বাক্য নির্ভুল অনুবাদ করেছেন।',
    iconName: 'Sparkles',
    xpBonus: 50,
  },
  {
    id: 'grammar-master',
    titleEn: 'Grammar Master',
    titleBn: 'ব্যাকরণ বিশারদ',
    descriptionBn: '২৫টি বাক্যের ব্যাকরণ ও ব্যবহারিক ব্যাখ্যা মনোযোগ দিয়ে পড়েছেন।',
    iconName: 'GraduationCap',
    xpBonus: 100,
  },
  {
    id: 'century-100',
    titleEn: '100 Sentences Completed',
    titleBn: 'শতক পূরণ (১০০ বাক্য)',
    descriptionBn: '১০০টি বাক্য সফলভাবে আয়ত্ত করে মাইলফলক স্পর্শ করেছেন।',
    iconName: 'Award',
    xpBonus: 200,
  },
  {
    id: 'streak-7',
    titleEn: '7-Day Learning Streak',
    titleBn: '৭ দিনের ধারাবাহিক সাধনা',
    descriptionBn: 'একটানা ৭ দিন নিয়মিত প্রতিদিন ইংরেজি অনুশীলন করেছেন।',
    iconName: 'Flame',
    xpBonus: 150,
  },
  {
    id: 'perfect-score',
    titleEn: 'Perfect Score',
    titleBn: 'নিখুঁত স্কোর (১০/১০)',
    descriptionBn: 'কোনো ভুল ছাড়া একনাগাড়ে ১০টি বাক্য প্রথম চেষ্টাতেই সঠিক করেছেন।',
    iconName: 'Trophy',
    xpBonus: 120,
  },
  {
    id: 'daily-champion',
    titleEn: 'Daily Challenger',
    titleBn: 'দৈনিক চ্যালেঞ্জ বিজয়ী',
    descriptionBn: 'আজকের ৫টি দৈনিক চ্যালেঞ্জ বাক্য সফলভাবে সম্পন্ন করেছেন।',
    iconName: 'Target',
    xpBonus: 75,
  },
  {
    id: 'level-1-complete',
    titleEn: 'Level 1: Beginner Graduate',
    titleBn: 'লেভেল ১ স্নাতক (Beginner)',
    descriptionBn: 'প্রথম লেভেলের ৫০টি মৌলিক বাক্যের লক্ষ্য সফলভাবে সমাপ্ত করেছেন।',
    iconName: 'Medal',
    xpBonus: 150,
  },
  {
    id: 'level-2-complete',
    titleEn: 'Level 2: Sentence Builder Graduate',
    titleBn: 'লেভেল ২ স্নাতক (Sentence Builder)',
    descriptionBn: 'দ্বিতীয় লেভেলের ১০০টি বাক্যের চ্যালেঞ্জ সম্পূর্ণ করেছেন।',
    iconName: 'ShieldCheck',
    xpBonus: 250,
  },
  {
    id: 'level-3-complete',
    titleEn: 'Level 3: Conversation Hero',
    titleBn: 'লেভেল ৩ বিজয়ী (Conversation Hero)',
    descriptionBn: 'তৃতীয় লেভেলের ১৫০টি বাক্য জয় করে সাবলীলতায় এগিয়েছেন।',
    iconName: 'Crown',
    xpBonus: 350,
  },
  {
    id: 'level-4-complete',
    titleEn: 'Level 4: English Master',
    titleBn: 'লেভেল ৪ গ্র্যান্ডমাস্টার (English Master)',
    descriptionBn: 'সর্বোচ্চ লেভেলের ২০০টি বাক্য ও প্রবচনে সম্পূর্ণ ব্যুৎপত্তি অর্জন করেছেন।',
    iconName: 'Star',
    xpBonus: 500,
  },
];

/**
 * Checks all badge conditions against the current user progress
 * Returns an array of newly unlocked badge IDs
 */
export function checkNewBadges(progress: UserProgress): BadgeId[] {
  const newlyUnlocked: BadgeId[] = [];
  const correctCount = Object.keys(progress.correctIds).length;
  const grammarCount = Object.keys(progress.grammarTipsViewedIds || {}).length;

  const checkAndAdd = (id: BadgeId, condition: boolean) => {
    if (condition && !progress.earnedBadges[id]) {
      newlyUnlocked.push(id);
    }
  };

  // 1. First 10
  checkAndAdd('first-10', correctCount >= 10);

  // 2. Grammar master (25 viewed)
  checkAndAdd('grammar-master', grammarCount >= 25);

  // 3. Century 100
  checkAndAdd('century-100', correctCount >= 100);

  // 4. Streak 7
  checkAndAdd('streak-7', progress.streakCount >= 7);

  // 5. Perfect score (10 consecutive correct)
  checkAndAdd('perfect-score', progress.maxConsecutiveCorrect >= 10);

  // 6. Daily champion
  const today = new Date().toISOString().split('T')[0];
  checkAndAdd('daily-champion', !!progress.completedDailyDates[today]);

  return newlyUnlocked;
}
