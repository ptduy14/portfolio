import { useContext, useEffect, useState, useRef } from "react";
import BotMessage from "../../../common/BotMessage";
import UserMessage from "../../../common/UserMessage";
import { askAssistant } from "../../../services/chatbotService";
import ChatInput from "../../../common/ChatInput";
import { ChatbotContext } from "../../../context/ChatbotContext";
import {
  setBotMessage,
  setChatInitialized,
  setUserMessage,
} from "../../../reducer/actions";
import WaitingMessage from "../../../common/WaitingMessage";
import ChatInitializing from "../../../common/ChatInitializing";

export default function Chatbot() {
  const { chatbot, dispatch } = useContext(ChatbotContext);
  const [isWaitingMessage, setIsWaitingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!chatbot.isChatInitialized) {
      handleStartChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chatbot.isChatInitialized) {
      scrollToBottom();
    }
  }, [chatbot.messages, isWaitingMessage, chatbot.isChatInitialized]);

  const handleStartChat = () => {
    const initialMessage =
      "Hi! Ask me anything about my experience, skills, or projects!";
    dispatch(setBotMessage(initialMessage));
    dispatch(setChatInitialized(true));
  };

  const handleSubmitMessage = async (content) => {
    if (!content.trim() || isWaitingMessage) return;

    setIsWaitingMessage(true);

    try {
      dispatch(setUserMessage(content));
      const response = await askAssistant(content);
      dispatch(setBotMessage(response || "I'm not sure how to answer that."));
    } catch (error) {
      console.error("Error sending message:", error);
      dispatch(
        setBotMessage(
          "I'm sorry, I encountered an error while trying to respond. Please try again."
        )
      );
    } finally {
      setIsWaitingMessage(false);
    }
  };

  if (!chatbot.isChatInitialized) {
    return <ChatInitializing />;
  }

  return (
    <div className="h-full w-full bg-primary-color rounded-md p-4 md:p-8 space-y-4 relative flex flex-col">
      <div className="flex-1 overflow-y-scroll space-y-4">
        {chatbot.messages.map((message, index) => {
          if (message.type === "bot") {
            return <BotMessage key={index} message={message.text} />;
          }
          return <UserMessage key={index} message={message.text} />;
        })}

        {isWaitingMessage && <WaitingMessage />}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex-shrink-0">
        <ChatInput
          handleSubmitMessage={handleSubmitMessage}
          isDisabled={isWaitingMessage}
        />
      </div>
    </div>
  );
}
