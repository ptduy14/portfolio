import { useContext } from "react";
import { ToastContext } from "./context/ToastContext";
import Toast from "./common/Toast";
import ThemeProvider from "./context/ThemeContext";
import { SystemProvider, useSystem } from "./desktop/SystemProvider";
import { DesktopProvider } from "./desktop/DesktopProvider";
import Desktop from "./desktop/Desktop";
import BootScreen from "./desktop/BootScreen";
import LockScreen from "./desktop/LockScreen";

function Shell() {
  const { isShowing } = useContext(ToastContext);
  const { booting, finishBoot, locked, unlock } = useSystem();

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
