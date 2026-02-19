import {
  PROFILE_CONTEXT,
  PROJECTS_CONTEXT,
  EXPERIENCES_CONTEXT,
  SKILLS_CONTEXT,
} from "../constant/assistantContext";

export function pickAssistantContext(prompt) {
  const q = prompt.toLowerCase();

  if (/project|portfolio|build|github/.test(q)) return PROJECTS_CONTEXT;
  if (/experience|company|intern|fpt|job/.test(q)) return EXPERIENCES_CONTEXT;
  if (/skill|tech|stack|react|frontend|backend/.test(q)) return SKILLS_CONTEXT;

  return PROFILE_CONTEXT;
}
