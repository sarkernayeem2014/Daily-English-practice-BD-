import React, { useState } from 'react';
import { UserProgress } from '../types';
import { exportProgressJSON, importProgressJSON, resetAllProgress } from '../utils/storage';
import { 
  ArrowLeft, 
  HelpCircle, 
  Terminal, 
  Github, 
  Sparkles, 
  Cpu, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Copy,
  AlertTriangle,
  Info,
  Zap
} from 'lucide-react';

interface GuideViewProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onBackToDashboard: () => void;
}

export const GuideView: React.FC<GuideViewProps> = ({
  progress,
  onUpdateProgress,
  onBackToDashboard,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExport = () => {
    const jsonStr = exportProgressJSON(progress);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-english-practice-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!jsonInput.trim()) return;
    const imported = importProgressJSON(jsonInput);
    if (imported) {
      onUpdateProgress(() => imported);
      setImportStatus('সফলভাবে অগ্রগতি ইমপোর্ট করা হয়েছে!');
      setJsonInput('');
    } else {
      setImportStatus('ভুল ফরম্যাট! সঠিক JSON ফাইল দিন।');
    }
  };

  const handleReset = () => {
    if (window.confirm('আপনি কি সত্যিই সমস্ত অগ্রগতি মুছে নতুন করে শুরু করতে চান?')) {
      const reset = resetAllProgress();
      onUpdateProgress(() => reset);
      alert('অগ্রগতি সফলভাবে রিসেট করা হয়েছে!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
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
              নির্দেশনা ও প্রযুক্তিগত তথ্য (User Guide & Setup)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              শুরু করার নিয়মাবলী, গিটহাব ডিপ্লয়মেন্ট এবং রুল-বেসড বনাম এআই আর্কিটেকচার
            </p>
          </div>
        </div>
      </div>

      {/* 1. Setup Instructions for Beginners */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center gap-2.5 text-blue-700 font-bold text-lg">
          <Terminal className="w-5 h-5" />
          <h2>১. নতুনদের জন্য লোকাল সেটআপ নির্দেশিকা (Beginner Setup)</h2>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          এই প্রজেক্টটি আপনার কম্পিউটারে লোকালি রান করার জন্য কম্পিউটার বা ল্যাপটপে <strong>Node.js (v18 বা তদূর্ধ্ব)</strong> ইনস্টল করা থাকতে হবে।
        </p>

        <div className="space-y-4">
          <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl space-y-3 font-mono text-xs sm:text-sm">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
              <span>টার্মিনালে এই কমান্ডগুলো পরপর রান করুন:</span>
              <button
                onClick={() =>
                  handleCopy(
                    'git clone https://github.com/your-username/daily-english-practice-bd.git\ncd daily-english-practice-bd\nnpm install\nnpm run dev',
                    'setup'
                  )
                }
                className="hover:text-white flex items-center gap-1"
              >
                {copiedKey === 'setup' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'setup' ? 'কপি হয়েছে' : 'সব কপি'}</span>
              </button>
            </div>
            <div>
              <span className="text-slate-500"># ১. রিপোজিটরি ক্লোন করুন</span>
              <p className="text-emerald-400">git clone https://github.com/your-username/daily-english-practice-bd.git</p>
            </div>
            <div>
              <span className="text-slate-500"># ২. প্রজেক্ট ফোল্ডারে প্রবেশ করুন</span>
              <p className="text-emerald-400">cd daily-english-practice-bd</p>
            </div>
            <div>
              <span className="text-slate-500"># ৩. প্যাকেজসমূহ ইনস্টল করুন</span>
              <p className="text-emerald-400">npm install</p>
            </div>
            <div>
              <span className="text-slate-500"># ৪. লোকাল সার্ভার চালু করুন</span>
              <p className="text-emerald-400">npm run dev</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            কমান্ড সম্পন্ন হলে ব্রাউজারে <code>http://localhost:3000</code> বা টার্মিনালে প্রদর্শিত লিংকে প্রবেশ করলেই ওয়েবসাইটটি দেখতে পাবেন।
          </p>
        </div>
      </section>

      {/* 2. Free GitHub Pages Deployment */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
          <Github className="w-5 h-5" />
          <h2>২. বিনামূল্যে GitHub Pages-এ লাইভ করার নিয়ম (Free Hosting)</h2>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          কোনো ডোমেইন বা পেইড হোস্টিং ছাড়াই গিটহাব পেজের মাধ্যমে এই অ্যাপটি বিশ্বজুড়ে সবার ব্যবহারের জন্য লাইভ করতে পারবেন:
        </p>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <strong>ধাপ ১: vite.config.ts ফাইলে বেস পাথ যুক্ত করুন</strong>
            <p className="text-slate-600">
              আপনার রিপোজিটরির নাম যদি হয় <code>daily-english-practice-bd</code>, তবে <code>vite.config.ts</code> ফাইলে যোগ করুন:
            </p>
            <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl overflow-x-auto font-mono text-xs">
{`export default defineConfig({
  base: '/daily-english-practice-bd/',
  plugins: [react(), tailwindcss()],
  // ...
});`}
            </pre>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <strong>ধাপ ২: প্রজেক্ট বিল্ড ও ডিপ্লয় করুন</strong>
            <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-xs space-y-1">
              <p className="text-slate-400"># বিল্ড তৈরি করুন:</p>
              <p className="text-emerald-400">npm run build</p>
              <p className="text-slate-400 mt-2"># gh-pages প্যাকেজ দিয়ে সরাসরি ডিপ্লয় করুন:</p>
              <p className="text-emerald-400">npx gh-pages -d dist</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <strong>ধাপ ৩: GitHub Repository Settings চেক করুন</strong>
            <p className="text-slate-600">
              আপনার GitHub রিপোজিটরির <strong>Settings &gt; Pages</strong> অপশনে যান। সেখানে Source হিসেবে <strong>gh-pages branch</strong> সিলেক্ট করে Save করুন। 
              কয়েক মিনিটের মধ্যেই <code>https://your-username.github.io/daily-english-practice-bd/</code> লিংকে লাইভ দেখতে পাবেন!
            </p>
          </div>
        </div>
      </section>

      {/* 3. Rule-Based Answer Matching & Transparent Limitations */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5 text-indigo-700 font-bold text-lg">
          <Info className="w-5 h-5 text-indigo-600" />
          <h2>৩. রুল-বেসড ম্যাচিং এবং এর সীমাবদ্ধতা (Architecture & Honesty)</h2>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed">
          এই অ্যাপটিতে কোনো পেইড এপিআই ছাড়াই দ্রুতগতির ও অফলাইনে কাজ করার উপযোগী <strong>স্মার্ট রুল-বেসড অ্যালগরিদম</strong> ব্যবহার করা হয়েছে:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <strong className="text-slate-900 block font-bold">কীভাবে উত্তর যাচাই হয়:</strong>
            <ul className="text-slate-600 space-y-1 list-disc list-inside">
              <li>বড় ও ছোট হাতের অক্ষরের (Case) পার্থক্য স্বয়ংক্রিয়ভাবে নিরপেক্ষ করা হয়।</li>
              <li>বিরামচিহ্ন (যেমন দাড়ি, কমা, প্রশ্নবোধক চিহ্ন) বাদ দিয়ে মূল শব্দ যাচাই করা হয়।</li>
              <li>কন্ট্রাকশন রূপান্তর: যেমন <code>"don't"</code> এবং <code>"do not"</code>, <code>"I'm"</code> এবং <code>"I am"</code> কে সমার্থক হিসেবে ধরা হয়।</li>
              <li>লেভেনস্টাইন অ্যালগরিদমের মাধ্যমে ছোটখাটো টাইপো হলেও সঠিক বা উৎসাহব্যঞ্জক ফিডব্যাক দেওয়া হয়।</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
            <strong className="text-amber-900 block font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> সীমাবদ্ধতার স্বচ্ছ প্রকাশ:
            </strong>
            <p className="text-amber-950 leading-relaxed">
              আমরা দাবি করি না যে রুল-বেসড সিস্টেম ইংরেজি ভাষার সব সম্ভাব্য বিকল্প বাক্য বুঝতে পারে। ভাষা অত্যন্ত বৈচিত্র্যময়। 
              যদি আপনার অনুবাদ ব্যাকরণগতভাবে সঠিক হয় কিন্তু আমাদের সংরক্ষিত বিকল্প তালিকায় না থাকে, 
              তবে আপনি নির্দ্বিধায় <strong>"আমার উত্তর সঠিক ছিল?"</strong> বোতামে চাপ দিয়ে নিজেকে সঠিক হিসেবে পয়েন্ট দিতে পারেন।
            </p>
          </div>
        </div>
      </section>

      {/* 4. Future AI-Powered Evaluation Roadmap */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5 text-blue-700 font-bold text-lg">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2>৪. ভবিষ্যতে এআই-ভিত্তিক মূল্যায়নের পরিকল্পনা (AI Integration Roadmap)</h2>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed">
          পরবর্তী সংস্করণে কৃত্রিম বুদ্ধিমত্তা (যেমন <strong>Google Gemini Flash API</strong>) যুক্ত করার মাধ্যমে মূল্যায়ন ব্যবস্থাকে আরও বৈপ্লবিক রূপ দেওয়া সম্ভব:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1.5">
            <strong className="text-blue-900 block font-bold">সেমান্টিক অর্থ সাদৃশ্য</strong>
            <p className="text-blue-950">
              নির্দিষ্ট শব্দের হুবহু মিল না থাকলেও শিক্ষার্থী মূল ভাব বজায় রাখতে পেরেছে কি না তা এআই স্বয়ংক্রিয়ভাবে নির্ধারণ করবে।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1.5">
            <strong className="text-indigo-900 block font-bold">ব্যক্তিগতকৃত ফিডব্যাক</strong>
            <p className="text-indigo-950">
              শিক্ষার্থী কোন সুনির্দিষ্ট ব্যাকরণিক ভুল করেছে (যেমন Tense, Preposition, Subject-Verb Agreement) তা বাংলায় বুঝিয়ে দেবে।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1.5">
            <strong className="text-sky-900 block font-bold">কথ্য ইংরেজিতে রূপান্তর</strong>
            <p className="text-sky-950">
              শিক্ষার্থীর আনুষ্ঠানিক বাক্যকে আরও সাবলীল দৈনন্দিন ন্যাচারাল ইংরেজিতে কীভাবে বলা যায় তার পরামর্শ প্রদান করবে।
            </p>
          </div>
        </div>
      </section>

      {/* 5. Progressive Tiers & XP Progression System */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5 text-blue-700 font-bold text-lg">
          <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
          <h2>৫. ৪টি প্রগ্রেসিভ লেভেল ও XP অগ্রগতি ব্যবস্থা</h2>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed">
          শিক্ষার্থীদের ধাপে ধাপে আত্মবিশ্বাসী করে তুলতে ৫০০টি বাক্যকে ৪টি নির্দিষ্ট স্তরে ভাগ করা হয়েছে:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl">
            <strong className="text-blue-900 block font-bold">Level 1: Beginner (৫০ বাক্য)</strong>
            <p className="text-blue-950 mt-1">মৌলিক শব্দভাণ্ডার। ৩০টি অনন্য বাক্য সম্পন্ন হলে Level 2 আনলক হয়।</p>
          </div>
          <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-2xl">
            <strong className="text-teal-900 block font-bold">Level 2: Sentence Builder (১০০ বাক্য)</strong>
            <p className="text-teal-950 mt-1">৮০টি অনন্য বাক্য সম্পন্ন হলে Level 3 আনলক হয়।</p>
          </div>
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
            <strong className="text-indigo-900 block font-bold">Level 3: Conversation Hero (১৫০ বাক্য)</strong>
            <p className="text-indigo-950 mt-1">১২০টি অনন্য বাক্য সম্পন্ন হলে Level 4 আনলক হয়।</p>
          </div>
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl">
            <strong className="text-amber-900 block font-bold">Level 4: English Master (২০০ বাক্য)</strong>
            <p className="text-amber-950 mt-1">১৮০টি অনন্য বাক্য সম্পন্ন হলে পরবর্তী Master Level আনলক হয়।</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
          <p><strong>XP অর্জন পদ্ধতি:</strong> প্রতিটি নতুন নির্ভুল অনুবাদের জন্য <strong>+১৫ XP</strong>, ভুল হওয়ার পর রিভিশনে সঠিক করলে <strong>+৮ XP</strong>, এবং দৈনিক চ্যালেঞ্জ সম্পন্ন করলে <strong>+৭৫ XP</strong> বোনাস দেওয়া হয়। কোনো বাক্য বারবার ক্লিক করে অতিরিক্ত XP নেওয়ার সুযোগ নেই।</p>
        </div>
      </section>

      {/* 6. Data Management & LocalStorage Security Disclosure */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
          <RotateCcw className="w-5 h-5 text-slate-600" />
          <h2>৬. ডাটা ব্যাকআপ ও ব্রাউজার লোকালস্টোরেজ সম্পর্কিত স্বচ্ছতা</h2>
        </div>

        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs sm:text-sm text-amber-950 space-y-2">
          <strong className="flex items-center gap-1.5 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            গুরুত্বপূর্ণ প্রযুক্তিগত তথ্য (Client-side Storage Disclosure):
          </strong>
          <p className="leading-relaxed">
            এই প্রোটোটাইপ অ্যাপটিতে আপনার স্কোর, XP এবং স্ট্রিক শুধুমাত্র আপনার <strong>বর্তমান ব্রাউজারের localStorage</strong>-এ সংরক্ষিত থাকে। 
            এটি কোনো সেন্ট্রাল সার্ভার ডাটাবেজে স্টোর হয় না, যার ফলে এটি ব্রাউজার হিস্টোরি ক্লিয়ার করলে মুছে যেতে পারে এবং এটি ব্রাউজার ডেভেলপার টুলস দ্বারা টেম্পারিং (পরিবর্তন)-এর বিরুদ্ধে সুরক্ষিত নয়। 
            আপনার অগ্রগতি নিরাপদে সংরক্ষণ করতে নিচের <strong>"JSON ব্যাকআপ ডাউনলোড"</strong> সুবিধাটি ব্যবহার করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>অগ্রগতি JSON ব্যাকআপ ডাউনলোড করুন</span>
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs sm:text-sm hover:bg-rose-100 border border-rose-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>সকল অগ্রগতি রিসেট করুন</span>
          </button>
        </div>

        {/* Import JSON */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            পূর্বে সংরক্ষিত JSON ব্যাকআপ ইমপোর্ট করুন:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="JSON টেক্সট বা কোড এখানে পেস্ট করুন..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleImport}
              className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-colors"
            >
              ইমপোর্ট
            </button>
          </div>
          {importStatus && (
            <p className="text-xs font-semibold text-blue-700">{importStatus}</p>
          )}
        </div>
      </section>
    </div>
  );
};
