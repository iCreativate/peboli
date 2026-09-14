'use client';

import { motion } from 'framer-motion';

const nodes = [
  { cx: 18, cy: 32, r: 3.2, delay: 0 },
  { cx: 38, cy: 18, r: 2.6, delay: 0.3 },
  { cx: 62, cy: 28, r: 3.8, delay: 0.15 },
  { cx: 78, cy: 52, r: 2.8, delay: 0.45 },
  { cx: 48, cy: 58, r: 3.4, delay: 0.2 },
  { cx: 28, cy: 68, r: 2.4, delay: 0.55 },
  { cx: 70, cy: 78, r: 3.0, delay: 0.35 },
  { cx: 88, cy: 22, r: 2.2, delay: 0.6 },
];

const links = [
  [0, 1],
  [1, 2],
  [2, 3],
  [0, 4],
  [4, 3],
  [4, 5],
  [5, 6],
  [3, 6],
  [2, 7],
];

export function HeroVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(184,240,0,0.18),transparent_55%),radial-gradient(ellipse_at_20%_80%,rgba(34,211,238,0.12),transparent_50%),linear-gradient(160deg,#071018_0%,#0d1824_45%,#122032_100%)]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:48px_48px]" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {links.map(([a, b], i) => (
          <motion.line
            key={`${a}-${b}`}
            x1={nodes[a].cx}
            y1={nodes[a].cy}
            x2={nodes[b].cx}
            y2={nodes[b].cy}
            stroke="rgba(184,240,0,0.35)"
            strokeWidth="0.15"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
          />
        ))}
        {nodes.map((node, i) => (
          <motion.circle
            key={i}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill="rgba(184,240,0,0.85)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
            transition={{
              scale: { duration: 3.2, repeat: Infinity, delay: node.delay, ease: 'easeInOut' },
              opacity: { duration: 3.2, repeat: Infinity, delay: node.delay, ease: 'easeInOut' },
            }}
            style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
          />
        ))}
      </svg>
    </div>
  );
}
