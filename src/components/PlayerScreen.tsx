import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Episode, PlayTarget, TitleItem } from '../types';
import { API_BASE, fetchSeason, fetchTitleDetail, getProgress, getTitle, getUrl, saveProgress } from '../services/api';
import { onImgError } from './Cards';
import {
  ArrowLeft,
  BrightnessIcon,
  ChevronDown,
  DownloadIcon,
  EpisodesIcon,
  Forward10,
  LockClosed,
  LockOpen,
  NextEpIcon,
  PauseIcon,
  PlayIcon,
  Replay10,
  ScissorsIcon,
  SpeedIcon,
  SubtitlesIcon
} from './Icons';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const AUDIO = ['English [Original]', 'Hindi', 'Tamil', 'Telugu'];
const SUBS = ['Off', 'English', 'English [CC]', 'Hindi'];

function fmt(sec: number) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

const ControlButton: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({
  icon,
  label,
  onClick
}) => (
  <button onClick={onClick} className="flex items-center gap-2 px-2 py-1 text-[14px] font-medium active:opacity-60">
    {icon}
    <span>{label}</span>
  </button>
);

export const PlayerScreen: React.FC<{ target: PlayTarget; onClose: () => void; onChangeTarget: (t: PlayTarget) => void }> = ({
  target,
  onClose,
  onChangeTarget
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<number | null>(null);

  const [detail, setDetail] = useState<TitleItem | null>(getTitle(target.id));
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [playing, setPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showUI, setShowUI] = useState(true);
  const [locked, setLocked] = useState(false);
  const [brightness, setBrightness] = useState(0.65);
  const [speed, setSpeed] = useState(1);
  const [panel, setPanel] = useState<null | 'episodes' | 'speed' | 'audio'>(null);
  const [audio, setAudio] = useState(AUDIO[0]);
  const [subs, setSubs] = useState(SUBS[1]);
  const [toast, setToast] = useState<string | null>(null);
  const [useGoServer, setUseGoServer] = useState(true);

  /* --- listen for postMessage close events from Go player iframe --- */
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (
        e.data === 'close-player' ||
        e.data === 'closePlayer' ||
        e.data?.type === 'closePlayer' ||
        e.data?.type === 'player:close'
      ) {
        onClose();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClose]);

  /* --- go fullscreen + landscape where the browser allows it --- */
  useEffect(() => {
    const el = document.documentElement;
    el.requestFullscreen?.().catch(() => {});
    const o: any = screen.orientation;
    o?.lock?.('landscape').catch(() => {});
    return () => {
      try {
        o?.unlock?.();
      } catch {
        /* not supported on desktop browsers */
      }
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    };
  }, []);

  /* --- load the title + episode list --- */
  useEffect(() => {
    let alive = true;
    fetchTitleDetail(target.id, target.season)
      .then(d => {
        if (!alive) return;
        setDetail(d);
        setEpisodes(d.episodes || []);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [target.id, target.season]);

  /* --- resume where we left off --- */
  useEffect(() => {
    const saved = getProgress(target.id, target.isSeries, target.season, target.episode);
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => {
      setDuration(v.duration || 0);
      if (saved && saved.pos < (v.duration || 0) - 10) {
        v.currentTime = saved.pos;
        setToast(`Resuming from ${fmt(saved.pos)}`);
        window.setTimeout(() => setToast(null), 2600);
      }
    };
    v.addEventListener('loadedmetadata', onMeta);
    return () => v.removeEventListener('loadedmetadata', onMeta);
  }, [target.id, target.season, target.episode, target.isSeries]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed;
  }, [speed]);

  const bump = useCallback(() => {
    setShowUI(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShowUI(false), 3800);
  }, []);

  useEffect(() => {
    bump();
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [bump]);

  const src = detail?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const pct = duration > 0 ? (current / duration) * 100 : 0;

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
    bump();
  };

  const seekBy = (delta: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + delta));
    bump();
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrent(v.currentTime);
    if (Math.floor(v.currentTime) % 5 === 0) {
      saveProgress(target.id, target.isSeries, target.season, target.episode, v.currentTime, v.duration);
    }
  };

  const scrubTo = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    v.currentTime = Math.max(0, Math.min(1, (x - rect.left) / rect.width)) * v.duration;
    bump();
  };

  const nextEpisode = () => {
    if (!target.isSeries) return;
    const next = target.episode + 1;
    if (next > Math.max(episodes.length, 1)) return;
    saveProgress(target.id, true, target.season, target.episode, current, duration);
    onChangeTarget({ ...target, episode: next });
  };

  const heading = target.isSeries
    ? `S${target.season}:E${target.episode}${episodes[target.episode - 1] ? ` "${episodes[target.episode - 1].title.replace(/^E\d+:\s*/, '')}"` : ''}`
    : detail?.title || '';

  const [playerSrcUrl, setPlayerSrcUrl] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const mediaType = target.isSeries ? 'tv' : 'movie';
    const fallbackUrl = `${API_BASE}/player.html?type=${mediaType}&id=${target.id}&season=${target.season}&episode=${target.episode}`;

    fetch(getUrl(`/api/url?id=${encodeURIComponent(target.id)}&type=${mediaType}&season=${target.season}&episode=${target.episode}`))
      .then(res => res.json())
      .then(data => {
        if (!alive) return;
        if (data && data.playerUrl) {
          setPlayerSrcUrl(data.playerUrl);
        } else {
          setPlayerSrcUrl(fallbackUrl);
        }
      })
      .catch(() => {
        if (alive) setPlayerSrcUrl(fallbackUrl);
      });

    return () => {
      alive = false;
    };
  }, [target.id, target.isSeries, target.season, target.episode]);

  const mediaType = target.isSeries ? 'tv' : 'movie';
  const finalPlayerUrl = playerSrcUrl || `${API_BASE}/player.html?type=${mediaType}&id=${target.id}&season=${target.season}&episode=${target.episode}`;

  if (useGoServer) {
    return (
      <div className="fixed inset-0 z-[120] select-none bg-black">
        <button
          onClick={onClose}
          aria-label="Close player"
          className="absolute left-4 top-4 z-[130] flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white shadow-md active:scale-95"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <iframe
          src={finalPlayerUrl}
          title={heading || 'Player'}
          className="h-full w-full border-0 bg-black"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] select-none bg-black" onClick={() => (locked ? setShowUI(s => !s) : bump())}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        playsInline
        onTimeUpdate={onTimeUpdate}
        onDurationChange={e => setDuration(e.currentTarget.duration || 0)}
        onEnded={nextEpisode}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="h-full w-full object-contain"
        style={{ filter: `brightness(${0.35 + brightness * 0.9})` }}
      />

      {toast && (
        <div className="pointer-events-none absolute left-1/2 top-6 z-40 -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-[13px]">
          {toast}
        </div>
      )}

      {/* ---------- locked ---------- */}
      {locked && showUI && (
        <button
          onClick={e => {
            e.stopPropagation();
            setLocked(false);
            bump();
          }}
          className="absolute right-5 top-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-black/60"
          aria-label="Unlock controls"
        >
          <LockClosed className="h-6 w-6" />
        </button>
      )}

      {/* ---------- full controls ---------- */}
      {!locked && showUI && !panel && (
        <div className="absolute inset-0 z-30 flex flex-col justify-between bg-black/35 animate-fade-in" onClick={e => e.stopPropagation()}>
          {/* top bar */}
          <div className="flex items-center justify-between px-5 pt-4">
            <button onClick={onClose} aria-label="Back">
              <ArrowLeft className="h-7 w-7" />
            </button>
            <p className="truncate px-4 text-[17px] font-bold">{heading}</p>
            <button onClick={() => setLocked(true)} aria-label="Lock controls">
              <LockOpen className="h-7 w-7" />
            </button>
          </div>

          {/* middle: brightness + transport */}
          <div className="relative flex flex-1 items-center">
            <div className="absolute left-5 flex flex-col items-center gap-3">
              <BrightnessIcon className="h-5 w-5" />
              <div
                className="relative h-[130px] w-[7px] cursor-pointer rounded-full bg-white/35"
                onClick={e => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setBrightness(Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height)));
                }}
                role="slider"
                aria-label="Brightness"
                aria-valuenow={Math.round(brightness * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'ArrowUp') setBrightness(b => Math.min(1, b + 0.1));
                  if (e.key === 'ArrowDown') setBrightness(b => Math.max(0, b - 0.1));
                }}
              >
                <div
                  className="absolute bottom-0 w-full rounded-full bg-white"
                  style={{ height: `${brightness * 100}%` }}
                />
              </div>
            </div>

            <div className="mx-auto flex items-center gap-16">
              <button onClick={() => seekBy(-10)} aria-label="Back 10 seconds">
                <Replay10 className="h-11 w-11" />
              </button>
              <button onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? <PauseIcon className="h-14 w-14" /> : <PlayIcon className="h-14 w-14" />}
              </button>
              <button onClick={() => seekBy(10)} aria-label="Forward 10 seconds">
                <Forward10 className="h-11 w-11" />
              </button>
            </div>
          </div>

          {/* bottom: scrubber + controls */}
          <div className="px-5 pb-4">
            <div className="mb-3 flex items-center gap-4">
              <div
                className="relative h-[5px] flex-1 cursor-pointer rounded-full bg-white/35"
                onClick={scrubTo}
                onTouchStart={scrubTo}
                role="slider"
                aria-label="Seek"
                aria-valuenow={Math.round(pct)}
                aria-valuemin={0}
                aria-valuemax={100}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'ArrowRight') seekBy(10);
                  if (e.key === 'ArrowLeft') seekBy(-10);
                }}
              >
                <div className="absolute inset-y-0 left-0 rounded-full bg-nfred" style={{ width: `${pct}%` }} />
                <span
                  className="absolute top-1/2 h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-nfred"
                  style={{ left: `${pct}%` }}
                />
              </div>
              <span className="w-[62px] text-right text-[15px] font-medium tabular-nums">
                {fmt(Math.max(0, duration - current))}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <ControlButton icon={<ScissorsIcon className="h-5 w-5" />} label="Clip" />
              <ControlButton
                icon={<SpeedIcon className="h-5 w-5" />}
                label={`Speed (${speed}x)`}
                onClick={() => setPanel('speed')}
              />
              {target.isSeries && (
                <ControlButton
                  icon={<EpisodesIcon className="h-5 w-5" />}
                  label="Episodes"
                  onClick={() => setPanel('episodes')}
                />
              )}
              <ControlButton
                icon={<SubtitlesIcon className="h-5 w-5" />}
                label="Audio & Subtitles"
                onClick={() => setPanel('audio')}
              />
              {target.isSeries && (
                <ControlButton icon={<NextEpIcon className="h-5 w-5" />} label="Next Ep." onClick={nextEpisode} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------- episodes panel ---------- */}
      {panel === 'episodes' && (
        <div className="absolute inset-0 z-40 overflow-y-auto bg-black/95 px-5 py-4" onClick={e => e.stopPropagation()}>
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => setPanel(null)} aria-label="Close episodes">
              <ArrowLeft className="h-7 w-7" />
            </button>
            <button className="flex items-center gap-2 rounded-[4px] bg-[#2b2b2b] px-4 py-2 text-[16px] font-bold">
              Season {target.season}
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <div className="no-scrollbar flex gap-5 overflow-x-auto pb-4">
            {episodes.map((ep, i) => {
              const label = ep.title.replace(/^E(\d+):\s*/, (_m, n) => `${n}. `);
              const on = i + 1 === target.episode;
              return (
                <div key={i} className="w-[260px] flex-shrink-0">
                  <button
                    onClick={() => {
                      onChangeTarget({ ...target, episode: i + 1 });
                      setPanel(null);
                    }}
                    className="relative block aspect-video w-full overflow-hidden rounded-[3px] bg-[#181818]"
                  >
                    <img src={ep.img || detail?.poster} onError={onImgError} alt="" className="h-full w-full object-cover" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45">
                        <PlayIcon className="ml-[2px] h-4 w-4" />
                      </span>
                    </span>
                    {on && <span className="absolute bottom-0 inset-x-0 h-[3px] bg-nfred" />}
                  </button>
                  <div className="mt-2 flex items-start gap-3">
                    <p className="flex-1 text-[16px] font-bold leading-tight">{label}</p>
                    <DownloadIcon className="h-6 w-6 flex-shrink-0" />
                  </div>
                  <p className="mt-1 text-[13px] text-[#a5a5a5]">{ep.duration}</p>
                  <p className="mt-2 text-[13px] leading-snug text-[#c2c2c2]">{ep.synopsis}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------- speed panel ---------- */}
      {panel === 'speed' && (
        <div
          className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/85"
          onClick={() => setPanel(null)}
        >
          <div className="w-[260px] rounded-lg bg-[#181818] py-2" onClick={e => e.stopPropagation()}>
            <p className="px-5 py-2 text-[13px] font-bold uppercase tracking-wide text-[#a5a5a5]">Playback speed</p>
            {SPEEDS.map(s => (
              <button
                key={s}
                onClick={() => {
                  setSpeed(s);
                  setPanel(null);
                }}
                className={`block w-full px-5 py-3 text-left text-[16px] ${
                  s === speed ? 'font-bold text-white' : 'text-[#c2c2c2]'
                }`}
              >
                {s}x {s === 1 && '(Normal)'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------- audio & subtitles panel ---------- */}
      {panel === 'audio' && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center gap-8 bg-black/85 px-8"
          onClick={() => setPanel(null)}
        >
          <div className="flex w-full max-w-xl gap-8" onClick={e => e.stopPropagation()}>
            <div className="flex-1">
              <p className="mb-3 text-[13px] font-bold uppercase tracking-wide text-[#a5a5a5]">Audio</p>
              {AUDIO.map(a => (
                <button
                  key={a}
                  onClick={() => setAudio(a)}
                  className={`block w-full py-2.5 text-left text-[16px] ${
                    a === audio ? 'font-bold text-white' : 'text-[#c2c2c2]'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <div className="flex-1">
              <p className="mb-3 text-[13px] font-bold uppercase tracking-wide text-[#a5a5a5]">Subtitles</p>
              {SUBS.map(s => (
                <button
                  key={s}
                  onClick={() => setSubs(s)}
                  className={`block w-full py-2.5 text-left text-[16px] ${
                    s === subs ? 'font-bold text-white' : 'text-[#c2c2c2]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
