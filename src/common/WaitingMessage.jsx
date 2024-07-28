import avata from "../assets/img/avata.jpg";

export default function WaitingMessage() {
  return (
    <div className="flex items-center gap-x-2">
      <div className="h-full w-12 rounded-full overflow-hidden">
        <img className="h-full width-full" src={avata} alt="" />
      </div>
      <div className="flex bg-tertiary-color px-2 py-2 md:px-3 md:py-3 rounded-md gap-x-1">
        <div className="h-2 w-2 bg-text-color rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-text-color rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-text-color rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}
