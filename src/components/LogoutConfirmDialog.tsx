import React, { useState, useEffect } from 'react';
import { LogOut, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutConfirmDialog: React.FC<LogoutConfirmDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoggingOut) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoggingOut, onClose]);

  if (!isOpen) return null;

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => {
          if (!isLoggingOut) onClose();
        }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Dialog: Bottom sheet on mobile, centered card on desktop */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 p-6 z-10 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Mobile Drag Pill */}
        <div className="sm:hidden w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <LogOut className="w-6 h-6 text-rose-600" />
          </div>

          <div className="space-y-1 flex-1">
            <h3 className="text-lg font-black text-slate-900">
              লগআউট করতে চান?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              আপনার প্রোগ্রেস ক্লাউডে সুরক্ষিত আছে, আবার লগইন করলে ফিরে পাবেন।
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 pt-2">
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={onClose}
            className="w-full sm:w-1/2 min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-all active:scale-98 cursor-pointer disabled:opacity-50"
          >
            বাতিল
          </button>

          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleConfirmLogout}
            className="w-full sm:w-1/2 min-h-[44px] px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-md shadow-rose-600/20 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>লগআউট হচ্ছে...</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>লগআউট করুন</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
