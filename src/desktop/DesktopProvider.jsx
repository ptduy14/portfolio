import { createContext, useCallback, useContext, useReducer } from "react";
import { APP_MAP } from "./apps/registry";

const DesktopContext = createContext(null);

const initialState = { windows: [] };

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// Size from a fraction of the viewport (responsive across screens), centered + lightly cascaded.
function computeGeometry(cfg, count) {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const w = clamp(Math.round(vw * cfg.size.w), 360, vw - 110); // leave room for the dock
  const h = clamp(Math.round(vh * cfg.size.h), 260, vh - 70); // leave room for the panel
  const n = count % 6;
  const x = clamp(Math.round((vw - w) / 2) + n * 26, 96, Math.max(96, vw - w - 16));
  const y = clamp(Math.round((vh - h) / 2) + n * 26, 44, Math.max(44, vh - h - 16));
  return { x, y, w, h };
}

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
      const geo = computeGeometry(cfg, state.windows.length);
      return {
        windows: [
          ...state.windows,
          { id: action.id, ...geo, maximized: false, minimized: false },
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
    case "RESIZE":
      return {
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, w: action.w, h: action.h } : w
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
  const resizeWindow = useCallback((id, w, h) => dispatch({ type: "RESIZE", id, w, h }), []);
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
        resizeWindow,
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
