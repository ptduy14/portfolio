import { createContext, useState } from "react";

export const ToastContext = createContext(null);

export default function ToastProvider({ children }) {
  const [isShowing, setIsShowing] = useState(false);
  const [messageToast, setMessageToast] = useState("");

  const handleShowingToast = (text) => {
    setMessageToast(text);
    setIsShowing(true);

    setTimeout(() => {
        if (isShowing) return;
        handleClosingToast();
    }, 5000)
  };

  const handleClosingToast = () => {
    setIsShowing(false);
  }

  const contextValue = {
    isShowing,
    setIsShowing,
    messageToast,
    handleShowingToast,
    handleClosingToast
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}
