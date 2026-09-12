export default function StaticMacBook({ branded = false }: { branded?: boolean }) {
  return (
    <svg
      viewBox="0 0 600 380"
      className="w-full h-full"
      role="img"
      aria-label="Illustration of a MacBook Air, closed"
    >
      <defs>
        <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d7d8db" />
          <stop offset="100%" stopColor="#a9aab0" />
        </linearGradient>
        <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c3c4c8" />
          <stop offset="100%" stopColor="#8f9096" />
        </linearGradient>
      </defs>

      {/* screen */}
      <rect x="150" y="30" width="300" height="200" rx="14" fill="url(#lidGrad)" />
      <rect x="160" y="40" width="280" height="180" rx="8" fill="#08080a" />
      {branded && (
        <text
          x="300"
          y="140"
          textAnchor="middle"
          fill="#f5f4f1"
          fontSize="26"
          letterSpacing="4"
          fontFamily="var(--font-sans)"
        >
          POSTIZ
        </text>
      )}

      {/* base */}
      <path d="M120 232 H480 L500 260 H100 Z" fill="url(#baseGrad)" />
      <rect x="95" y="258" width="410" height="10" rx="4" fill="#6f7075" />
    </svg>
  );
}
