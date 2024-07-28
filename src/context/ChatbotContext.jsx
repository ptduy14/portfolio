import { createContext, useContext, useReducer } from "react";
import chatbotReducer from "../reducer/chatbotReducer";

export const ChatbotContext = createContext(null);

export default function ChatbotProvider({ children }) {
    const initialState = {
        sessionId: null,
        messages: [],
        buttonsInput: [],
        isChatInitialized: false
    }

    const [chatbot, dispatch] = useReducer(chatbotReducer, initialState);

    const contextValue = {
        chatbot,
        dispatch
    }

  return <ChatbotContext.Provider value={contextValue}>{children}</ChatbotContext.Provider>;
}
