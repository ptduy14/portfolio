import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Bio from "./SubContent/Bio";
import Skill from "./SubContent/Skill";
import Project from "./SubContent/Project";
import Contact from "./SubContent/Contact";
import Chatbot from "./SubContent/Chatbot";
import NavbarMobile from "./Navbar/NavbarMobile";
import { TABS } from "../../constant/tab";

const TAB_COMPONENT_MAP = {
  bio: Bio,
  skills: Skill,
  projects: Project,
  "ask-me": Chatbot,
  contact: Contact,
};

export default function Content() {
  const [currentContent, setCurrentContent] = useState(TABS[0].key);

  useEffect(() => {
    const currentTab = TABS.find((tab) => tab.key === currentContent);
    document.title = currentTab ? currentTab.label : "";
  }, [currentContent]);

  const handleRenderCurrentContent = () => {
    const Component = TAB_COMPONENT_MAP[currentContent] || Bio;
    return <Component />;
  };

  return (
    <div className="mt-12">
      <Navbar setCurrentContent={setCurrentContent} />
      <NavbarMobile
        setCurrentContent={setCurrentContent}
        currentContent={currentContent}
      />

      <div className="p-5 h-[22.563rem] bg-secondary-color">
        {handleRenderCurrentContent()}
      </div>
    </div>
  );
}
