import type { CSSProperties } from "react";

type SignalNodeStyle = CSSProperties & {
  "--x": string;
  "--y": string;
};

const nodes = [
  { left: "8%", top: "30%", x: "18px", y: "-14px", delay: "0s", duration: "7.5s", tone: "bg-white/70" },
  { left: "15%", top: "42%", x: "-12px", y: "16px", delay: "1.2s", duration: "8.2s", tone: "bg-forgeko-accent/80" },
  { left: "24%", top: "23%", x: "20px", y: "10px", delay: "0.6s", duration: "7s", tone: "bg-cyan-300/70" },
  { left: "36%", top: "55%", x: "-18px", y: "-12px", delay: "2s", duration: "9s", tone: "bg-white/60" },
  { left: "52%", top: "19%", x: "14px", y: "18px", delay: "1.7s", duration: "7.8s", tone: "bg-forgeko-accent/70" },
  { left: "66%", top: "43%", x: "-16px", y: "14px", delay: "0.4s", duration: "8.6s", tone: "bg-teal-300/60" },
  { left: "79%", top: "28%", x: "12px", y: "-18px", delay: "2.4s", duration: "7.2s", tone: "bg-white/65" },
  { left: "88%", top: "58%", x: "-20px", y: "-10px", delay: "1s", duration: "9.4s", tone: "bg-forgeko-accent/75" }
];

const streams = [
  { top: "24%", left: "8%", width: "35%", delay: "0s" },
  { top: "38%", left: "52%", width: "34%", delay: "1.1s" },
  { top: "60%", left: "22%", width: "46%", delay: "2.2s" }
];

export function HeroSignalField() {
  return (
    <div aria-hidden="true" className="signal-field pointer-events-none absolute inset-0 overflow-hidden">
      <div className="signal-mesh absolute left-1/2 top-10 h-[34rem] w-[min(76rem,116vw)] -translate-x-1/2" />
      <div className="absolute left-1/2 top-16 h-[26rem] w-[min(68rem,108vw)] -translate-x-1/2">
        {streams.map((stream) => (
          <span
            key={`${stream.top}-${stream.left}`}
            className="signal-stream absolute h-px"
            style={{
              top: stream.top,
              left: stream.left,
              width: stream.width,
              animationDelay: stream.delay
            }}
          />
        ))}
        {nodes.map((node) => (
          <span
            key={`${node.left}-${node.top}`}
            className={`signal-node absolute h-1.5 w-1.5 ${node.tone}`}
            style={{
              left: node.left,
              top: node.top,
              animationDelay: node.delay,
              animationDuration: node.duration,
              "--x": node.x,
              "--y": node.y
            } as SignalNodeStyle}
          />
        ))}
      </div>
    </div>
  );
}
