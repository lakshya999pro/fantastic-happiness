import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Episode, TitleItem } from '../types';
import { fetchSeason, fetchSimilar, fetchTitleDetail, getTitle } from '../services/api';
import { onImgError } from './Cards';
import {
  ArrowLeft,
  CheckIcon,
  ChevronDown,
  CloseIcon,
  DownloadIcon,
  DownloadStackIcon,
  InfoIcon,
  PlayIcon,
  PlusIcon,
  ShareIcon,
  ThumbUpIcon,
  VolumeOff,
  VolumeOn
} from './Icons';

/* ─────────────────────────────────────────────
   YOUTUBE IFRAME API (loaded once, shared globally)
   Mirrors the loadYTAPI() bootstrap from detail.html
───────────────────────────────────────────── */
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const TRAILER_DELAY_MS = 2500; // wait 2-3s after backdrop shows before swapping to trailer

let ytApiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise(resolve => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prevCallback?.();
      resolve();
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  });
  return ytApiPromise;
}

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void; active?: boolean }> = ({
  icon,
  label,
  onClick,
  active
}) => (
  <button onClick={onClick} className="flex w-1/4 flex-col items-center gap-2 active:opacity-60">
    <span className={active ? 'text-white' : 'text-white'}>{icon}</span>
    <span className="text-center text-[13px] leading-tight text-[#c2c2c2]">{label}</span>
  </button>
);

/** The centred season list that slides over the page. */
export const SeasonPicker: React.FC<{
  count: number;
  current: number;
  onPick: (n: number) => void;
  onClose: () => void;
}> = ({ count, current, onPick, onClose }) => (
  <div className="fixed inset-0 z-[105] mx-auto flex max-w-md flex-col items-center justify-center bg-black/85 animate-fade-in">
    <div className="no-scrollbar max-h-[70vh] w-full overflow-y-auto py-8 text-center">
      {Array.from({ length: count }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          onClick={() => {
            onPick(n);
            onClose();
          }}
          className={`block w-full py-[22px] ${
            n === current ? 'text-[27px] font-bold text-white' : 'text-[25px] font-normal text-[#9a9a9a]'
          }`}
        >
          Season {n}
        </button>
      ))}
    </div>
    <button
      onClick={onClose}
      aria-label="Close season list"
      className="absolute bottom-8 flex h-16 w-16 items-center justify-center rounded-full bg-white text-black"
    >
      <CloseIcon className="h-7 w-7" />
    </button>
  </div>
);

