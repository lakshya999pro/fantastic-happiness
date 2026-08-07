import React from 'react';

type P = { className?: string; style?: React.CSSProperties };
const S = (d: string, vb = '0 0 24 24', fill = true) =>
  function Icon({ className = 'w-6 h-6', style }: P) {
    return (
      <svg
        viewBox={vb}
        className={className}
        style={style}
        fill={fill ? 'currentColor' : 'none'}
        stroke={fill ? 'none' : 'currentColor'}
        strokeWidth={fill ? undefined : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={d} />
      </svg>
    );
  };

/* ---------- brand ---------- */
export const NetflixN: React.FC<P> = ({ className = 'w-6 h-10', style }) => (
  <svg viewBox="0 0 30 48" className={className} style={style} aria-label="Netflix" fill="#E50914">
    <path d="M0 0h9l12 34.2V0h9v48h-9L9 13.8V48H0Z" />
  </svg>
);

export const NetflixWordmark: React.FC<P> = ({ className = 'h-5', style }) => (
  <svg viewBox="0 0 1024 276" className={className} style={style} fill="#E50914" aria-label="Netflix">
    <path d="M0 0h74l52 148V0h72v276h-72L74 128v148H0Zm256 0h150v58h-78v52h74v58h-74v50h78v58H256Zm180 0h164v58h-46v218h-72V58h-46Zm200 0h72v218h74v58H636Zm168 0h150v58h-78v52h74v58h-74v108h-72Zm192 0h72v276h-72Z" />
  </svg>
);

/* ---------- bottom nav ---------- */
export const HomeFill = S(
  'M12 3.2 2.6 11.1a1 1 0 0 0 .65 1.77H5v7.4a.9.9 0 0 0 .9.9h4.1v-6h4v6h4.1a.9.9 0 0 0 .9-.9v-7.4h1.75a1 1 0 0 0 .65-1.77Z'
);
export const HomeLine: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.4 11.3 12 4l8.6 7.3" />
    <path d="M5.4 10.4V20h4.2v-5.6h4.8V20h4.2v-9.6" />
  </svg>
);
export const ClipsIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
    <rect x="3" y="3" width="12.5" height="18" rx="2.4" />
    <path d="M18.4 5.6c1.3.5 2.1 1.5 2.1 2.9v7c0 1.4-.8 2.4-2.1 2.9" />
    <path d="M7.6 8.7v6.6l4.9-3.3Z" fill="currentColor" stroke="none" />
  </svg>
);
export const ClipsIconFill: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M5.4 3h7.7a2.4 2.4 0 0 1 2.4 2.4v13.2A2.4 2.4 0 0 1 13.1 21H5.4A2.4 2.4 0 0 1 3 18.6V5.4A2.4 2.4 0 0 1 5.4 3Zm2.2 5.7v6.6l4.9-3.3Z" />
    <path d="M18.4 5.6c1.3.5 2.1 1.5 2.1 2.9v7c0 1.4-.8 2.4-2.1 2.9V5.6Z" />
  </svg>
);
export const SearchIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <circle cx="10.6" cy="10.6" r="6.6" />
    <path d="m15.6 15.6 4.6 4.6" />
  </svg>
);

/* ---------- header / actions ---------- */
export const DownloadIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12" />
    <path d="m6.8 10.4 5.2 5.2 5.2-5.2" />
    <path d="M4 20.2h16" />
  </svg>
);
export const BellIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.2 16.4V10.6a6.2 6.2 0 1 0-12.4 0v5.8L4 18.6h16Z" />
    <path d="M10 21.2h4" />
  </svg>
);
export const MicIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
    <rect x="9" y="2.6" width="6" height="11.4" rx="3" />
    <path d="M5.2 11.4a6.8 6.8 0 0 0 13.6 0" />
    <path d="M12 18.2v3.2" />
  </svg>
);
export const PlayIcon = S('M7 4.5 20 12 7 19.5Z');
export const PlusIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M12 4.6v14.8M4.6 12h14.8" />
  </svg>
);
export const CheckIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m4.8 12.6 4.6 4.6L19.2 7" />
  </svg>
);
export const ThumbUpIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
    <path d="M7.4 21V9.9l4-6.2c1.5-.2 2.4.7 2.2 2.2l-.7 3.2h5.3c1.3 0 2.2 1.1 1.9 2.3l-1.7 7.5c-.2 1.2-1.1 2.1-2.3 2.1Z" />
    <path d="M7.4 9.9H4.2c-.7 0-1.2.5-1.2 1.2v8.7c0 .7.5 1.2 1.2 1.2h3.2" />
  </svg>
);
export const ShareIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
    <circle cx="18" cy="5.4" r="2.7" />
    <circle cx="6" cy="12" r="2.7" />
    <circle cx="18" cy="18.6" r="2.7" />
    <path d="m8.4 10.7 7.2-4M8.4 13.3l7.2 4" />
  </svg>
);
export const DownloadStackIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.6v10.6" />
    <path d="m7 8.6 5 5 5-5" />
    <path d="M4 17.4h16M4 21h16" />
  </svg>
);

