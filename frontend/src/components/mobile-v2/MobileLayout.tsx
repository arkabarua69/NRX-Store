import { ReactNode } from 'react';
import MobileNavBar from './MobileNavBar';
import MobileAppBar from './MobileAppBar';

interface MobileLayoutProps {
  children: ReactNode;
  showNavBar?: boolean;
  showAppBar?: boolean;
  appBarProps?: React.ComponentProps<typeof MobileAppBar>;
}

export default function MobileLayout({
  children,
  showNavBar = true,
  showAppBar = true,
  appBarProps,
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Bar */}
      {showAppBar && <MobileAppBar {...appBarProps} />}

      {/* Main Content */}
      <main
        className={`
          ${showAppBar ? 'pt-14' : ''}
          ${showNavBar ? 'pb-20' : ''}
        `}
        style={{
          paddingTop: showAppBar ? 'calc(56px + var(--safe-area-top))' : undefined,
          paddingBottom: showNavBar ? 'calc(80px + var(--safe-area-bottom))' : undefined,
        }}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      {showNavBar && <MobileNavBar />}
    </div>
  );
}
