import React, { useState, useMemo } from 'react';
import { CategoryId, Level, SentenceItem, UserProgress } from '../types';
import { ALL_SENTENCES } from '../data/sentences';
import { CATEGORIES } from '../data/categories';
import { speakEnglish } from '../utils/speech';
import { 
  Search, 
  Volume2, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  Filter, 
  ArrowLeft, 
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CategoryBrowserProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onBackToDashboard: () => void;
}

export const CategoryBrowser: React.FC<CategoryBrowserProps> = ({
  progress,
  onUpdateProgress,
  onBackToDashboard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<Level | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filteredSentences = useMemo(() => {
    return ALL_SENTENCES.filter((s) => {
      const matchCat = selectedCategory === 'all' || s.category === selectedCategory;
      const matchLvl = selectedLevel === 'all' || s.level === selectedLevel;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.bn.toLowerCase().includes(q) ||
        s.enPrimary.toLowerCase().includes(q) ||
        s.grammarTipBn.toLowerCase().includes(q) ||
        s.enAlternatives.some((alt) => alt.toLowerCase().includes(q));

      return matchCat && matchLvl && matchSearch;
    });
  }, [selectedCategory, selectedLevel, searchQuery]);

  const handlePronounce = async (id: string, text: string) => {
    setPlayingId(id);
    await speakEnglish(text);
    setPlayingId(null);
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

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
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
                সকল বাক্য ভাণ্ডার (৫১০+ বাক্য)
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {filteredSentences.length} টি দৃশ্যমান
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              বাংলা ও ইংরেজি যেকোনো শব্দ দিয়ে অনুসন্ধান করুন এবং উচ্চারণ শুনুন
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="বাংলা বাক্য, ইংরেজি অনুবাদ বা ব্যাকরণ নিয়ম অনুসন্ধান করুন..."
            className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              ক্লিয়ার
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full">
          <div className="flex items-center gap-2 flex-1 w-full sm:w-auto min-w-0 sm:min-w-[200px]">
            <span className="text-xs font-semibold text-slate-500 shrink-0">ক্যাটাগরি:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as CategoryId | 'all')}
              aria-label="ক্যাটাগরি বাছাই করুন"
              className="flex-1 min-w-0 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">সকল ক্যাটাগরি ({ALL_SENTENCES.length})</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameBn}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-1 w-full sm:w-auto min-w-0 sm:min-w-[160px]">
            <span className="text-xs font-semibold text-slate-500 shrink-0">লেভেল:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as Level | 'all')}
              aria-label="লেভেল বাছাই করুন"
              className="flex-1 min-w-0 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">সকল লেভেল</option>
              <option value="beginner">প্রাথমিক (Beginner)</option>
              <option value="intermediate">মধ্যম (Intermediate)</option>
              <option value="advanced">উচ্চতর (Advanced)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sentence Cards List */}
      <div className="space-y-3">
        {filteredSentences.map((s) => {
          const isExpanded = expandedId === s.id;
          const isBookmarked = !!progress.bookmarkedIds[s.id];
          const isMastered = !!progress.correctIds[s.id];
          const categoryObj = CATEGORIES.find((c) => c.id === s.category);

          return (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-blue-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {categoryObj?.nameBn}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {s.level === 'beginner' ? 'প্রাথমিক' : s.level === 'intermediate' ? 'মধ্যম' : 'উচ্চতর'}
                    </span>
                    {isMastered && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        সম্পন্ন ✓
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-0.5">
                    {s.bn}
                  </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handlePronounce(s.id, s.enPrimary)}
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="উচ্চারণ শুনুন"
                  >
                    <Volume2 className={`w-4 h-4 ${playingId === s.id ? 'animate-pulse text-blue-600' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleToggleBookmark(s.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isBookmarked
                        ? 'text-amber-600 hover:bg-amber-50'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                    title="বুকমার্ক"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : s.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                    title={isExpanded ? 'সংক্ষিপ্ত করুন' : 'বিস্তারিত দেখুন'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Translation */}
              <div className="text-sm sm:text-base font-semibold text-blue-700 bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                "{s.enPrimary}"
              </div>

              {/* Expanded details: alternatives, grammar, common mistake */}
              {isExpanded && (
                <div className="space-y-3 pt-2 border-t border-slate-100 text-xs sm:text-sm animate-in fade-in duration-200">
                  {s.enAlternatives.length > 0 && (
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">
                        অন্যান্য গ্রহণযোগ্য অনুবাদ:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {s.enAlternatives.map((alt, i) => (
                          <span
                            key={i}
                            onClick={() => handlePronounce(`${s.id}-alt-${i}`, alt)}
                            className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 px-2.5 py-1 rounded-md text-slate-700 cursor-pointer transition-colors"
                            title="উচ্চারণ শুনতে ক্লিক করুন"
                          >
                            {alt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <strong className="text-indigo-700 block mb-1">ব্যাকরণ টিপস:</strong>
                      <p className="text-slate-600">{s.grammarTipBn}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <strong className="text-blue-700 block mb-1">ব্যবহারিক ব্যাখ্যা:</strong>
                      <p className="text-slate-600">{s.explanationBn}</p>
                    </div>
                  </div>

                  {s.commonMistakeBn && (
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900">
                      <strong className="text-amber-800 block mb-0.5">সাধারণ ভুল ও সতর্কতা:</strong>
                      <p className="text-amber-950">{s.commonMistakeBn}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
