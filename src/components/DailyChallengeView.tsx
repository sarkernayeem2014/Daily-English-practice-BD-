import React, { useState, useEffect, useRef } from 'react';
import { SentenceItem, UserProgress } from '../types';
import { getDailyChallengeSentences } from '../utils/dailyChallenge';
import { computeUnlockedTiers } from '../data/tiers';
import { evaluateAnswer, EvaluationResult } from '../utils/evaluator';
import { speakEnglish } from '../utils/speech';
import { playCorrectSound } from '../utils/soundEffects';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  Zap, 
  Volume2, 
  Sparkles, 
  Check, 
  Eye, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface DailyChallengeViewProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onBackToDashboard: () => void;
}

export const DailyChallengeView: React.FC<DailyChallengeViewProps> = ({
  progress,
  onUpdateProgress,
  onBackToDashboard,
}) => {
  const todayDateStr = new Date().toISOString().split('T')[0];
  const challengeSentences = React.useMemo(() => getDailyChallengeSentences(todayDateStr), [todayDateStr]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const currentSentence: SentenceItem = challengeSentences[currentIndex];
  const isCompletedToday = !!progress.completedDailyDates[todayDateStr];

  useEffect(() => {
    setUserInput('');
    setEvalResult(null);
    setHasRevealed(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);

  const handleCheck = () => {
    if (!userInput.trim()) return;
    const result = evaluateAnswer(
      userInput,
      currentSentence.enPrimary,
      currentSentence.enAlternatives
    );
    setEvalResult(result);

    if (result.isCorrect) {
      playCorrectSound(progress.soundEnabled);

      onUpdateProgress((prev) => {
        const newDailyAnswers = { ...prev.todayDailyAnswers, [currentSentence.id]: true };
        const newCorrect = { ...prev.correctIds, [currentSentence.id]: true };
        const newAttempted = { ...prev.attemptedIds, [currentSentence.id]: true };

        // Award XP only once per sentence
        let newXp = prev.xp;
        const newAwardedXp = { ...prev.awardedXpIds };
        if (!newAwardedXp[currentSentence.id]) {
          newXp += 15; // standard correct XP
          newAwardedXp[currentSentence.id] = Date.now();
        }

        // Check if all 5 are completed today
        const completedAllFive = challengeSentences.every((s) => newDailyAnswers[s.id]);
        const newCompletedDailyDates = { ...prev.completedDailyDates };
        const newBadges = { ...prev.earnedBadges };

        if (completedAllFive && !newCompletedDailyDates[todayDateStr]) {
          newCompletedDailyDates[todayDateStr] = true;
          newXp += 75; // Daily challenge completion bonus!
          newBadges['daily-champion'] = { earnedAt: new Date().toISOString() };
        }

        return {
          ...prev,
          todayDailyAnswers: newDailyAnswers,
          correctIds: newCorrect,
          attemptedIds: newAttempted,
          xp: newXp,
          awardedXpIds: newAwardedXp,
          completedDailyDates: newCompletedDailyDates,
          earnedBadges: newBadges,
          unlockedTiers: computeUnlockedTiers(newCorrect, prev.unlockedTiers),
        };
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < challengeSentences.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handlePronounce = async (text: string) => {
    setIsSpeaking(true);
    await speakEnglish(text);
    setIsSpeaking(false);
  };

  const solvedCount = challengeSentences.filter((s) => progress.todayDailyAnswers[s.id]).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
              <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <Target className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                আজকের দৈনিক ৫-বাক্য চ্যালেঞ্জ
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              তারিখ: {todayDateStr} • সম্পন্ন: {solvedCount}/৫ টি বাক্য
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isCompletedToday ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>আজকের চ্যালেঞ্জ সম্পন্ন (+৭৫ XP)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
              <Zap className="w-4 h-4 fill-amber-500" />
              <span>সম্পন্ন করলে ৭৫ XP বোনাস</span>
            </span>
          )}
        </div>
      </div>

      {/* Progress Dots */}
      <div className="grid grid-cols-5 gap-2">
        {challengeSentences.map((s, idx) => {
          const isDone = !!progress.todayDailyAnswers[s.id];
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={s.id}
              onClick={() => setCurrentIndex(idx)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isCurrent
                  ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-md shadow-blue-600/20'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="text-[10px] uppercase font-bold opacity-80">বাক্য {idx + 1}</div>
              <div className="text-xs mt-0.5 flex items-center justify-center gap-1">
                {isDone ? <Check className="w-3.5 h-3.5" /> : `লেভেল ${s.level[0].toUpperCase()}`}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Single Sentence Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            দৈনিক চ্যালেঞ্জ #{currentIndex + 1} of 5
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {currentSentence.level === 'beginner' ? 'প্রাথমিক' : currentSentence.level === 'intermediate' ? 'মধ্যম' : 'উচ্চতর'}
          </span>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            বাংলা বাক্য:
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
            {currentSentence.bn}
          </h2>
        </div>

        <div className="space-y-3">
          <label htmlFor="daily-input" className="block text-xs font-semibold text-slate-600">
            আপনার ইংরেজি অনুবাদ লিখুন:
          </label>
          <input
            id="daily-input"
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
              if (evalResult) setEvalResult(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (!evalResult && userInput.trim()) {
                  handleCheck();
                } else if (evalResult || hasRevealed) {
                  handleNext();
                }
              }
            }}
            placeholder="Write your English translation here..."
            className="w-full px-5 py-4 text-base sm:text-lg bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleCheck}
            disabled={!userInput.trim()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm shadow-md shadow-blue-600/20 active:scale-98 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>উত্তর যাচাই করুন</span>
          </button>

          <button
            onClick={() => setHasRevealed(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm active:scale-98 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>উত্তর দেখুন</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === challengeSentences.length - 1}
              className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback Area */}
        {(evalResult || hasRevealed) && (
          <div className="mt-6 space-y-4 pt-4 border-t border-slate-100 animate-in fade-in duration-200">
            {evalResult && (
              <div
                className={`p-4 rounded-2xl border ${
                  evalResult.isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="font-bold text-sm sm:text-base">{evalResult.feedbackTitle}</div>
                <p className="text-xs sm:text-sm mt-0.5 opacity-90">{evalResult.feedbackMessage}</p>
              </div>
            )}

            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                  আদর্শ ইংরেজি অনুবাদ:
                </span>
                <button
                  onClick={() => handlePronounce(currentSentence.enPrimary)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white text-blue-700 text-xs font-bold border border-blue-200 hover:bg-blue-100 transition-colors shadow-2xs"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse text-blue-600' : ''}`} />
                  <span>উচ্চারণ শুনুন</span>
                </button>
              </div>
              <div className="text-lg font-bold text-slate-900">"{currentSentence.enPrimary}"</div>
              <p className="text-xs text-slate-600 pt-1">
                <strong>ব্যাকরণ টিপস:</strong> {currentSentence.grammarTipBn}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Encouragement note regarding zero penalty */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed text-center">
        💡 <strong>কোনো নেগেটিভ পেনাল্টি নেই:</strong> কোনো দিন ব্যস্ততার কারণে দৈনিক চ্যালেঞ্জ মিস করলেও আপনার পয়েন্ট কাটা যাবে না বা স্ট্রিক ভাঙবে না। নিজের গতিতে আনন্দ নিয়ে ইংরেজি শিখুন!
      </div>
    </div>
  );
};
