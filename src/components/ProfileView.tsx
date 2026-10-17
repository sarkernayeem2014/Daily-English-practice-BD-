import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserProgress, CLASS_LEVEL_OPTIONS, ClassLevel } from '../types';
import {
  getUserProfile,
  updateUserProfile,
  UserProfileData,
  convertBanglaDigitsToEnglish,
  validateBangladeshiPhone,
} from '../firebase/authService';
import {
  ArrowLeft,
  User,
  GraduationCap,
  School,
  Phone,
  Mail,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  Zap,
  Crown,
  ShieldCheck,
} from 'lucide-react';

interface ProfileViewProps {
  progress: UserProgress;
  onBackToDashboard: () => void;
  onRequestLogout: () => void;
  onProfileUpdated?: (updated: UserProfileData) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  progress,
  onBackToDashboard,
  onRequestLogout,
  onProfileUpdated,
}) => {
  const { currentUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel | ''>('');
  const [phone, setPhone] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);

  // Load profile from Firestore /users/{uid}
  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
        const data = await getUserProfile(currentUser.uid);
        if (isMounted) {
          if (data) {
            setFullName(data.fullName || data.displayName || currentUser.displayName || '');
            setInstitution(data.institution || '');
            setClassLevel((data.classLevel as ClassLevel) || '');
            setPhone(data.phone || '');
          } else {
            setFullName(currentUser.displayName || '');
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Determine user rank title from XP
  const getRankTitle = (xp: number) => {
    if (xp >= 3000) return 'লেভেল ৪ • ইংরেজি গ্র্যান্ডমাস্টার';
    if (xp >= 1500) return 'লেভেল ৩ • সাবলীলতার চ্যাম্পিয়ন';
    if (xp >= 500) return 'লেভেল ২ • দক্ষ বাক্য কারিগর';
    return 'লেভেল ১ • অনুসন্ধানী শিক্ষার্থী';
  };

  const handlePhoneChange = (val: string) => {
    // Automatically convert any Bangla digits to English digits
    const converted = convertBanglaDigitsToEnglish(val);
    setPhone(converted);
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
      newErrors.classLevel = 'অনুগ্রহ করে আপনার শ্রেণি বা ক্লাস নির্বাচন করুন';
    }

    if (phone.trim()) {
      const normalized = convertBanglaDigitsToEnglish(phone).replace(/[\s\-+]/g, '');
      const cleanPhone = normalized.startsWith('88') ? normalized.slice(2) : normalized;
      if (!validateBangladeshiPhone(cleanPhone)) {
        newErrors.phone = 'সঠিক বাংলাদেশি ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
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

      const completeProfile: UserProfileData = {
        uid: currentUser.uid,
        email: currentUser.email || '',
        displayName: fullName.trim(),
        fullName: fullName.trim(),
        institution: institution.trim(),
        classLevel: classLevel as string,
        phone: finalPhone,
        profileCompleted: true,
        photoURL: currentUser.photoURL || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onProfileUpdated?.(completeProfile);

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3500);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setErrors((prev) => ({
        ...prev,
        form: 'প্রোফাইল সংরক্ষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const userDisplayName = fullName.trim() || currentUser?.displayName || 'শিক্ষার্থী';
  const userInitials = userDisplayName.charAt(0).toUpperCase() || 'E';

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 px-1 sm:px-0 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>প্রোফাইল সংরক্ষিত হয়েছে</span>
        </div>
      )}

      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/80 bg-white/60 backdrop-blur-xs font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-98 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ড্যাশবোর্ডে ফিরুন</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>ব্যক্তিগত ও নিরাপদ</span>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Avatar (Google photo or first letter) */}
          <div className="relative shrink-0">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={userDisplayName}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-blue-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white font-black text-3xl flex items-center justify-center border-4 border-white shadow-md ring-2 ring-blue-200">
                {userInitials}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-sm ring-2 ring-white">
              <Crown className="w-4 h-4" />
            </div>
          </div>

          {/* Info & Badges */}
          <div className="space-y-2 flex-1 min-w-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {userDisplayName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium break-all mt-0.5">
                {currentUser?.email}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>{getRankTitle(progress.xp)}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                <span>{progress.xp} XP অর্জিত</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              প্রোফাইল আপডেট ও শিক্ষার্থীর বিবরণী
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              আপনার সঠিক তথ্য প্রদান করে প্রোফাইল হালনাগাদ বা পরিবর্তন করুন।
            </p>
          </div>
          <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/80">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>প্রোফাইল এডিটর</span>
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-500 font-medium">প্রোফাইল তথ্য লোড হচ্ছে...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            {errors.form && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* Field: Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="profile-fullName"
                className="block text-xs font-bold text-slate-700"
              >
                শিক্ষার্থীর পূর্ণ নাম <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="profile-fullName"
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
                <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* Field: Institution */}
            <div className="space-y-1.5">
              <label
                htmlFor="profile-institution"
                className="block text-xs font-bold text-slate-700"
              >
                স্কুল / কলেজ / বিশ্ববিদ্যালয়ের নাম <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <School className="w-4 h-4" />
                </div>
                <input
                  id="profile-institution"
                  type="text"
                  value={institution}
                  onChange={(e) => {
                    setInstitution(e.target.value);
                    if (errors.institution) setErrors((prev) => ({ ...prev, institution: '' }));
                  }}
                  placeholder="যেমন: ঢাকা কলেজ / রাজশাহী বিশ্ববিদ্যালয়"
                  className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.institution
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.institution && (
                <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.institution}</span>
                </p>
              )}
            </div>

            {/* Field: Class / Grade */}
            <div className="space-y-1.5">
              <label
                htmlFor="profile-classLevel"
                className="block text-xs font-bold text-slate-700"
              >
                শ্রেণি / ক্লাস <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <select
                  id="profile-classLevel"
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
                <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.classLevel}</span>
                </p>
              )}
            </div>

            {/* Field: Phone (Optional but validated) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="profile-phone"
                  className="block text-xs font-bold text-slate-700"
                >
                  মোবাইল নম্বর
                </label>
                <span className="text-[11px] text-slate-400 font-medium">ঐচ্ছিক (Optional)</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="01XXXXXXXXX (যেমন: 01712345678)"
                  className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.phone
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.phone ? (
                <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  বাংলা বা ইংরেজি সংখ্যায় ১১ ডিজিটের বাংলাদেশি নম্বর দেওয়া যাবে।
                </p>
              )}
            </div>

            {/* Field: Email (Read-Only) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="profile-email"
                  className="block text-xs font-bold text-slate-700"
                >
                  ইমেইল ঠিকানা
                </label>
                <span className="text-[11px] text-slate-400 font-medium">পরিবর্তনযোগ্য নয়</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="profile-email"
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed select-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full min-h-[44px] px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base shadow-md shadow-blue-600/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
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
            </div>
          </form>
        )}

        {/* Divider */}
        <div className="pt-4 border-t border-slate-100">
          {/* Nice Red-Outlined Logout Button */}
          <button
            type="button"
            onClick={onRequestLogout}
            className="w-full min-h-[44px] px-4 py-3 rounded-xl border-2 border-rose-200 hover:border-rose-400 bg-rose-50/50 hover:bg-rose-50 text-rose-600 font-bold text-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2.5"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>লগআউট করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
