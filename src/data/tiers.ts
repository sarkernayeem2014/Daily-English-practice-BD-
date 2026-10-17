import { LevelTierInfo, SentenceItem, TierLevel } from '../types';
import { ALL_SENTENCES } from './sentences';

export const LEVEL_TIERS: LevelTierInfo[] = [
  {
    tier: 1,
    titleEn: 'Beginner',
    titleBn: 'প্রাথমিক ধাপ (Beginner)',
    subtitleBn: 'দৈনন্দিন জীবনের মৌলিক ও সহজ বাক্য গঠন',
    targetCount: 50,
    requiredPrevCompleted: 0,
    minAccuracyRequired: 0,
    badgeId: 'level-1-complete',
    color: 'from-blue-600 to-sky-500',
    accentBg: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    tier: 2,
    titleEn: 'Sentence Builder',
    titleBn: 'বাক্য নির্মাতা (Sentence Builder)',
    subtitleBn: 'নানা পরিস্থিতি অনুযায়ী সাবলীল ও বৈচিত্র্যময় বাক্য তৈরি',
    targetCount: 100,
    requiredPrevCompleted: 30, // Level 1-এর ৩০টি বাক্য সম্পন্ন হলে আনলক হবে
    minAccuracyRequired: 70,
    badgeId: 'level-2-complete',
    color: 'from-teal-600 to-emerald-500',
    accentBg: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  {
    tier: 3,
    titleEn: 'Conversation Hero',
    titleBn: 'কথোপকথন বিজয়ী (Conversation Hero)',
    subtitleBn: 'আড্ডা, বিনম্র অনুরোধ, সামাজিক মেলামেশা ও স্বাভাবিক ভাব প্রকাশ',
    targetCount: 150,
    requiredPrevCompleted: 80, // Level 2-এর ৮০টি বাক্য সম্পন্ন হলে আনলক হবে
    minAccuracyRequired: 75,
    badgeId: 'level-3-complete',
    color: 'from-indigo-600 to-purple-600',
    accentBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    tier: 4,
    titleEn: 'English Master',
    titleBn: 'ইংরেজি বিশারদ (English Master)',
    subtitleBn: 'উন্নত ইংরেজি শব্দভাণ্ডার, প্রাতিষ্ঠানিক বাক্য ও জটিল কালজয়ী প্রবচন',
    targetCount: 200,
    requiredPrevCompleted: 120, // Level 3-এর ১২০টি বাক্য সম্পন্ন হলে আনলক হবে
    minAccuracyRequired: 80,
    badgeId: 'level-4-complete',
    color: 'from-amber-600 to-rose-600',
    accentBg: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    tier: 5,
    titleEn: 'Master Level',
    titleBn: 'মাস্টার লেভেল (Master Level)',
    subtitleBn: 'চূড়ান্ত ফ্লুয়েন্সি, মাস্টার চ্যালেঞ্জ ও কোর্স সমাপনী স্তর',
    targetCount: 510,
    requiredPrevCompleted: 180, // Level 4-এর ১৮০টি বাক্য সম্পন্ন হলে আনলক হবে
    minAccuracyRequired: 85,
    badgeId: 'level-4-complete',
    color: 'from-purple-600 to-pink-600',
    accentBg: 'bg-purple-50 text-purple-800 border-purple-200',
  },
];

/**
 * Deterministically partition sentences into tiers:
 * Tier 1: 50 sentences (indices 0 to 49)
 * Tier 2: 100 sentences (indices 50 to 149)
 * Tier 3: 150 sentences (indices 150 to 299)
 * Tier 4: 200 sentences (indices 300 to 499)
 * Tier 5 (Master Level): All 510 sentences (complete master pool)
 */
export function getSentencesForTier(tier: TierLevel): SentenceItem[] {
  if (tier === 1) {
    return ALL_SENTENCES.slice(0, 50).map((s) => ({ ...s, tier: 1 }));
  }
  if (tier === 2) {
    return ALL_SENTENCES.slice(50, 150).map((s) => ({ ...s, tier: 2 }));
  }
  if (tier === 3) {
    return ALL_SENTENCES.slice(150, 300).map((s) => ({ ...s, tier: 3 }));
  }
  if (tier === 4) {
    return ALL_SENTENCES.slice(300, 500).map((s) => ({ ...s, tier: 4 }));
  }
  if (tier === 5) {
    return ALL_SENTENCES.map((s) => ({ ...s, tier: 5 }));
  }
  return ALL_SENTENCES.slice(0, 50);
}

export function getTierInfo(tier: TierLevel): LevelTierInfo {
  return LEVEL_TIERS.find((t) => t.tier === tier) || LEVEL_TIERS[0];
}

export function isTierUnlocked(tier: TierLevel, unlockedTiers: number[]): boolean {
  if (tier === 1) return true;
  return unlockedTiers.includes(tier);
}

/**
 * Computes unlocked tiers strictly based on unique completed sentence IDs (not attempts).
 * Unlocks the next level immediately when the required threshold is reached:
 * - Level 1: 50 total sentences; unlock Level 2 after 30 unique completed sentences.
 * - Level 2: 100 total sentences; unlock Level 3 after 80 unique completed sentences.
 * - Level 3: 150 total sentences; unlock Level 4 after 120 unique completed sentences.
 * - Level 4: 200 total sentences; unlock the next Master Level after 180 unique completed sentences.
 */
export function computeUnlockedTiers(
  correctIds: Record<string, boolean>,
  currentUnlocked: number[] = [1]
): number[] {
  const unlocked = new Set<number>(
    currentUnlocked && currentUnlocked.length > 0 ? currentUnlocked : [1]
  );
  unlocked.add(1); // Level 1 is always unlocked

  const tier1Sentences = ALL_SENTENCES.slice(0, 50);
  const tier2Sentences = ALL_SENTENCES.slice(50, 150);
  const tier3Sentences = ALL_SENTENCES.slice(150, 300);
  const tier4Sentences = ALL_SENTENCES.slice(300, 500);

  const tier1Count = tier1Sentences.filter((s) => correctIds[s.id]).length;
  const tier2Count = tier2Sentences.filter((s) => correctIds[s.id]).length;
  const tier3Count = tier3Sentences.filter((s) => correctIds[s.id]).length;
  const tier4Count = tier4Sentences.filter((s) => correctIds[s.id]).length;
  const totalCount = Object.keys(correctIds).length;

  // Level 1: 50 total sentences; unlock Level 2 after 30 unique completed sentences
  if (tier1Count >= 30 || totalCount >= 30) {
    unlocked.add(2);
  }

  // Level 2: 100 total sentences; unlock Level 3 after 80 unique completed sentences
  if (tier2Count >= 80 || (unlocked.has(2) && totalCount >= 110)) {
    unlocked.add(3);
  }

  // Level 3: 150 total sentences; unlock Level 4 after 120 unique completed sentences
  if (tier3Count >= 120 || (unlocked.has(3) && totalCount >= 230)) {
    unlocked.add(4);
  }

  // Level 4: 200 total sentences; unlock the next Master Level after 180 unique completed sentences
  if (tier4Count >= 180 || (unlocked.has(4) && totalCount >= 410)) {
    unlocked.add(5);
  }

  return Array.from(unlocked).sort((a, b) => a - b);
}
