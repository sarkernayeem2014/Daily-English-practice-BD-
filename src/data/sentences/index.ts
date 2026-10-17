import { CategoryId, Level, SentenceItem } from '../../types';
import { DAILY_ROUTINE_SENTENCES } from './dailyRoutine';
import { FAMILY_SENTENCES } from './family';
import { SCHOOL_COLLEGE_SENTENCES } from './schoolCollege';
import { SHOPPING_SENTENCES } from './shopping';
import { FOOD_COOKING_SENTENCES } from './foodCooking';
import { TRAVEL_SENTENCES } from './travel';
import { FRIENDS_SOCIAL_SENTENCES } from './friendsSocial';
import { QUESTIONS_REQUESTS_SENTENCES } from './questionsRequests';
import { TENSES_ACTIVITIES_SENTENCES } from './tensesActivities';
import { COMMON_EXPRESSIONS_SENTENCES } from './commonExpressions';

export const ALL_SENTENCES: SentenceItem[] = [
  ...DAILY_ROUTINE_SENTENCES,
  ...FAMILY_SENTENCES,
  ...SCHOOL_COLLEGE_SENTENCES,
  ...SHOPPING_SENTENCES,
  ...FOOD_COOKING_SENTENCES,
  ...TRAVEL_SENTENCES,
  ...FRIENDS_SOCIAL_SENTENCES,
  ...QUESTIONS_REQUESTS_SENTENCES,
  ...TENSES_ACTIVITIES_SENTENCES,
  ...COMMON_EXPRESSIONS_SENTENCES,
];

export function getSentencesByCategory(categoryId: CategoryId): SentenceItem[] {
  return ALL_SENTENCES.filter((s) => s.category === categoryId);
}

export function getSentencesByLevel(level: Level): SentenceItem[] {
  return ALL_SENTENCES.filter((s) => s.level === level);
}

export function getSentencesByCategoryAndLevel(
  categoryId: CategoryId | 'all',
  level: Level | 'all'
): SentenceItem[] {
  return ALL_SENTENCES.filter((s) => {
    const matchCat = categoryId === 'all' || s.category === categoryId;
    const matchLvl = level === 'all' || s.level === level;
    return matchCat && matchLvl;
  });
}

export function getSentenceById(id: string): SentenceItem | undefined {
  return ALL_SENTENCES.find((s) => s.id === id);
}

export function searchSentences(query: string): SentenceItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_SENTENCES;
  return ALL_SENTENCES.filter(
    (s) =>
      s.bn.toLowerCase().includes(q) ||
      s.enPrimary.toLowerCase().includes(q) ||
      s.grammarTipBn.toLowerCase().includes(q) ||
      s.enAlternatives.some((alt) => alt.toLowerCase().includes(q))
  );
}
