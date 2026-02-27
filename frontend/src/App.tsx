import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import IndexMobile from "@/pages/IndexMobile";
import Store from "@/pages/Store";
import StoreMobile from "@/pages/StoreMobile";
import Dashboard from "@/pages/Dashboard";
import DashboardMobile from "@/pages/DashboardMobile";
import Profile from "@/pages/Profile";
import ProfileMobile from "@/pages/ProfileMobile";
import Cart from "@/pages/Cart";
import CartMobile from "@/pages/CartMobile";
import Checkout from "@/pages/Checkout";
import CheckoutMobile from "@/pages/CheckoutMobile";
import Wishlist from "@/pages/Wishlist";
import WishlistMobile from "@/pages/WishlistMobile";
import Settings from "@/pages/Settings";
import SettingsMobile from "@/pages/SettingsMobile";
import NotificationsMobile from "@/pages/NotificationsMobile";
import { useIsMobile } from "@/hooks/useIsMobile";
import Login from "@/pages/Login";
import ProductDetails from "@/pages/ProductDetails";
import ProductDetailsMobile from "@/pages/ProductDetailsMobile";
import Admin from "@/pages/Admin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminNotificationsMobile from "@/pages/AdminNotificationsMobile";
import AdminProductUploadMobile from "@/pages/AdminProductUploadMobile";
import AdminInfo from "@/pages/AdminInfo";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import Support from "@/pages/Support";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Refund from "@/pages/Refund";
import Invoice from "@/pages/Invoice";
import InvoiceMobile from "@/pages/InvoiceMobile";
import PaymentProofMobile from "@/pages/PaymentProofMobile";
import AuthCallback from "@/pages/AuthCallback";
import NotFound from "@/pages/NotFound";
import ChatBot from "@/components/ChatBot";
import InstallPrompt from "@/components/InstallPrompt";

const queryClient = new QueryClient();

const App = () => {
  const isMobile = useIsMobile();
  
  return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <WishlistProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
            <Routes>
              <Route path="/" element={isMobile ? <IndexMobile /> : <Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/store" element={<ProtectedRoute>{isMobile ? <StoreMobile /> : <Store />}</ProtectedRoute>} />
              <Route path="/product/:id" element={<ProtectedRoute>{isMobile ? <ProductDetailsMobile /> : <ProductDetails />}</ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute>{isMobile ? <CartMobile /> : <Cart />}</ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute>{isMobile ? <WishlistMobile /> : <Wishlist />}</ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute>{isMobile ? <CheckoutMobile /> : <Checkout />}</ProtectedRoute>} />
              <Route path="/invoice/:orderId" element={<ProtectedRoute>{isMobile ? <InvoiceMobile /> : <Invoice />}</ProtectedRoute>} />
              <Route path="/payment-proof/:orderId" element={<ProtectedRoute>{isMobile ? <PaymentProofMobile /> : <Invoice />}</ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute>{isMobile ? <ProfileMobile /> : <Profile />}</ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute>{isMobile ? <DashboardMobile /> : <Dashboard />}</ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin-notifications" element={<ProtectedRoute><AdminNotificationsMobile /></ProtectedRoute>} />
              <Route path="/admin-product-upload" element={<ProtectedRoute>{isMobile ? <AdminProductUploadMobile /> : <AdminDashboard />}</ProtectedRoute>} />
              <Route path="/admin-info" element={<ProtectedRoute><AdminInfo /></ProtectedRoute>} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/support" element={<Support />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/settings" element={<ProtectedRoute>{isMobile ? <SettingsMobile /> : <Settings />}</ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute>{isMobile ? <NotificationsMobile /> : <NotificationsMobile />}</ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <ChatBot />
          <InstallPrompt />
          <SpeedInsights />
        </TooltipProvider>
      </WishlistProvider>
      </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);
};

export default App;
