import { createContext, useRef, useState } from "react";

export const ToastContext = createContext(null);

export default function ToastProvider({ children }) {
  const [isShowing, setIsShowing] = useState(false);
  const [messageToast, setMessageToast] = useState("");
  const [titleToast, setTitleToast] = useState("Portfolio OS");
  const timer = useRef(null);

  const handleShowingToast = (text, title = "Portfolio OS") => {
    setMessageToast(text);
    setTitleToast(title);
    setIsShowing(true);

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setIsShowing(false), 5000);
  };

  const handleClosingToast = () => {
    if (timer.current) clearTimeout(timer.current);
    setIsShowing(false);
  };

  const contextValue = {
    isShowing,
    setIsShowing,
    messageToast,
    titleToast,
    handleShowingToast,
    handleClosingToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}
