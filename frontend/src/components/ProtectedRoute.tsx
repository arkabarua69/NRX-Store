import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(requireAdmin);

  useEffect(() => {
    if (requireAdmin && user) {
      // Check if user is admin based on email from .env
      const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',').map((e: string) => e.trim()) || [];
      const userIsAdmin = adminEmails.includes(user.email) || user.role === 'admin';
      setIsAdmin(userIsAdmin);
      setCheckingAdmin(false);
    }
  }, [user, requireAdmin]);

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF3B30] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    toast.error("অনুগ্রহ করে লগইন করুন - Please login first");
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    toast.error("অ্যাডমিন অ্যাক্সেস প্রয়োজন - Admin access required");
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
