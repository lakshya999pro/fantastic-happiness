import React from 'react';
import { TitleItem } from '../types';
import { SmileyAvatar } from './Avatar';
import { PosterCard } from './Cards';
import { BellIcon, ChevronDown, ChevronRight, DownloadIcon } from './Icons';

const Section: React.FC<{ title: string; items: TitleItem[]; onOpen: (id: number) => void; empty: string }> = ({
  title,
  items,
  onOpen,
  empty
}) => (
  <section className="mb-7">
    <div className="mb-2.5 flex items-center justify-between px-3">
      <h2 className="text-[23px] font-bold tracking-[-0.01em]">{title}</h2>
      {items.length > 0 && (
        <button className="flex items-center gap-1 text-[19px] font-bold">
          See All <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
    {items.length ? (
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-3">
        {items.map(item => (
          <PosterCard key={item.id} item={item} onOpen={onOpen} width="w-[104px]" />
        ))}
      </div>
    ) : (
      <p className="px-3 text-[14px] text-nfgrey">{empty}</p>
    )}
  </section>
);

export const MyNetflix: React.FC<{
  profileName: string;
  myList: TitleItem[];
  watched: TitleItem[];
  onOpen: (id: number) => void;
  onProfile: () => void;
  onDownloads: () => void;
  onNotifications: () => void;
}> = ({ profileName, myList, watched, onOpen, onProfile, onDownloads, onNotifications }) => (
  <div className="pb-24 pt-2">
    <div className="mb-5 flex items-center justify-between px-3">
      <button onClick={onProfile} className="flex items-center gap-2.5 active:opacity-70">
        <SmileyAvatar className="h-[42px] w-[42px]" radius={10} />
        <span className="text-[26px] font-bold leading-none tracking-[-0.02em]">{profileName}</span>
        <ChevronDown className="h-4 w-4 text-white" />
      </button>
      <div className="flex items-center gap-5">
        <button onClick={onDownloads} aria-label="Downloads">
          <DownloadIcon className="h-[25px] w-[25px]" />
        </button>
        <button onClick={onNotifications} aria-label="Notifications">
          <BellIcon className="h-[25px] w-[25px]" />
        </button>
      </div>
    </div>

    <button
      onClick={onDownloads}
      className="mx-3 mb-7 block w-[calc(100%-1.5rem)] rounded-lg bg-[#1f1f1f] p-4 text-left active:opacity-80"
    >
      <div className="mb-1.5 flex items-center gap-3">
        <DownloadIcon className="h-6 w-6" />
        <span className="flex-1 text-[21px] font-bold">Downloads</span>
        <ChevronRight className="h-6 w-6" />
      </div>
      <p className="pl-9 text-[15px] leading-snug text-[#a5a5a5]">
        Movies and shows that you download appear here.
      </p>
    </button>

    <Section
      title="My List"
      items={myList}
      onOpen={onOpen}
      empty="Titles you add to My List show up here."
    />
    <Section
      title="Trailers You Have Watched"
      items={watched}
      onOpen={onOpen}
      empty="Trailers and titles you open show up here."
    />
  </div>
);