/* ---------- chevrons / close ---------- */
export const ChevronRight: React.FC<P> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 4.8 7.2 7.2L9 19.2" />
  </svg>
);
export const ChevronDown: React.FC<P> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="m4.8 8.4 7.2 7.2 7.2-7.2" />
  </svg>
);
export const ArrowLeft: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12H4.4" />
    <path d="m10.6 5.2-6.2 6.8 6.2 6.8" />
  </svg>
);
export const CloseIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M5.6 5.6 18.4 18.4M18.4 5.6 5.6 18.4" />
  </svg>
);
export const InfoIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1.1 15.4h-2.2v-6.6h2.2Zm0-8.3h-2.2V6.9h2.2Z" />
  </svg>
);

/* ---------- player ---------- */
export const VolumeOn: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M4 9.2h3.4L12 5v14L7.4 14.8H4Z" />
    <path
      d="M15.2 8.6a5 5 0 0 1 0 6.8M17.6 6a8.4 8.4 0 0 1 0 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
    />
  </svg>
);
export const VolumeOff: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M4 9.2h3.4L12 5v14L7.4 14.8H4Z" />
    <path d="M15.6 9.4 20.4 14.2M20.4 9.4 15.6 14.2" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" />
  </svg>
);
export const LockClosed: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
    <rect x="4.6" y="10.4" width="14.8" height="10.4" rx="1.8" />
    <path d="M8 10.4V7.6a4 4 0 0 1 8 0v2.8" />
  </svg>
);
export const LockOpen: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
    <rect x="4.6" y="10.4" width="14.8" height="10.4" rx="1.8" />
    <path d="M8 10.4V7.6a4 4 0 0 1 7.6-1.7" />
  </svg>
);
export const Replay10: React.FC<P> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 8.5a11.5 11.5 0 1 1-11.2 14" />
    <path d="M13.4 3.4 8.2 8.6l5.2 5.2" />
    <text x="20" y="25.6" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" stroke="none">
      10
    </text>
  </svg>
);
export const Forward10: React.FC<P> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 8.5a11.5 11.5 0 1 0 11.2 14" />
    <path d="m26.6 3.4 5.2 5.2-5.2 5.2" />
    <text x="20" y="25.6" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" stroke="none">
      10
    </text>
  </svg>
);
export const PauseIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <rect x="5.6" y="4" width="4.4" height="16" rx="1" />
    <rect x="14" y="4" width="4.4" height="16" rx="1" />
  </svg>
);
export const BrightnessIcon: React.FC<P> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
  </svg>
);
export const ScissorsIcon: React.FC<P> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6.2" cy="18" r="2.6" />
    <circle cx="6.2" cy="6" r="2.6" />
    <path d="M8.4 7.6 20 18M20 6 8.4 16.4" />
  </svg>
);
export const SpeedIcon: React.FC<P> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
    <circle cx="12" cy="12" r="9.2" />
    <path d="M12 12 16 8.4" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);
export const EpisodesIcon: React.FC<P> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round">
    <rect x="3" y="8.6" width="13.2" height="10.4" rx="1.6" />
    <path d="M6.4 5.8h11.2M9 3.4h9.6" />
    <path d="M18.6 8.6h1.8a1.6 1.6 0 0 1 1.6 1.6v7.2a1.6 1.6 0 0 1-1.6 1.6h-1.8" />
  </svg>
);
export const SubtitlesIcon: React.FC<P> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6.4A2 2 0 0 1 5 4.4h14a2 2 0 0 1 2 2v8.4a2 2 0 0 1-2 2H9.6L5.4 20.4v-3.6H5a2 2 0 0 1-2-2Z" />
    <path d="M6.6 9.6h6M6.6 12.8h4M14.4 12.8h3M14.4 9.6h3" />
  </svg>
);
export const NextEpIcon: React.FC<P> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round">
    <path d="M5 5.2 15.4 12 5 18.8Z" />
    <path d="M19 4.6v14.8" strokeLinecap="round" />
  </svg>
);

