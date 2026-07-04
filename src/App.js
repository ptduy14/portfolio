import { useContext } from "react";
import { ToastContext } from "./context/ToastContext";
import Toast from "./common/Toast";
import ThemeProvider from "./context/ThemeContext";
import { SystemProvider, useSystem } from "./desktop/SystemProvider";
import { DesktopProvider } from "./desktop/DesktopProvider";
import Desktop from "./desktop/Desktop";
import MobileShell from "./desktop/mobile/MobileShell";
import BootScreen from "./desktop/BootScreen";
import LockScreen from "./desktop/LockScreen";
import { useIsMobile } from "./desktop/useIsMobile";

function Shell() {
  // Onboarding is handled by the first-run GuidedTour (mounted inside the shells).
  const { isShowing } = useContext(ToastContext);
  const { booting, finishBoot, locked, unlock } = useSystem();
  const isMobile = useIsMobile();

  return (
    <>
      {isShowing && <Toast />}
      {isMobile ? <MobileShell /> : <Desktop />}
      {locked && <LockScreen onUnlock={unlock} />}
      {booting && <BootScreen onDone={finishBoot} />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SystemProvider>
        <DesktopProvider>
          <Shell />
        </DesktopProvider>
      </SystemProvider>
    </ThemeProvider>
  );
}

export default App;
