export default function ButtonInput({ buttonsInput, handleSubmitMessage }) {
  return (
   
      <div className="flex gap-y-2 float-right justify-end text-[#fff] font-semibold gap-x-2 flex-wrap w-[80%]">
      {buttonsInput.map((buttonInput, index) => (
        <div
          key={index}
          className="py-2 px-3 bg-[#0041d6] rounded-md cursor-pointer hover:bg-[#003bc4]"
          onClick={() => handleSubmitMessage(buttonInput.content)}
        >
          {buttonInput.content}
        </div>
      ))}
    </div>

    
  );
}
