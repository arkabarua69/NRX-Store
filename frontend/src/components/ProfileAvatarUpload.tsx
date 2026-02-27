import { useState } from "react";
import { Upload, User, X, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/supabase";
import { API_URL } from "@/lib/config";

interface ProfileAvatarUploadProps {
  currentAvatar?: string;
  onAvatarUpdated?: (newAvatarUrl: string) => Promise<void>;
}

export default function ProfileAvatarUpload({ 
  currentAvatar, 
  onAvatarUpdated 
}: ProfileAvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentAvatar || "");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("শুধুমাত্র ছবি আপলোড করুন (JPG, PNG, WEBP, GIF)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ফাইল সাইজ বেশি! সর্বোচ্চ 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    toast.info("অ্যাভাটার আপলোড হচ্ছে...");

    try {
      const token = await getAuthToken();
      if (!token) {
        toast.error("লগইন করুন");
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/users/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'আপলোড ব্যর্থ');
      }

      const result = await response.json();
      const avatarUrl = result.data.avatar_url;

      setPreview(avatarUrl);
      toast.success("✅ অ্যাভাটার আপলোড সফল!");

      if (onAvatarUpdated) {
        await onAvatarUpdated(avatarUrl);
      }

      // Auto reload page after 1.5 seconds to show avatar everywhere
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast.error(error.message || "আপলোড ব্যর্থ");
      setPreview(currentAvatar || "");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Preview */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
          {preview ? (
            <img 
              src={preview} 
              alt="Avatar" 
              className="w-full h-full object-cover"
              onError={() => setPreview("")}
            />
          ) : (
            <User size={48} className="text-white" />
          )}
        </div>

        {/* Upload Button Overlay */}
        <label className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-lg border-4 border-white">
          {uploading ? (
            <Loader2 size={20} className="text-white animate-spin" />
          ) : (
            <Upload size={20} className="text-white" />
          )}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Info Text */}
      <div className="text-center">
        <p className="text-sm font-bold text-gray-700">
          আপনার প্রোফাইল ছবি
        </p>
        <p className="text-xs text-gray-500 mt-1">
          JPG, PNG, WEBP, GIF • সর্বোচ্চ 5MB
        </p>
      </div>
    </div>
  );
}
