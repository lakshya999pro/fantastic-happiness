import React from 'react';
import { SmileyAvatar } from './Avatar';
import { ClipsIcon, ClipsIconFill, HomeFill, HomeLine, SearchIcon } from './Icons';

export type Tab = 'home' | 'clips' | 'search' | 'my';

const TABS: { key: Tab; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'clips', label: 'Clips' },
  { key: 'search', label: 'Search' },
  { key: 'my', label: 'My Netflix' }
];

export const BottomNav: React.FC<{ active: Tab; onChange: (t: Tab) => void }> = ({ active, onChange }) => (
  <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-1">
    {/* fade so content scrolling underneath doesn't hard-cut against the floating pill */}
    <div className="pointer-events-none absolute inset-x-0 -top-8 bottom-0 -z-10 bg-gradient-to-t from-black via-black/85 to-transparent" />
    <nav
      className="flex items-center justify-around rounded-full border border-white/10 bg-[#161616]/85 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.55)] backdrop-blur-xl"
      aria-label="Primary"
    >
      {TABS.map(({ key, label }) => {
        const on = active === key;
        const colour = on ? 'text-white' : 'text-[#8c8c8c]';
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            aria-current={on ? 'page' : undefined}
            className={`flex w-1/4 flex-col items-center gap-1 py-1 transition-colors active:opacity-70 ${colour}`}
          >
            {key === 'home' && (on ? <HomeFill className="h-[22px] w-[22px]" /> : <HomeLine className="h-[22px] w-[22px]" />)}
            {key === 'clips' &&
              (on ? <ClipsIconFill className="h-[22px] w-[22px]" /> : <ClipsIcon className="h-[22px] w-[22px]" />)}
            {key === 'search' && <SearchIcon className="h-[22px] w-[22px]" />}
            {key === 'my' && <SmileyAvatar className="h-[22px] w-[22px]" radius={6} />}
            <span className={`text-[10px] leading-none ${on ? 'font-bold' : 'font-medium'}`}>{label}</span>
          </button>
        );
      })}
    </nav>
  </div>
);
