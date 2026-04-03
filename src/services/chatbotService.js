import axios from "axios";

// Endpoint
const HF_SPACE_URL = "https://ptduy14-portfolio-rag-agent.hf.space/chat";

export async function askAssistant(prompt) {
  try {
    const response = await axios.post(
      HF_SPACE_URL,
      {
        message: prompt,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; 

  } catch (error) {
    console.error("RAG Agent Error:", error);
    
    if (error.response?.status === 504 || error.code === 'ECONNABORTED') {
      return "The AI system is currently waking up (Hugging Face Space cold start). Please wait about 30 seconds and try again!";
    }
    
    return "I'm sorry, I'm experiencing some technical difficulties at the moment. Please feel free to reach out to me directly via email!";
  }
}