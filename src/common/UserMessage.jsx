export default function UserMessage({ message }) {
  return (
    <div className="text-end">
      <div className="bg-tertiary-color px-2 py-2 md:px-6 md:py-3 inline-block rounded-md">
        {message}
      </div>
    </div>
  );
}
