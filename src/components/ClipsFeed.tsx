import React, { useEffect, useRef, useState } from 'react';
import { MediaPlayer, MediaProvider, type MediaPlayerInstance } from '@vidstack/react';
import '@vidstack/react/player/styles/base.css';
import { CLIPS, CLIP_CATEGORIES } from '../data/clips';
import { fetchClipUrl, fetchClips, addClipApi, getTitle } from '../services/api';
import { ClipItem } from '../types';
import { onImgError } from './Cards';
import { CheckIcon, PlusIcon, ShareIcon, VolumeOff, VolumeOn } from './Icons';

// Converts a YouTube URL or bare video ID into vidstack's "youtube/{id}" src format
function toYouTubeSrc(url?: string): string {
  if (!url) return '';
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return `youtube/${url}`;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? `youtube/${m[1]}` : url;
}

export const ClipsFeed: React.FC<{
  onOpen: (id: number) => void;
  onToggleList: (id: number) => void;
  inList: (id: number) => boolean;
}> = ({ onOpen, onToggleList, inList }) => {
  const [muted, setMuted] = useState(true);
  const [tab, setTab] = useState<'discover' | 'categories'>('discover');
  const [active, setActive] = useState(0);
  const [resolvedUrls, setResolvedUrls] = useState<Record<number, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRefs = useRef<(MediaPlayerInstance | null)[]>([]);

  const [clipsList, setClipsList] = useState<ClipItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newPoster, setNewPoster] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load clips from backend API, fall back to static CLIPS dataset
  useEffect(() => {
    fetchClips().then(items => {
      if (items && items.length > 0) {
        setClipsList(items);
      } else {
        setClipsList(CLIPS);
      }
    });
  }, []);

  // Resolve real video URLs via /api/clipurl (Nuelink API) — skip clips that are already YouTube links
  useEffect(() => {
    clipsList.forEach(clip => {
      if (clip.videoUrl && !/youtu\.?be/.test(clip.videoUrl)) {
        fetchClipUrl(clip.videoUrl).then(realUrl => {
          if (realUrl) {
            setResolvedUrls(prev => ({ ...prev, [clip.id]: realUrl }));
          }
        });
      }
    });
  }, [clipsList]);

  // play only whichever clip is on screen
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const idx = Number((entry.target as HTMLElement).dataset.idx);
          const player = playerRefs.current[idx];
          if (!player) return;
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            setActive(idx);
            player.play().catch(() => {});
          } else {
            player.pause();
          }
        });
      },
      { threshold: [0, 0.6, 1] }
    );
    containerRef.current?.querySelectorAll('[data-idx]').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [clipsList]);

  useEffect(() => {
    playerRefs.current.forEach(p => p && (p.muted = muted));
  }, [muted]);

  const handleVideoEnded = (idx: number) => {
    const nextIdx = idx + 1;
    if (nextIdx < clipsList.length && containerRef.current) {
      const nextSection = containerRef.current.querySelector(`[data-idx="${nextIdx}"]`);
      nextSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddClip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl && !newTitle) return;
    setIsSubmitting(true);
    const clipData = {
      title: newTitle || 'New Clip',
      videoUrl: newVideoUrl,
      poster: newPoster || 'https://picsum.photos/seed/clip-new/720/1280',
      tags: newTags ? newTags.split(',').map(t => t.trim()) : ['Trending'],
      description: newDesc || '',
      rating: 'U/A 16+'
    };
    const res = await addClipApi(clipData);
    if (res.success && res.item) {
      setClipsList(prev => [res.item!, ...prev]);
      setShowAddModal(false);
      setNewTitle('');
      setNewVideoUrl('');
      setNewPoster('');
      setNewTags('');
      setNewDesc('');
    } else {
      alert(res.error || 'Failed to add clip');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="relative h-full bg-black">
      {/* Discover / Categories / Add Clip Header */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-3">
        <div className="flex gap-2 mx-auto">
          <button
            onClick={() => setTab('discover')}
            className={`pointer-events-auto rounded-full px-5 py-[6px] text-[18px] font-bold ${
              tab === 'discover' ? 'bg-white/20 text-white backdrop-blur-sm' : 'text-white/85'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setTab('categories')}
            className={`pointer-events-auto rounded-full px-5 py-[6px] text-[18px] font-bold ${
              tab === 'categories' ? 'bg-white/20 text-white backdrop-blur-sm' : 'text-white/85'
            }`}
          >
            Categories
          </button>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg active:scale-95"
          title="Add New Clip from Web"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add</span>
        </button>
      </div>

      {tab === 'categories' ? (
        <div className="h-full overflow-y-auto px-4 pb-28 pt-20">
          <div className="grid grid-cols-2 gap-3">
            {CLIP_CATEGORIES.map((c, i) => (
              <button
                key={c}
                onClick={() => setTab('discover')}
                className="relative flex h-24 items-end overflow-hidden rounded-lg bg-[#1a1a1a] p-3 text-left"
              >
                <img
                  src={clipsList.length > 0 ? clipsList[i % clipsList.length].poster : 'https://picsum.photos/seed/clip/720/1280'}
                  onError={onImgError}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-45"
                />
                <span className="relative text-[17px] font-bold">{c}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="no-scrollbar h-full snap-y snap-mandatory overflow-y-scroll"
          style={{ scrollBehavior: 'smooth' }}
        >
          {clipsList.map((clip, idx) => {
            const linked = clip.titleId ? getTitle(clip.titleId) : null;
            const added = clip.titleId ? inList(clip.titleId) : false;
            return (
              <section key={clip.id} data-idx={idx} className="relative h-full w-full snap-start snap-always flex items-center justify-center bg-black overflow-hidden">
                <MediaPlayer
                  ref={(el: MediaPlayerInstance | null) => (playerRefs.current[idx] = el)}
                  src={toYouTubeSrc(resolvedUrls[clip.id] || clip.videoUrl)}
                  poster={clip.poster}
                  title={clip.title}
                  muted={muted}
                  playsInline
                  controls={false}
                  viewType="video"
                  streamType="on-demand"
                  onEnded={() => handleVideoEnded(idx)}
                  className="h-full w-full bg-black pointer-events-none [&_video]:object-contain"
                >
                  <MediaProvider />
                </MediaPlayer>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/45" />

                <span className="absolute right-3 top-[70px] rounded-[3px] bg-black/55 px-2 py-[3px] text-[12px] font-medium">
                  {clip.rating || 'U/A 16+'}
                </span>

                {/* right rail */}
                <div className="absolute bottom-[190px] right-3 z-20 flex flex-col items-center gap-4">
                  <button
                    onClick={() => setMuted(m => !m)}
                    aria-label={muted ? 'Unmute' : 'Mute'}
                    className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-white/15 backdrop-blur-sm active:scale-95"
                  >
                    {muted ? <VolumeOff className="h-6 w-6" /> : <VolumeOn className="h-6 w-6" />}
                  </button>
                  <button
                    onClick={() => clip.titleId && onToggleList(clip.titleId)}
                    aria-label="Add to My List"
                    className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-white/15 backdrop-blur-sm active:scale-95"
                  >
                    {added ? <CheckIcon className="h-6 w-6" /> : <PlusIcon className="h-7 w-7" />}
                  </button>
                  <button
                    onClick={() =>
                      navigator.share?.({ title: clip.title, text: clip.description }).catch(() => {})
                    }
                    aria-label="Share"
                    className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-white/15 backdrop-blur-sm active:scale-95"
                  >
                    <ShareIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => clip.titleId && onOpen(clip.titleId)}
                    className="mt-1 h-[62px] w-[62px] overflow-hidden rounded-full border-2 border-white/80"
                  >
                    <img
                      src={clip.poster || linked?.poster || 'https://picsum.photos/seed/clip/720/1280'}
                      onError={onImgError}
                      alt={clip.title}
                      className="h-full w-full object-cover"
                    />
                  </button>
                </div>

                {/* bottom info */}
                <div className="absolute bottom-[92px] left-0 z-10 w-[74%] px-4">
                  <button onClick={() => clip.titleId && onOpen(clip.titleId)} className="block text-left">
                    <h2 className="mb-1.5 text-[23px] font-bold leading-tight">{clip.title || linked?.title}</h2>
                  </button>
                  <p className="mb-2 text-[13px] font-bold text-white/95">{Array.isArray(clip.tags) ? clip.tags.join('  •  ') : clip.tags}</p>
                  <p className="text-[14.5px] leading-[1.35] text-white/95 line-clamp-4">{clip.description}</p>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Modal dialog to Add Clip from Web */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#181818] border border-white/10 p-6 text-white shadow-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
              <span>Add Clip from Web</span>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white text-lg font-bold">✕</button>
            </h3>
            <form onSubmit={handleAddClip} className="space-y-3.5">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Clip title"
                  className="w-full rounded-lg bg-[#262626] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Video URL / Instagram Reel / YouTube Shorts *</label>
                <input
                  type="text"
                  required
                  value={newVideoUrl}
                  onChange={e => setNewVideoUrl(e.target.value)}
                  placeholder="https://... or reel / shorts link"
                  className="w-full rounded-lg bg-[#262626] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Poster Image URL (optional)</label>
                <input
                  type="text"
                  value={newPoster}
                  onChange={e => setNewPoster(e.target.value)}
                  placeholder="https://image-url..."
                  className="w-full rounded-lg bg-[#262626] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  placeholder="Action, Thriller, Fan-favorite"
                  className="w-full rounded-lg bg-[#262626] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Short summary of this clip"
                  className="w-full rounded-lg bg-[#262626] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Add Clip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
