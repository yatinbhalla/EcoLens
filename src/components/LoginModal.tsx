import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export function LoginModal({ onClose }: { onClose: () => void }) {
  const { signIn, updateProfileDetails, user } = useAuth();
  const [mobile, setMobile] = useState('');
  const [step, setStep] = useState(user ? 2 : 1);

  const handleSignIn = async () => {
    try {
      await signIn();
      setStep(2);
    } catch (error) {
      console.error("Sign in error", error);
    }
  };

  const handleSaveContact = async () => {
    if (mobile) {
      await updateProfileDetails(mobile);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A2E22]/50 backdrop-blur flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] rounded-[2rem] p-8 max-w-sm w-full shadow-lg border border-[#E5E1D8]">
        {step === 1 && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-[#064E3B] rounded-2xl flex items-center justify-center text-white text-3xl mx-auto">🌱</div>
            <div>
              <h2 className="text-2xl font-bold text-[#064E3B]">Welcome</h2>
              <p className="text-sm text-gray-500 mt-2">Sign in to save your sustainability analysis history and access it across devices.</p>
            </div>
            <button onClick={handleSignIn} className="w-full py-3 px-4 bg-white border border-[#E5E1D8] text-[#1A2E22] rounded-xl font-bold hover:bg-gray-50 flex justify-center items-center gap-2">
               <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
            </button>
            <button onClick={onClose} className="text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-[#064E3B] transition-colors">
              Continue without signing in
            </button>
          </div>
        )}
        
        {step === 2 && (
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#064E3B]">Save Contact Details</h2>
              <p className="text-sm text-gray-500 mt-2">Optionally add a mobile number for future updates.</p>
            </div>
            
            <div className="space-y-4 text-left">
               <div>
                 <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Full Name (from Google)</label>
                 <Input value={user?.displayName || ''} disabled className="bg-gray-50" />
               </div>
               <div>
                 <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Email (from Google)</label>
                 <Input value={user?.email || ''} disabled className="bg-gray-50" />
               </div>
               <div>
                 <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Mobile Number (Optional)</label>
                 <Input 
                   placeholder="+1 234 567 8900" 
                   value={mobile} 
                   onChange={(e) => setMobile(e.target.value)} 
                 />
               </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => onClose()} className="flex-1 py-3 px-4 bg-white border border-[#E5E1D8] text-[#1A2E22] rounded-xl font-bold hover:bg-gray-50 flex justify-center items-center">
                Skip
              </button>
              <button onClick={handleSaveContact} className="flex-1 py-3 px-4 bg-[#064E3B] text-white rounded-xl font-bold hover:bg-[#064E3B]/90 flex justify-center items-center">
                Save & Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
