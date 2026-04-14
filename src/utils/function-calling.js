import resume from "../assets/resume/resume.pdf";

const handleBotAction = (action, data) => {
  switch (action) {
    case "download_cv":
      const link = document.createElement("a");
      link.href = resume;
      link.setAttribute("download", "Tan_Duy_CV.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      break;

    default:
      console.warn("Unknown action:", action);
  }
};

export default handleBotAction;
