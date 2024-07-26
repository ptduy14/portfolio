import { useState } from "react";
import ArrowDownIcon from "../../Icons/ArrowDownIcon";
import ArrowTopIcon from "../../Icons/ArrowUpIcon";

export default function NavbarMobile({ setCurrentContent, currentContent }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block md:hidden relative">
      <div
        className="selected flex justify-between items-center py-3 px-5 bg-tertiary-color cursor-pointer hover:bg-hover-color"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{currentContent}</span>
        {isOpen ? <ArrowTopIcon /> : <ArrowDownIcon />}
      </div>
      <ul
        className={`${
          isOpen ? "h-auto" : "h-0"
        } overflow-hidden absolute left-0 right-0 z-10`}
      >
        {["Bio", "Skill", "Project", "Chatbot", "Contact"].map(
          (item, index) => {
            return (
              <li
                key={index}
                className={`py-3 px-5 bg-tertiary-color cursor-pointer hover:bg-hover-color ${
                  item === currentContent && "hidden"
                }`}
                onClick={() => {
                  setCurrentContent(item);
                  setIsOpen(!isOpen);
                }}
              >
                {item}
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
}
