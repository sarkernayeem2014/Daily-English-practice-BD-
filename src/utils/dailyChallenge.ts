import { SentenceItem } from '../types';
import { ALL_SENTENCES } from '../data/sentences';

/**
 * Deterministically generates 5 balanced sentences for any given date string (YYYY-MM-DD).
 * 1 Beginner, 2 Intermediate, 2 Advanced sentences from varied categories.
 */
export function getDailyChallengeSentences(dateStr?: string): SentenceItem[] {
  const dateKey = dateStr || new Date().toISOString().split('T')[0];
  
  // Simple numeric hash from date string
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  const beginners = ALL_SENTENCES.filter((s) => s.level === 'beginner');
  const intermediates = ALL_SENTENCES.filter((s) => s.level === 'intermediate');
  const advanceds = ALL_SENTENCES.filter((s) => s.level === 'advanced');

  const b1 = beginners[seed % beginners.length];
  const i1 = intermediates[(seed + 11) % intermediates.length];
  const i2 = intermediates[(seed + 37) % intermediates.length];
  const a1 = advanceds[(seed + 23) % advanceds.length];
  const a2 = advanceds[(seed + 59) % advanceds.length];

  return [b1, i1, i2, a1, a2];
}
