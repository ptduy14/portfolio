import { useState } from "react";
import ArrowDownIcon from "../../Icons/ArrowDownIcon";
import ArrowTopIcon from "../../Icons/ArrowUpIcon";
import { TABS } from "../../../constant/tab";

export default function NavbarMobile({ setCurrentContent, currentContent }) {
  const [isOpen, setIsOpen] = useState(false);

  const currentTab = TABS.find((tab) => tab.key === currentContent);

  return (
    <div className="block md:hidden relative">
      <div
        className="selected flex justify-between items-center py-3 px-5 bg-tertiary-color cursor-pointer hover:bg-hover-color"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{currentTab ? currentTab.label : ""}</span>
        {isOpen ? <ArrowTopIcon /> : <ArrowDownIcon />}
      </div>
      <ul
        className={`${
          isOpen ? "h-auto" : "h-0"
        } overflow-hidden absolute left-0 right-0 z-10`}
      >
        {TABS.map((tab) => {
          return (
            <li
              key={tab.key}
              className={`py-3 px-5 bg-tertiary-color cursor-pointer hover:bg-hover-color ${
                tab.key === currentContent && "hidden"
              }`}
              onClick={() => {
                setCurrentContent(tab.key);
                setIsOpen(!isOpen);
              }}
            >
              {tab.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
