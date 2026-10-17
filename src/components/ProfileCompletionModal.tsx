import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CLASS_LEVEL_OPTIONS, ClassLevel } from '../types';
import {
  getUserProfile,
  updateUserProfile,
  UserProfileData,
  convertBanglaDigitsToEnglish,
  validateBangladeshiPhone,
} from '../firebase/authService';
import {
  Sparkles,
  User,
  School,
  GraduationCap,
  Phone,
  Save,
  Loader2,
  AlertCircle,
  X,
  CheckCircle2,
} from 'lucide-react';

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useAuth();

  const [fullName, setFullName] = useState(currentUser?.displayName || '');
  const [institution, setInstitution] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel | ''>('');
  const [phone, setPhone] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill existing profile values if available
  useEffect(() => {
    if (!isOpen || !currentUser) return;
    let isMounted = true;
    getUserProfile(currentUser.uid).then((data) => {
      if (!isMounted || !data) return;
      if (data.fullName || data.displayName) {
        setFullName(data.fullName || data.displayName || '');
      }
      if (data.institution) setInstitution(data.institution);
      if (data.classLevel) setClassLevel(data.classLevel as ClassLevel);
      if (data.phone) setPhone(data.phone);
    }).catch(console.error);

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  const handlePhoneChange = (val: string) => {
    setPhone(convertBanglaDigitsToEnglish(val));
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'শিক্ষার্থীর নাম আবশ্যক';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'নাম কমপক্ষে ২ অক্ষরের হতে হবে';
    }

    if (!institution.trim()) {
      newErrors.institution = 'স্কুল, কলেজ বা বিশ্ববিদ্যালয়ের নাম আবশ্যক';
    }

    if (!classLevel) {
      newErrors.classLevel = 'আপনার শ্রেণি বা ক্লাস নির্বাচন করুন';
    }

    if (phone.trim()) {
      const normalized = convertBanglaDigitsToEnglish(phone).replace(/[\s\-+]/g, '');
      const cleanPhone = normalized.startsWith('88') ? normalized.slice(2) : normalized;
      if (!validateBangladeshiPhone(cleanPhone)) {
        newErrors.phone = 'সঠিক বাংলাদেশি ১১ ডিজিটের নম্বর দিন (যেমন: 017XXXXXXXX)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const cleanPhone = phone.trim() ? convertBanglaDigitsToEnglish(phone).replace(/[\s\-+]/g, '') : '';
      const finalPhone = cleanPhone.startsWith('88') ? cleanPhone.slice(2) : cleanPhone;

      const updates: Partial<UserProfileData> = {
        fullName: fullName.trim(),
        displayName: fullName.trim(),
        institution: institution.trim(),
        classLevel: classLevel as string,
        phone: finalPhone,
        profileCompleted: true,
      };

      await updateUserProfile(currentUser.uid, updates);
      onSuccess();
    } catch (err) {
      console.error('Failed to complete profile:', err);
      setErrors((prev) => ({
        ...prev,
        form: 'প্রোফাইল সংরক্ষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
      }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-blue-100 p-5 sm:p-7 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header Icon & Close Button */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200 mb-0.5">
                <span>এককালীন ধাপ</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                প্রোফাইল সম্পূর্ণ করুন
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="পরে করবো"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          স্বাগতম! আপনার শিক্ষাপ্রতিষ্ঠান ও শ্রেণি যুক্ত করে প্রোফাইলটি সম্পূর্ণ করুন। এটি আপনার শেখার অভিজ্ঞতাকে আরও সমৃদ্ধ করবে।
        </p>

        {errors.form && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label
              htmlFor="modal-fullName"
              className="block text-xs font-bold text-slate-700"
            >
              শিক্ষার্থীর পূর্ণ নাম <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="modal-fullName"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                }}
                placeholder="যেমন: সাকিব আল হাসান"
                className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.fullName
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="text-xs text-rose-600 font-medium mt-1">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Institution */}
          <div className="space-y-1">
            <label
              htmlFor="modal-institution"
              className="block text-xs font-bold text-slate-700"
            >
              স্কুল / কলেজ / বিশ্ববিদ্যালয়ের নাম <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <School className="w-4 h-4" />
              </div>
              <input
                id="modal-institution"
                type="text"
                value={institution}
                onChange={(e) => {
                  setInstitution(e.target.value);
                  if (errors.institution) setErrors((prev) => ({ ...prev, institution: '' }));
                }}
                placeholder="যেমন: মতিঝিল আইডিয়াল স্কুল / ঢাকা বিশ্ববিদ্যালয়"
                className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.institution
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
            </div>
            {errors.institution && (
              <p className="text-xs text-rose-600 font-medium mt-1">
                {errors.institution}
              </p>
            )}
          </div>

          {/* Class Level */}
          <div className="space-y-1">
            <label
              htmlFor="modal-classLevel"
              className="block text-xs font-bold text-slate-700"
            >
              শ্রেণি / ক্লাস <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <select
                id="modal-classLevel"
                value={classLevel}
                onChange={(e) => {
                  setClassLevel(e.target.value as ClassLevel);
                  if (errors.classLevel) setErrors((prev) => ({ ...prev, classLevel: '' }));
                }}
                className={`w-full min-h-[44px] pl-10 pr-8 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                  errors.classLevel
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                }`}
              >
                <option value="">শ্রেণি / শিক্ষাস্তর নির্বাচন করুন</option>
                {CLASS_LEVEL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            {errors.classLevel && (
              <p className="text-xs text-rose-600 font-medium mt-1">
                {errors.classLevel}
              </p>
            )}
          </div>

          {/* Phone (Optional) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="modal-phone"
                className="block text-xs font-bold text-slate-700"
              >
                মোবাইল নম্বর
              </label>
              <span className="text-[11px] text-slate-400">ঐচ্ছিক</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="modal-phone"
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="01XXXXXXXXX"
                className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.phone
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-rose-600 font-medium mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full min-h-[44px] px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-600/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>সংরক্ষণ করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </>
              )}
            </button>

            {/* Skip for now Link */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline underline-offset-4 cursor-pointer py-1"
              >
                পরে করবো (Skip for now)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
