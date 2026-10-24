import React, { useState, useEffect } from 'react';
import { Trophy, Sparkles, X, Check, User } from 'lucide-react';

interface NicknameModalProps {
  isOpen: boolean;
  initialNickname?: string;
  onSave: (nickname: string) => Promise<void> | void;
  onClose?: () => void;
  canDismiss?: boolean;
}

export const NicknameModal: React.FC<NicknameModalProps> = ({
  isOpen,
  initialNickname = '',
  onSave,
  onClose,
  canDismiss = true,
}) => {
  const [nickname, setNickname] = useState(initialNickname);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNickname(initialNickname);
      setError(null);
    }
  }, [isOpen, initialNickname]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed) {
      setError('অনুগ্রহ করে একটি ডাকনাম লিখুন (কমপক্ষে ২ অক্ষর)');
      return;
    }
    if (trimmed.length < 2) {
      setError('ডাকনামটি কমপক্ষে ২ অক্ষরের হতে হবে');
      return;
    }
    if (trimmed.length > 30) {
      setError('ডাকনামটি সর্বোচ্চ ৩০ অক্ষরের মধ্যে রাখুন');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave(trimmed);
      if (onClose) onClose();
    } catch (err) {
      setError('ডাকনাম সংরক্ষণ করতে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-blue-100 p-6 sm:p-7 text-left space-y-5 overflow-hidden">
        {/* Top Decorative Gradient */}
        <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-amber-500 via-blue-600 to-indigo-600" />

        {/* Header & Icon */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-md shadow-amber-500/10">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>লিডারবোর্ড প্রোফাইল</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                আপনার ডাকনাম নির্ধারণ করুন
              </h3>
            </div>
          </div>

          {canDismiss && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Explanatory text */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          লিডারবোর্ডে আপনার অর্জিত পয়েন্ট ও অবস্থান প্রদর্শনের জন্য একটি আকর্ষণীয় ডাকনাম দিন। প্রতিটি সঠিক উত্তরের পয়েন্ট এই নামে যুক্ত হবে।
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>ডাকনাম (Nickname)</span>
              <span className="text-[11px] text-slate-400 font-normal">
                {nickname.length}/30
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  if (error) setError(null);
                }}
                maxLength={30}
                placeholder="যেমন: Tanvir_99 অথবা নিবিড়_পড়ুয়া"
                autoFocus
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            {error && (
              <p className="text-xs text-rose-600 font-medium animate-in fade-in">
                {error}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            {canDismiss && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors text-center cursor-pointer"
              >
                পরে করব
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>সংরক্ষণ হচ্ছে...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>ডাকনাম নিশ্চিত করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
