import { ShoppingCart, Heart, Star, Diamond, Zap, TrendingUp, Crown } from 'lucide-react';
import { Product } from '@/lib/types';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWishlist } from '@/contexts/WishlistContext';

interface ModernProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
  onClick: (product: Product) => void;
  layout?: 'grid' | 'list';
}

export default function ModernProductCard({
  product,
  onAddToCart,
  onQuickBuy,
  onClick,
  layout = 'grid',
}: ModernProductCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickBuy(product);
  };

  if (layout === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => onClick(product)}
        className="mobile-card flex gap-3 p-3 active:scale-[0.98] transition-transform"
      >
        {/* Image */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={product.image || product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.badge && (
            <div className="absolute top-1 left-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 rounded-md text-[10px] font-black shadow-lg">
              {product.badge}
            </div>
          )}
          {product.isFeatured && (
            <div className="absolute top-1 right-1">
              <Crown size={14} className="text-yellow-400 fill-yellow-400 drop-shadow-lg" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <h3 className="font-black text-gray-900 text-sm mb-1 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-gray-600">{product.rating || 4.5}</span>
            <span className="text-xs text-gray-400">({product.soldCount || 0})</span>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div>
              <p className="text-lg font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                ৳{product.price}
              </p>
              <p className="text-xs text-gray-600 flex items-center gap-1 font-bold">
                <Diamond size={10} className="text-red-500" />
                {product.diamonds}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className="p-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-lg active:scale-90 transition-transform"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={() => onClick(product)}
      className="mobile-card overflow-hidden active:scale-[0.98] transition-transform"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={product.image || product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
          <div className="flex flex-col gap-1">
            {product.badge && (
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2.5 py-1 rounded-lg text-xs font-black shadow-lg backdrop-blur-sm">
                {product.badge}
              </div>
            )}
            {product.isFeatured && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2.5 py-1 rounded-lg text-xs font-black shadow-lg backdrop-blur-sm flex items-center gap-1">
                <TrendingUp size={12} />
                Hot
              </div>
            )}
          </div>
          
          <button
            onClick={handleWishlist}
            className="p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg active:scale-90 transition-transform"
          >
            <Heart
              size={16}
              className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}
            />
          </button>
        </div>

        {/* Bottom Stats */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            {product.rating || 4.5}
          </div>
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold">
            <TrendingUp size={12} className="text-green-500" />
            {product.soldCount || 0} বিক্রি
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5">
        <h3 className="font-black text-gray-900 text-sm mb-1 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2.5 line-clamp-1">
          {product.nameBn || product.name_bn}
        </p>

        {/* Price Section */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-2 mb-2.5 border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-0.5 font-medium">মূল্য</p>
              <p className="text-lg font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                ৳{product.price}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600 mb-0.5 font-medium">ডায়মন্ড</p>
              <p className="text-base font-black text-gray-900 flex items-center gap-1">
                {product.diamonds}
                <Diamond size={12} className="text-red-500" />
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={handleAddToCart}
            className="mobile-btn bg-gray-100 text-gray-900 flex items-center justify-center gap-1 py-2 text-xs"
          >
            <ShoppingCart size={14} />
            <span className="font-bold">কার্ট</span>
          </button>
          <button
            onClick={handleQuickBuy}
            className="mobile-btn bg-gradient-to-r from-red-500 to-pink-500 text-white flex items-center justify-center gap-1 py-2 text-xs shadow-lg"
          >
            <Zap size={14} />
            <span className="font-bold">কিনুন</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
