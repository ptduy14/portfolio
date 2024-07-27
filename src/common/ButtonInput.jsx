export default function ButtonInput({ buttonsInput }) {
    return <div className="flex gap-y-2 justify-end text-[#fff] font-semibold gap-x-2 flex-wrap">
        {buttonsInput.map((buttonInput, index) => <div key={index} className="py-1 px-3 bg-[#0041d6] rounded-md cursor-pointer hover:bg-[#003bc4]">{buttonInput.content}</div>)}
        
    </div>
}