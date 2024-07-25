import avata from "../assets/img/avata.jpg"

export default function BotMessage() {
  return (
    <div className="flex items-center gap-x-2">
        <div className="h-full w-12 rounded-full overflow-hidden">
            <img className="h-full width-full" src={avata} alt="" />
        </div>
      <div className="bg-tertiary-color px-6 py-3 inline-block rounded-md">
        Hi! What would you like to learn about me?
      </div>
    </div>
  );
}
