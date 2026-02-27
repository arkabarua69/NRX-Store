import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowLeft, Sparkles } from "lucide-react";
import UnifiedNavbar from "@/components/ui/UnifiedNavbar";
import Footer from "@/components/ui/Footer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <UnifiedNavbar />

      <main className="max-w-7xl mx-auto px-4 pt-24 pb-20">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#FF3B30] font-bold mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            ফিরে যান
          </button>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
                <Heart className="text-[#FF3B30]" size={36} />
                আমার উইশলিস্ট
              </h1>
              <p className="text-gray-600 font-medium">
                {wishlist.length} টি পণ্য সংরক্ষিত আছে
              </p>
            </div>
            
            {wishlist.length > 0 && (
              <button
                onClick={clearWishlist}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-black hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Trash2 size={20} />
                সব মুছে ফেলুন
              </button>
            )}
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={64} className="text-red-400" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">উইশলিস্ট খালি!</h2>
            <p className="text-gray-600 font-medium mb-8">আপনার পছন্দের পণ্য এখানে সংরক্ষণ করুন</p>
            <button
              onClick={() => navigate("/store")}
              className="px-8 py-4 bg-gradient-to-r from-[#FF3B30] to-red-600 text-white rounded-2xl font-black hover:shadow-2xl transition-all"
            >
              স্টোর দেখুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-red-200 transition-all"
              >
                <div className="relative aspect-square bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-3xl font-black text-[#FF3B30]">
                      ৳{product.price}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="py-3 px-4 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                      বিস্তারিত
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="py-3 px-4 bg-gradient-to-r from-[#FF3B30] to-red-600 text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      কার্ট
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