export const DetailScreen: React.FC<{
  titleId: number;
  onClose: () => void;
  onPlay: (id: number, season?: number, episode?: number) => void;
  onOpen: (id: number) => void;
  onToggleList: (id: number) => void;
  inList: (id: number) => boolean;
}> = ({ titleId, onClose, onPlay, onOpen, onToggleList, inList }) => {
  const [detail, setDetail] = useState<TitleItem | null>(() => getTitle(titleId));
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [similar, setSimilar] = useState<TitleItem[]>([]);
  const [season, setSeason] = useState(1);
  const [seasonOpen, setSeasonOpen] = useState(false);
  const [tab, setTab] = useState<'episodes' | 'collection' | 'more'>('episodes');
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(!getTitle(titleId));

  const isSeries = detail?.type === 'series' || detail?.type === 'tvshow';

  useEffect(() => {
    setDetail(getTitle(titleId));
    setSeason(1);
    setEpisodes([]);
    setLoading(!getTitle(titleId));
    let alive = true;

    fetchTitleDetail(titleId, 1)
      .then(full => {
        if (!alive) return;
        setDetail(full);
        setEpisodes(full.episodes || []);
        setTab(full.type === 'movie' ? 'more' : 'episodes');
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));

    fetchSimilar(titleId).then(items => alive && setSimilar(items));
    return () => {
      alive = false;
    };
  }, [titleId]);

  const changeSeason = async (n: number) => {
    setSeason(n);
    setEpisodes([]);
    try {
      setEpisodes(await fetchSeason(titleId, n));
    } catch {
      /* keep the empty state; the row below shows a short message */
    }
  };

  /* ─────────────────────────────────────────────
     HERO: BACKDROP → TRAILER (ported from detail.html)
     Backdrop shows first; after TRAILER_DELAY_MS a muted,
     controls-less YouTube trailer fades in over it.
  ───────────────────────────────────────────── */
  const ytKey = detail?.trailerYoutubeKey || null;

  const [trailerActive, setTrailerActive] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [isUserUnmuted, setIsUserUnmuted] = useState(false);

  // playback + scrub state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // tap-to-reveal chrome (play/pause, seek bar, time, back button)
  const [heroControlsVisible, setHeroControlsVisible] = useState(true);

  const trailerTargetRef = useRef<HTMLDivElement | null>(null);
  const trailerPlayerRef = useRef<any>(null);
  const backdropTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trailerElementId = useMemo(() => `yt-player-${titleId}`, [titleId]);

  // chrome (back button / play-pause / seek row) shows whenever there's no
  // active player yet, or the user has tapped to reveal it.
  const showChrome = !playerReady || heroControlsVisible;

  const destroyPlayer = () => {
    try {
      trailerPlayerRef.current?.destroy?.();
    } catch {
      /* no-op */
    }
    trailerPlayerRef.current = null;
  };

  const stopTrailer = () => {
    if (trailerPlayerRef.current && typeof trailerPlayerRef.current.stopVideo === 'function') {
      try {
        trailerPlayerRef.current.stopVideo();
      } catch {
        /* no-op */
      }
    }
    setTrailerActive(false);
    setPlayerReady(false);
    setIsPlaying(false);
  };

  useEffect(() => {
    // reset trailer state whenever the title changes
    if (backdropTimerRef.current) clearTimeout(backdropTimerRef.current);
    destroyPlayer();
    setTrailerActive(false);
    setPlayerReady(false);
    setIsUserUnmuted(false);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);
    setHeroControlsVisible(true);

    if (!ytKey) return;

    const initTrailerPlayer = async () => {
      await loadYouTubeApi();
      if (!trailerTargetRef.current) return;

      try {
        trailerPlayerRef.current = new window.YT.Player(trailerElementId, {
          height: '100%',
          width: '100%',
          videoId: ytKey,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            rel: 0,
            playsinline: 1,
            modestbranding: 1,
            iv_load_policy: 3
          },
          events: {
            onReady: (event: any) => {
              event.target.mute();
              event.target.playVideo();
              setTrailerActive(true);
              setPlayerReady(true);
              setIsUserUnmuted(false);
              setIsPlaying(true);
              setHeroControlsVisible(true);
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                stopTrailer();
              } else if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
                setHeroControlsVisible(true);
              }
            }
          }
        });
      } catch (err) {
        console.warn('[DetailScreen] YT Player init failed, staying on backdrop:', err);
        setTrailerActive(false);
      }
    };

    backdropTimerRef.current = setTimeout(initTrailerPlayer, TRAILER_DELAY_MS);

    return () => {
      if (backdropTimerRef.current) clearTimeout(backdropTimerRef.current);
      destroyPlayer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleId, ytKey]);

  // poll playback position while a player exists
  useEffect(() => {
    if (!playerReady) return;
    const id = setInterval(() => {
      const p = trailerPlayerRef.current;
      if (p && typeof p.getCurrentTime === 'function') {
        setCurrentTime(p.getCurrentTime() || 0);
        setDuration(p.getDuration() || 0);
      }
    }, 500);
    return () => clearInterval(id);
  }, [playerReady]);

  // auto-hide the chrome 3s after it's shown, but only while playing
  useEffect(() => {
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    if (playerReady && isPlaying && heroControlsVisible) {
      hideControlsTimerRef.current = setTimeout(() => setHeroControlsVisible(false), 3000);
    }
    return () => {
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    };
  }, [isPlaying, heroControlsVisible, playerReady]);

  const handleHeroTap = () => {
    if (!playerReady) return;
    setHeroControlsVisible(v => !v);
  };

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    const p = trailerPlayerRef.current;
    if (!p) return;
    if (isPlaying) {
      p.pauseVideo?.();
    } else {
      p.playVideo?.();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const value = Number(e.target.value);
    setCurrentTime(value);
    trailerPlayerRef.current?.seekTo?.(value, true);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!trailerPlayerRef.current || typeof trailerPlayerRef.current.mute !== 'function') return;
    const next = !isUserUnmuted;
    setIsUserUnmuted(next);
    if (next) {
      trailerPlayerRef.current.unMute();
    } else {
      trailerPlayerRef.current.mute();
    }
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const added = detail ? inList(detail.id) : false;
  const seasonCount = detail?.seasonsCount || 1;

  return (
    <div className="fixed inset-0 z-[90] mx-auto max-w-md overflow-y-auto bg-black no-scrollbar">
      {/* ---- HERO: backdrop → trailer header ---- */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#0d0d0d]" onClick={handleHeroTap}>
        {/* backdrop layer */}
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: trailerActive ? 0 : 1 }}
        >
          {detail && (
            <img
              src={detail.backdrop || detail.poster}
              onError={onImgError}
              alt={detail.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* trailer layer (YouTube IFrame API target) */}
        {ytKey && (
          <div
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ opacity: trailerActive ? 1 : 0, pointerEvents: trailerActive ? 'auto' : 'none' }}
          >
            <div className="relative h-full w-full overflow-hidden [&_iframe]:absolute [&_iframe]:left-1/2 [&_iframe]:top-1/2 [&_iframe]:h-[177.77vw] [&_iframe]:w-[177.77vw] [&_iframe]:-translate-x-1/2 [&_iframe]:-translate-y-1/2 [&_iframe]:border-0 [&_iframe]:[transform:translate(-50%,-50%)_scale(1.35)]">
              <div ref={trailerTargetRef} id={trailerElementId} className="h-full w-full" />
            </div>
          </div>
        )}

        {/* dim overlay while chrome is visible, so controls stay readable */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 transition-opacity duration-300"
          style={{ opacity: showChrome ? 1 : 0.55 }}
        />

        {/* back button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Back"
          className={`absolute left-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-opacity active:opacity-70 ${
            showChrome ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        {/* center play / pause toggle */}
        {playerReady && (
          <button
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className={`absolute left-1/2 top-1/2 z-30 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-opacity active:opacity-70 ${
              showChrome ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            {isPlaying ? (
              <span className="flex items-center gap-2">
                <span className="h-8 w-2.5 rounded-sm bg-white" />
                <span className="h-8 w-2.5 rounded-sm bg-white" />
              </span>
            ) : (
              <PlayIcon className="h-9 w-9 text-white" />
            )}
          </button>
        )}

        {/* mute toggle — always visible once the player is ready */}
        {playerReady && (
          <button
            onClick={toggleMute}
            aria-label={isUserUnmuted ? 'Mute trailer' : 'Unmute trailer'}
            className="absolute bottom-11 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white active:opacity-70"
          >
            {isUserUnmuted ? <VolumeOn className="h-5 w-5" /> : <VolumeOff className="h-5 w-5" />}
          </button>
        )}

        {playerReady && (
          <>
            {/* slim static progress line — shown once chrome auto-hides */}
            <div
              className={`absolute inset-x-0 bottom-0 z-20 h-[3px] bg-white/25 transition-opacity duration-300 ${
                showChrome ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
            >
              <div
                className="h-full bg-nfred"
                style={{ width: `${duration ? Math.min(100, (currentTime / duration) * 100) : 0}%` }}
              />
            </div>

            {/* full scrub bar + elapsed time — shown while chrome is visible */}
            <div
              className={`absolute inset-x-3 bottom-3 z-30 flex items-center gap-2 transition-opacity duration-300 ${
                showChrome ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={currentTime}
                onClick={e => e.stopPropagation()}
                onChange={handleSeek}
                className="h-1 flex-1 cursor-pointer"
                style={{ accentColor: '#e50914' }}
              />
              <span className="min-w-[38px] text-right text-[11px] font-medium tabular-nums text-white">
                {formatTime(currentTime)}
              </span>
            </div>
          </>
        )}
      </div>

      {loading && !detail && (
        <div className="flex justify-center py-16">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-white/25 border-t-nfred" />
        </div>
      )}

      {detail && (
        <div className="px-4 pb-28 pt-3">
          <h1 className="mb-2 text-[34px] font-extrabold leading-[1.05] tracking-[-0.025em]">{detail.title}</h1>

          <div className="mb-3 flex items-center gap-3 text-[15px] text-[#a5a5a5]">
            <span>{detail.year || '2024'}</span>
            <span className="rounded-[3px] bg-[#3a3a3a] px-[7px] py-[2px] text-[13px] text-white">
              {detail.rating || 'U/A 13+'}
            </span>
            <span>{isSeries ? detail.seasons || '1 Season' : detail.runtime || '1h 45m'}</span>
          </div>

          {detail.languages && detail.languages.length > 0 && (
            <p className="mb-4 text-[18px] font-bold leading-snug">Watch in {detail.languages.join(', ')}</p>
          )}

          <button
            onClick={() => onPlay(detail.id, season, 1)}
            className="mb-2.5 flex w-full items-center justify-center gap-2.5 rounded-[4px] bg-white py-[13px] text-[19px] font-bold text-black active:opacity-80"
          >
            <PlayIcon className="h-[18px] w-[18px]" />
            Play
          </button>
          <button className="mb-5 flex w-full items-center justify-center gap-2.5 rounded-[4px] bg-[#2b2b2b] py-[13px] text-[19px] font-bold text-white active:opacity-80">
            <DownloadIcon className="h-[21px] w-[21px]" />
            Download
          </button>

          <p className="mb-3 text-[16px] leading-[1.4]">{detail.synopsis}</p>

          {detail.cast && detail.cast.length > 0 && (
            <p className="mb-1 text-[14px] text-[#a5a5a5]">
              <span className="font-bold text-white">Starring: </span>
              {detail.cast.slice(0, 3).join(', ')}
              {detail.cast.length > 3 && '… more'}
            </p>
          )}
          {detail.director && detail.director !== 'Unknown' && (
            <p className="mb-6 text-[14px] text-[#a5a5a5]">
              <span className="font-bold text-white">{isSeries ? 'Creator: ' : 'Director: '}</span>
              {detail.director}
            </p>
          )}

          {/* action strip */}
          <div className="mb-7 flex items-start justify-around">
            <ActionButton
              icon={added ? <CheckIcon className="h-8 w-8" /> : <PlusIcon className="h-8 w-8" />}
              label="My List"
              onClick={() => onToggleList(detail.id)}
              active={added}
            />
            <ActionButton
              icon={<ThumbUpIcon className="h-8 w-8" />}
              label={liked ? 'Rated' : 'Rate'}
              onClick={() => setLiked(l => !l)}
              active={liked}
            />
            <ActionButton
              icon={<ShareIcon className="h-8 w-8" />}
              label="Share"
              onClick={() =>
                navigator.share?.({ title: detail.title, text: detail.synopsis }).catch(() => {})
              }
            />
            {isSeries && (
              <ActionButton
                icon={<DownloadStackIcon className="h-8 w-8" />}
                label={`Download Season ${season}`}
              />
            )}
          </div>

          {/* tabs */}
          <div className="mb-4 flex border-t border-white/15">
            {(isSeries ? (['episodes', 'collection', 'more'] as const) : (['more'] as const)).map(t => {
              const labels = { episodes: 'Episodes', collection: 'Collection', more: 'More Like This' };
              const on = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`-mt-px border-t-[3px] px-3 pb-3 pt-3 text-[16px] font-bold ${
                    on ? 'border-nfred text-white' : 'border-transparent text-[#a5a5a5]'
                  }`}
                >
                  {labels[t]}
                </button>
              );
            })}
          </div>

          {/* ---- episodes ---- */}
          {tab === 'episodes' && isSeries && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <button
                  onClick={() => setSeasonOpen(true)}
                  className="flex items-center gap-2.5 rounded-[4px] bg-[#2b2b2b] px-4 py-[10px] text-[19px] font-bold"
                >
                  Season {season}
                  <ChevronDown className="h-4 w-4" />
                </button>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c9c9c9] text-black">
                  <InfoIcon className="h-8 w-8" />
                </span>
              </div>

              {episodes.length === 0 ? (
                <p className="py-6 text-center text-[14px] text-nfgrey">Loading episodes…</p>
              ) : (
                <ul className="flex flex-col gap-6">
                  {episodes.map((ep, i) => {
                    const label = ep.title.replace(/^E(\d+):\s*/, (_m, n) => `${n}. `);
                    return (
                      <li key={i}>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onPlay(detail.id, season, i + 1)}
                            className="relative h-[70px] w-[124px] flex-shrink-0 overflow-hidden rounded-[3px] bg-[#181818]"
                          >
                            <img
                              src={ep.img || detail.backdrop || detail.poster}
                              onError={onImgError}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/90 bg-black/25">
                                <PlayIcon className="ml-[2px] h-3.5 w-3.5" />
                              </span>
                            </span>
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className="text-[17px] font-bold leading-tight">{label}</p>
                            <p className="mt-1 text-[14px] text-[#a5a5a5]">{ep.duration}</p>
                          </div>
                          <button aria-label={`Download ${label}`} className="flex-shrink-0 active:opacity-60">
                            <DownloadIcon className="h-7 w-7" />
                          </button>
                        </div>
                        <p className="mt-2.5 text-[14.5px] leading-[1.4] text-[#c2c2c2]">{ep.synopsis}</p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {/* ---- collection ---- */}
          {tab === 'collection' && (
            <div className="grid grid-cols-3 gap-2">
              {similar.slice(0, 6).map(item => (
                <button key={item.id} onClick={() => onOpen(item.id)} className="active:opacity-70">
                  <img
                    src={item.poster}
                    onError={onImgError}
                    alt={item.title}
                    loading="lazy"
                    className="aspect-[2/3] w-full rounded-[3px] object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* ---- more like this ---- */}
          {tab === 'more' && (
            <div className="grid grid-cols-3 gap-2">
              {similar.slice(0, 6).map(item => (
                <button key={item.id} onClick={() => onOpen(item.id)} className="active:opacity-70">
                  <img
                    src={item.poster}
                    onError={onImgError}
                    alt={item.title}
                    loading="lazy"
                    className="aspect-[2/3] w-full rounded-[3px] object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {seasonOpen && (
        <SeasonPicker
          count={seasonCount}
          current={season}
          onPick={changeSeason}
          onClose={() => setSeasonOpen(false)}
        />
      )}
    </div>
  );
};
