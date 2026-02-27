import { X, Plus, Minus, Trash2, ShoppingCart, Package, Sparkles, ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, change: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemove,
  onCheckout
}: CartSidebarProps) {
  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-500/20 rounded-full blur-2xl" />
            
            <div className="relative flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    শপিং কার্ট
                    <Sparkles size={18} className="text-yellow-300" />
                  </h2>
                  <p className="text-sm text-white/90 font-bold">{itemCount} টি পণ্য</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm border border-white/30 hover:scale-110"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-2xl" />
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-xl">
                    <ShoppingCart className="w-16 h-16 text-gray-300" />
                  </div>
                </div>
                <p className="text-xl font-black text-gray-900 mb-2">কার্ট খালি</p>
                <p className="text-sm text-gray-500 mb-8 max-w-xs">আপনার কার্টে কোন পণ্য নেই। এখনই শপিং শুরু করুন!</p>
                <button
                  onClick={onClose}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-black hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Package size={20} />
                  শপিং করুন
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="relative group">
                    <div className="flex gap-3 p-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-orange-500 text-white rounded-lg text-xs font-black shadow-lg">
                          ×{item.quantity}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-gray-900 text-sm mb-1 line-clamp-1">{item.product.name}</h3>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-1">{item.product.nameBn}</p>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <p className="text-xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                            ৳{item.product.price}
                          </p>
                          <span className="text-xs text-gray-400 font-semibold">× {item.quantity}</span>
                          <span className="ml-auto text-sm font-black text-gray-900">
                            ৳{item.product.price * item.quantity}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-white rounded-xl border-2 border-gray-200 shadow-sm">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                              className="w-8 h-8 rounded-l-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-10 text-center font-black text-sm">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              className="w-8 h-8 rounded-r-lg flex items-center justify-center hover:bg-green-50 hover:text-green-500 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => onRemove(item.product.id)}
                            className="ml-auto p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
                            title="Remove"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t-2 border-gray-200 p-5 space-y-4 bg-gradient-to-br from-gray-50 to-white">
              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-semibold">সাবটোটাল</span>
                  <span className="font-black text-gray-900">৳{total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-semibold flex items-center gap-1">
                    <Package size={14} />
                    ডেলিভারি চার্জ
                  </span>
                  <span className="font-black text-green-600 flex items-center gap-1">
                    <Sparkles size={14} />
                    ফ্রি
                  </span>
                </div>
                <div className="border-t-2 border-gray-200 pt-3 flex justify-between items-center">
                  <span className="text-base text-gray-900 font-black">মোট মূল্য</span>
                  <span className="text-3xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    ৳{total}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={onCheckout}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white font-black text-lg hover:shadow-2xl hover:shadow-orange-300 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
                >
                  <ShoppingCart size={22} className="group-hover:rotate-12 transition-transform" />
                  চেকআউট করুন
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-100 hover:border-gray-400 transition-all"
                >
                  শপিং চালিয়ে যান
                </button>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Sparkles size={12} className="text-white" />
                </div>
                <span className="font-semibold">নিরাপদ পেমেন্ট • ১০০% সিকিউর</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
