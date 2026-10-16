import React from 'react';

export const CfpLogo: React.FC<{ className?: string; size?: number }> = ({ className = "w-full h-full", size }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 500 500" 
      width={size || "100%"} 
      height={size || "100%"}
      className={className}
    >
      <defs>
        <linearGradient id="goldGradInline" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24"/>
          <stop offset="50%" stopColor="#d97706"/>
          <stop offset="100%" stopColor="#b45309"/>
        </linearGradient>
        <linearGradient id="shieldGradInline" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f2b59"/>
          <stop offset="100%" stopColor="#07142b"/>
        </linearGradient>
      </defs>

      {/* Golden Wings */}
      <g>
        <path d="M 250,110 C 220,70 170,50 110,65 C 100,95 110,130 135,160 C 100,165 80,195 85,225 C 105,240 135,245 160,240 C 130,260 120,295 135,325 C 160,335 190,325 215,300 C 210,330 220,360 250,380 Z" fill="url(#goldGradInline)" stroke="#78350f" strokeWidth="2"/>
        <path d="M 250,110 C 280,70 330,50 390,65 C 400,95 390,130 365,160 C 400,165 420,195 415,225 C 395,240 365,245 340,240 C 370,260 380,295 365,325 C 340,335 310,325 285,300 C 290,330 280,360 250,380 Z" fill="url(#goldGradInline)" stroke="#78350f" strokeWidth="2"/>
        <path d="M 235,80 C 240,60 260,60 265,80 C 280,85 285,100 270,110 L 230,110 C 215,100 220,85 235,80 Z" fill="#fef08a" stroke="#b45309" strokeWidth="2"/>
        <polygon points="250,55 240,75 260,75" fill="#f59e0b"/>
      </g>

      {/* Shield */}
      <g>
        <path d="M 250,130 C 320,130 330,160 330,220 C 330,300 280,360 250,390 C 220,360 170,300 170,220 C 170,160 180,130 250,130 Z" fill="url(#shieldGradInline)" stroke="#fbbf24" strokeWidth="6"/>
        <path d="M 250,142 C 310,142 318,170 318,220 C 318,290 274,345 250,372 C 226,345 182,290 182,220 C 182,170 190,142 250,142 Z" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="4,2"/>
      </g>

      {/* Engineering Cog */}
      <g transform="translate(250,230)">
        <circle r="46" fill="#1e293b" stroke="#fbbf24" strokeWidth="3"/>
        <g fill="#fbbf24">
          <rect x="-6" y="-55" width="12" height="12" rx="2"/>
          <rect x="-6" y="43" width="12" height="12" rx="2"/>
          <rect x="-55" y="-6" width="12" height="12" rx="2"/>
          <rect x="43" y="-6" width="12" height="12" rx="2"/>
          <rect x="-40" y="-40" width="12" height="12" rx="2" transform="rotate(45)"/>
          <rect x="28" y="-40" width="12" height="12" rx="2" transform="rotate(45)"/>
          <rect x="-40" y="28" width="12" height="12" rx="2" transform="rotate(45)"/>
          <rect x="28" y="28" width="12" height="12" rx="2" transform="rotate(45)"/>
        </g>
        {/* Lightning Bolt */}
        <polygon points="4,-35 -20,5 2,5 -6,35 22,-5 -2,-5" fill="#facc15" stroke="#78350f" strokeWidth="1.5"/>
      </g>

      {/* Banner CFP */}
      <g>
        <path d="M 160,395 L 340,395 L 325,435 L 250,425 L 175,435 Z" fill="#0f172a" stroke="#fbbf24" strokeWidth="3"/>
        <text x="250" y="420" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="24" fill="#fbbf24" letterSpacing="4">CFP</text>
      </g>

      <g fontFamily="Arial, sans-serif" fontWeight="bold">
        <text x="250" y="460" textAnchor="middle" fontSize="16" fill="#0f172a" letterSpacing="2">COLEGIO FEDERAL PERITOS</text>
        <text x="250" y="480" textAnchor="middle" fontSize="12" fill="#d97706" letterSpacing="3">INGENIERÍA ELÉCTRICA</text>
      </g>
    </svg>
  );
};
