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
  <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md justify-around border-t border-white/10 bg-[#0b0b0b] pb-[env(safe-area-inset-bottom)] pt-2">
    {TABS.map(({ key, label }) => {
      const on = active === key;
      const colour = on ? 'text-white' : 'text-[#8c8c8c]';
      return (
        <button
          key={key}
          onClick={() => onChange(key)}
          aria-current={on ? 'page' : undefined}
          className={`flex w-1/4 flex-col items-center gap-1 pb-2 ${colour}`}
        >
          {key === 'home' && (on ? <HomeFill className="h-[23px] w-[23px]" /> : <HomeLine className="h-[23px] w-[23px]" />)}
          {key === 'clips' &&
            (on ? <ClipsIconFill className="h-[23px] w-[23px]" /> : <ClipsIcon className="h-[23px] w-[23px]" />)}
          {key === 'search' && <SearchIcon className="h-[23px] w-[23px]" />}
          {key === 'my' && <SmileyAvatar className="h-[23px] w-[23px]" radius={6} />}
          <span className={`text-[10.5px] ${on ? 'font-bold' : 'font-medium'}`}>{label}</span>
        </button>
      );
    })}
  </nav>
);
