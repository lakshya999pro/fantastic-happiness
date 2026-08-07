import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HomeData, PlayTarget, TitleItem, triggerNativePlay } from './types';
import {
  fetchCatalog,
  fetchGenres,
  fetchHome,
  getTitle,
  loadState,
  saveState
} from './services/api';
import { BottomNav, Tab } from './components/BottomNav';
import { BrowseMode, CategoriesSheet, HomeTopBar, PillBar } from './components/TopNav';
import { HeroBanner } from './components/HeroBanner';
import { RowSection } from './components/Cards';
import { SearchTab } from './components/SearchTab';
import { ClipsFeed } from './components/ClipsFeed';
import { MyNetflix } from './components/MyNetflix';
import { DetailScreen } from './components/DetailScreen';
import { PlayerScreen } from './components/PlayerScreen';
import { AppSettings, EditProfile, ProfileSheet, SimpleScreen } from './components/ProfileScreens';
import {
  BrowseGrid,
  DownloadsScreen,
  GamesScreen,
  NewHotScreen,
  NotificationsScreen
} from './components/BrowseScreens';

/** Ambient colour behind the Home header, like the app's artwork-tinted top. */
const TINTS = ['#2a0d16', '#0d2226', '#1b1030', '#2a1a08', '#101c2e'];

type Overlay = null | 'profile' | 'settings' | 'editProfile' | 'downloads' | 'notifications' | 'account' | 'help' | 'categories';

