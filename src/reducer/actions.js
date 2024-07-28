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

const setButtonsInput = (buttonsInput) => {
  return {
    type: "set_buttons_input",
    buttonsInput,
  };
};

export { setSession, setBotMessage, setButtonsInput, setUserMessage };
