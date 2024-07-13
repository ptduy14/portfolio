import { convertPxToRem } from "../../../utils/convertUtils";

export default function Navbar({ navbarContainerRef, positionActiveLine, handleSwitchContent }) {
  return (
    <ul className="flex relative" ref={navbarContainerRef}>
      {["Bio", "Skill", "Experiences", "Project", "Contact"].map(
        (item, index) => {
          return (
            <li
              key={index}
              onClick={() => handleSwitchContent({ index, content: item })}
              className="py-5 px-6 bg-tertiary-color cursor-pointer hover:bg-hover-color"
            >
              {item}
            </li>
          );
        }
      )}
      <div
        className={`block absolute transition-all duration-500 ease h-full bottom-0 bg-[#1F4962] opacity-20`}
        style={{
          left: `${convertPxToRem(positionActiveLine.left)}rem`,
          width: `${convertPxToRem(positionActiveLine.width)}rem`,
        }}
      ></div>
    </ul>
  );
}
