export function PromoIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle
        cx="100"
        cy="75"
        r="60"
        fill="currentColor"
        className="text-emerald-100/20 dark:text-emerald-900/20"
      />
      
      {/* Tree trunk */}
      <path
        d="M100 120L92 60L108 60L100 120Z"
        fill="currentColor"
        className="text-emerald-800 dark:text-emerald-950"
      />
      
      {/* Leaves */}
      <circle
        cx="100"
        cy="50"
        r="35"
        fill="currentColor"
        className="text-emerald-500 dark:text-emerald-600"
      />
      <circle
        cx="75"
        cy="70"
        r="25"
        fill="currentColor"
        className="text-emerald-400 dark:text-emerald-500"
      />
      <circle
        cx="125"
        cy="70"
        r="25"
        fill="currentColor"
        className="text-emerald-400 dark:text-emerald-500"
      />
      
      {/* Floating leaves */}
      <path
        d="M40 40C45 35 50 40 50 45C45 50 40 45 40 40Z"
        fill="currentColor"
        className="text-emerald-300 dark:text-emerald-400"
      />
      <path
        d="M150 30C155 25 160 30 160 35C155 40 150 35 150 30Z"
        fill="currentColor"
        className="text-emerald-300 dark:text-emerald-400"
      />
    </svg>
  );
}
