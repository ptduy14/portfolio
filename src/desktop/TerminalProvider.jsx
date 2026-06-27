import { createContext, useContext, useRef, useState } from "react";

// Persistent terminal log (survives closing/reopening the Ask Me app).
// entry = { id, kind: 'banner'|'system'|'user'|'agent'|'tool'|'think'|'output', text }
const TerminalContext = createContext(null);

export function TerminalProvider({ children }) {
  const [log, setLog] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const idRef = useRef(0);

  const pushEntry = (kind, text = "") => {
    const id = ++idRef.current;
    setLog((l) => [...l, { id, kind, text }]);
    return id;
  };
  const updateEntry = (id, text) => setLog((l) => l.map((e) => (e.id === id ? { ...e, text } : e)));
  const removeEntry = (id) => setLog((l) => l.filter((e) => e.id !== id));
  const clearLog = () => setLog([]);

  return (
    <TerminalContext.Provider
      value={{ log, pushEntry, updateEntry, removeEntry, clearLog, initialized, setInitialized }}
    >
      {children}
    </TerminalContext.Provider>
  );
}

export const useTerminal = () => useContext(TerminalContext);
