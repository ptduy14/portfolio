import { useContext, useState } from "react";
import { ToastContext } from "./context/ToastContext";
import Toast from "./common/Toast";
import ThemeProvider from "./context/ThemeContext";
import { DesktopProvider } from "./desktop/DesktopProvider";
import Desktop from "./desktop/Desktop";
import BootScreen from "./desktop/BootScreen";

function App() {
  const { isShowing } = useContext(ToastContext);
  const [booted, setBooted] = useState(false);

  return (
    <ThemeProvider>
      <DesktopProvider>
        {isShowing && <Toast />}
        {!booted && <BootScreen onDone={() => setBooted(true)} />}
        <Desktop />
      </DesktopProvider>
    </ThemeProvider>
  );
}

export default App;
