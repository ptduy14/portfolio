import React from "react";
import ReactDOM from "react-dom/client";
// Self-hosted fonts (Adwaita Sans ≈ Inter, Adwaita Mono ≈ JetBrains Mono)
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ToastProvider from "./context/ToastContext";
import ChatbotProvider from "./context/ChatbotContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <ToastProvider>
      <ChatbotProvider>
        <App />
      </ChatbotProvider>
    </ToastProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
