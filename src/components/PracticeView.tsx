import React, { useState, useEffect, useRef } from 'react';
import { BadgeId, CategoryId, Level, SentenceItem, TierLevel, UserProgress } from '../types';
import { CATEGORIES } from '../data/categories';
import { getSentencesByCategoryAndLevel, ALL_SENTENCES } from '../data/sentences';
import { LEVEL_TIERS, getSentencesForTier, getTierInfo, computeUnlockedTiers, isTierUnlocked } from '../data/tiers';
import { BADGES, checkNewBadges } from '../data/badges';
import { evaluateAnswer, EvaluationResult } from '../utils/evaluator';
import { speakEnglish } from '../utils/speech';
import { playCorrectSound, playBadgeUnlockSound } from '../utils/soundEffects';
import { LevelCompleteModal } from './LevelCompleteModal';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Eye, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Keyboard,
  Shuffle,
  Zap,
  Trophy,
  Award
} from 'lucide-react';

interface PracticeViewProps {
  initialTier?: TierLevel;
  initialCategory?: CategoryId | 'all';
  initialLevel?: Level | 'all';
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onBackToDashboard: () => void;
  onOpenReview: () => void;
  onOpenCertificate: () => void;
}

// Convert numbers to Bengali digits (e.g. 5 -> ৫)
export const toBengaliNumber = (num: number): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => bnDigits[parseInt(d, 10)] ?? d);
};

// Locate the first uncompleted sentence or resume target
export const findResumeSentenceIndex = (
  list: SentenceItem[],
  correctIds: Record<string, boolean>,
  targetSentenceId?: string
): number => {
  if (!list || list.length === 0) return 0;

  // 1. If targetSentenceId exists in this list and is NOT yet completed, resume right there
  if (targetSentenceId) {
    const targetIdx = list.findIndex((s) => s.id === targetSentenceId);
    if (targetIdx !== -1 && !correctIds[targetSentenceId]) {
      return targetIdx;
    }
  }

  // 2. Otherwise find the FIRST sentence in the list that is not yet completed
  const firstUnfinished = list.findIndex((s) => !correctIds[s.id]);
  if (firstUnfinished !== -1) {
    return firstUnfinished;
  }

  // 3. If all sentences are completed, return 0
  return 0;
};