/* ---------- settings / profile ---------- */
export const GearIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round">
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.6 14.4a1.5 1.5 0 0 0 .3 1.7l.1.1a1.8 1.8 0 1 1-2.6 2.6l-.1-.1a1.5 1.5 0 0 0-1.7-.3 1.5 1.5 0 0 0-.9 1.4v.2a1.8 1.8 0 1 1-3.6 0v-.1a1.5 1.5 0 0 0-1-1.4 1.5 1.5 0 0 0-1.7.3l-.1.1a1.8 1.8 0 1 1-2.6-2.6l.1-.1a1.5 1.5 0 0 0 .3-1.7 1.5 1.5 0 0 0-1.4-.9h-.2a1.8 1.8 0 1 1 0-3.6h.1a1.5 1.5 0 0 0 1.4-1 1.5 1.5 0 0 0-.3-1.7l-.1-.1a1.8 1.8 0 1 1 2.6-2.6l.1.1a1.5 1.5 0 0 0 1.7.3h.1a1.5 1.5 0 0 0 .9-1.4v-.2a1.8 1.8 0 1 1 3.6 0v.1a1.5 1.5 0 0 0 .9 1.4 1.5 1.5 0 0 0 1.7-.3l.1-.1a1.8 1.8 0 1 1 2.6 2.6l-.1.1a1.5 1.5 0 0 0-.3 1.7v.1a1.5 1.5 0 0 0 1.4.9h.2a1.8 1.8 0 1 1 0 3.6h-.1a1.5 1.5 0 0 0-1.4.9Z" />
  </svg>
);
export const UserIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7.6" r="4" />
    <path d="M4.6 20.4a7.4 7.4 0 0 1 14.8 0" />
  </svg>
);
export const HelpIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
    <circle cx="12" cy="12" r="9.2" />
    <path d="M9.5 9.4a2.6 2.6 0 1 1 3.4 2.5c-.6.2-.9.8-.9 1.4v.5" />
    <circle cx="12" cy="17" r="1.05" fill="currentColor" stroke="none" />
  </svg>
);
export const PencilIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.4 3.6a2.3 2.3 0 0 1 3.3 3.3L8.4 18.2l-4.4 1.1 1.1-4.4Z" />
  </svg>
);
export const GamepadIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.6 7.4h8.8a4.6 4.6 0 0 1 4.5 3.7l.7 3.6c.4 2.1-1.8 3.6-3.5 2.4l-2.4-1.7H8.3l-2.4 1.7c-1.7 1.2-3.9-.3-3.5-2.4l.7-3.6a4.6 4.6 0 0 1 4.5-3.7Z" />
    <path d="M6.6 11.4v2.6M5.3 12.7h2.6M15.9 11.9h.01M18.1 13.7h.01" />
  </svg>
);
export const RestrictIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.2 2.8h7.6l5.4 5.4v7.6l-5.4 5.4H8.2l-5.4-5.4V8.2Z" />
    <path d="M12 7.6v6M12 16.6h.01" />
  </svg>
);
export const TranslateIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.6 5.6h9M7.1 3.4v2.2M9.4 5.6c0 3.6-2.6 6.6-6.8 8" />
    <path d="M5 10.2c1.4 2.1 3.4 3.4 5.6 3.9" />
    <path d="m13 20.6 4-10 4 10M14.6 17.4h4.8" />
  </svg>
);
export const SubtitleAppearanceIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round">
    <rect x="2.6" y="4.4" width="18.8" height="15.2" rx="2" />
    <text x="12" y="15.6" textAnchor="middle" fontSize="9" fontWeight="700" fill="currentColor" stroke="none">
      AA
    </text>
  </svg>
);
export const WifiIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
    <path d="M2.4 8.6a14 14 0 0 1 19.2 0" />
    <path d="M5.8 12.4a9.2 9.2 0 0 1 12.4 0" />
    <path d="M9.2 16a4.4 4.4 0 0 1 5.6 0" />
    <circle cx="12" cy="19.4" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);
export const SignalIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <rect x="2.6" y="15" width="3.2" height="5.4" rx="1" />
    <rect x="8" y="11.4" width="3.2" height="9" rx="1" />
    <rect x="13.4" y="7.8" width="3.2" height="12.6" rx="1" />
    <rect x="18.8" y="4.2" width="3.2" height="16.2" rx="1" />
  </svg>
);
export const QualityIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round">
    <rect x="2.6" y="4.6" width="18.8" height="14.8" rx="1.8" />
    <path d="M2.6 9.4h6.2v10M14.4 4.6v14.8" />
  </svg>
);
export const StorageIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <rect x="3" y="4.6" width="4" height="3.6" rx="1" />
    <rect x="8.6" y="4.6" width="12.4" height="3.6" rx="1" />
    <rect x="3" y="10.2" width="4" height="3.6" rx="1" />
    <rect x="8.6" y="10.2" width="12.4" height="3.6" rx="1" />
    <rect x="3" y="15.8" width="4" height="3.6" rx="1" />
    <rect x="8.6" y="15.8" width="12.4" height="3.6" rx="1" />
  </svg>
);
export const SignOutIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.4 3.6H6.2a2 2 0 0 0-2 2v12.8a2 2 0 0 0 2 2h8.2" />
    <path d="M18.4 12H9.6M15.4 8.2 19.2 12l-3.8 3.8" />
  </svg>
);

/* ---------- misc ---------- */
export const AudioDescIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 34 24" className={className} fill="currentColor">
    <text x="2" y="17" fontSize="13" fontWeight="800" fontStyle="italic">
      AD
    </text>
    <path d="M22.8 8.4a5.4 5.4 0 0 1 0 7.2M26 6a9 9 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" />
  </svg>
);
export const CCIcon: React.FC<P> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round">
    <rect x="2.6" y="5" width="18.8" height="13.2" rx="2" />
    <path d="M10 10.2a2.8 2.8 0 1 0 0 3.4M17.6 10.2a2.8 2.8 0 1 0 0 3.4" strokeLinecap="round" />
  </svg>
);
