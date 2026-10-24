import { collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { LeaderboardEntry } from '../types';

const LEADERBOARD_COLLECTION = 'leaderboard';
const NICKNAME_STORAGE_KEY = 'dep_user_nickname';

/**
 * Retrieves the stored nickname for the current user from local storage
 */
export function getSavedNickname(): string {
  try {
    return localStorage.getItem(NICKNAME_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

/**
 * Sets and saves the user's nickname locally
 */
export function setSavedNickname(nickname: string): void {
  try {
    if (nickname.trim()) {
      localStorage.setItem(NICKNAME_STORAGE_KEY, nickname.trim());
    }
  } catch (err) {
    console.error('Failed to save nickname locally', err);
  }
}

/**
 * Saves or updates a user's leaderboard record directly in Firestore:
 * Path: leaderboard/{uid}
 * Document fields: { name, totalPoints, levelCompleted, updatedAt }
 */
export async function syncUserToLeaderboard(
  uid: string,
  name: string,
  totalPoints: number,
  levelCompleted: number
): Promise<void> {
  const cleanName = name.trim();
  if (!uid || !cleanName) return;

  // Persist locally for immediate access
  setSavedNickname(cleanName);

  const payload = {
    name: cleanName,
    totalPoints: Number(totalPoints) || 0,
    levelCompleted: Number(levelCompleted) || 0,
    updatedAt: new Date().toISOString(),
  };

  const docPath = `${LEADERBOARD_COLLECTION}/${uid}`;
  try {
    const leaderDocRef = doc(db, LEADERBOARD_COLLECTION, uid);
    await setDoc(leaderDocRef, payload, { merge: true });
  } catch (error) {
    console.warn(`Firestore Leaderboard write error for ${docPath}:`, error);
    try {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    } catch {
      // Don't throw unhandled rejection to prevent interrupting user translation flow
    }
  }
}

/**
 * Fetches the top 10 leaderboard entries from Firestore ordered by totalPoints descending.
 * Also retrieves current user's entry if outside top 10.
 */
export async function fetchLeaderboardEntries(currentUserId?: string): Promise<{
  top10: LeaderboardEntry[];
  currentUserEntry?: LeaderboardEntry;
  currentUserRank?: number;
}> {
  const top10: LeaderboardEntry[] = [];
  let currentUserEntry: LeaderboardEntry | undefined;
  let currentUserRank: number | undefined;

  try {
    const q = query(
      collection(db, LEADERBOARD_COLLECTION),
      orderBy('totalPoints', 'desc'),
      limit(10)
    );
    const snap = await getDocs(q);

    snap.docs.forEach((docSnap, index) => {
      const data = docSnap.data();
      const entry: LeaderboardEntry = {
        uid: docSnap.id,
        name: data.name || 'শিক্ষার্থী',
        totalPoints: typeof data.totalPoints === 'number' ? data.totalPoints : 0,
        levelCompleted: typeof data.levelCompleted === 'number' ? data.levelCompleted : 0,
        updatedAt: data.updatedAt || new Date().toISOString(),
        rank: index + 1,
        isCurrentUser: currentUserId ? docSnap.id === currentUserId : false,
      };

      top10.push(entry);

      if (currentUserId && docSnap.id === currentUserId) {
        currentUserEntry = entry;
        currentUserRank = entry.rank;
      }
    });

    // If current user is not in top 10 and authenticated, fetch their individual document
    if (currentUserId && !currentUserEntry) {
      try {
        const userDocRef = doc(db, LEADERBOARD_COLLECTION, currentUserId);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const uData = userSnap.data();
          currentUserEntry = {
            uid: currentUserId,
            name: uData.name || 'শিক্ষার্থী',
            totalPoints: typeof uData.totalPoints === 'number' ? uData.totalPoints : 0,
            levelCompleted: typeof uData.levelCompleted === 'number' ? uData.levelCompleted : 0,
            updatedAt: uData.updatedAt || new Date().toISOString(),
            isCurrentUser: true,
          };
        }
      } catch (err) {
        console.warn('Could not fetch individual leaderboard record for current user:', err);
      }
    }
  } catch (error) {
    console.warn('Error fetching Firestore leaderboard entries:', error);
    try {
      handleFirestoreError(error, OperationType.GET, LEADERBOARD_COLLECTION);
    } catch {
      // Return empty array gracefully if network error
    }
  }

  return {
    top10,
    currentUserEntry,
    currentUserRank,
  };
}
