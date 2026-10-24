import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './config';
import { handleFirestoreError, OperationType } from './errors';
import { UserProgress } from '../types';
import { DEFAULT_PROGRESS } from '../utils/storage';
import { computeUnlockedTiers } from '../data/tiers';

/**
 * Loads user progress from Firestore for the given user UID
 */
export async function loadUserProgressFromFirestore(uid: string): Promise<UserProgress | null> {
  const docPath = `users/${uid}/progress/current`;
  try {
    const snap = await getDoc(doc(db, 'users', uid, 'progress', 'current'));
    if (!snap.exists()) {
      return null;
    }
    const data = snap.data();
    if (!data || typeof data !== 'object') {
      return null;
    }

    const correctIds = (data.correctIds as Record<string, boolean>) || {};
    const awardedXpIds = (data.awardedXpIds as Record<string, number>) || {};

    // Ensure all completed sentences have awardedXpIds
    Object.keys(correctIds).forEach((id) => {
      if (!awardedXpIds[id]) {
        awardedXpIds[id] = Date.now();
      }
    });

    const parsedXp = typeof data.xp === 'number' && !isNaN(data.xp) ? data.xp : Object.keys(correctIds).length * 15;
    const unlockedTiers = computeUnlockedTiers(correctIds, Array.isArray(data.unlockedTiers) ? data.unlockedTiers : [1]);

    const progress: UserProgress = {
      ...DEFAULT_PROGRESS,
      ...data,
      xp: parsedXp,
      correctIds,
      awardedXpIds,
      unlockedTiers,
      totalScore: Object.keys(correctIds).length * 10,
      lastLevel: (data.lastLevel as any) || 1,
      lastSentenceId: typeof data.lastSentenceId === 'string' ? data.lastSentenceId : undefined,
      nickname: typeof data.nickname === 'string' ? data.nickname : undefined,
    };

    return progress;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }
}

/**
 * Saves user progress to Firestore under their authenticated UID
 */
export async function saveUserProgressToFirestore(uid: string, progress: UserProgress): Promise<void> {
  const docPath = `users/${uid}/progress/current`;
  try {
    const payload = {
      ...progress,
      userId: uid,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', uid, 'progress', 'current'), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Safe Migration Strategy:
 * When an anonymous/local user signs in, merges local progress into cloud progress
 * without losing any XP, streak, completed sentence IDs, or badges.
 */
export function mergeLocalAndCloudProgress(
  local: UserProgress,
  cloud: UserProgress | null
): UserProgress {
  if (!cloud) {
    // If user has no existing cloud data, migrate all local progress directly
    return {
      ...local,
      unlockedTiers: computeUnlockedTiers(local.correctIds, local.unlockedTiers),
    };
  }

  // Combine unique completed sentence IDs
  const mergedCorrectIds: Record<string, boolean> = {
    ...cloud.correctIds,
    ...local.correctIds,
  };

  // Combine attempted IDs
  const mergedAttemptedIds: Record<string, boolean> = {
    ...cloud.attemptedIds,
    ...local.attemptedIds,
  };

  // Combine struggle IDs (remove any that are already in mergedCorrectIds)
  const mergedStruggleIds: Record<string, boolean> = {
    ...cloud.struggleIds,
    ...local.struggleIds,
  };
  Object.keys(mergedCorrectIds).forEach((id) => {
    delete mergedStruggleIds[id];
  });

  // Combine awarded XP IDs
  const mergedAwardedXpIds: Record<string, number> = {
    ...cloud.awardedXpIds,
    ...local.awardedXpIds,
  };
  Object.keys(mergedCorrectIds).forEach((id) => {
    if (!mergedAwardedXpIds[id]) {
      mergedAwardedXpIds[id] = Date.now();
    }
  });

  // Calculate merged XP: maximum of cloud or local, plus any new unique sentences merged
  const newSentencesFromLocal = Object.keys(local.correctIds).filter((id) => !cloud.correctIds[id]).length;
  const mergedXp = Math.max(cloud.xp, local.xp) + newSentencesFromLocal * 15;

  // Streak calculation
  const mergedStreak = Math.max(cloud.streakCount, local.streakCount);
  const mergedBestStreak = Math.max(cloud.personalBestStreak, local.personalBestStreak, mergedStreak);

  // Combine earned badges
  const mergedBadges = {
    ...cloud.earnedBadges,
    ...local.earnedBadges,
  };

  // Re-evaluate unlocked tiers using the unified correct sentences
  const mergedTiers = computeUnlockedTiers(
    mergedCorrectIds,
    Array.from(new Set([...(cloud.unlockedTiers || [1]), ...(local.unlockedTiers || [1])]))
  );

  return {
    ...DEFAULT_PROGRESS,
    xp: mergedXp,
    streakCount: mergedStreak,
    personalBestStreak: mergedBestStreak,
    lastActiveDate: new Date().toISOString().split('T')[0],
    totalScore: Object.keys(mergedCorrectIds).length * 10,
    consecutiveCorrect: Math.max(cloud.consecutiveCorrect || 0, local.consecutiveCorrect || 0),
    maxConsecutiveCorrect: Math.max(cloud.maxConsecutiveCorrect || 0, local.maxConsecutiveCorrect || 0),
    unlockedTiers: mergedTiers,
    correctIds: mergedCorrectIds,
    attemptedIds: mergedAttemptedIds,
    struggleIds: mergedStruggleIds,
    bookmarkedIds: { ...cloud.bookmarkedIds, ...local.bookmarkedIds },
    awardedXpIds: mergedAwardedXpIds,
    earnedBadges: mergedBadges,
    completedDailyDates: { ...cloud.completedDailyDates, ...local.completedDailyDates },
    todayDailyAnswers: { ...cloud.todayDailyAnswers, ...local.todayDailyAnswers },
    userAnswers: { ...cloud.userAnswers, ...local.userAnswers },
    grammarTipsViewedIds: { ...cloud.grammarTipsViewedIds, ...local.grammarTipsViewedIds },
    studentName: cloud.studentName || local.studentName || '',
    theme: cloud.theme || local.theme || 'classic',
    soundEnabled: typeof cloud.soundEnabled === 'boolean' ? cloud.soundEnabled : local.soundEnabled,
    reducedMotion: typeof cloud.reducedMotion === 'boolean' ? cloud.reducedMotion : local.reducedMotion,
    lastLevel: cloud.lastLevel || local.lastLevel || 1,
    lastSentenceId: cloud.lastSentenceId || local.lastSentenceId || undefined,
    nickname: cloud.nickname || local.nickname || undefined,
  };
}
