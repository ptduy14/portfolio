export function createOptions(text = "") {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.REACT_APP_TOKEN}`},
    body: JSON.stringify({
      message: { type: "text", text: text },
    }),
  };
}

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

  continueChat: async (sessionId, message) => {
    const options = createOptions(message);
    const response = await fetch(
      `https://typebot.io/api/v1/sessions/${sessionId}/continueChat`,
      options
    );
    const data = await response.json();
    return data;
  },
};

export default chatbotPreviewService;
