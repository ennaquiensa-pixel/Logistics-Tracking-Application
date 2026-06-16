export const Logo: React.FC<{ className?: string }> = ({ className = "w-32 h-8" }) => (
    <svg 
    className={className}
    viewBox="0 0 80 80" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="minimalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#000000"/>
        <stop offset="100%" stopColor="#333333"/>
      </linearGradient>
    </defs>
    
    <g>
      <path d="M15 40 L65 40" stroke="url(#minimalGradient)" strokeWidth="3" strokeLinecap="round"/>
      <rect x="35" y="35" width="20" height="10" rx="2" fill="url(#minimalGradient)"/>
      <rect x="45" y="30" width="12" height="10" rx="2" fill="url(#minimalGradient)"/>
      <circle cx="40" cy="48" r="3" fill="#666666"/>
      <circle cx="50" cy="48" r="3" fill="#666666"/>
      <circle cx="60" cy="40" r="4" fill="white" stroke="url(#minimalGradient)" strokeWidth="2"/>
    </g>
  </svg>
 
);