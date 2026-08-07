import React, { useEffect, useState } from 'react';
import { GameItem, TitleItem } from '../types';
import { fetchGames, fetchNewHot } from '../services/api';
import { PosterCard, onImgError } from './Cards';
import { ScreenHeader } from './ProfileScreens';
import { BellIcon, DownloadIcon, PlayIcon, PlusIcon } from './Icons';

/** 3-column poster grid used by Shows / Movies / a picked category. */
export const BrowseGrid: React.FC<{
  heading: string;
  items: TitleItem[];
  total: number;
  loading: boolean;
  onOpen: (id: number) => void;
}> = ({ heading, items, total, loading, onOpen }) => (
  <div className="px-3 pb-24">
    <h2 className="mb-3 text-[22px] font-bold capitalize tracking-[-0.01em]">
      {heading}
      {total > 0 && <span className="ml-2 text-[14px] font-normal text-nfgrey">{total} titles</span>}
    </h2>
    {loading ? (
      <div className="flex justify-center py-16">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/25 border-t-white" />
      </div>
    ) : (
      <div className="grid grid-cols-3 gap-2">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onOpen(item.id)}
            className="mx-auto active:opacity-70"
            style={{ width: 105, height: 158 }}
          >
            <img
              src={item.poster}
              onError={onImgError}
              alt={item.title}
              loading="lazy"
              className="h-full w-full rounded-[3px] bg-[#181818] object-cover"
            />
          </button>
        ))}
      </div>
    )}
  </div>
);

