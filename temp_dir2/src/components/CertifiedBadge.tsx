export default function CertifiedBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Outer rosette */}
        <path 
          d="M50 2 L57 12 L68 9 L72 20 L83 22 L82 33 L92 40 L87 50 L92 60 L82 67 L83 78 L72 80 L68 91 L57 88 L50 98 L43 88 L32 91 L28 80 L17 78 L18 67 L8 60 L13 50 L8 40 L18 33 L17 22 L28 20 L32 9 L43 12 Z" 
          fill="#F59E0B" 
        />
        {/* Inner circle */}
        <circle cx="50" cy="50" r="32" fill="#FBBF24" />
        <circle cx="50" cy="50" r="32" fill="none" stroke="#92400E" strokeWidth="1" strokeDasharray="2 2" />
        
        {/* Ribbon Icon */}
        <g transform="translate(40, 28) scale(0.8)" fill="none" stroke="#78350F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="5" />
          <path d="M8.5 11.5 L7 20 L12 17 L17 20 L15.5 11.5" />
        </g>
        
        {/* RB1 Text */}
        <text x="50" y="56" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#78350F" textAnchor="middle">RB1</text>
        
        {/* Curved Text Path */}
        <path id="topCurve" d="M 22 50 A 28 28 0 0 1 78 50" fill="none" />
        <path id="bottomCurve" d="M 22 50 A 28 28 0 0 0 78 50" fill="none" />
        
        {/* Text */}
        <text fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#78350F" letterSpacing="1">
          <textPath href="#topCurve" startOffset="50%" textAnchor="middle">- CERTIFIED -</textPath>
        </text>
        <text fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#78350F" letterSpacing="1">
          <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle">REAL BUILDER</textPath>
        </text>

        {/* Stars */}
        <path d="M 17 50 L 19 52 L 22 51 L 20 54 L 21 57 L 18 55 L 15 57 L 16 54 L 14 51 L 17 52 Z" fill="#78350F" />
        <path d="M 83 50 L 85 52 L 88 51 L 86 54 L 87 57 L 84 55 L 81 57 L 82 54 L 80 51 L 83 52 Z" fill="#78350F" />
      </svg>
      {/* Bottom ribbons for the badge */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
        <div className="w-1.5 h-3 bg-[#F59E0B] rounded-b-sm"></div>
        <div className="w-1.5 h-3 bg-[#F59E0B] rounded-b-sm"></div>
      </div>
    </div>
  );
}
