export default function UserMessage({ message }) {
  return (
    <div className="text-end">
      <div className="bg-[#ddba20] text-white md:text-text-color md:font-normal text-left font-semibold md:bg-hover-color px-2 py-2 md:px-6 md:py-3 inline-block rounded-md">
        {message}
      </div>
    </div>
  );
}
