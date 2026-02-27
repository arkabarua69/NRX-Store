import { useState, useEffect } from "react";
import { Order } from "@/lib/types";
import { Calendar, ChevronLeft, ChevronRight, TrendingUp, Package, DollarSign } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, startOfWeek, endOfWeek } from "date-fns";
import { motion } from "framer-motion";

interface CalendarTabProps {
  orders: Order[];
}

export default function CalendarTab({ orders }: CalendarTabProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getOrdersForDay = (day: Date) => {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt || order.created_at);
      return isSameDay(orderDate, day);
    });
  };

  const getRevenueForDay = (day: Date) => {
    return getOrdersForDay(day)
      .filter(o => o.status === "completed")
      .reduce((sum, o) => sum + (o.total_amount || o.price || 0), 0);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt || order.created_at);
    return isSameMonth(orderDate, currentDate);
  });

  const monthRevenue = monthOrders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + (o.total_amount || o.price || 0), 0);

  const monthStats = {
    totalOrders: monthOrders.length,
    completedOrders: monthOrders.filter(o => o.status === "completed").length,
    pendingOrders: monthOrders.filter(o => o.status === "pending").length,
    revenue: monthRevenue,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Month Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <Package size={isMobile ? 16 : 20} />
            <span className="text-xs sm:text-sm font-bold">{isMobile ? 'অর্ডার' : 'Total Orders'}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black">{monthStats.totalOrders}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={isMobile ? 16 : 20} />
            <span className="text-xs sm:text-sm font-bold">{isMobile ? 'সম্পন্ন' : 'Completed'}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black">{monthStats.completedOrders}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={isMobile ? 16 : 20} />
            <span className="text-xs sm:text-sm font-bold">{isMobile ? 'পেন্ডিং' : 'Pending'}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black">{monthStats.pendingOrders}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={isMobile ? 16 : 20} />
            <span className="text-xs sm:text-sm font-bold">{isMobile ? 'আয়' : 'Revenue'}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black">৳{monthRevenue}</p>
        </motion.div>
      </div>

      {/* Calendar Header */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-black text-gray-900">
            {isMobile ? format(currentDate, "MMM yyyy") : format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={previousMonth}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
            >
              <ChevronLeft size={isMobile ? 18 : 20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm font-bold hover:shadow-lg active:scale-95 transition-all"
            >
              {isMobile ? 'আজ' : 'Today'}
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
            >
              <ChevronRight size={isMobile ? 18 : 20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Day Headers */}
          {(isMobile 
            ? ["S", "M", "T", "W", "T", "F", "S"]
            : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          ).map((day, index) => (
            <div key={index} className="text-center text-xs sm:text-sm font-bold text-gray-600 py-2">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {calendarDays.map((day, index) => {
            const dayOrders = getOrdersForDay(day);
            const dayRevenue = getRevenueForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`${isMobile ? 'min-h-[60px]' : 'min-h-[100px]'} p-1 sm:p-2 rounded-lg border transition-all ${
                  isCurrentMonth
                    ? isToday
                      ? "bg-gradient-to-br from-purple-100 to-pink-100 border-purple-500 shadow-md"
                      : "bg-white border-gray-200 hover:border-purple-400 hover:shadow-sm"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      isCurrentMonth
                        ? isToday
                          ? "text-purple-600"
                          : "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {dayOrders.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-[10px] font-bold">
                      {dayOrders.length}
                    </span>
                  )}
                </div>

                {dayOrders.length > 0 && (
                  <div className="space-y-0.5">
                    {!isMobile && (
                      <>
                        <div className="text-[10px] font-semibold text-gray-600">
                          Orders: {dayOrders.length}
                        </div>
                        {dayRevenue > 0 && (
                          <div className="text-[10px] font-bold text-green-600">
                            ৳{dayRevenue}
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex flex-wrap gap-0.5 mt-1">
                      {dayOrders.slice(0, isMobile ? 2 : 3).map((order) => (
                        <div
                          key={order.id}
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                            order.status === "completed"
                              ? "bg-green-500"
                              : order.status === "pending"
                              ? "bg-yellow-500"
                              : order.status === "processing"
                              ? "bg-blue-500"
                              : "bg-red-500"
                          }`}
                          title={`${order.productName || order.product_name || "Order"} - ${order.status}`}
                        />
                      ))}
                      {dayOrders.length > (isMobile ? 2 : 3) && (
                        <span className="text-[8px] sm:text-xs text-gray-500">+{dayOrders.length - (isMobile ? 2 : 3)}</span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
          <h3 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">
            {isMobile ? 'স্ট্যাটাস:' : 'Status Legend:'}
          </h3>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
              <span className="text-[10px] sm:text-xs font-semibold text-gray-600">
                {isMobile ? 'সম্পন্ন' : 'Completed'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500" />
              <span className="text-[10px] sm:text-xs font-semibold text-gray-600">
                {isMobile ? 'প্রসেসিং' : 'Processing'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
              <span className="text-[10px] sm:text-xs font-semibold text-gray-600">
                {isMobile ? 'পেন্ডিং' : 'Pending'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
              <span className="text-[10px] sm:text-xs font-semibold text-gray-600">
                {isMobile ? 'ব্যর্থ' : 'Failed'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
