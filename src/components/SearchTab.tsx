import React, { useEffect, useRef, useState } from 'react';
import { Row, TitleItem } from '../types';
import { fetchSearch } from '../services/api';
import { PosterCard, Top10Badge, TagLabel, onImgError } from './Cards';
import { CloseIcon, MicIcon, PlayIcon, SearchIcon } from './Icons';

/** One line of the "Recommended Shows & Movies" list. */
const ListRow: React.FC<{ item: TitleItem; onOpen: (id: number) => void; onPlay: (id: number) => void }> = ({
  item,
  onOpen,
  onPlay
}) => (
  <div className="flex items-center gap-3 pr-3">
    <button onClick={() => onOpen(item.id)} className="relative h-[81px] w-[145px] flex-shrink-0 overflow-hidden rounded-[3px] bg-[#181818]">
      <img src={item.poster || (item as any).img || (item as any).backdrop} onError={onImgError} alt="" loading="lazy" className="h-full w-full object-cover" />
      {item.top10Badge && <Top10Badge />}
      {item.tag && <TagLabel text={item.tag} />}
    </button>
    <button onClick={() => onOpen(item.id)} className="flex-1 truncate text-left text-[17px] font-medium leading-tight">
      {item.title}
    </button>
    <button
      onClick={() => onPlay(item.id)}
      aria-label={`Play ${item.title}`}
      className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-white/80 active:opacity-60"
    >
      <PlayIcon className="ml-[3px] h-[15px] w-[15px]" />
    </button>
  </div>
);

export const SearchTab: React.FC<{ onOpen: (id: number) => void; onPlay: (id: number) => void }> = ({
  onOpen,
  onPlay
}) => {
  const [query, setQuery] = useState('');
  const [topResults, setTopResults] = useState<TitleItem[]>([]);
  const [categories, setCategories] = useState<Row[]>([]);
  const [recommended, setRecommended] = useState<TitleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      fetchSearch(query)
        .then(res => {
          setTopResults(res.topResults);
          setCategories(res.categories);
          if (!query) setRecommended(res.recommended);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 220);
    return () => clearTimeout(t);
  }, [query]);

  const searching = query.trim().length > 0;

  return (
    <div className="pb-24">
      {/* search field */}
      <div className="sticky top-0 z-20 bg-black px-0 pt-1">
        <div className="mx-0 flex items-center gap-3 bg-[#2b2b2b] px-4 py-[13px]">
          <SearchIcon className="h-[26px] w-[26px] flex-shrink-0 text-[#a3a3a3]" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search shows, movies, game…"
            className="w-full bg-transparent text-[19px] font-normal text-white outline-none placeholder:text-[#a3a3a3]"
          />
          {searching ? (
            <button onClick={() => setQuery('')} aria-label="Clear search">
              <CloseIcon className="h-[26px] w-[26px] text-[#d2d2d2]" />
            </button>
          ) : (
            <MicIcon className="h-[26px] w-[26px] flex-shrink-0 text-[#d2d2d2]" />
          )}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-14">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/25 border-t-white" />
        </div>
      )}

      {!loading && searching && (
        <div className="pt-5">
          {topResults.length > 0 ? (
            <section className="mb-7">
              <h2 className="mb-3 px-3 text-[24px] font-bold tracking-[-0.01em]">Top Results</h2>
              <div className="no-scrollbar flex gap-2 overflow-x-auto px-3">
                {topResults.slice(0, 14).map(item => (
                  <PosterCard key={item.id} item={item} onOpen={onOpen} width="w-[146px]" />
                ))}
              </div>
            </section>
          ) : (
            <p className="px-3 pt-12 text-center text-[15px] text-nfgrey">
              No results for “{query}”. Try a different title, genre or actor.
            </p>
          )}

          {categories.map(cat => (
            <section key={cat.name} className="mb-7">
              <h2 className="mb-3 px-3 text-[24px] font-bold tracking-[-0.01em]">{cat.name}</h2>
              <div className="no-scrollbar flex gap-2 overflow-x-auto px-3">
                {cat.items.map(item => (
                  <PosterCard key={item.id} item={item} onOpen={onOpen} width="w-[146px]" />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {!loading && !searching && (
        <div className="pt-4">
          <h2 className="mb-2.5 px-3 text-[17px] font-bold tracking-tight">Recommended Shows &amp; Movies</h2>
          <div className="flex flex-col">
            {recommended.map(item => (
              <div key={item.id} className="border-b border-transparent py-[6px] pl-0">
                <ListRow item={item} onOpen={onOpen} onPlay={onPlay} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
