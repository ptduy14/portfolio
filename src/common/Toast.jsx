import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";
import { Icon } from "../desktop/shell/icons";

export default function Toast() {
  const { messageToast, titleToast, handleClosingToast } = useContext(ToastContext);

  return (
    <div
      onClick={handleClosingToast}
      role="status"
      className="mat-popover animate-toastIn fixed right-4 top-11 z-[170] w-80 cursor-pointer rounded-2xl border p-3 shadow-float"
      style={{ borderColor: "var(--mat-border)" }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-accent text-text-on-accent">
          <Icon name="bell" size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-semibold text-text">{titleToast}</span>
            <span className="flex-none text-xs text-text-dim">now</span>
          </div>
          <p className="mt-0.5 text-sm leading-snug text-text-body">{messageToast}</p>
        </div>
      </div>
    </div>
  );
}
