import { useContext, useEffect, useState } from "react";
import BotMessage from "../../../common/BotMessage";
import UserMessage from "../../../common/UserMessage";
import chatbotPreviewService from "../../../services/chatbotPreviewService";
import ButtonInput from "../../../common/ButtonInput";
import { ChatbotContext } from "../../../context/ChatbotContext";
import {
  setBotMessage,
  setButtonsInput,
  setChatInitialized,
  setSession,
  setUserMessage,
} from "../../../reducer/actions";
import WaitingMessage from "../../../common/WaitingMessage";
import ChatInitializing from "../../../common/ChatInitializing";

export default function Chatbot() {
  const { chatbot, dispatch } = useContext(ChatbotContext);
  const [isWaitingMessage, setIsWaitingMessage] = useState(false);

  useEffect(() => {
    if (!chatbot.sessionId && chatbot.messages.length === 0) {
      handleStartChat();
      dispatch(setChatInitialized(true));
    }
  }, []);

  const handleStartChat = async () => {
    const data = await chatbotPreviewService.startChat();
    dispatch(setSession(data.sessionId));
    dispatch(
      setBotMessage(data.messages[0].content.richText[0].children[0].text)
    );
    dispatch(setButtonsInput(data.input.items));
  };

  const handleSubmitMessage = async (content) => {
    setIsWaitingMessage(true);

    try {
      dispatch(setUserMessage(content));
      const data = await chatbotPreviewService.continueChat(
        chatbot.sessionId,
        content
      );
      dispatch(
        setBotMessage(data.messages[0].content.richText[0].children[0].text)
      );
      dispatch(setButtonsInput(data.input.items));
    } catch (error) {
      console.log(error);
    } finally {
      setIsWaitingMessage(false);
    }
  };

  if (!chatbot.isChatInitialized) {
    return <ChatInitializing />;
  }

  return (
    <div className="h-full w-full bg-primary-color rounded-md p-4 md:p-8 space-y-4 relative overflow-y-scroll">
      {chatbot.messages.map((message, index) => {
        if (message.type === "bot") {
          return <BotMessage key={index} message={message.text} />;
        }
        return <UserMessage key={index} message={message.text} />;
      })}

      {isWaitingMessage || (
        <ButtonInput
          buttonsInput={chatbot.buttonsInput}
          handleSubmitMessage={handleSubmitMessage}
        />
      )}
      {isWaitingMessage && <WaitingMessage />}
    </div>
  );
}
