export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background clouds */}
      <path
        d="M60 60C60 50 70 40 80 40C85 40 90 42 93 45C97 38 105 35 115 35C128 35 140 45 140 60C140 65 138 70 135 73C138 76 140 80 140 85C140 95 130 105 120 105H60C45 105 35 95 35 80C35 68 45 60 55 60C57 60 58 60 60 60Z"
        fill="currentColor"
        className="text-emerald-100/40 dark:text-emerald-900/20"
      />
      <path
        d="M320 80C320 75 325 70 330 70C333 70 335 71 337 73C339 69 343 67 348 67C355 67 360 72 360 80C360 82 359 85 358 86C359 88 360 90 360 92C360 97 355 102 350 102H320C312 102 307 97 307 90C307 84 312 80 317 80C318 80 319 80 320 80Z"
        fill="currentColor"
        className="text-emerald-100/40 dark:text-emerald-900/20"
      />

      {/* Trees */}
      <path
        d="M100 160L90 100L110 100L100 160Z"
        fill="currentColor"
        className="text-emerald-800 dark:text-emerald-950"
      />
      <circle
        cx="100"
        cy="90"
        r="25"
        fill="currentColor"
        className="text-emerald-500 dark:text-emerald-600"
      />
      <circle
        cx="85"
        cy="105"
        r="20"
        fill="currentColor"
        className="text-emerald-400 dark:text-emerald-500"
      />
      <circle
        cx="115"
        cy="105"
        r="20"
        fill="currentColor"
        className="text-emerald-400 dark:text-emerald-500"
      />

      <path
        d="M300 160L295 120L305 120L300 160Z"
        fill="currentColor"
        className="text-emerald-800 dark:text-emerald-950"
      />
      <circle
        cx="300"
        cy="110"
        r="20"
        fill="currentColor"
        className="text-emerald-500 dark:text-emerald-600"
      />

      {/* Road */}
      <path
        d="M0 160H400"
        stroke="currentColor"
        strokeWidth="4"
        className="text-emerald-900/10 dark:text-emerald-100/10"
      />

      {/* Car */}
      <g transform="translate(150, 110)">
        {/* Car body */}
        <path
          d="M15 30C15 20 25 10 40 10H80C90 10 100 20 105 30L115 50H5L15 30Z"
          fill="currentColor"
          className="text-emerald-600 dark:text-emerald-500"
        />
        <path
          d="M0 50C0 45 5 40 10 40H110C115 40 120 45 120 50V65C120 70 115 75 110 75H10C5 75 0 70 0 65V50Z"
          fill="currentColor"
          className="text-emerald-500 dark:text-emerald-400"
        />
        {/* Windows */}
        <path
          d="M25 15H55V35H15L25 15Z"
          fill="currentColor"
          className="text-emerald-100 dark:text-emerald-900"
        />
        <path
          d="M60 15H85L95 35H60V15Z"
          fill="currentColor"
          className="text-emerald-100 dark:text-emerald-900"
        />
        {/* Wheels */}
        <circle cx="25" cy="75" r="12" fill="#1f2937" />
        <circle cx="25" cy="75" r="6" fill="#9ca3af" />
        <circle cx="95" cy="75" r="12" fill="#1f2937" />
        <circle cx="95" cy="75" r="6" fill="#9ca3af" />
        {/* Lights */}
        <path d="M115 45H120V55H115V45Z" fill="#fbbf24" />
        <path d="M0 45H5V55H0V45Z" fill="#ef4444" />
      </g>
    </svg>
  );
}
