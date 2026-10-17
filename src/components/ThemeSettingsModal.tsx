import React from 'react';
import { AppTheme, UserProgress } from '../types';
import { 
  Palette, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Eye, 
  X, 
  User, 
  ShieldAlert,
  Check
} from 'lucide-react';

interface ThemeSettingsModalProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onClose: () => void;
}

export const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({
  progress,
  onUpdateProgress,
  onClose,
}) => {
  const themes: { id: AppTheme; nameBn: string; color: string; descBn: string }[] = [
    {
      id: 'classic',
      nameBn: 'ক্লাসিক ব্লু অ্যান্ড হোয়াইট',
      color: 'bg-blue-600',
      descBn: 'আধুনিক ও প্রমিত নীল-সাদা ইন্টারফেস',
    },
    {
      id: 'emerald',
      nameBn: 'এমারেল্ড ফরেস্ট (সবুজের ছোঁয়া)',
      color: 'bg-emerald-600',
      descBn: 'চোখের জন্য শান্ত ও স্নিগ্ধ সবুজ আভা',
    },
    {
      id: 'indigo-gold',
      nameBn: 'রয়্যাল ইন্ডিগো অ্যান্ড গোল্ড',
      color: 'bg-indigo-700',
      descBn: 'অভিজাত রাজকীয় থিম ও স্বর্ণালী ছোঁয়া',
    },
    {
      id: 'midnight',
      nameBn: 'মিডনাইট ডার্ক (ডার্ক মোড)',
      color: 'bg-slate-900',
      descBn: 'রাতে অনুশীলনের উপযোগী চোখের প্রশান্তিদায়ক ডার্ক থিম',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <Palette className="w-5 h-5 text-blue-600" />
            <span>থিম ও অভিজ্ঞতা সেটিংস</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Picker */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            থিম নির্বাচন করুন:
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => onUpdateProgress((prev) => ({ ...prev, theme: t.id }))}
                className={`p-3 rounded-2xl border text-left transition-all relative ${
                  progress.theme === t.id
                    ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-4 h-4 rounded-full ${t.color}`} />
                  <span className="text-xs font-bold text-slate-800">{t.nameBn}</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">{t.descBn}</p>
                {progress.theme === t.id && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
              {progress.soundEnabled ? <Volume2 className="w-5 h-5 text-blue-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">সাউন্ড এফেক্টস (Sound Effects)</div>
              <div className="text-[11px] text-slate-500">সঠিক উত্তর ও লেভেল আপে মিষ্টি সুর বাজবে</div>
            </div>
          </div>
          <button
            onClick={() => onUpdateProgress((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              progress.soundEnabled ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                progress.soundEnabled ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Reduced Motion Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">কম্পন ও কনফেটি অ্যানিমেশন (Reduced Motion)</div>
              <div className="text-[11px] text-slate-500">সংবেদনশীলতার জন্য অ্যানিমেশন সীমিত করুন</div>
            </div>
          </div>
          <button
            onClick={() => onUpdateProgress((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion }))}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              progress.reducedMotion ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                progress.reducedMotion ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Security / LocalStorage Note as Requested */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>ডাটা নিরাপত্তা নোটিশ:</strong> এই অ্যাপে আপনার সমস্ত অগ্রগতি শুধুমাত্র আপনার বর্তমান ব্রাউজারের <code>localStorage</code>-এ সংরক্ষিত থাকে। ব্রাউজার ক্যাশ ক্লিয়ার করলে এটি রিসেট হতে পারে, তাই গাইড পেইজ থেকে JSON ব্যাকআপ সংরক্ষণ করে রাখার পরামর্শ দেওয়া হচ্ছে।
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
        >
          সংরক্ষণ ও বন্ধ করুন
        </button>
      </div>
    </div>
  );
};
