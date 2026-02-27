import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Camera, Save, 
  Bell, Lock, Globe, Moon, ChevronRight 
} from 'lucide-react';
import MobileLayout from '@/components/mobile-v2/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { uploadImage } from '@/lib/uploadService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function SettingsMobile() {
  const navigate = useNavigate();
  const { user, refreshUserData } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('শুধুমাত্র ছবি আপলোড করুন');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('ছবির সাইজ ৫MB এর কম হতে হবে');
      return;
    }

    setUploadingAvatar(true);
    toast.info('আপলোড হচ্ছে...');

    try {
      const data = await uploadImage(file, 'avatars');
      
      if (!data?.url) {
        throw new Error('আপলোড ব্যর্থ হয়েছে');
      }

      const avatarUrl = data.url;

      // Update user profile with new avatar
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          avatar_url: avatarUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('প্রোফাইল আপডেট ব্যর্থ হয়েছে');
      }

      // Refresh user data to get updated avatar
      await refreshUserData();
      
      toast.success('অ্যাভাটার আপডেট সফল হয়েছে!');
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast.error(error.message || 'আপলোড ব্যর্থ হয়েছে');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    toast.success('সেটিংস সেভ করা হয়েছে');
  };

  const settingsSections = [
    {
      title: 'অ্যাকাউন্ট',
      items: [
        { icon: Bell, label: 'নোটিফিকেশন', path: '/notifications' },
        { icon: Lock, label: 'প্রাইভেসি ও সিকিউরিটি', path: '/privacy' },
        { icon: Globe, label: 'ভাষা', value: 'বাংলা' },
        { icon: Moon, label: 'ডার্ক মোড', toggle: true },
      ],
    },
    {
      title: 'সাপোর্ট',
      items: [
        { icon: User, label: 'হেল্প সেন্টার', path: '/support' },
        { icon: User, label: 'FAQ', path: '/faq' },
        { icon: User, label: 'শর্তাবলী', path: '/terms' },
        { icon: User, label: 'রিফান্ড পলিসি', path: '/refund' },
      ],
    },
  ];

  return (
    <MobileLayout
      showAppBar={true}
      showNavBar={true}
      appBarProps={{
        title: 'সেটিংস',
        showBack: true,
      }}
    >
      <div className="px-4 py-6 space-y-6">
        {/* Profile Section */}
        <div className="mobile-card p-4">
          <h3 className="text-lg font-black text-gray-900 mb-4">প্রোফাইল তথ্য</h3>
          
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-white" />
                )}
              </div>
              <label 
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100 cursor-pointer active:scale-90 transition-transform ${uploadingAvatar ? 'opacity-50' : ''}`}
              >
                {uploadingAvatar ? (
                  <div className="w-3 h-3 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera size={14} className="text-gray-700" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploadingAvatar}
              />
            </div>
            <div>
              <p className="font-black text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <p className="text-xs text-gray-500 mt-1">ছবি পরিবর্তন করতে ক্লিক করুন</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">নাম</label>
              <div className="flex items-center gap-2 mobile-input">
                <User size={18} className="text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-transparent outline-none"
                  placeholder="আপনার নাম"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ইমেইল</label>
              <div className="flex items-center gap-2 mobile-input">
                <Mail size={18} className="text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent outline-none"
                  placeholder="your@email.com"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ফোন</label>
              <div className="flex items-center gap-2 mobile-input">
                <Phone size={18} className="text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 bg-transparent outline-none"
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ঠিকানা</label>
              <div className="flex items-center gap-2 mobile-input">
                <MapPin size={18} className="text-gray-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex-1 bg-transparent outline-none"
                  placeholder="আপনার ঠিকানা"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg"
          >
            <Save size={20} />
            <span>সেভ করুন</span>
          </motion.button>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mobile-card p-4">
            <h3 className="text-lg font-black text-gray-900 mb-3">{section.title}</h3>
            <div className="space-y-2">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    onClick={() => item.path && navigate(item.path)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon size={18} className="text-gray-700" />
                    </div>
                    <span className="flex-1 text-left font-medium text-gray-900">
                      {item.label}
                    </span>
                    {item.value && (
                      <span className="text-sm text-gray-500">{item.value}</span>
                    )}
                    {item.toggle && (
                      <div className="w-11 h-6 bg-gray-200 rounded-full relative">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    )}
                    {item.path && <ChevronRight size={18} className="text-gray-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
}
