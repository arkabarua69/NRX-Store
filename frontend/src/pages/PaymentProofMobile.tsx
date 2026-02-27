import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Camera, Image as ImageIcon, CheckCircle, X, AlertCircle } from 'lucide-react';
import MobileLayout from '@/components/mobile-v2/MobileLayout';
import { uploadImage } from '@/lib/uploadService';
import { uploadPaymentProof } from '@/lib/orderService';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function PaymentProofMobile() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [transactionId, setTransactionId] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('পেমেন্ট প্রুফ সিলেক্ট করুন');
      return;
    }

    if (!transactionId.trim()) {
      toast.error('ট্রানজেকশন আইডি লিখুন');
      return;
    }

    setUploading(true);
    toast.info('আপলোড হচ্ছে...');

    try {
      // Upload image first
      const imageData = await uploadImage(selectedFile, 'payment-proofs');
      
      if (!imageData?.url) {
        throw new Error('ছবি আপলোড ব্যর্থ হয়েছে');
      }

      // Upload payment proof with order
      await uploadPaymentProof(
        orderId!,
        selectedFile,
        paymentMethod,
        transactionId.trim()
      );

      toast.success('পেমেন্ট প্রুফ সফলভাবে আপলোড হয়েছে!');
      
      // Navigate to invoice after 1 second
      setTimeout(() => {
        navigate(`/invoice/${orderId}`);
      }, 1000);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'আপলোড ব্যর্থ হয়েছে');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview('');
  };

  const paymentMethods = [
    { id: 'bkash', name: 'বিকাশ', color: 'from-pink-500 to-rose-500', icon: '💳' },
    { id: 'nagad', name: 'নগদ', color: 'from-orange-500 to-red-500', icon: '💰' },
    { id: 'rocket', name: 'রকেট', color: 'from-purple-500 to-indigo-500', icon: '🚀' },
  ];

  return (
    <MobileLayout
      showAppBar={true}
      showNavBar={false}
      appBarProps={{
        title: 'পেমেন্ট প্রুফ আপলোড',
        showBack: true,
      }}
    >
      <div className="p-4 space-y-6">
        {/* Info Card */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500 rounded-xl">
              <AlertCircle size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-blue-900 mb-1">গুরুত্বপূর্ণ তথ্য</h3>
              <p className="text-sm text-blue-800">
                পেমেন্ট করার পর স্ক্রিনশট আপলোড করুন। ট্রানজেকশন আইডি সঠিকভাবে লিখুন।
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-3">
            পেমেন্ট মেথড সিলেক্ট করুন *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id as any)}
                className={`
                  p-4 rounded-2xl border-2 transition-all
                  ${paymentMethod === method.id
                    ? `bg-gradient-to-br ${method.color} text-white border-transparent shadow-lg`
                    : 'bg-white text-gray-700 border-gray-200'
                  }
                `}
              >
                <div className="text-2xl mb-2">{method.icon}</div>
                <div className="text-sm font-bold">{method.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Transaction ID */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-2">
            ট্রানজেকশন আইডি *
          </label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="যেমন: 8A5B2C3D4E"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all font-medium"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-3">
            পেমেন্ট স্ক্রিনশট আপলোড করুন *
          </label>

          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full rounded-2xl border-2 border-gray-200 shadow-lg"
              />
              <button
                onClick={handleRemove}
                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg active:scale-95 transition-transform"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Camera Button */}
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-2xl font-black shadow-lg active:scale-95 transition-transform cursor-pointer">
                  <Camera size={24} />
                  <span>ক্যামেরা দিয়ে তুলুন</span>
                </div>
              </label>

              {/* Gallery Button */}
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 p-4 rounded-2xl font-black active:scale-95 transition-transform cursor-pointer">
                  <ImageIcon size={24} />
                  <span>গ্যালারি থেকে সিলেক্ট করুন</span>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleUpload}
          disabled={!selectedFile || !transactionId.trim() || uploading}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl font-black text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              আপলোড হচ্ছে...
            </>
          ) : (
            <>
              <Upload size={24} />
              পেমেন্ট প্রুফ জমা দিন
            </>
          )}
        </motion.button>

        {/* Skip Button */}
        <button
          onClick={() => navigate(`/invoice/${orderId}`)}
          disabled={uploading}
          className="w-full text-gray-600 font-bold py-3 disabled:opacity-50"
        >
          পরে আপলোড করব
        </button>

        {/* Help Text */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h4 className="font-black text-gray-900 mb-2">💡 টিপস:</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>• স্ক্রিনশটে ট্রানজেকশন আইডি স্পষ্ট দেখা যাচ্ছে কিনা চেক করুন</li>
            <li>• ছবি ঝাপসা বা অস্পষ্ট হলে আবার তুলুন</li>
            <li>• সঠিক পেমেন্ট মেথড সিলেক্ট করুন</li>
            <li>• ট্রানজেকশন আইডি সঠিকভাবে লিখুন</li>
          </ul>
        </div>
      </div>
    </MobileLayout>
  );
}
