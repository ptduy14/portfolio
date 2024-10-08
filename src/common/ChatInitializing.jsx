export default function ChatInitializing() {
  return (
    <div className="flex space-x-2 justify-center items-center bg-primary-color rounded-md p-4 md:p-8 space-y-4 h-full">
      <span className="sr-only">Loading...</span>
      <div className="h-4 w-4 bg-text-color rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-4 w-4 bg-text-color rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-4 w-4 bg-text-color rounded-full animate-bounce"></div>
    </div>
  );
}
