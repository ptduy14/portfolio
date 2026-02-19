const setSession = (sessionId) => {
  return {
    type: "set_session",
    sessionId,
  };
};

const setBotMessage = (message) => {
  return {
    type: "set_bot_message",
    message,
  };
};

const setUserMessage = (message) => {
  return {
    type: "set_user_message",
    message,
  };
};

const setChatInitialized = (isChatInitialized) => {
  return {
    type: "set_chat_initialized",
    isChatInitialized,
  };
};

export { setSession, setBotMessage, setUserMessage, setChatInitialized };
