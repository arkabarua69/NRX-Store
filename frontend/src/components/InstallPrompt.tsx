import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Listen for beforeinstallprompt event
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show install prompt immediately on mobile if not dismissed
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('installPromptDismissed');
      const isMobileDevice = window.innerWidth < 768;
      
      if (!dismissed && isMobileDevice) {
        setShowPrompt(true);
      }
    }, 1000); // Show after 1 second

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          localStorage.setItem('installPromptDismissed', 'true');
          setShowPrompt(false);
        }
      } catch (error) {
        console.error("Install error:", error);
      }
    } else {
      // Fallback for iOS or browsers that don't support PWA install
      alert('📱 To install:\n\n1. Tap Share button\n2. Select "Add to Home Screen"\n3. Tap "Add"');
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('installPromptDismissed', 'true');
    setShowPrompt(false);
  };

  // Only show on mobile
  if (!showPrompt || !isMobile) return null;

  return (
    <div className="fixed bottom-28 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl shadow-2xl p-4 text-white">
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-black text-lg">Install NRX Store App</h3>
            <p className="text-sm text-white/90 mt-1 font-medium">
              📱 Install করুন দ্রুত access এবং better experience এর জন্য!
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleInstall}
                className="flex-1 px-4 py-3 bg-white text-purple-600 rounded-xl text-sm font-black hover:bg-white/90 transition-all active:scale-95 shadow-lg"
              >
                <Download className="w-4 h-4 inline mr-2" />
                Install Now
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-3 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl transition-all active:scale-95"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
