import BotMessage from "../../../common/BotMessage";
import UserMessage from "../../../common/UserMessage";

export default function Chatbot() {
  return (
    <div className="h-full w-full bg-primary-color rounded-md p-8 space-y-4 relative">
      <BotMessage />
      <UserMessage />
      <div className="h-24 w-full bg-tertiary-color absolute bottom-0 left-0 flex justify-center items-center text-lg font-bold">This function is in development 🧑‍💻</div>
    </div>
  );
}
