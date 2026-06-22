import { createContext, useCallback, useContext, useReducer } from "react";
import { APP_MAP } from "./apps/registry";

const DesktopContext = createContext(null);

const initialState = { windows: [] };

// windows[] is ordered by stacking: last item = top-most (focused).
function reducer(state, action) {
  switch (action.type) {
    case "OPEN": {
      const existing = state.windows.find((w) => w.id === action.id);
      if (existing) {
        // restore (un-minimize) + bring to top
        return {
          windows: [
            ...state.windows.filter((w) => w.id !== action.id),
            { ...existing, minimized: false },
          ],
        };
      }
      const cfg = APP_MAP[action.id];
      if (!cfg) return state;
      const n = state.windows.length % 6;
      return {
        windows: [
          ...state.windows,
          {
            id: action.id,
            x: 120 + n * 30,
            y: 60 + n * 30,
            w: cfg.defaultSize.w,
            h: cfg.defaultSize.h,
            maximized: false,
            minimized: false,
          },
        ],
      };
    }
    case "CLOSE":
      return { windows: state.windows.filter((w) => w.id !== action.id) };
    case "FOCUS": {
      const w = state.windows.find((x) => x.id === action.id);
      if (!w || state.windows[state.windows.length - 1]?.id === action.id) return state;
      return { windows: [...state.windows.filter((x) => x.id !== action.id), w] };
    }
    case "MOVE":
      return {
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, x: action.x, y: action.y } : w
        ),
      };
    case "TOGGLE_MAX":
      return {
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, maximized: !w.maximized } : w
        ),
      };
    case "MINIMIZE":
      return {
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, minimized: true } : w
        ),
      };
    default:
      return state;
  }
}

export function DesktopProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const openApp = useCallback((id) => dispatch({ type: "OPEN", id }), []);
  const closeApp = useCallback((id) => dispatch({ type: "CLOSE", id }), []);
  const focusApp = useCallback((id) => dispatch({ type: "FOCUS", id }), []);
  const moveWindow = useCallback((id, x, y) => dispatch({ type: "MOVE", id, x, y }), []);
  const toggleMax = useCallback((id) => dispatch({ type: "TOGGLE_MAX", id }), []);
  const minimize = useCallback((id) => dispatch({ type: "MINIMIZE", id }), []);

  const visible = state.windows.filter((w) => !w.minimized);
  const focusedId = visible.length ? visible[visible.length - 1].id : null;
  const openIds = state.windows.map((w) => w.id);

  return (
    <DesktopContext.Provider
      value={{
        windows: state.windows,
        focusedId,
        openIds,
        openApp,
        closeApp,
        focusApp,
        moveWindow,
        toggleMax,
        minimize,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  return useContext(DesktopContext);
}