export const PracticeView: React.FC<PracticeViewProps> = ({
  initialTier,
  initialCategory = 'all',
  initialLevel = 'all',
  progress,
  onUpdateProgress,
  onBackToDashboard,
  onOpenReview,
  onOpenCertificate,
}) => {
  const effectiveInitialTier: TierLevel = initialTier || progress.lastLevel || 1;
  const [activeTier, setActiveTier] = useState<TierLevel | null>(effectiveInitialTier);
  const [category, setCategory] = useState<CategoryId | 'all'>(initialCategory);
  const [level, setLevel] = useState<Level | 'all'>(initialLevel);
  const [isReviewingAll, setIsReviewingAll] = useState<boolean>(false);

  // Compute sentence list based on whether a Tier or Category is active
  const sentenceList = React.useMemo(() => {
    if (activeTier) {
      return getSentencesForTier(activeTier);
    }
    const list = getSentencesByCategoryAndLevel(category, level);
    return list.length > 0 ? list : ALL_SENTENCES.slice(0, 50);
  }, [activeTier, category, level]);

  // Initialize directly at the first uncompleted sentence (no flicker to sentence #1)
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const list = effectiveInitialTier
      ? getSentencesForTier(effectiveInitialTier)
      : getSentencesByCategoryAndLevel(initialCategory, initialLevel);
    const targetList = list.length > 0 ? list : ALL_SENTENCES.slice(0, 50);
    return findResumeSentenceIndex(targetList, progress.correctIds, progress.lastSentenceId);
  });

  const [userInput, setUserInput] = useState<string>('');
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [hasRevealedAnswer, setHasRevealedAnswer] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [userOverridden, setUserOverridden] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<BadgeId[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Sync when initialTier prop changes from parent
  useEffect(() => {
    if (initialTier && initialTier !== activeTier) {
      setActiveTier(initialTier);
      setIsReviewingAll(false);
      const list = getSentencesForTier(initialTier);
      const nextIdx = findResumeSentenceIndex(list, progress.correctIds, progress.lastSentenceId);
      setCurrentIndex(nextIdx);
      if (list[nextIdx] && !progress.correctIds[list[nextIdx].id]) {
        onUpdateProgress((prev) => ({
          ...prev,
          lastLevel: initialTier,
          lastSentenceId: list[nextIdx].id,
        }));
      }
    }
  }, [initialTier]);

  const currentSentence: SentenceItem = sentenceList[currentIndex] || sentenceList[0] || ALL_SENTENCES[0];

  // Auto-save lastLevel and lastSentenceId for uncompleted sentence
  useEffect(() => {
    if (currentSentence && !progress.correctIds[currentSentence.id]) {
      if (progress.lastSentenceId !== currentSentence.id || progress.lastLevel !== activeTier) {
        onUpdateProgress((prev) => ({
          ...prev,
          lastLevel: activeTier || prev.lastLevel || 1,
          lastSentenceId: currentSentence.id,
        }));
      }
    }
  }, [currentSentence?.id, activeTier]);

  // Auto-focus input when sentence changes
  useEffect(() => {
    setUserInput(progress.userAnswers[currentSentence.id] || '');
    setEvalResult(null);
    setHasRevealedAnswer(false);
    setUserOverridden(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, currentSentence.id]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!evalResult && !hasRevealedAnswer && userInput.trim()) {
          handleCheckAnswer();
        } else if (evalResult || hasRevealedAnswer) {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userInput, evalResult, hasRevealedAnswer, currentIndex]);

  const handleCheckAnswer = () => {
    if (!userInput.trim()) return;

    const result = evaluateAnswer(
      userInput,
      currentSentence.enPrimary,
      currentSentence.enAlternatives
    );
    setEvalResult(result);

    const isCorrect = result.isCorrect;

    if (isCorrect) {
      playCorrectSound(progress.soundEnabled);
    }

    onUpdateProgress((prev) => {
      const newAttempted = { ...prev.attemptedIds, [currentSentence.id]: true };
      const newCorrect = { ...prev.correctIds };
      const newStruggle = { ...prev.struggleIds };
      const wasStruggling = !!prev.struggleIds[currentSentence.id];

      let earnedXp = 0;
      const newAwardedXp = { ...prev.awardedXpIds };

      if (isCorrect) {
        newCorrect[currentSentence.id] = true;
        delete newStruggle[currentSentence.id];

        // Anti-farming check: award XP only once per sentence
        if (!newAwardedXp[currentSentence.id]) {
          earnedXp = wasStruggling ? 8 : 15; // +15 for new correct, +8 for correcting a struggled sentence
          newAwardedXp[currentSentence.id] = Date.now();
        }
      } else {
        newStruggle[currentSentence.id] = true;
      }

      const newAnswers = { ...prev.userAnswers, [currentSentence.id]: userInput };
      const currentConsecutive = isCorrect ? prev.consecutiveCorrect + 1 : 0;
      const maxConsecutive = Math.max(prev.maxConsecutiveCorrect, currentConsecutive);

      // Track grammar viewed
      const newGrammarViewed = { ...prev.grammarTipsViewedIds, [currentSentence.id]: true };

      // Check badges
      const simulated: UserProgress = {
        ...prev,
        attemptedIds: newAttempted,
        correctIds: newCorrect,
        struggleIds: newStruggle,
        awardedXpIds: newAwardedXp,
        xp: prev.xp + earnedXp,
        consecutiveCorrect: currentConsecutive,
        maxConsecutiveCorrect: maxConsecutive,
        grammarTipsViewedIds: newGrammarViewed,
      };

      const newBadgesList = checkNewBadges(simulated);
      let badgeBonusXp = 0;
      const updatedBadges = { ...prev.earnedBadges };

      if (newBadgesList.length > 0) {
        newBadgesList.forEach((bId) => {
          updatedBadges[bId] = { earnedAt: new Date().toISOString() };
          const badge = BADGES.find((b) => b.id === bId);
          if (badge) {
            badgeBonusXp += badge.xpBonus;
          }
        });
        setNewlyUnlockedBadges(newBadgesList);
        playBadgeUnlockSound(prev.soundEnabled);
      }

      // Check tier unlocking condition immediately using unique completed sentence IDs
      const updatedUnlockedTiers = computeUnlockedTiers(newCorrect, prev.unlockedTiers);

      return {
        ...simulated,
        xp: simulated.xp + badgeBonusXp,
        earnedBadges: updatedBadges,
        unlockedTiers: updatedUnlockedTiers,
        userAnswers: newAnswers,
        totalScore: Object.keys(newCorrect).length * 10,
        lastLevel: activeTier || prev.lastLevel || 1,
        lastSentenceId: currentSentence.id,
      };
    });

    // Check if this was the last uncompleted sentence in this set
    const remainingUncompleted = sentenceList.filter(
      (s) => s.id !== currentSentence.id && !progress.correctIds[s.id]
    ).length;

    if (activeTier && isCorrect && remainingUncompleted === 0) {
      setTimeout(() => {
        setShowCompletionModal(true);
      }, 700);
    }
  };

  const handleShowAnswer = () => {
    setHasRevealedAnswer(true);
    onUpdateProgress((prev) => ({
      ...prev,
      attemptedIds: { ...prev.attemptedIds, [currentSentence.id]: true },
      struggleIds: { ...prev.struggleIds, [currentSentence.id]: true },
      grammarTipsViewedIds: { ...prev.grammarTipsViewedIds, [currentSentence.id]: true },
      lastLevel: activeTier || prev.lastLevel || 1,
      lastSentenceId: currentSentence.id,
    }));
  };

  // Skip over any sentences that are already completed and go to the next uncompleted one
  const handleNext = () => {
    const isAllDone = sentenceList.every((s) => progress.correctIds[s.id]);

    if (isAllDone || isReviewingAll) {
      if (currentIndex < sentenceList.length - 1) {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        if (!progress.correctIds[sentenceList[nextIdx].id]) {
          onUpdateProgress((prev) => ({
            ...prev,
            lastLevel: activeTier || prev.lastLevel || 1,
            lastSentenceId: sentenceList[nextIdx].id,
          }));
        }
      } else {
        if (activeTier) {
          setShowCompletionModal(true);
        }
        setIsReviewingAll(false);
      }
      return;
    }

    // Search forward from currentIndex + 1 for next uncompleted sentence
    let nextUncompletedIndex = -1;
    for (let i = currentIndex + 1; i < sentenceList.length; i++) {
      const sId = sentenceList[i].id;
      const isDone = !!progress.correctIds[sId] || (evalResult?.isCorrect && sId === currentSentence.id);
      if (!isDone) {
        nextUncompletedIndex = i;
        break;
      }
    }

    // If none found after currentIndex, wrap around from 0 to currentIndex - 1
    if (nextUncompletedIndex === -1) {
      for (let i = 0; i < currentIndex; i++) {
        const sId = sentenceList[i].id;
        const isDone = !!progress.correctIds[sId] || (evalResult?.isCorrect && sId === currentSentence.id);
        if (!isDone) {
          nextUncompletedIndex = i;
          break;
        }
      }
    }

    if (nextUncompletedIndex !== -1) {
      setCurrentIndex(nextUncompletedIndex);
      onUpdateProgress((prev) => ({
        ...prev,
        lastLevel: activeTier || prev.lastLevel || 1,
        lastSentenceId: sentenceList[nextUncompletedIndex].id,
      }));
    } else {
      // Every sentence in this level is now completed!
      if (activeTier) {
        setShowCompletionModal(true);
      }
    }
  };

  // Revisit old sentence manually without breaking the resume state
  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      if (!progress.correctIds[sentenceList[prevIdx].id]) {
        onUpdateProgress((prev) => ({
          ...prev,
          lastLevel: activeTier || prev.lastLevel || 1,
          lastSentenceId: sentenceList[prevIdx].id,
        }));
      }
    }
  };

  const handleSelectTier = (newTier: TierLevel) => {
    setActiveTier(newTier);
    setIsReviewingAll(false);
    const newTierList = getSentencesForTier(newTier);
    const resumeIdx = findResumeSentenceIndex(newTierList, progress.correctIds, progress.lastSentenceId);
    setCurrentIndex(resumeIdx);
    if (newTierList[resumeIdx] && !progress.correctIds[newTierList[resumeIdx].id]) {
      onUpdateProgress((prev) => ({
        ...prev,
        lastLevel: newTier,
        lastSentenceId: newTierList[resumeIdx].id,
      }));
    }
  };

  const handleSelectCategory = (newCat: CategoryId | 'all') => {
    setCategory(newCat);
    setActiveTier(null);
    setIsReviewingAll(false);
    const list = getSentencesByCategoryAndLevel(newCat, level);
    const targetList = list.length > 0 ? list : ALL_SENTENCES.slice(0, 50);
    const resumeIdx = findResumeSentenceIndex(targetList, progress.correctIds);
    setCurrentIndex(resumeIdx);
  };

  const handleRandom = () => {
    const randIndex = Math.floor(Math.random() * sentenceList.length);
    setCurrentIndex(randIndex);
  };

  const handlePronounce = async (text: string) => {
    setIsSpeaking(true);
    await speakEnglish(text);
    setIsSpeaking(false);
  };

  const handleToggleBookmark = () => {
    onUpdateProgress((prev) => {
      const newBookmarked = { ...prev.bookmarkedIds };
      if (newBookmarked[currentSentence.id]) {
        delete newBookmarked[currentSentence.id];
      } else {
        newBookmarked[currentSentence.id] = true;
      }
      return {
        ...prev,
        bookmarkedIds: newBookmarked,
      };
    });
  };

  const handleSelfOverride = () => {
    setUserOverridden(true);
    onUpdateProgress((prev) => {
      const newCorrect = { ...prev.correctIds, [currentSentence.id]: true };
      const newStruggle = { ...prev.struggleIds };
      delete newStruggle[currentSentence.id];

      let newXp = prev.xp;
      const newAwarded = { ...prev.awardedXpIds };
      if (!newAwarded[currentSentence.id]) {
        newXp += 15;
        newAwarded[currentSentence.id] = Date.now();
      }

      // Check tier unlocking condition immediately using unique completed sentence IDs
      const updatedUnlockedTiers = computeUnlockedTiers(newCorrect, prev.unlockedTiers);

      return {
        ...prev,
        correctIds: newCorrect,
        struggleIds: newStruggle,
        xp: newXp,
        awardedXpIds: newAwarded,
        unlockedTiers: updatedUnlockedTiers,
        totalScore: Object.keys(newCorrect).length * 10,
      };
    });
  };

  const isBookmarked = !!progress.bookmarkedIds[currentSentence.id];
  const isMastered = !!progress.correctIds[currentSentence.id];
  const currentCategoryInfo = CATEGORIES.find((c) => c.id === currentSentence.category);
  const tierInfo = activeTier ? getTierInfo(activeTier) : null;

  // Completed in this tier
  const tierCompletedCount = sentenceList.filter((s) => progress.correctIds[s.id]).length;
  const isAllTierCompleted = sentenceList.length > 0 && tierCompletedCount === sentenceList.length;
  const tierAccuracy = sentenceList.filter((s) => progress.attemptedIds[s.id]).length > 0
    ? Math.round((tierCompletedCount / sentenceList.filter((s) => progress.attemptedIds[s.id]).length) * 100)
    : 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Filter and Navigation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="ড্যাশবোর্ডে ফিরুন"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm sm:text-base">
                {tierInfo ? tierInfo.titleBn : currentCategoryInfo?.nameBn || 'সকল ক্যাটাগরি'}
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {activeTier ? `Tier ${activeTier}` : currentSentence.level}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              বাক্য {toBengaliNumber(currentIndex + 1)} / {toBengaliNumber(sentenceList.length)} ({toBengaliNumber(tierCompletedCount)}টি সম্পন্ন)
            </p>
          </div>
        </div>

        {/* Level / Tier Picker or Category Picker */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {activeTier ? (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl min-w-max">
              {LEVEL_TIERS.map((t) => {
                const unlocked = progress.unlockedTiers.includes(t.tier);
                return (
                  <button
                    key={t.tier}
                    disabled={!unlocked}
                    onClick={() => handleSelectTier(t.tier)}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeTier === t.tier
                        ? 'bg-white text-blue-700 shadow-xs'
                        : unlocked
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-slate-300 cursor-not-allowed'
                    }`}
                  >
                    L{t.tier} {!unlocked && '🔒'}
                  </button>
                );
              })}
            </div>
          ) : (
            <select
              value={category}
              onChange={(e) => handleSelectCategory(e.target.value as CategoryId | 'all')}
              aria-label="ক্যাটাগরি নির্বাচন করুন"
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">সকল ক্যাটাগরি</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameBn}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleRandom}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200"
            title="এলোমেলো বাক্য (Random Sentence)"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar of Current Set */}
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden shadow-inner">
        <div
          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / sentenceList.length) * 100}%` }}
        />
      </div>

      {/* If all sentences in level are completed and user is not in review mode */}
      {isAllTierCompleted && !isReviewingAll ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Trophy className="w-10 h-10 animate-bounce duration-1000" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>১০০% সম্পন্ন</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              এই লেভেলের সব বাক্য সম্পন্ন!
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
              অভিনন্দন! আপনি {tierInfo ? tierInfo.titleBn : 'এই লেভেলের'} সবকটি বাক্য সফলভাবে সম্পন্ন করেছেন।
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-md mx-auto text-center">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-slate-500 block">মোট বাক্য</span>
              <span className="text-lg font-black text-slate-900">{sentenceList.length}টি</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-slate-500 block">নির্ভুলতা</span>
              <span className="text-lg font-black text-emerald-600">{tierAccuracy}%</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-slate-500 block">অর্জিত XP</span>
              <span className="text-lg font-black text-amber-600">+{tierCompletedCount * 15}</span>
            </div>
          </div>

          {/* Actions: Next Unlocked Level / Review Completed / Dashboard */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {activeTier && activeTier < 5 && isTierUnlocked((activeTier + 1) as TierLevel, progress.unlockedTiers) ? (
              <button
                onClick={() => handleSelectTier((activeTier + 1) as TierLevel)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base shadow-md shadow-blue-600/20 active:scale-98 transition-all cursor-pointer"
              >
                <span>পরবর্তী লেভেল শুরু করুন ({getTierInfo((activeTier + 1) as TierLevel).titleBn})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenCertificate}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm sm:text-base shadow-md shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
              >
                <Trophy className="w-5 h-5" />
                <span>কোর্স প্রশংসাপত্র দেখুন</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsReviewingAll(true);
                setCurrentIndex(0);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm active:scale-98 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>সম্পন্ন বাক্যগুলো পুনরাবৃত্তি করুন</span>
            </button>

            <button
              onClick={onBackToDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-medium text-sm transition-all cursor-pointer"
            >
              <span>ড্যাশবোর্ডে ফিরুন</span>
            </button>
          </div>
        </div>
      ) : (
        /* Main Single-Sentence Practice Card */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
          {/* Review mode alert if user clicked to review finished level */}
          {isReviewingAll && (
            <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-blue-900">
              <span className="font-semibold flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                পুনরাবৃত্তি মোড: আপনি এই লেভেলের সম্পন্ন বাক্যগুলো পুনরাবৃত্তি করছেন।
              </span>
              <button
                onClick={() => setIsReviewingAll(false)}
                className="font-bold underline text-blue-700 hover:text-blue-900 text-left sm:text-right shrink-0 cursor-pointer"
              >
                সমাপ্তি সামারি দেখুন
              </button>
            </div>
          )}

          {/* Top Badges & Bookmark */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                Sentence #{currentIndex + 1}
              </span>
              {isMastered && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <Check className="w-3 h-3" /> আয়ত্তে এসেছে (+১৫ XP অর্জিত)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleBookmark}
                className={`p-2 rounded-xl transition-colors ${
                  isBookmarked
                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title={isBookmarked ? 'বুকমার্ক সরানো হয়েছে' : 'রিভিশনের জন্য বুকমার্ক করুন'}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-5 h-5 fill-amber-500 text-amber-600" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

        {/* Bengali Prompt Sentence */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            বাংলা বাক্য:
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug tracking-tight">
            {currentSentence.bn}
          </h2>
        </div>

        {/* Translation Input Form */}
        <div className="space-y-3">
          <label htmlFor="english-input" className="block text-xs font-semibold text-slate-600">
            ইংরেজি অনুবাদ লিখুন:
          </label>
          <div className="relative">
            <input
              id="english-input"
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => {
                setUserInput(e.target.value);
                if (evalResult) setEvalResult(null);
              }}
              placeholder="Write your English translation here... (যেমন: I wake up at 6 AM)"
              className="w-full px-5 py-4 text-base sm:text-lg bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-slate-800 placeholder:text-slate-400"
            />
            {userInput && (
              <button
                onClick={() => setUserInput('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 p-1"
              >
                মুছুন
              </button>
            )}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className="flex items-center gap-1">
              <Keyboard className="w-3.5 h-3.5" /> <strong>Enter</strong> চাপুন উত্তর যাচাই বা পরবর্তী বাক্যের জন্য
            </span>
            <span>সঠিক উত্তরে +১৫ XP</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleCheckAnswer}
            disabled={!userInput.trim()}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm shadow-md shadow-blue-600/20 active:scale-98 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>উত্তর যাচাই করুন</span>
          </button>

          <button
            onClick={handleShowAnswer}
            className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm active:scale-98 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>উত্তর দেখুন</span>
          </button>

          <div className="flex items-center gap-2 ml-auto w-full sm:w-auto justify-end">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              title="পূর্ববর্তী বাক্য"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm active:scale-98 transition-all"
            >
              <span>{currentIndex === sentenceList.length - 1 ? 'লেভেল সমাপ্ত করুন' : 'পরবর্তী বাক্য'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rich Feedback & Explanation Box */}
        {(evalResult || hasRevealedAnswer) && (
          <div className="mt-8 space-y-5 animate-in fade-in duration-300">
            {/* Result Status Banner */}
            {evalResult && (
              <div
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center gap-3.5 ${
                  evalResult.isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : evalResult.isClose
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {evalResult.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : evalResult.isClose ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm sm:text-base">
                    {evalResult.feedbackTitle}
                  </h3>
                  <p className="text-xs sm:text-sm mt-0.5 opacity-90 leading-relaxed">
                    {evalResult.feedbackMessage}
                  </p>
                </div>

                {!evalResult.isCorrect && !userOverridden && (
                  <button
                    onClick={handleSelfOverride}
                    className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-100/50 shadow-xs transition-colors"
                    title="আমার অনুবাদ সঠিক ছিল তবে অন্য শব্দ ব্যবহৃত হয়েছে"
                  >
                    আমার উত্তর সঠিক ছিল?
                  </button>
                )}
                {userOverridden && (
                  <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-md border border-emerald-300">
                    সঠিক হিসেবে গ্রহণ করা হয়েছে ✓
                  </span>
                )}
              </div>
            )}

            {/* Model English Answer Card with Audio Speaker */}
            <div className="bg-blue-50/70 border border-blue-200/90 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> আদর্শ মডেল ইংরেজি অনুবাদ:
                </span>
                <button
                  onClick={() => handlePronounce(currentSentence.enPrimary)}
                  disabled={isSpeaking}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-colors shadow-xs"
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse text-blue-600' : ''}`} />
                  <span>উচ্চারণ শুনুন</span>
                </button>
              </div>

              <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                "{currentSentence.enPrimary}"
              </div>

              {/* Alternative Accepted Translations */}
              {currentSentence.enAlternatives.length > 0 && (
                <div className="pt-2 border-t border-blue-200/60">
                  <span className="text-xs font-semibold text-slate-600 block mb-1.5">
                    অন্যান্য গ্রহণযোগ্য বিকল্প অনুবাদসমূহ:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentSentence.enAlternatives.map((alt, idx) => (
                      <span
                        key={idx}
                        onClick={() => handlePronounce(alt)}
                        className="inline-flex items-center gap-1 text-xs bg-white text-slate-700 border border-blue-200 px-2.5 py-1 rounded-lg hover:border-blue-400 cursor-pointer transition-colors"
                        title="উচ্চারণ শুনতে ক্লিক করুন"
                      >
                        <Volume2 className="w-3 h-3 text-blue-500" />
                        <span>{alt}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bengali Grammar & Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>প্রয়োজনীয় ব্যাকরণ ও নিয়ম:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {currentSentence.grammarTipBn}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>অর্থ ও ব্যবহারিক ব্যাখ্যা:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {currentSentence.explanationBn}
                </p>
              </div>
            </div>

            {/* Common Bangladeshi Mistake Warning */}
            {currentSentence.commonMistakeBn && (
              <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    বাংলাদেশি শিক্ষার্থীদের সাধারণ ভুল:
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                    {currentSentence.commonMistakeBn}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      )}

      {/* Level Completion Celebration Modal */}
      {showCompletionModal && tierInfo && (
        <LevelCompleteModal
          tierInfo={tierInfo}
          completedCount={tierCompletedCount}
          accuracyRate={tierAccuracy}
          xpEarned={tierCompletedCount * 15}
          unlockedBadgeIds={newlyUnlockedBadges}
          soundEnabled={progress.soundEnabled}
          reducedMotion={progress.reducedMotion}
          onContinueNext={() => {
            setShowCompletionModal(false);
            if (activeTier && activeTier < 5) {
              const nextTier = (activeTier + 1) as TierLevel;
              handleSelectTier(nextTier);
            } else {
              onOpenCertificate();
            }
          }}
          onReplayLevel={() => {
            setShowCompletionModal(false);
            setIsReviewingAll(true);
            setCurrentIndex(0);
          }}
          onClose={() => {
            setShowCompletionModal(false);
            onBackToDashboard();
          }}
        />
      )}
    </div>
  );
};
