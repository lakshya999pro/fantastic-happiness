import React, { useEffect, useState } from 'react';
import { HeroSlide } from '../types';
import { onImgError } from './Cards';
import { CheckIcon, ChevronDown, NetflixN, PlayIcon, PlusIcon } from './Icons';

export const HeroBanner: React.FC<{
  slides: HeroSlide[];
  onPlay: (id: number) => void;
  onOpen: (id: number) => void;
  onToggleList: (id: number) => void;
  inList: (id: number) => boolean;
  onIndexChange?: (i: number) => void;
}> = ({ slides, onPlay, onOpen, onToggleList, inList, onIndexChange }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIndex(i => (i + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [slides.length]);

  useEffect(() => onIndexChange?.(index), [index, onIndexChange]);

  if (!slides.length) return null;
  const slide = slides[index] || slides[0];
  const added = inList(slide.id);

  return (
    <div className="px-7 pb-7 animate-fade-in">
      <div className="relative overflow-hidden rounded-xl bg-[#141414]">
        <button onClick={() => onOpen(slide.id)} className="block w-full text-left">
          <div className="relative aspect-[3/5] w-full">
            <img
              src={slide.poster}
              onError={onImgError}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/35" />
            <NetflixN className="absolute left-3 top-3 h-6 w-4 drop-shadow" />
            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-nfred/90" />
            {slide.badge && (
              <span className="absolute left-3 top-11 rounded-[3px] bg-nfred px-1.5 py-[3px] text-[10px] font-bold">
                {slide.badge}
              </span>
            )}
          </div>
        </button>

        <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
          <h1 className="mb-2 text-center text-[30px] font-extrabold leading-[1.05] tracking-[-0.02em] drop-shadow-lg">
            {slide.title}
          </h1>
          <p className="mb-3.5 text-center text-[12.5px] font-medium text-white/90">{slide.tagline}</p>
          <div className="flex gap-2">
            <button
              onClick={() => onPlay(slide.id)}
              className="flex flex-1 items-center justify-center gap-2 rounded-[4px] bg-white py-[11px] text-[15px] font-bold text-black active:opacity-80"
            >
              <PlayIcon className="h-[15px] w-[15px]" />
              Play
            </button>
            <button
              onClick={() => onToggleList(slide.id)}
              className="flex flex-1 items-center justify-center gap-2 rounded-[4px] bg-[#3a3a3a]/90 py-[11px] text-[15px] font-bold text-white active:opacity-80"
            >
              {added ? <CheckIcon className="h-[17px] w-[17px]" /> : <PlusIcon className="h-[17px] w-[17px]" />}
              My List
            </button>
          </div>
        </div>

        {slides.length > 1 && (
          <div className="absolute right-3 top-14 flex flex-col gap-1.5">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/35'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
