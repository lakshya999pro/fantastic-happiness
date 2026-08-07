export interface TitleItem {
  id: number;
  title: string;
  type: 'movie' | 'series' | 'tvshow';
  poster: string;
  backdrop?: string;
  match?: number;
  year?: string | number;
  rating?: string;
  runtime?: string;
  seasons?: string;
  seasonsCount?: number;
  seasonsList?: SeasonRef[];
  currentSeason?: number;
  languages?: string[];
  topTen?: number;
  top10Badge?: boolean;
  tag?: string;
  month?: string;
  day?: number;
  releaseNote?: string;
  genres?: string[];
  synopsis?: string;
  cast?: string[];
  director?: string;
  trailerYoutubeKey?: string | null;
  videoUrl?: string;
  episodes?: Episode[];
}

export interface SeasonRef {
  season_number: number;
  name: string;
  episode_count: number;
}

export interface Episode {
  title: string;
  duration: string;
  synopsis: string;
  img?: string;
  videoUrl?: string;
}

export interface Row {
  key: string;
  name: string;
  style: 'poster' | 'ranked';
  items: TitleItem[];
}

export interface HeroSlide {
  id: number;
  title: string;
  poster: string;
  tagline: string;
  badge?: string;
}

export interface HomeData {
  hero: HeroSlide | null;
  heroes: HeroSlide[];
  rows: Row[];
}

export interface GameItem {
  id: number;
  name: string;
  genre: string;
  icon: string;
}

export interface ClipItem {
  id: number;
  titleId: number;
  videoUrl: string;
  poster: string;
  title: string;
  tags: string[];
  description: string;
  rating: string;
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  kids?: boolean;
}

export type PlayTarget = {
  id: number;
  isSeries: boolean;
  season: number;
  episode: number;
};

declare global {
  interface Window {
    AndroidBridge?: {
      playMovie?: (tmdbId: string, title: string) => void;
      playTvShow?: (tmdbId: string, season: number, episode: number, title: string) => void;
    };
    playMovie?: (tmdbId: string | number, title: string) => void;
    playTvShow?: (tmdbId: string | number, season: number | string, episode: number | string, title: string) => void;
  }
}

/** Triggers Android native PlayerActivity via AndroidBridge if present */
export function triggerNativePlay(target: PlayTarget, title: string = ''): boolean {
  const isSeries = target.isSeries;
  const tmdbId = String(target.id);
  const season = Number(target.season || 1);
  const episode = Number(target.episode || 1);

  if (typeof window !== 'undefined' && window.AndroidBridge) {
    if (isSeries && typeof window.AndroidBridge.playTvShow === 'function') {
      console.log('[AndroidBridge] Launching playTvShow:', tmdbId, season, episode, title);
      window.AndroidBridge.playTvShow(tmdbId, season, episode, title);
      return true;
    } else if (!isSeries && typeof window.AndroidBridge.playMovie === 'function') {
      console.log('[AndroidBridge] Launching playMovie:', tmdbId, title);
      window.AndroidBridge.playMovie(tmdbId, title);
      return true;
    }
  }
  return false;
}
