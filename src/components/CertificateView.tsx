import React, { useState } from 'react';
import { UserProgress } from '../types';
import { 
  Printer, 
  ArrowLeft, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Trophy, 
  Calendar,
  CheckCircle2,
  FileCheck2,
  Edit2
} from 'lucide-react';

interface CertificateViewProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onBackToDashboard: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  progress,
  onUpdateProgress,
  onBackToDashboard,
}) => {
  const [name, setName] = useState(progress.studentName || 'মোঃ তাওহীদ হাসান');
  const [isEditing, setIsEditing] = useState(!progress.studentName);

  const handleSaveName = () => {
    onUpdateProgress((prev) => ({ ...prev, studentName: name.trim() }));
    setIsEditing(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const todayFormatted = new Date().toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const totalCorrect = Object.keys(progress.correctIds).length;
  const certificateId = `DEP-BD-${Math.abs((progress.xp * 7919) % 899999 + 100000)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Non-printed control header */}
      <div className="print:hidden bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="ড্যাশবোর্ডে ফিরুন"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              কোর্স সমাপনী সার্টিফিকেট (Certificate of Achievement)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              আপনার ইংরেজি অনুবাদ অনুশীলন সম্পন্ন করার আনুষ্ঠানিক প্রশংসাপত্র
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 active:scale-98 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট / PDF সংরক্ষণ করুন</span>
          </button>
        </div>
      </div>

      {/* Name Input Bar (Non-printed) */}
      <div className="print:hidden bg-blue-50 border border-blue-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Edit2 className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-blue-900">সার্টিফিকেটে প্রদর্শিত নাম:</span>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার পূর্ণ নাম লিখুন (বাংলা বা ইংরেজি)"
              className="flex-1 sm:flex-initial min-w-0 px-3 py-1.5 text-xs bg-white border border-blue-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <button
              onClick={handleSaveName}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shrink-0"
            >
              সংরক্ষণ
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-blue-950">{name}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              (পরিবর্তন করুন)
            </button>
          </div>
        )}
      </div>

      {/* Ornate Printable Certificate */}
      <div className="relative bg-amber-50/20 rounded-3xl border-4 sm:border-8 border-double border-amber-600/40 p-4 sm:p-14 shadow-xl text-center space-y-6 overflow-hidden print:border-amber-800 print:shadow-none print:m-0 print:p-8">
        {/* Subtle Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
          <Award className="w-96 h-96 text-amber-900" />
        </div>

        {/* Certificate Header Emblem */}
        <div className="relative z-10 flex flex-col items-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-600/20 mx-auto">
            <Trophy className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold tracking-[0.25em] text-amber-800 uppercase">
            Certificate of Accomplishment
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight">
            Daily English Practice BD
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            বাংলা থেকে ইংরেজি অনুবাদ ও ব্যবহারিক দক্ষতা অর্জন প্রশংসাপত্র
          </p>
        </div>

        {/* Certificate Recipient Presentation */}
        <div className="relative z-10 space-y-3 py-4">
          <p className="text-xs sm:text-sm text-slate-600 font-medium italic">
            এই প্রশংসাপত্র সগৌরবে প্রদান করা হচ্ছে
          </p>
          <div className="text-2xl sm:text-4xl font-extrabold text-blue-900 border-b-2 border-amber-400/60 pb-2 inline-block px-8 tracking-tight font-serif">
            {name || 'কৃতী শিক্ষার্থী'}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed pt-2">
            যিনি <strong>Daily English Practice BD</strong> প্ল্যাটফর্মে নিষ্ঠার সাথে বাংলা বাক্য ইংরেজিতে রূপান্তর, 
            যথাযথ ব্যাকরণ অনুধাবন এবং ভাষা অনুশীলনের মাধ্যমে <strong>{totalCorrect}টি বাক্য</strong> সফলভাবে আয়ত্ত 
            করে অনন্য অধ্যবসায়ের প্রমাণ দিয়েছেন।
          </p>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 grid grid-cols-3 gap-4 max-w-lg mx-auto py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">মোট XP অর্জিত</span>
            <span className="text-base sm:text-lg font-extrabold text-amber-700">{progress.xp} XP</span>
          </div>
          <div className="border-x border-amber-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">সর্বোচ্চ ধারাবাহিকতা</span>
            <span className="text-base sm:text-lg font-extrabold text-blue-700">{progress.personalBestStreak} দিন</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">সার্টিফিকেট নং</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-slate-800">{certificateId}</span>
          </div>
        </div>

        {/* Footer Signatures and Date */}
        <div className="relative z-10 pt-6 flex items-end justify-between border-t border-amber-200 text-xs">
          <div className="text-left space-y-1">
            <div className="font-mono text-slate-700 font-semibold">{todayFormatted}</div>
            <div className="text-[10px] text-slate-500">ইস্যুর তারিখ</div>
          </div>

          {/* Golden Seal */}
          <div className="w-16 h-16 rounded-full border-4 border-amber-500 bg-amber-100/80 flex flex-col items-center justify-center text-amber-800 font-bold text-[9px] shadow-sm">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <span>VERIFIED</span>
          </div>

          <div className="text-right space-y-1">
            <div className="font-serif italic font-bold text-blue-900 text-sm">Academic Lead</div>
            <div className="text-[10px] text-slate-500">Daily English Practice BD</div>
          </div>
        </div>

        {/* Explicit Disclosure as Required */}
        <div className="relative z-10 pt-4 border-t border-slate-200 text-[10px] text-slate-500 leading-normal max-w-xl mx-auto">
          <strong>আইনি ও প্রাতিষ্ঠানিক ব্যাখ্যা:</strong> এই প্রশংসাপত্রটি Daily English Practice BD প্ল্যাটফর্মে শিক্ষার্থীর স্ব-উদ্যোগী অনলাইন অনুশীলন সম্পন্ন করার একটি শিক্ষামূলক স্মারক এবং এটি কোনো বিশ্ববিদ্যালয় বা সরকারি স্বীকৃত ডিগ্রি বা প্রাতিষ্ঠানিক সনদপত্রের সমকক্ষ নয়।
        </div>
      </div>
    </div>
  );
};
