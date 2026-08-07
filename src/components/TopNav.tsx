import React, { useEffect, useRef, useState } from 'react';
import { BellIcon, ChevronDown, CloseIcon, DownloadIcon, NetflixN } from './Icons';

export type BrowseMode = null | 'shows' | 'movies' | 'games' | 'newhot' | 'genre';

/** The Home header: red N, "Home", downloads and notifications. */
export const HomeTopBar: React.FC<{
  title?: string;
  onDownloads: () => void;
  onNotifications: () => void;
}> = ({ title = 'Home', onDownloads, onNotifications }) => (
  <div className="flex items-center justify-between px-3.5 pt-3 pb-0">
    <div className="flex items-center gap-2.5">
      <NetflixN className="h-[26px] w-[17px]" />
      <span className="text-[26px] font-bold leading-none tracking-[-0.02em]">{title}</span>
    </div>
    <div className="flex items-center gap-5">
      <button onClick={onDownloads} aria-label="Downloads">
        <DownloadIcon className="h-[25px] w-[25px]" />
      </button>
      <button onClick={onNotifications} aria-label="Notifications">
        <BellIcon className="h-[25px] w-[25px]" />
      </button>
    </div>
  </div>
);

const PILL =
  'flex-shrink-0 rounded-full border px-[17px] py-[10px] text-[14.5px] font-medium leading-[26px] whitespace-nowrap transition-colors';

export const CategoriesSheet: React.FC<{
  activeGenre: string | null;
  genres: string[];
  onClose: () => void;
  onSelectGenre: (g: string | null) => void;
}> = ({ activeGenre, genres, onClose, onSelectGenre }) => (
  <div
    className="fixed inset-0 z-[110] mx-auto flex max-w-md flex-col items-center justify-center bg-black/92 backdrop-blur-xl animate-fade-in"
    onClick={onClose}
    role="dialog"
    aria-label="Categories menu"
  >
    <div
      className="no-scrollbar max-h-[75vh] w-full overflow-y-auto px-6 py-8 text-center"
      onClick={e => e.stopPropagation()}
    >
      <button
        className={`block w-full py-[18px] text-[25px] transition-all active:opacity-60 ${
          !activeGenre ? 'font-extrabold text-white text-[27px]' : 'font-medium text-white/80'
        }`}
        onClick={() => onSelectGenre(null)}
      >
        Home (All Categories)
      </button>
      <div className="my-3 mx-auto h-[1px] w-24 bg-white/15" />
      {['Only on Netflix'].map(extra => (
        <button
          key={extra}
          className="block w-full py-[16px] text-[23px] font-medium text-white/80 transition-all hover:text-white active:opacity-60"
          onClick={() => onSelectGenre(null)}
        >
          {extra}
        </button>
      ))}
      <div className="my-3 mx-auto h-[1px] w-24 bg-white/15" />
      {genres.map(g => (
        <button
          key={g}
          className={`block w-full py-[16px] text-[23px] transition-all hover:text-white active:opacity-60 ${
            activeGenre === g ? 'font-extrabold text-white text-[26px]' : 'font-medium text-white/80'
          }`}
          onClick={() => onSelectGenre(g)}
        >
          {g}
        </button>
      ))}
    </div>

    <button
      onClick={onClose}
      aria-label="Close categories menu"
      className="absolute bottom-8 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform active:scale-95"
    >
      <CloseIcon className="h-6 w-6" />
    </button>
  </div>
);

export const PillBar: React.FC<{
  mode: BrowseMode;
  activeGenre: string | null;
  genres: string[];
  onMode: (m: BrowseMode) => void;
  onGenre: (g: string | null) => void;
  onOpenCategories?: () => void;
}> = ({ mode, activeGenre, genres, onMode, onGenre, onOpenCategories }) => {
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, [open]);

  const pillClass = (active: boolean) =>
    `${PILL} ${active ? 'border-white bg-white text-black' : 'border-white/40 bg-black/25 text-white'}`;

  const toggleCategories = () => {
    if (onOpenCategories) {
      onOpenCategories();
    } else {
      setOpen(o => !o);
    }
  };

  return (
    <>
      <div ref={barRef} className="no-scrollbar relative z-30 flex gap-2.5 overflow-x-auto px-3.5 pb-5 pt-6">
        <button className={pillClass(mode === 'shows')} onClick={() => onMode(mode === 'shows' ? null : 'shows')}>
          Shows
        </button>
        <button className={pillClass(mode === 'movies')} onClick={() => onMode(mode === 'movies' ? null : 'movies')}>
          Movies
        </button>
        <button className={pillClass(mode === 'games')} onClick={() => onMode(mode === 'games' ? null : 'games')}>
          Games
        </button>
        <button className={pillClass(mode === 'newhot')} onClick={() => onMode(mode === 'newhot' ? null : 'newhot')}>
          New &amp; Hot
        </button>
        <button
          className={`${pillClass(!!activeGenre)} flex items-center gap-1.5`}
          onClick={toggleCategories}
        >
          <span className="max-w-[130px] truncate">{activeGenre || 'Categories'}</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {open && (
        <CategoriesSheet
          activeGenre={activeGenre}
          genres={genres}
          onClose={() => setOpen(false)}
          onSelectGenre={g => {
            onGenre(g);
            setOpen(false);
          }}
        />
      )}
    </>
  );
};
