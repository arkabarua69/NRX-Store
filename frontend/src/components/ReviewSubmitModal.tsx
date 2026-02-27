import { useState } from "react";
import { X, Star, Send, Loader2 } from "lucide-react";
import { submitReview } from "@/lib/reviewService";
import { toast } from "sonner";

interface ReviewSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  productId?: string;
}

export default function ReviewSubmitModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  productId 
}: ReviewSubmitModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error("অনুগ্রহ করে আপনার মতামত লিখুন");
      return;
    }

    if (comment.trim().length < 3) {
      toast.error("কমেন্ট কমপক্ষে ৩ অক্ষরের হতে হবে");
      return;
    }

    setSubmitting(true);

    try {
      await submitReview(rating, comment, productId);
      toast.success("✅ রিভিউ সফলভাবে জমা হয়েছে!");
      setRating(5);
      setComment("");
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Review submission error:", error);
      toast.error(error.message || "রিভিউ জমা দিতে ব্যর্থ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">আপনার মতামত দিন</h2>
              <p className="text-sm text-white/80 mt-1">আমাদের সেবা সম্পর্কে জানান</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-all"
              disabled={submitting}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div className="space-y-3">
            <label className="block text-lg font-black text-gray-900">
              রেটিং দিন *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-all transform hover:scale-125"
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
              <span className="ml-3 text-2xl font-black text-gray-900">
                {rating}/5
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {rating === 5 && "⭐ অসাধারণ!"}
              {rating === 4 && "😊 খুব ভালো!"}
              {rating === 3 && "👍 ভালো"}
              {rating === 2 && "😐 মোটামুটি"}
              {rating === 1 && "😞 খারাপ"}
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-3">
            <label className="block text-lg font-black text-gray-900">
              আপনার মতামত লিখুন *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all font-medium resize-none"
              rows={5}
              placeholder="আমাদের সেবা সম্পর্কে আপনার অভিজ্ঞতা শেয়ার করুন..."
              required
              disabled={submitting}
              minLength={3}
            />
            <p className="text-sm text-gray-500">
              {comment.length}/500 অক্ষর
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800 font-medium">
              💡 <strong>জেনে রাখুন:</strong> আপনার রিভিউ সবার জন্য দৃশ্যমান হবে এবং অন্যদের সিদ্ধান্ত নিতে সাহায্য করবে।
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !comment.trim()}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {submitting ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                জমা হচ্ছে...
              </>
            ) : (
              <>
                <Send size={24} />
                রিভিউ জমা দিন
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
