import { useState, useEffect, useRef } from "react";
import { TABS } from "../../../constant/tab";

export default function Navbar({ setCurrentContent }) {
  const [positionActiveLine, setPositionActiveLine] = useState({
    left: 0,
    width: 0,
  });
  const [navbarItemList, setNavbarItemList] = useState([]);
  const navbarContainerRef = useRef(null);

  useEffect(() => {
    let nodeList = navbarContainerRef.current.querySelectorAll("li");
    setNavbarItemList(nodeList);
    setPositionActiveLine({
      left: nodeList[0].offsetLeft,
      width: nodeList[0].offsetWidth,
    });
  }, []);

  const handleSwitchContent = (obj) => {
    setPositionActiveLine({
      left: navbarItemList[obj.index].offsetLeft,
      width: navbarItemList[obj.index].offsetWidth,
    });

    setCurrentContent(obj.key);
  };

  return (
    <ul className="relative hidden md:flex" ref={navbarContainerRef}>
      {TABS.map((tab, index) => {
        return (
          <li
            key={tab.key}
            onClick={() => handleSwitchContent({ index, key: tab.key })}
            className="py-5 px-6 bg-tertiary-color cursor-pointer hover:bg-hover-color"
          >
            {tab.label}
          </li>
        );
      })}
      <div
        className={`block absolute transition-all duration-500 ease h-full bottom-0 bg-[#1F4962] opacity-20`}
        style={{
          left: `${positionActiveLine.left}px`,
          width: `${positionActiveLine.width}px`,
        }}
      ></div>
    </ul>
  );
}
