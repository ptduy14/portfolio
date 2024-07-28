export default function chatbotReducer(state, action) {
  switch (action.type) {
    case "set_session":
      return {
        ...state,
        sessionId: action.sessionId,
      };
      break;

    case "set_bot_message":
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            type: "bot",
            text: action.message,
          },
        ],
      };
      break;

    case "set_user_message":
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            type: "user",
            text: action.message
          }
        ]
      }

    case "set_buttons_input":
      return {
        ...state,
        buttonsInput: action.buttonsInput,
      };
      break;

    case "set_chat_initialized": 
      return {
        ...state,
        isChatInitialized: action.isChatInitialized
      }
      break;
      
    default:
      break;
  }
}
