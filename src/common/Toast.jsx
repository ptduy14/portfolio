import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";

export default function Toast() {
  const { messageToast, handleClosingToast } = useContext(ToastContext);
  return (
    <div onClick={handleClosingToast} className="py-2.5 px-4 bg-tertiary-color fixed w-80 top-12 rounded-xl shadow-custom cursor-pointer hover:bg-[#212635] z-10 transition-all duration-500 right-20">
      <p>{messageToast}</p>
    </div>
  );
}
