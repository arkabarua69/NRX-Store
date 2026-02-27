import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, Filter, Package, TrendingUp, Clock, DollarSign } from 'lucide-react';
import MobileLayout from '@/components/mobile-v2/MobileLayout';
import { ModernProductCard } from '@/components/mobile-v2';
import { getActiveProducts } from '@/lib/productService';
import { Product } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationCount } from '@/hooks/useNotificationCount';

type SortOption = 'popular' | 'newest' | 'price-low' | 'price-high';

export default function StoreMobile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart, cart } = useCart();
  const { unreadCount: notificationCount } = useNotificationCount();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGame, setSelectedGame] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [availableGames, setAvailableGames] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
    const category = searchParams.get('category');
    if (category) setSelectedCategory(category);
  }, [searchParams]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, selectedCategory, selectedGame, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getActiveProducts();
      const productList = response.products || [];
      setProducts(productList);
      
      // Extract unique game names
      const games = Array.from(new Set(productList.map((p: Product) => p.gameName).filter((name): name is string => Boolean(name))));
      setAvailableGames(games);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('পণ্য লোড করতে সমস্যা হয়েছে');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedGame !== 'all') {
      filtered = filtered.filter(p => p.gameName === selectedGame);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameBn?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success('কার্টে যোগ করা হয়েছে!');
  };

  const handleQuickBuy = (product: Product) => {
    addToCart(product);
    navigate('/checkout');
  };

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const categories = [
    { id: 'all', label: 'সব', icon: '🎮' },
    { id: 'budget', label: 'বাজেট', icon: '💰' },
    { id: 'standard', label: 'স্ট্যান্ডার্ড', icon: '📦' },
    { id: 'premium', label: 'প্রিমিয়াম', icon: '💎' },
    { id: 'membership', label: 'মেম্বারশিপ', icon: '👑' },
  ];

  const sortOptions = [
    { id: 'popular', label: 'জনপ্রিয়', icon: TrendingUp },
    { id: 'newest', label: 'নতুন', icon: Clock },
    { id: 'price-low', label: 'কম দাম', icon: DollarSign },
    { id: 'price-high', label: 'বেশি দাম', icon: DollarSign },
  ];

  return (
    <MobileLayout
      showAppBar={true}
      showNavBar={true}
      appBarProps={{
        showLogo: true,
        showCart: true,
        showNotification: true,
        cartCount: cart?.length || 0,
        notificationCount: notificationCount,
      }}
    >
      <div className="flex flex-col h-full bg-white">
        {/* Search Section */}
        <div className="px-4 pt-3 pb-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য খুঁজুন..."
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-200 active:scale-90 transition-transform"
              >
                <X size={14} className="text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 py-2.5 border-b border-gray-100 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  flex items-center gap-1.5 px-3.5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all
                  ${selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 active:scale-95'
                  }
                `}
              >
                <span className="text-base">{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Game Filter */}
        {availableGames.length > 0 && (
          <div className="px-4 py-2.5 border-b border-gray-100 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedGame('all')}
                className={`
                  flex items-center gap-1.5 px-3.5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all
                  ${selectedGame === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 active:scale-95'
                  }
                `}
              >
                <span className="text-base">🎮</span>
                <span>সব গেম</span>
              </button>
              {availableGames.map((game) => (
                <button
                  key={game}
                  onClick={() => setSelectedGame(game)}
                  className={`
                    flex items-center gap-1.5 px-3.5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all
                    ${selectedGame === game
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 active:scale-95'
                    }
                  `}
                >
                  <span>{game}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={16} className="text-gray-600" />
            <span className="text-sm font-bold text-gray-900">
              {filteredProducts.length} পণ্য
            </span>
          </div>
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg active:scale-95 transition-transform"
          >
            <Filter size={14} className="text-gray-700" />
            <span className="text-sm font-bold text-gray-700">ফিল্টার</span>
          </button>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-3">
            {loading ? (
              <div className="grid grid-cols-2 gap-2.5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Package size={40} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2 text-center">
                  {products.length === 0 ? 'কোন পণ্য নেই' : 'কোন পণ্য পাওয়া যায়নি'}
                </h3>
                <p className="text-sm text-gray-600 text-center mb-6">
                  {products.length === 0 
                    ? 'এই মুহূর্তে কোন পণ্য উপলব্ধ নেই' 
                    : 'অন্য ক্যাটাগরি বা সার্চ চেষ্টা করুন'}
                </p>
                {products.length === 0 && (
                  <button
                    onClick={fetchProducts}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
                  >
                    পুনরায় চেষ্টা করুন
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {filteredProducts.map((product) => (
                  <ModernProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickBuy={handleQuickBuy}
                    onClick={handleProductClick}
                    layout="grid"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilterModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 shadow-2xl"
            >
              <div className="p-6">
                {/* Handle */}
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-gray-900">সাজান</h3>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="p-2 rounded-full bg-gray-100 active:scale-90 transition-transform"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Sort Options */}
                <div className="space-y-2 mb-4">
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSortBy(option.id as SortOption);
                          setShowFilterModal(false);
                          toast.success(`${option.label} অনুযায়ী সাজানো হয়েছে`);
                        }}
                        className={`
                          w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all
                          ${sortBy === option.id
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-gray-50 text-gray-700 active:scale-95'
                          }
                        `}
                      >
                        <Icon size={20} />
                        <span className="flex-1 text-left">{option.label}</span>
                        {sortBy === option.id && (
                          <span className="text-xl">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold active:scale-95 transition-transform"
                >
                  বন্ধ করুন
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MobileLayout>
  );
}
