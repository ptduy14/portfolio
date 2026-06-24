import { useEffect, useRef, useState } from "react";
import { useSystem } from "./SystemProvider";

// Linux-style boot log (D4). Static, author-controlled HTML → safe to inject.
const STATIC_LINES = [
  '<span style="color:#6b7480">[    0.000000]</span> Linux version 6.9.0-portfolio (duy@portfolio) #1 SMP',
  '<span style="color:#6b7480">[    0.084213]</span> Command line: BOOT_IMAGE=/vmlinuz root=/dev/duy ro quiet splash',
  '<span style="color:#8ff0a4">[  OK  ]</span> Mounted <span style="color:#62a0ea">/home/duy</span>',
  '<span style="color:#8ff0a4">[  OK  ]</span> Started Load Kernel Modules',
  '<span style="color:#8ff0a4">[  OK  ]</span> Reached target <span style="color:#62a0ea">Network</span>',
  '<span style="color:#8ff0a4">[  OK  ]</span> Started GNOME Display Manager',
  "",
  "loading portfolio modules...",
  '  <span style="color:#62a0ea">&rarr;</span> react ................... <span style="color:#8ff0a4">ok</span>',
  '  <span style="color:#62a0ea">&rarr;</span> tailwind ................ <span style="color:#8ff0a4">ok</span>',
  '  <span style="color:#62a0ea">&rarr;</span> rag-agent (hf.space) .... <span style="color:#f9f06b">warm-up</span>',
];

function githubLine(github) {
  const head = '  <span style="color:#62a0ea">&rarr;</span> github (ptduy14) ...... ';
  if (github.status === "ok")
    return head + `<span style="color:#8ff0a4">${github.repoCount} repos · ${github.totalStars}&#9733;</span>`;
  if (github.status === "error")
    return head + '<span style="color:#f66151">offline (using cached)</span>';
  return head + '<span style="color:#f9f06b">syncing…</span>';
}

export default function BootScreen({ onDone }) {
  const { github } = useSystem();
  const [count, setCount] = useState(0);
  const finished = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Lines are rebuilt each render so the github line reflects live status; length is stable.
  const lines = [
    ...STATIC_LINES,
    githubLine(github),
    '  <span style="color:#62a0ea">&rarr;</span> desktop-shell ........... <span style="color:#8ff0a4">ok</span>',
    "",
    'starting desktop session for <span style="color:#62a0ea">duy</span>...',
  ];
  const total = lines.length;

  useEffect(() => {
    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      onDoneRef.current();
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= total) {
        clearInterval(timer);
        setTimeout(finish, 450);
      }
    }, 110);

    const skip = () => {
      clearInterval(timer);
      finish();
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);
    return () => {
      clearInterval(timer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden whitespace-pre bg-[#0a0c0f] p-6 font-mono text-[13px] leading-relaxed text-[#cfd6df]">
      {lines.slice(0, count).map((line, idx) => (
        <div key={idx} dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }} />
      ))}
      <div className="absolute bottom-5 right-6 text-[11px] text-[#566b78]">
        press any key to skip &raquo;
      </div>
    </div>
  );
}