/** The Games pill. */
export const GamesScreen: React.FC = () => {
  const [games, setGames] = useState<GameItem[]>([]);
  useEffect(() => {
    fetchGames().then(setGames).catch(() => {});
  }, []);

  return (
    <div className="px-3 pb-24">
      <h2 className="mb-4 text-[22px] font-bold tracking-[-0.01em]">Mobile Games</h2>
      <ul className="flex flex-col gap-4">
        {games.map(g => (
          <li key={g.id} className="flex items-center gap-3.5">
            <img
              src={g.icon}
              onError={onImgError}
              alt=""
              loading="lazy"
              className="h-[74px] w-[74px] flex-shrink-0 rounded-[14px] bg-[#181818] object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[17px] font-bold">{g.name}</p>
              <p className="mt-0.5 text-[14px] text-nfgrey">{g.genre}</p>
            </div>
            <button className="flex-shrink-0 rounded-[4px] bg-white px-5 py-2 text-[15px] font-bold text-black active:opacity-80">
              Get
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

/** The New & Hot pill. */
export const NewHotScreen: React.FC<{ onOpen: (id: number) => void; onPlay: (id: number) => void }> = ({
  onOpen,
  onPlay
}) => {
  const [tab, setTab] = useState<'coming' | 'everyone' | 'top10'>('coming');
  const [data, setData] = useState<{ comingSoon: TitleItem[]; everyone: TitleItem[]; top10: TitleItem[] } | null>(null);

  useEffect(() => {
    fetchNewHot().then(setData).catch(() => {});
  }, []);

  const tabs = [
    { key: 'coming' as const, label: '🍿 Coming Soon' },
    { key: 'everyone' as const, label: '🔥 Everyone’s Watching' },
    { key: 'top10' as const, label: '📈 Top 10' }
  ];

  return (
    <div className="pb-24">
      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto px-3">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-shrink-0 rounded-full px-4 py-[7px] text-[14px] font-bold ${
              tab === t.key ? 'bg-white text-black' : 'bg-[#2b2b2b] text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!data && (
        <div className="flex justify-center py-16">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/25 border-t-white" />
        </div>
      )}

      {data && tab === 'coming' && (
        <ul className="flex flex-col gap-8 px-3">
          {data.comingSoon.map(item => (
            <li key={item.id} className="flex gap-3">
              <div className="w-[44px] flex-shrink-0 pt-1 text-center">
                <p className="text-[13px] font-bold text-nfgrey">{item.month}</p>
                <p className="text-[26px] font-bold leading-none">{item.day}</p>
              </div>
              <div className="min-w-0 flex-1">
                <button onClick={() => onOpen(item.id)} className="block w-full">
                  <img
                    src={item.poster}
                    onError={onImgError}
                    alt={item.title}
                    loading="lazy"
                    className="aspect-video w-full rounded-[4px] bg-[#181818] object-cover"
                  />
                </button>
                <div className="mt-2.5 flex items-center justify-between">
                  <p className="truncate pr-3 text-[19px] font-bold">{item.title}</p>
                  <div className="flex flex-shrink-0 gap-4 text-[11px] text-nfgrey">
                    <span className="flex flex-col items-center gap-1">
                      <BellIcon className="h-5 w-5 text-white" />
                      Remind Me
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-[13px] font-bold text-nflight">{item.releaseNote}</p>
                <p className="mt-1 text-[13px] text-nfgrey">{(item.genres || []).join(' • ')}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {data && tab === 'everyone' && (
        <ul className="flex flex-col gap-7 px-3">
          {data.everyone.map(item => (
            <li key={item.id}>
              <button onClick={() => onOpen(item.id)} className="block w-full">
                <img
                  src={item.poster}
                  onError={onImgError}
                  alt={item.title}
                  loading="lazy"
                  className="aspect-video w-full rounded-[4px] bg-[#181818] object-cover"
                />
              </button>
              <div className="mt-2.5 flex items-center justify-between">
                <p className="truncate pr-3 text-[19px] font-bold">{item.title}</p>
                <button onClick={() => onPlay(item.id)} className="flex flex-col items-center gap-1 text-[11px] text-nfgrey">
                  <PlayIcon className="h-5 w-5 text-white" />
                  Play
                </button>
              </div>
              <p className="mt-1 text-[13px] text-nfgrey">{(item.genres || []).join(' • ')}</p>
            </li>
          ))}
        </ul>
      )}

      {data && tab === 'top10' && (
        <ul className="flex flex-col gap-4 px-3">
          {data.top10.map(item => (
            <li key={item.id} className="flex items-center gap-3">
              <span className="rank-numeral w-[52px] flex-shrink-0 text-center" style={{ fontSize: 56 }}>
                {item.topTen}
              </span>
              <button onClick={() => onOpen(item.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                <img
                  src={item.poster}
                  onError={onImgError}
                  alt=""
                  loading="lazy"
                  className="h-[92px] w-[62px] flex-shrink-0 rounded-[3px] bg-[#181818] object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[17px] font-bold">{item.title}</span>
                  <span className="mt-1 block truncate text-[13px] text-nfgrey">{(item.genres || []).join(' • ')}</span>
                </span>
              </button>
              <PlusIcon className="h-6 w-6 flex-shrink-0" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/** Downloads screen — mirrors the app's empty state. */
export const DownloadsScreen: React.FC<{ onBack: () => void; onBrowse: () => void }> = ({ onBack, onBrowse }) => (
  <div className="fixed inset-0 z-[96] mx-auto max-w-md overflow-y-auto bg-black">
    <ScreenHeader title="Downloads" onBack={onBack} />
    <div className="flex flex-col items-center px-8 pt-24 text-center">
      <DownloadIcon className="mb-6 h-14 w-14 text-[#5a5a5a]" />
      <p className="mb-2 text-[21px] font-bold">Never be without Netflix</p>
      <p className="mb-8 text-[15px] leading-relaxed text-[#a5a5a5]">
        Download shows and movies so you always have something to watch — even without a connection.
      </p>
      <button
        onClick={onBrowse}
        className="rounded-[4px] bg-white px-6 py-3 text-[16px] font-bold text-black active:opacity-80"
      >
        Find Something to Download
      </button>
    </div>
  </div>
);

/** Notifications screen built from the newest catalog rows. */
export const NotificationsScreen: React.FC<{ items: TitleItem[]; onBack: () => void; onOpen: (id: number) => void }> = ({
  items,
  onBack,
  onOpen
}) => (
  <div className="fixed inset-0 z-[96] mx-auto max-w-md overflow-y-auto bg-black pb-10">
    <ScreenHeader title="Notifications" onBack={onBack} />
    {items.length === 0 ? (
      <p className="px-4 pt-16 text-center text-[15px] text-[#a5a5a5]">Nothing new right now.</p>
    ) : (
      <ul className="divide-y divide-white/10">
        {items.slice(0, 12).map((item, i) => (
          <li key={item.id}>
            <button onClick={() => onOpen(item.id)} className="flex w-full items-center gap-3 px-4 py-4 text-left active:bg-white/5">
              <img
                src={item.poster}
                onError={onImgError}
                alt=""
                loading="lazy"
                className="h-[78px] w-[54px] flex-shrink-0 rounded-[3px] bg-[#181818] object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold leading-snug">
                  {i % 2 === 0 ? 'New arrival: ' : 'Now trending: '}
                  {item.title}
                </span>
                <span className="mt-1 block text-[13px] text-[#a5a5a5]">
                  {(item.genres || []).slice(0, 2).join(' • ')} · {i + 1}d ago
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);
