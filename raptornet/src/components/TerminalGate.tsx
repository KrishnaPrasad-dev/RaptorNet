"use client";

import { useEffect, useState } from "react";

const lineOne = "> initializing_application.sh";
const lineTwo = "> access_request: open";

export default function TerminalGate() {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [activeLine, setActiveLine] = useState<1 | 2>(1);

  useEffect(() => {
    let firstIndex = 0;
    let secondIndex = 0;

    const firstTimer = window.setInterval(() => {
      firstIndex += 1;
      setFirst(lineOne.slice(0, firstIndex));

      if (firstIndex >= lineOne.length) {
        window.clearInterval(firstTimer);
        window.setTimeout(() => {
          setActiveLine(2);

          const secondTimer = window.setInterval(() => {
            secondIndex += 1;
            setSecond(lineTwo.slice(0, secondIndex));

            if (secondIndex >= lineTwo.length) {
              window.clearInterval(secondTimer);
              setActiveLine(2);
            }
          }, 35);
        }, 190);
      }
    }, 32);

    return () => {
      window.clearInterval(firstTimer);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-white/12 bg-[linear-gradient(145deg,rgba(6,9,13,0.9),rgba(9,12,18,0.86))] p-4 sm:p-5">
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-300/70" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200/90">
          Applications open
        </p>
      </div>

      <div className="mt-4 space-y-2 font-mono text-sm leading-6 text-[#bde1ff] sm:text-[0.95rem]">
        <p>
          {first}
          {activeLine === 1 ? <span className="ml-1 inline-block animate-pulse text-white">_</span> : null}
        </p>
        <p>
          {second}
          {activeLine === 2 ? <span className="ml-1 inline-block animate-pulse text-white">_</span> : null}
        </p>
      </div>
    </div>
  );
}
