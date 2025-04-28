import avata from "../assets/img/avata.png";
import ReactMarkdown from 'react-markdown';

export default function BotMessage({ message }) {
  return (
    <div className="flex items-end gap-x-2 w-full h-auto">
      <div className="hidden md:block md:h-12 md:w-12 rounded-full overflow-hidden flex-shrink-0">
        <img className="h-full w-full" src={avata} alt="" />
      </div>
      <div className="bg-tertiary-color px-2 py-2 md:px-6 md:py-3 rounded-md">
      <ReactMarkdown>{message}</ReactMarkdown>
      </div>
    </div>
  );
}
