import LoadingSpinner from './LoadingSpinner';

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
}

export default function LoadingScreen({ 
  message = "লোড হচ্ছে...", 
  submessage = "অনুগ্রহ করে অপেক্ষা করুন" 
}: LoadingScreenProps) {
  return <LoadingSpinner message={message} submessage={submessage} fullScreen={true} size="lg" />;
}

// Inline loading spinner for buttons
export function ButtonSpinner({ size = 20 }: { size?: number }) {
  return (
    <div 
      className="border-2 border-white border-t-transparent rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  );
}

// Small loading indicator
export function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}
