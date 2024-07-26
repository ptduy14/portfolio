import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Bio from "./SubContent/Bio";
import Skill from "./SubContent/Skill";
import Project from "./SubContent/Project";
import Contact from "./SubContent/Contact";
import Chatbot from "./SubContent/Chatbot";
import NavbarMobile from "./Navbar/NavbarMobile";

export default function Content() {
  const [currentContent, setCurrentContent] = useState("Bio");

  useEffect(() => {
    document.title = currentContent;
  }, [currentContent]);

  const handleRenderCurrentContent = () => {
    switch (currentContent) {
      case "Skill":
        return <Skill />;
        break;

      case "Project":
        return <Project />;
        break;

      case "Chatbot":
        return <Chatbot />;
        break;

      case "Contact":
        return <Contact />;
        break;

      default:
        return <Bio />;
        break;
    }
  };

  return (
    <div className="mt-12">
      <Navbar setCurrentContent={setCurrentContent} />
      <NavbarMobile setCurrentContent={setCurrentContent} currentContent={currentContent}/>

      <div className="p-5 h-[22.563rem] bg-secondary-color">
        {handleRenderCurrentContent()}
      </div>
    </div>
  );
}
