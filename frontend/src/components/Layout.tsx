import { ReactNode } from "react";
import UnifiedNavbar from "@/components/ui/UnifiedNavbar";
import MobileBottomNav from "@/components/mobile/MobileBottomNav";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      {/* Desktop Navbar - Hidden on mobile */}
      <div className="hidden lg:block">
        <UnifiedNavbar />
      </div>
      
      {/* Main Content with proper padding for mobile */}
      <div className="pt-0 lg:pt-20 pb-20 lg:pb-0 min-h-screen">
        {children}
      </div>

      {/* Mobile Bottom Navigation - Only on mobile */}
      <div className="lg:hidden">
        <MobileBottomNav />
      </div>
    </>
  );
}
