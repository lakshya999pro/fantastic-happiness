import React from 'react';

/** Mirrors HeroBanner's layout while artwork/data is still loading. */
export const HeroSkeleton: React.FC = () => (
  <div className="px-7 pb-7">
    <div className="skeleton relative aspect-[3/5] w-full overflow-hidden rounded-xl bg-[#141414]">
      <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
        <div className="mx-auto mb-3 h-7 w-2/3 rounded bg-white/10" />
        <div className="mx-auto mb-4 h-3 w-1/2 rounded bg-white/10" />
        <div className="flex gap-2">
          <div className="h-[42px] flex-1 rounded bg-white/10" />
          <div className="h-[42px] flex-1 rounded bg-white/10" />
        </div>
      </div>
    </div>
  </div>
);

/** Mirrors RowSection's title + horizontal strip of poster cards. */
export const RowSkeleton: React.FC<{ ranked?: boolean }> = ({ ranked }) => (
  <section className="mb-6">
    <div className="mb-2.5 px-3.5">
      <div className="skeleton h-5 w-40 rounded bg-[#1a1a1a]" />
    </div>
    <div className="no-scrollbar flex gap-1.5 overflow-x-hidden px-3.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="skeleton flex-shrink-0 rounded-[5px] bg-[#1a1a1a]"
          style={{ width: ranked ? 95 : 95, height: 142 }}
        />
      ))}
    </div>
  </section>
);

/** Full Home-tab loading state: hero block + a handful of row blocks. */
export const HomeSkeleton: React.FC = () => (
  <div className="pb-24">
    <HeroSkeleton />
    <RowSkeleton />
    <RowSkeleton ranked />
    <RowSkeleton />
  </div>
);

/** 3-column poster grid skeleton used by Shows/Movies/genre browsing. */
export const GridSkeleton: React.FC = () => (
  <div className="grid grid-cols-3 gap-2">
    {Array.from({ length: 15 }).map((_, i) => (
      <div key={i} className="skeleton mx-auto rounded-[3px] bg-[#1a1a1a]" style={{ width: 105, height: 158 }} />
    ))}
  </div>
);
