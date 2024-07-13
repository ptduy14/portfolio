import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import Bio from "./SubContent/Bio";

export default function Content() {
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
  };

  return (
    <div className="mt-12">
      <Navbar
        navbarContainerRef={navbarContainerRef}
        positionActiveLine={positionActiveLine}
        handleSwitchContent={handleSwitchContent}
      />
      <div className="p-5 h-[22.563rem] bg-secondary-color">
        <Bio />
      </div>
    </div>
  );
}
