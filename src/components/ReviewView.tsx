import React, { useState } from 'react';
import { SentenceItem, UserProgress, CategoryId } from '../types';
import { ALL_SENTENCES, getSentenceById } from '../data/sentences';
import { CATEGORIES } from '../data/categories';
import { computeUnlockedTiers } from '../data/tiers';
import { speakEnglish } from '../utils/speech';
import { 
  RotateCcw, 
  Trash2, 
  Volume2, 
  Check, 
  Play, 
  AlertCircle, 
  Bookmark, 
  Sparkles, 
  ArrowLeft,
  Filter,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface ReviewViewProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onStartPracticeSpecific: (sentenceIds: string[]) => void;
  onBackToDashboard: () => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  progress,
  onUpdateProgress,
  onStartPracticeSpecific,
  onBackToDashboard,
}) => {
  const [tab, setTab] = useState<'all' | 'struggled' | 'bookmarked'>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Gather struggle and bookmarked sentence objects
  const struggleItems = Object.keys(progress.struggleIds)
    .map((id) => getSentenceById(id))
    .filter((s): s is SentenceItem => !!s);

  const bookmarkItems = Object.keys(progress.bookmarkedIds)
    .map((id) => getSentenceById(id))
    .filter((s): s is SentenceItem => !!s);

  // Unified items
  const combinedMap = new Map<string, SentenceItem>();
  if (tab === 'all' || tab === 'struggled') {
    struggleItems.forEach((s) => combinedMap.set(s.id, s));
  }
  if (tab === 'all' || tab === 'bookmarked') {
    bookmarkItems.forEach((s) => combinedMap.set(s.id, s));
  }

  const reviewList = Array.from(combinedMap.values()).filter((item) => {
    return selectedCategory === 'all' || item.category === selectedCategory;
  });

  const handlePronounce = async (id: string, text: string) => {
    setPlayingId(id);
    await speakEnglish(text);
    setPlayingId(null);
  };

  const handleRemoveStruggle = (id: string) => {
    onUpdateProgress((prev) => {
      const newStruggle = { ...prev.struggleIds };
      delete newStruggle[id];
      const newCorrect = { ...prev.correctIds, [id]: true };

      // Reward improvement with XP (+8 XP)
      let newXp = prev.xp;
      const newAwardedXp = { ...prev.awardedXpIds };
      if (!newAwardedXp[id]) {
        newXp += 8;
        newAwardedXp[id] = Date.now();
      }

      return {
        ...prev,
        struggleIds: newStruggle,
        correctIds: newCorrect,
        xp: newXp,
        awardedXpIds: newAwardedXp,
        unlockedTiers: computeUnlockedTiers(newCorrect, prev.unlockedTiers),
        totalScore: Object.keys(newCorrect).length * 10,
      };
    });
  };

  const handleToggleBookmark = (id: string) => {
    onUpdateProgress((prev) => {
      const newBookmarks = { ...prev.bookmarkedIds };
      if (newBookmarks[id]) {
        delete newBookmarks[id];
      } else {
        newBookmarks[id] = true;
      }
      return {
        ...prev,
        bookmarkedIds: newBookmarks,
      };
    });
  };

  const handleClearAllStruggles = () => {
    if (window.confirm('আপনি কি সত্যিই সম্পূর্ণ রিভিশন তালিকা খালি করতে চান?')) {
      onUpdateProgress((prev) => ({
        ...prev,
        struggleIds: {},
      }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
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
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                রিভিউ ও ভুল সংশোধন তালিকা
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {reviewList.length} টি বাক্য
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              যেসব বাক্য সমাধানে দ্বিধা হয়েছিল বা যা আপনি পরবর্তীতে রিভিশনের জন্য বুকমার্ক করেছেন
            </p>
          </div>
        </div>

        {reviewList.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onStartPracticeSpecific(reviewList.map((s) => s.id))}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>এই বাক্যগুলো প্র্যাকটিস করুন</span>
            </button>

            <button
              onClick={handleClearAllStruggles}
              className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
              title="রিভিশন তালিকা খালি করুন"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filter and Tab Controller */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tab Pills */}
        <div className="w-full sm:w-auto overflow-x-auto scrollbar-none py-0.5">
          <div className="inline-flex sm:flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl min-w-max">
            <button
              onClick={() => setTab('all')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                tab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সব ({struggleItems.length + bookmarkItems.length})
            </button>
            <button
              onClick={() => setTab('struggled')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                tab === 'struggled'
                  ? 'bg-white text-amber-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ভুল হওয়া বাক্য ({struggleItems.length})
            </button>
            <button
              onClick={() => setTab('bookmarked')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                tab === 'bookmarked'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              বুকমার্ক করা ({bookmarkItems.length})
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as CategoryId | 'all')}
            aria-label="ক্যাটাগরি অনুযায়ী ফিল্টার করুন"
            className="w-full sm:w-48 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">সকল ক্যাটাগরি</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameBn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Review Sentence List */}
      {reviewList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            চমৎকার! আপনার কোনো রিভিশন বাক্য বাকি নেই
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            আপনি অনুশীলনের সময় যে বাক্যগুলো ভুল করবেন বা বুকমার্ক করে রাখবেন, সেগুলো এখানে স্বয়ংক্রিয়ভাবে জমা হবে।
          </p>
          <button
            onClick={onBackToDashboard}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors"
          >
            নতুন প্র্যাকটিস শুরু করুন
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviewList.map((sentence) => {
            const isBookmarked = !!progress.bookmarkedIds[sentence.id];
            const isStruggling = !!progress.struggleIds[sentence.id];
            const lastAnswer = progress.userAnswers[sentence.id];

            return (
              <div
                key={sentence.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {CATEGORIES.find((c) => c.id === sentence.category)?.nameBn}
                      </span>
                      {isStruggling && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          ভুল হয়েছিল
                        </span>
                      )}
                      {isBookmarked && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          বুকমার্ক করা
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {sentence.bn}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handlePronounce(sentence.id, sentence.enPrimary)}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="উচ্চারণ শুনুন"
                    >
                      <Volume2 className={`w-4 h-4 ${playingId === sentence.id ? 'animate-pulse text-blue-600' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleToggleBookmark(sentence.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isBookmarked
                          ? 'text-amber-600 hover:bg-amber-50'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                      title="বুকমার্ক পরিবর্তন করুন"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>

                    {isStruggling && (
                      <button
                        onClick={() => handleRemoveStruggle(sentence.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        title="আয়ত্তে এসেছে (তালিকা থেকে সরান)"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Model and Alternatives */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-700">সঠিক ইংরেজি:</span>
                    <span className="text-sm font-semibold text-slate-900">"{sentence.enPrimary}"</span>
                  </div>

                  {lastAnswer && (
                    <div className="text-xs text-slate-500">
                      আপনার পূর্ববর্তী প্রচেষ্টা: <span className="text-rose-600 font-medium line-through">"{lastAnswer}"</span>
                    </div>
                  )}

                  {sentence.enAlternatives.length > 0 && (
                    <div className="text-xs text-slate-600 flex flex-wrap gap-1.5 pt-1">
                      <span className="text-slate-400 font-medium">বিকল্প:</span>
                      {sentence.enAlternatives.map((alt, i) => (
                        <span key={i} className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700">
                          {alt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Grammar Tip */}
                <div className="text-xs text-slate-600 flex items-start gap-2 pt-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>টিপস:</strong> {sentence.grammarTipBn}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
