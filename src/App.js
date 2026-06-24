import { useContext, useEffect, useRef } from "react";
import { ToastContext } from "./context/ToastContext";
import Toast from "./common/Toast";
import ThemeProvider from "./context/ThemeContext";
import { SystemProvider, useSystem } from "./desktop/SystemProvider";
import { DesktopProvider } from "./desktop/DesktopProvider";
import Desktop from "./desktop/Desktop";
import BootScreen from "./desktop/BootScreen";
import LockScreen from "./desktop/LockScreen";

function Shell() {
  const { isShowing, handleShowingToast } = useContext(ToastContext);
  const { booting, finishBoot, locked, unlock } = useSystem();
  const welcomed = useRef(false);

  // Welcome notification once the desktop is revealed after boot.
  useEffect(() => {
    if (!booting && !welcomed.current) {
      welcomed.current = true;
      handleShowingToast(
        "Click around — this portfolio is a real desktop. Try the dock & Settings.",
        "Welcome to Portfolio OS"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booting]);

  return (
    <>
      {isShowing && <Toast />}
      <Desktop />
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