export const App: React.FC = () => {
  const [tab, setTab] = useState<Tab>('home');
  const [home, setHome] = useState<HomeData | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);

  const [mode, setMode] = useState<BrowseMode>(null);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [browse, setBrowse] = useState<{ items: TitleItem[]; total: number; loading: boolean }>({
    items: [],
    total: 0,
    loading: false
  });

  const [myList, setMyList] = useState<number[]>(() => loadState<number[]>('nf_myList', []));
  const [watched, setWatched] = useState<number[]>(() => loadState<number[]>('nf_watched', []));
  const [profileName, setProfileName] = useState<string>(() => loadState<string>('nf_profileName', 'batz9pro'));

  const [detailStack, setDetailStack] = useState<number[]>([]);
  const [playTarget, setPlayTarget] = useState<PlayTarget | null>(null);
  const [overlay, setOverlay] = useState<Overlay>(null);

  const mainRef = useRef<HTMLDivElement>(null);

  /* ---------------- data ---------------- */
  useEffect(() => {
    fetchHome().then(setHome).catch(err => console.error('Home failed:', err));
    fetchGenres().then(setGenres).catch(() => {});
  }, []);

  useEffect(() => {
    if (mode !== 'shows' && mode !== 'movies' && !activeGenre) return;
    setBrowse(b => ({ ...b, loading: true }));
    const params = activeGenre
      ? { genre: activeGenre, limit: 60 }
      : { type: (mode === 'movies' ? 'movie' : 'tvshow') as 'movie' | 'tvshow', limit: 60 };
    fetchCatalog(params)
      .then(res => setBrowse({ items: res.items, total: res.total, loading: false }))
      .catch(() => setBrowse({ items: [], total: 0, loading: false }));
  }, [mode, activeGenre]);

  /* ---------------- persistence ---------------- */
  useEffect(() => saveState('nf_myList', myList), [myList]);
  useEffect(() => saveState('nf_watched', watched), [watched]);
  useEffect(() => saveState('nf_profileName', profileName), [profileName]);

  /* ---------------- hardware / browser back ---------------- */
  useEffect(() => {
    const onPop = () => {
      if (playTarget) setPlayTarget(null);
      else if (overlay) setOverlay(null);
      else if (detailStack.length) setDetailStack(s => s.slice(0, -1));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [playTarget, overlay, detailStack.length]);

  const pushHistory = (hash: string) => {
    try {
      window.history.pushState({}, '', `#${hash}`);
    } catch {
      /* file:// or a sandboxed iframe — navigation still works via the UI */
    }
  };

  /* ---------------- actions ---------------- */
  const openDetail = useCallback((id: number) => {
    setDetailStack(s => (s[s.length - 1] === id ? s : [...s, id]));
    setWatched(w => [id, ...w.filter(x => x !== id)].slice(0, 40));
    pushHistory(`title-${id}`);
  }, []);

  const closeDetail = () => setDetailStack(s => s.slice(0, -1));

  const play = useCallback((id: number, season = 1, episode = 1) => {
    const t = getTitle(id);
    const isSeries = t?.type === 'series' || t?.type === 'tvshow';
    const title = t?.title || '';
    setWatched(w => [id, ...w.filter(x => x !== id)].slice(0, 40));

    const target: PlayTarget = { id, isSeries: !!isSeries, season, episode };
    if (triggerNativePlay(target, title)) {
      return;
    }

    setPlayTarget(target);
    pushHistory(`play-${id}`);
  }, []);

  const toggleList = useCallback((id: number) => {
    setMyList(list => (list.includes(id) ? list.filter(x => x !== id) : [id, ...list]));
  }, []);

  const inList = useCallback((id: number) => myList.includes(id), [myList]);

  const resetBrowse = () => {
    setMode(null);
    setActiveGenre(null);
    mainRef.current?.scrollTo({ top: 0 });
  };

  /* ---------------- derived ---------------- */
  const myListTitles = useMemo(
    () => myList.map(getTitle).filter(Boolean) as TitleItem[],
    [myList, home]
  );
  const watchedTitles = useMemo(
    () => watched.map(getTitle).filter(Boolean) as TitleItem[],
    [watched, home]
  );
  const notificationItems = useMemo(() => home?.rows.find(r => r.name === 'New on Netflix')?.items || [], [home]);

  const browsing = mode === 'shows' || mode === 'movies' || !!activeGenre;
  const tint = TINTS[heroIndex % TINTS.length];

  return (
    <div className="mx-auto flex h-full max-w-md flex-col bg-black">
      <main
        ref={mainRef}
        className={`no-scrollbar relative flex-1 ${tab === 'clips' ? 'overflow-hidden' : 'overflow-y-auto'}`}
      >
        {/* ---------------- HOME ---------------- */}
        {tab === 'home' && (
          <div className="relative">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-[420px] transition-colors duration-700"
              style={{ background: `linear-gradient(to bottom, ${tint} 0%, rgba(0,0,0,0) 100%)` }}
            />
            <div className="relative">
              <HomeTopBar
                title={activeGenre || (mode === 'games' ? 'Games' : mode === 'newhot' ? 'New & Hot' : 'Home')}
                onDownloads={() => setOverlay('downloads')}
                onNotifications={() => setOverlay('notifications')}
              />
              <PillBar
                mode={mode}
                activeGenre={activeGenre}
                genres={genres}
                onMode={m => {
                  setActiveGenre(null);
                  setMode(m);
                  mainRef.current?.scrollTo({ top: 0 });
                }}
                onGenre={g => {
                  setMode(g ? 'genre' : null);
                  setActiveGenre(g);
                  mainRef.current?.scrollTo({ top: 0 });
                }}
                onOpenCategories={() => setOverlay('categories')}
              />

              {mode === 'games' ? (
                <GamesScreen />
              ) : mode === 'newhot' ? (
                <NewHotScreen onOpen={openDetail} onPlay={id => play(id)} />
              ) : browsing ? (
                <BrowseGrid
                  heading={activeGenre || (mode === 'movies' ? 'Movies' : 'Shows')}
                  items={browse.items}
                  total={browse.total}
                  loading={browse.loading}
                  onOpen={openDetail}
                />
              ) : !home ? (
                <div className="flex justify-center py-24">
                  <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-nfred" />
                </div>
              ) : (
                <div className="pb-24">
                  <HeroBanner
                    slides={home.heroes}
                    onPlay={id => play(id)}
                    onOpen={openDetail}
                    onToggleList={toggleList}
                    inList={inList}
                    onIndexChange={setHeroIndex}
                  />
                  {watchedTitles.length > 0 && (
                    <RowSection
                      row={{
                        key: 'continue',
                        name: `Continue Watching for ${profileName}`,
                        style: 'poster',
                        items: watchedTitles
                      }}
                      onOpen={openDetail}
                    />
                  )}
                  {home.rows.map(row => (
                    <RowSection key={row.key} row={row} onOpen={openDetail} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- CLIPS ---------------- */}
        {tab === 'clips' && <ClipsFeed onOpen={openDetail} onToggleList={toggleList} inList={inList} />}

        {/* ---------------- SEARCH ---------------- */}
        {tab === 'search' && <SearchTab onOpen={openDetail} onPlay={id => play(id)} />}

        {/* ---------------- MY NETFLIX ---------------- */}
        {tab === 'my' && (
          <MyNetflix
            profileName={profileName}
            myList={myListTitles}
            watched={watchedTitles}
            onOpen={openDetail}
            onProfile={() => setOverlay('profile')}
            onDownloads={() => setOverlay('downloads')}
            onNotifications={() => setOverlay('notifications')}
          />
        )}
      </main>

      {!playTarget && <BottomNav active={tab} onChange={t => { setTab(t); resetBrowse(); }} />}

      {/* ---------------- overlays ---------------- */}
      {detailStack.length > 0 && (
        <DetailScreen
          key={detailStack[detailStack.length - 1]}
          titleId={detailStack[detailStack.length - 1]}
          onClose={closeDetail}
          onPlay={play}
          onOpen={openDetail}
          onToggleList={toggleList}
          inList={inList}
        />
      )}

      {playTarget && (
        <PlayerScreen target={playTarget} onClose={() => setPlayTarget(null)} onChangeTarget={setPlayTarget} />
      )}

      {overlay === 'profile' && (
        <ProfileSheet
          name={profileName}
          onClose={() => setOverlay(null)}
          onEditProfile={() => setOverlay('editProfile')}
          onAppSettings={() => setOverlay('settings')}
          onAccount={() => setOverlay('account')}
          onHelp={() => setOverlay('help')}
          onSignOut={() => setOverlay(null)}
        />
      )}
      {overlay === 'settings' && <AppSettings onBack={() => setOverlay('profile')} />}
      {overlay === 'editProfile' && (
        <EditProfile name={profileName} onName={setProfileName} onBack={() => setOverlay('profile')} />
      )}
      {overlay === 'downloads' && (
        <DownloadsScreen
          onBack={() => setOverlay(null)}
          onBrowse={() => {
            setOverlay(null);
            setTab('home');
            resetBrowse();
          }}
        />
      )}
      {overlay === 'notifications' && (
        <NotificationsScreen
          items={notificationItems}
          onBack={() => setOverlay(null)}
          onOpen={id => {
            setOverlay(null);
            openDetail(id);
          }}
        />
      )}
      {overlay === 'categories' && (
        <CategoriesSheet
          activeGenre={activeGenre}
          genres={genres}
          onClose={() => setOverlay(null)}
          onSelectGenre={g => {
            setMode(g ? 'genre' : null);
            setActiveGenre(g);
            setOverlay(null);
            mainRef.current?.scrollTo({ top: 0 });
          }}
        />
      )}
      {overlay === 'account' && (
        <SimpleScreen
          title="Account"
          message={`Signed in as ${profileName}. Plan, payment and membership settings live on netflix.com/account.`}
          onBack={() => setOverlay('profile')}
        />
      )}
      {overlay === 'help' && (
        <SimpleScreen
          title="Help"
          message="Having trouble? Check your connection, then restart the app. This is a school project build of the Netflix mobile interface."
          onBack={() => setOverlay('profile')}
        />
      )}
    </div>
  );
};
