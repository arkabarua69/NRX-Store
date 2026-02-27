import { ShoppingCart, Heart, Star, Eye, Users, Diamond, Zap } from 'lucide-react';
import { Product } from '@/lib/types';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
  onClick: (product: Product) => void;
  compact?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  onQuickBuy,
  onClick,
  compact = false,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickBuy(product);
  };

  if (compact) {
    return (
      <div
        onClick={() => onClick(product)}
        className="mobile-card flex gap-3 p-3 cursor-pointer"
      >
        {/* Image */}
        <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
          <img
            src={product.image || product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.badge && (
            <div className="absolute top-1 left-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
              {product.badge}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-600">{product.rating || 4.5}</span>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div>
              <p className="text-lg font-black text-red-500">৳{product.price}</p>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <Diamond size={10} className="text-red-500" />
                {product.diamonds}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg active:scale-95 transition-transform"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick(product)}
      className="mobile-card overflow-hidden cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        <img
          src={product.image || product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
              {product.badge}
            </div>
          )}
          {product.isFeatured && (
            <div className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
              ⭐ Featured
            </div>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg active:scale-95 transition-transform"
        >
          <Heart
            size={18}
            className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>

        {/* Stats */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
            <Eye size={12} />
            {product.viewCount || 0}
          </div>
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
            <Users size={12} />
            {product.soldCount || 0}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
          {product.nameBn || product.name_bn}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < Math.floor(product.rating || 4.5)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">({product.rating || 4.5})</span>
        </div>

        {/* Price */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-3 mb-3 border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-0.5">মূল্য</p>
              <p className="text-xl font-black text-red-500">৳{product.price}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600 mb-0.5">ডায়মন্ড</p>
              <p className="text-lg font-black text-gray-900 flex items-center gap-1">
                {product.diamonds}
                <Diamond size={14} className="text-red-500" />
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            className="mobile-btn mobile-btn-primary flex items-center justify-center gap-2 py-3"
          >
            <ShoppingCart size={18} />
            <span>কার্ট</span>
          </button>
          <button
            onClick={handleQuickBuy}
            className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold active:scale-95 transition-transform"
          >
            <Zap size={18} />
            <span>কিনুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
