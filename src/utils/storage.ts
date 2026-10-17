import { UserProgress } from '../types';
import { computeUnlockedTiers } from '../data/tiers';

const STORAGE_KEY = 'daily_english_practice_bd_v2';
const LEGACY_STORAGE_KEY = 'daily_english_practice_bd_v1';
const DEDICATED_XP_KEY = 'daily_english_practice_xp';
const DEDICATED_COMPLETED_KEY = 'daily_english_practice_completed_ids';

export const DEFAULT_PROGRESS: UserProgress = {
  attemptedIds: {},
  correctIds: {},
  struggleIds: {},
  bookmarkedIds: {},
  userAnswers: {},
  awardedXpIds: {},
  xp: 0,
  streakCount: 1,
  personalBestStreak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalScore: 0,
  consecutiveCorrect: 0,
  maxConsecutiveCorrect: 0,
  grammarTipsViewedIds: {},
  unlockedTiers: [1], // Level 1 (Beginner) unlocked by default
  earnedBadges: {},
  completedDailyDates: {},
  todayDailyAnswers: {},
  studentName: '',
  theme: 'classic',
  soundEnabled: true,
  reducedMotion: false,
  lastLevel: 1,
  lastSentenceId: undefined,
};

export function loadProgress(): UserProgress {
  try {
    let parsed: any = null;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = null;
      }
    }

    if (!parsed) {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        try {
          parsed = JSON.parse(legacyRaw);
        } catch {
          parsed = null;
        }
      }
    }

    // Read dedicated backup keys if present
    const storedXpStr = localStorage.getItem(DEDICATED_XP_KEY);
    const storedCompletedStr = localStorage.getItem(DEDICATED_COMPLETED_KEY);

    const dedicatedCompleted: Record<string, boolean> = {};
    if (storedCompletedStr) {
      try {
        const ids = JSON.parse(storedCompletedStr);
        if (Array.isArray(ids)) {
          ids.forEach((id: string) => {
            dedicatedCompleted[id] = true;
          });
        }
      } catch {
        // ignore parse error
      }
    }

    if (!parsed || typeof parsed !== 'object') {
      let initialXp = 0;
      if (storedXpStr !== null && !isNaN(Number(storedXpStr))) {
        initialXp = Number(storedXpStr);
      } else if (Object.keys(dedicatedCompleted).length > 0) {
        initialXp = Object.keys(dedicatedCompleted).length * 15;
      }

      const awarded: Record<string, number> = {};
      Object.keys(dedicatedCompleted).forEach((id) => {
        awarded[id] = Date.now();
      });

      return {
        ...DEFAULT_PROGRESS,
        xp: initialXp,
        correctIds: dedicatedCompleted,
        awardedXpIds: awarded,
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const lastActive = parsed.lastActiveDate || today;

    let streak = parsed.streakCount || 1;
    let bestStreak = parsed.personalBestStreak || streak;

    if (lastActive !== today) {
      const lastDate = new Date(lastActive);
      const currentDate = new Date(today);
      const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        streak += 1;
      } else if (diffDays > 1) {
        streak = 1; // reset streak if missed more than 1 day
      }
      if (streak > bestStreak) {
        bestStreak = streak;
      }
    }

    const correctIds: Record<string, boolean> = {
      ...(parsed.correctIds || {}),
      ...dedicatedCompleted,
    };
    const awardedXpIds: Record<string, number> = { ...(parsed.awardedXpIds || {}) };

    // Ensure every completed sentence ID is recorded in awardedXpIds so XP cannot be re-awarded
    Object.keys(correctIds).forEach((id) => {
      if (!awardedXpIds[id]) {
        awardedXpIds[id] = Date.now();
      }
    });

    // Compute or restore XP reliably without ever resetting
    let loadedXp = typeof parsed.xp === 'number' && !isNaN(parsed.xp) ? parsed.xp : 0;
    if (storedXpStr !== null && !isNaN(Number(storedXpStr))) {
      loadedXp = Math.max(loadedXp, Number(storedXpStr));
    }
    const completedCount = Object.keys(correctIds).length;
    if (loadedXp === 0 && completedCount > 0) {
      loadedXp = completedCount * 15;
    }

    // Verify unlocked tiers dynamically using the exact thresholds
    const unlockedTiers: number[] = computeUnlockedTiers(
      correctIds,
      parsed.unlockedTiers && Array.isArray(parsed.unlockedTiers) ? parsed.unlockedTiers : [1]
    );

    // Reset daily challenge answers for new day if date changed
    const todayDaily = parsed.lastActiveDate === today ? (parsed.todayDailyAnswers || {}) : {};

    const progress: UserProgress = {
      ...DEFAULT_PROGRESS,
      ...parsed,
      xp: loadedXp,
      correctIds,
      awardedXpIds,
      attemptedIds: parsed.attemptedIds || {},
      struggleIds: parsed.struggleIds || {},
      bookmarkedIds: parsed.bookmarkedIds || {},
      userAnswers: parsed.userAnswers || {},
      streakCount: streak,
      personalBestStreak: bestStreak,
      lastActiveDate: today,
      todayDailyAnswers: todayDaily,
      unlockedTiers,
      totalScore: completedCount * 10,
      lastLevel: parsed.lastLevel || 1,
      lastSentenceId: parsed.lastSentenceId || undefined,
    };

    return progress;
  } catch (e) {
    console.error('Failed to load progress from localStorage', e);
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    if (!progress || typeof progress !== 'object') return;
    const serialized = JSON.stringify(progress);
    localStorage.setItem(STORAGE_KEY, serialized);
    localStorage.setItem(LEGACY_STORAGE_KEY, serialized);
    // Explicitly persist XP and completed sentence IDs to dedicated keys
    localStorage.setItem(DEDICATED_XP_KEY, String(progress.xp || 0));
    localStorage.setItem(
      DEDICATED_COMPLETED_KEY,
      JSON.stringify(Object.keys(progress.correctIds || {}))
    );
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function resetAllProgress(): UserProgress {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.removeItem(DEDICATED_XP_KEY);
    localStorage.removeItem(DEDICATED_COMPLETED_KEY);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_PROGRESS;
}

export function exportProgressJSON(progress: UserProgress): string {
  return JSON.stringify(progress, null, 2);
}

export function importProgressJSON(jsonStr: string): UserProgress | null {
  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed === 'object' && parsed !== null) {
      const merged = { ...DEFAULT_PROGRESS, ...parsed };
      saveProgress(merged);
      return merged;
    }
  } catch (e) {
    console.error('Failed to import JSON', e);
  }
  return null;
}
