import React from 'react';
import { Row, TitleItem } from '../types';
import { progressPercent } from '../services/api';
import { PlayIcon } from './Icons';

const FALLBACK = 'https://via.placeholder.com/300x450/181818/555555?text=Netflix';

function onImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  const el = e.currentTarget;
  if (el.src !== FALLBACK) el.src = FALLBACK;
}

/** The red "TOP 10" corner ribbon. */
export const Top10Badge: React.FC = () => (
  <div className="absolute top-0 right-0 bg-nfred px-[3px] pt-[2px] pb-[3px] rounded-bl-[3px] leading-none text-center">
    <div className="text-[7px] font-extrabold tracking-tight">TOP</div>
    <div className="text-[11px] font-extrabold leading-none -mt-[1px]">10</div>
  </div>
);

/** The red label strip along the bottom of a poster. */
export const TagLabel: React.FC<{ text: string }> = ({ text }) =>
  text === 'New Episode' ? (
    <div className="absolute bottom-0 inset-x-0 flex flex-col items-start">
      <span className="bg-nfred text-[9px] font-bold px-1.5 py-[2px]">New Episode</span>
      <span className="bg-white text-black text-[9px] font-bold px-1.5 py-[2px]">Watch Now</span>
    </div>
  ) : (
    <span className="absolute bottom-0 left-0 bg-nfred text-[9px] font-bold px-1.5 py-[2px]">{text}</span>
  );

interface PosterProps {
  item: TitleItem;
  onOpen: (id: number) => void;
  width?: string;
}

export const PosterCard: React.FC<PosterProps> = ({ item, onOpen, width }) => {
  const pct = progressPercent(item.id);
  return (
    <button
      onClick={() => onOpen(item.id)}
      className={`relative flex-shrink-0 text-left active:scale-[0.97] transition-transform duration-150 ${width || ''}`}
      style={!width ? { width: 95, height: 142 } : undefined}
      aria-label={item.title}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[5px] bg-[#181818] shadow-md">
        <img
          src={item.poster || (item as any).img || (item as any).backdrop}
          onError={onImgError}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {item.top10Badge && <Top10Badge />}
        {item.tag && <TagLabel text={item.tag} />}
        {pct > 0 && (
          <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/25">
            <div className="h-full bg-nfred" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
    </button>
  );
};

/** Top 10 row card: giant outlined numeral with the poster overlapping it. */
export const RankedCard: React.FC<{ item: TitleItem; rank: number; onOpen: (id: number) => void }> = ({
  item,
  rank,
  onOpen
}) => (
  <button
    onClick={() => onOpen(item.id)}
    className="relative flex flex-shrink-0 items-end active:scale-[0.97] transition-transform duration-150"
    style={{ width: rank >= 10 ? 155 : 128, height: 142 }}
    aria-label={`${rank}. ${item.title}`}
  >
    <span
      className="rank-numeral absolute bottom-0 left-0 select-none"
      style={{ fontSize: 106, zIndex: 0 }}
    >
      {rank}
    </span>
    <div
      className="relative z-10 ml-auto overflow-hidden rounded-[5px] bg-[#181818] shadow-md"
      style={{ width: 95, height: 142 }}
    >
      <img src={item.poster || (item as any).img || (item as any).backdrop} onError={onImgError} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
      {item.tag && <TagLabel text={item.tag} />}
    </div>
  </button>
);

/** A landscape 16:9 card used by Continue Watching / episode lists. */
export const WideCard: React.FC<{
  item: TitleItem;
  onOpen: (id: number) => void;
  onPlay?: (id: number) => void;
}> = ({ item, onOpen, onPlay }) => {
  const pct = progressPercent(item.id);
  return (
    <button
      onClick={() => (onPlay ? onPlay(item.id) : onOpen(item.id))}
      className="relative w-[168px] flex-shrink-0 text-left active:opacity-70"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-[4px] bg-[#181818]">
        <img src={item.backdrop || item.poster} onError={onImgError} alt={item.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/90 bg-black/40">
            <PlayIcon className="ml-[2px] h-3.5 w-3.5 text-white" />
          </span>
        </div>
        {pct > 0 && (
          <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/25">
            <div className="h-full bg-nfred" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
      <p className="mt-1.5 truncate text-[11px] text-nflight">{item.title}</p>
    </button>
  );
};

/** Section title + horizontally scrolling strip. */
export const RowSection: React.FC<{
  row: Row;
  onOpen: (id: number) => void;
  seeAll?: () => void;
}> = ({ row, onOpen, seeAll }) => {
  if (!row.items.length) return null;
  const ranked = row.style === 'ranked';
  return (
    <section className="mb-6">
      <div className="mb-2.5 flex items-center justify-between px-3.5">
        <h2 className="text-[21px] font-bold tracking-[-0.015em]">{row.name}</h2>
        {seeAll && (
          <button onClick={seeAll} className="text-[13px] font-semibold text-nflight">
            See All
          </button>
        )}
      </div>
      <div className={`no-scrollbar flex overflow-x-auto px-3.5 ${ranked ? 'gap-1' : 'gap-1.5'}`}>
        {row.items.map((item, i) =>
          ranked ? (
            <RankedCard key={item.id + '-' + i} item={item} rank={item.topTen || i + 1} onOpen={onOpen} />
          ) : (
            <PosterCard key={item.id + '-' + i} item={item} onOpen={onOpen} />
          )
        )}
      </div>
    </section>
  );
};

export { FALLBACK, onImgError };
