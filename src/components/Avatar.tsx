import React from 'react';

/** The blue smiley profile picture used by the default Netflix profile. */
export const SmileyAvatar: React.FC<{ className?: string; radius?: number }> = ({
  className = 'w-10 h-10',
  radius = 14
}) => (
  <svg viewBox="0 0 100 100" className={className} aria-label="Profile">
    <defs>
      <linearGradient id="nf-smiley" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1F6FD6" />
        <stop offset="100%" stopColor="#54A6F7" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx={radius} fill="url(#nf-smiley)" />
    <circle cx="33" cy="41" r="6.4" fill="#fff" />
    <circle cx="67" cy="41" r="6.4" fill="#fff" />
    <path d="M31 60c6.5 8.6 31.5 8.6 38 0" fill="none" stroke="#fff" strokeWidth="7.5" strokeLinecap="round" />
  </svg>
);

/** The rainbow "kids" profile tile. */
export const KidsAvatar: React.FC<{ className?: string; radius?: number }> = ({
  className = 'w-10 h-10',
  radius = 14
}) => (
  <svg viewBox="0 0 100 100" className={className} aria-label="Children profile">
    <clipPath id="nf-kids-clip">
      <rect width="100" height="100" rx={radius} />
    </clipPath>
    <g clipPath="url(#nf-kids-clip)">
      <rect width="20" height="100" x="0" fill="#3CB878" />
      <rect width="20" height="100" x="20" fill="#F2B233" />
      <rect width="20" height="100" x="40" fill="#FFFFFF" />
      <rect width="20" height="100" x="60" fill="#E8459B" />
      <rect width="20" height="100" x="80" fill="#7A7CF0" />
      <g>
        <text
          x="50"
          y="60"
          textAnchor="middle"
          fontSize="27"
          fontWeight="900"
          fontFamily="Inter, Helvetica, Arial, sans-serif"
          fill="none"
          stroke="#fff"
          strokeWidth="9"
          strokeLinejoin="round"
        >
          kids
        </text>
        <text
          x="50"
          y="60"
          textAnchor="middle"
          fontSize="27"
          fontWeight="900"
          fontFamily="Inter, Helvetica, Arial, sans-serif"
          fill="#E50914"
        >
          kids
        </text>
      </g>
    </g>
  </svg>
);
