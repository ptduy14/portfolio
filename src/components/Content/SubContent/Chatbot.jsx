import { useEffect, useState } from "react";
import BotMessage from "../../../common/BotMessage";
import UserMessage from "../../../common/UserMessage";
import chatbotPreviewService from "../../../services/chatbotPreviewService";
import ButtonInput from "../../../common/ButtonInput";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [buttonsInput, setButtonsInput] = useState([]);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      handleContinueChat();
    } else {
      handleStartChat();
    }
  }, []);

  const handleStartChat = async () => {
    const data = await chatbotPreviewService.startChat();
    setMessages((prev) => ([
      ...prev,
      {
        type: 'bot',
        message: data.messages[0].content.richText[0].children[0].text
      }
    ]));
    setButtonsInput(data.input.items);
    console.log(data);
  };

  const handleContinueChat = async () => {
    const data = await chatbotPreviewService.continueChat();
    console.log(data);
  };

  console.log(buttonsInput)

  return (
    <div className="h-full w-full bg-primary-color rounded-md p-8 space-y-2 relative overflow-y-scroll">
      {messages.map((message, index) => {
        if (message.type === 'bot') return <BotMessage key={index} message={message.message}/> 
        return <UserMessage key={index} message={message.message} />
      })}
      <ButtonInput buttonsInput={buttonsInput} />
    </div>
  );
}
