import createOptions from "../utils/createOptions";

const chatbotPreviewService = {
  startChat: async () => {
    const options = createOptions();
    const response = await fetch(
      `https://typebot.io/api/v1/typebots/${process.env.REACT_APP_TYPEBOT_ID}/preview/startChat`,
      options
    );
    const data = await response.json();
    return data;
  },

  continueChat: async () => {
    const options = createOptions();
    const sessionId = localStorage.getItem("sessionId");
    const response = await fetch(
      `https://typebot.io/api/v1/sessions/${sessionId}/continueChat`,
      options
    );
    const data = await response.json();
    return data;
  },
};

export default chatbotPreviewService;
