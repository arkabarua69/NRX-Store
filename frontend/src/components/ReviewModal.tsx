import { useState } from "react";
import { X, Star, Send, User } from "lucide-react";
import { submitReview } from "@/lib/reviewService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId?: string;
}

export default function ReviewModal({ isOpen, onClose, onSuccess, productId }: ReviewModalProps) {
  const { userData } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("অনুগ্রহ করে রেটিং দিন");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("রিভিউ কমপক্ষে ১০ অক্ষরের হতে হবে");
      return;
    }

    setSubmitting(true);

    try {
      await submitReview(rating, comment, productId);
      toast.success("রিভিউ সফলভাবে জমা হয়েছে!");
      setRating(0);
      setComment("");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "রিভিউ জমা দিতে ব্যর্থ");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg pointer-events-auto animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 px-6 py-6 rounded-t-3xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">রিভিউ লিখুন</h2>
                <p className="text-white/90 text-sm">আপনার অভিজ্ঞতা শেয়ার করুন</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-all"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
          </div>

          {/* User Info Display */}
          {userData && (
            <div className="px-6 pt-6 pb-0">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                  {userData.avatar ? (
                    <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} className="text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{userData.name}</p>
                  <p className="text-sm text-gray-600 truncate">{userData.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                রেটিং দিন <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={`${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      } transition-colors`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm font-bold text-gray-700">
                    {rating === 5 ? "অসাধারণ!" : rating === 4 ? "খুব ভালো!" : rating === 3 ? "ভালো" : rating === 2 ? "মোটামুটি" : "খারাপ"}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                আপনার মতামত <span className="text-red-500">*</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="আপনার অভিজ্ঞতা বিস্তারিত লিখুন... (কমপক্ষে ১০ অক্ষর)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                rows={5}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {comment.length} অক্ষর {comment.length < 10 && `(আরও ${10 - comment.length} অক্ষর প্রয়োজন)`}
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all"
                disabled={submitting}
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={submitting || rating === 0 || comment.trim().length < 10}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    জমা হচ্ছে...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    রিভিউ জমা দিন
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
