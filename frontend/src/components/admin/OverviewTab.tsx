import { Order, Product } from "@/lib/types";
import { 
  TrendingUp, Package, ShoppingCart, DollarSign, Clock, 
  CheckCircle, Zap, Target, Users, Award,
  ArrowUpRight, ArrowDownRight, Activity, Sparkles
} from "lucide-react";
import { format } from "date-fns";

interface OverviewTabProps {
  orders: Order[];
  products: Product[];
}

export default function OverviewTab({ orders, products }: OverviewTabProps) {
  const recentOrders = orders.slice(0, 8);
  const todayOrders = orders.filter(o => {
    const today = new Date();
    const orderDate = new Date(o.createdAt || o.created_at);
    return orderDate.toDateString() === today.toDateString();
  });

  const yesterdayOrders = orders.filter(o => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const orderDate = new Date(o.createdAt || o.created_at);
    return orderDate.toDateString() === yesterday.toDateString();
  });

  const todayRevenue = todayOrders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + (o.total_amount || o.price || 0), 0);

  const yesterdayRevenue = yesterdayOrders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + (o.total_amount || o.price || 0), 0);

  const revenueChange = yesterdayRevenue > 0 
    ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100) 
    : 0;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      processing: "bg-blue-100 text-blue-700 border-blue-200",
      failed: "bg-red-100 text-red-700 border-red-200",
      cancelled: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <TrendingUp className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Overview</h2>
          <p className="text-xs text-gray-600">Quick stats</p>
        </div>
      </div>

      {/* Today's Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart size={28} />
              <Activity size={20} className="opacity-70 animate-pulse" />
            </div>
            <p className="text-white/80 text-xs font-bold mb-1">Orders</p>
            <p className="text-4xl font-black mb-2">{todayOrders.length}</p>
            <p className="text-white/70 text-xs">
              {todayOrders.filter(o => o.status === "completed").length} done
            </p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <DollarSign size={28} />
              <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                revenueChange >= 0 ? 'bg-white/20' : 'bg-red-500/30'
              }`}>
                {revenueChange >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {Math.abs(revenueChange).toFixed(0)}%
              </span>
            </div>
            <p className="text-white/80 text-xs font-bold mb-1">Revenue</p>
            <p className="text-4xl font-black mb-2">৳{todayRevenue.toLocaleString()}</p>
            <p className="text-white/70 text-xs">
              Yesterday: ৳{yesterdayRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <Package size={28} />
              <Sparkles size={20} className="opacity-70" />
            </div>
            <p className="text-white/80 text-xs font-bold mb-1">Products</p>
            <p className="text-4xl font-black mb-2">{products.length}</p>
            <p className="text-white/70 text-xs">
              {products.filter(p => p.isActive).length} active
            </p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <Target size={28} />
              <Award size={20} className="opacity-70" />
            </div>
            <p className="text-white/80 text-xs font-bold mb-1">Success</p>
            <p className="text-4xl font-black mb-2">
              {orders.length > 0 ? ((orders.filter(o => o.status === "completed").length / orders.length) * 100).toFixed(0) : 0}%
            </p>
            <p className="text-white/70 text-xs">
              {orders.filter(o => o.status === "completed").length} / {orders.length} orders
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <Clock size={20} className="text-blue-600" />
            Recent
          </h3>
          <span className="text-xs font-bold text-gray-600">{recentOrders.length} orders</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {recentOrders.map((order) => {
            // Safely parse date
            const orderDate = order.createdAt || order.created_at ? new Date(order.createdAt || order.created_at) : new Date();
            const isValidDate = !isNaN(orderDate.getTime());
            
            return (
              <div key={order.id} className="bg-white rounded-xl p-3 lg:p-4 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col">
                <div className="flex-1">
                  <p className="font-black text-gray-900 mb-1 text-sm lg:text-base line-clamp-1">{order.productName || order.product_name || "Unknown Product"}</p>
                  <p className="text-xs lg:text-sm text-gray-600 flex items-center gap-1 mb-1">
                    <Users size={12} />
                    <span className="truncate">{order.userName || order.user_name || order.display_name || "Unknown User"}</span>
                  </p>
                  <p className="text-[10px] lg:text-xs text-gray-500 flex items-center gap-1 mb-2">
                    <Clock size={10} />
                    {isValidDate ? format(orderDate, "MMM dd, HH:mm") : "N/A"}
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <p className="text-lg lg:text-xl font-black text-[#FF3B30] mb-2">৳{order.total_amount || order.price || 0}</p>
                  <span className={`inline-block text-[10px] lg:text-xs font-bold px-2 py-1 rounded-full border-2 ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] lg:text-xs text-gray-500 pt-2 mt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <Zap size={10} />
                    {order.diamonds || 0}
                  </span>
                  <span>•</span>
                  <span className="truncate">🎮 {order.player_id || order.gameId || "N/A"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
