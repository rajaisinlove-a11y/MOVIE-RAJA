import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ContentRow from "./components/ContentRow";
import DetailModal from "./components/DetailModal";
import PlayerModal from "./components/PlayerModal";
import DownloadsPanel from "./components/DownloadsPanel";
import SettingsPanel from "./components/SettingsPanel";
import LiveTVGrid from "./components/LiveTVGrid";
import AddonGrid from "./components/AddonGrid";
import SearchOverlay from "./components/SearchOverlay";
import Footer from "./components/Footer";
import { Title, HERO_TITLES, TRENDING, MOVIES, SERIES, ANIME } from "./data/mockData";

const SECTIONS = [
  { title: "Trending Now", items: TRENDING },
  { title: "Top Movies", items: MOVIES },
  { title: "Binge-Worthy Series", items: SERIES },
  { title: "Anime Picks", items: ANIME, size: "large" as const },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [playerTitle, setPlayerTitle] = useState<Title | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [downloadsOpen, setDownloadsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [language, setLanguage] = useState("en");

  // Welcome animation state
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 2200);
    return () => clearTimeout(t);
  }, []);

  const handlePlay = (title: Title) => {
    setPlayerTitle(title);
    setPlayerOpen(true);
    setDetailOpen(false);
  };

  const handleDetails = (title: Title) => {
    setSelectedTitle(title);
    setDetailOpen(true);
  };

  const handleDownload = (_title: Title) => {
    setDownloadsOpen(true);
    // In a real app this would call the backend download API with _title
  };

  const handleSearchSelect = (title: Title) => {
    setSelectedTitle(title);
    setDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Intro splash */}
      <AnimatePresence>
        {intro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-2xl shadow-red-900/50 pulse-glow">
                <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M10 4v4" />
                  <path d="M2 8h20" />
                  <path d="M6 4v4" />
                </svg>
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-white">MovieBox</h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenDownloads={() => setDownloadsOpen(true)}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="pt-0">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Hero onPlay={handlePlay} onDetails={handleDetails} onDownload={handleDownload} />
              {SECTIONS.map((section, idx) => (
                <ContentRow
                  key={section.title}
                  title={section.title}
                  items={section.items}
                  onPlay={handlePlay}
                  onDetails={handleDetails}
                  onDownload={handleDownload}
                  size={section.size || "normal"}
                  delay={idx * 0.1}
                />
              ))}
            </motion.div>
          )}

          {activeTab === "movies" && (
            <motion.div
              key="movies"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-24"
            >
              <PageHeader title="Movies" subtitle="The biggest blockbusters and hidden gems." />
              <ContentRow title="All Movies" items={MOVIES} onPlay={handlePlay} onDetails={handleDetails} onDownload={handleDownload} size="large" />
              <ContentRow title="Trending in Movies" items={TRENDING.filter((t) => t.type === "movie" || t.type === "series")} onPlay={handlePlay} onDetails={handleDetails} onDownload={handleDownload} />
            </motion.div>
          )}

          {activeTab === "series" && (
            <motion.div
              key="series"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-24"
            >
              <PageHeader title="Series" subtitle="Binge entire seasons without interruption." />
              <ContentRow title="All Series" items={SERIES} onPlay={handlePlay} onDetails={handleDetails} onDownload={handleDownload} size="large" />
              <ContentRow title="Crime & Thriller" items={SERIES.filter((t) => t.genres.some((g) => ["Crime", "Thriller"].includes(g)))} onPlay={handlePlay} onDetails={handleDetails} onDownload={handleDownload} />
            </motion.div>
          )}

          {activeTab === "anime" && (
            <motion.div
              key="anime"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-24"
            >
              <PageHeader title="Anime" subtitle="Simulcasts, classics, and everything in between." />
              <ContentRow title="All Anime" items={ANIME} onPlay={handlePlay} onDetails={handleDetails} onDownload={handleDownload} size="large" />
            </motion.div>
          )}

          {activeTab === "live" && (
            <motion.div
              key="live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-20"
            >
              <LiveTVGrid
                onPlayChannel={(channel) => {
                  const liveTitle: Title = {
                    ...HERO_TITLES[0],
                    id: channel.id,
                    title: channel.name,
                    description: `Now playing: ${channel.nowPlaying}`,
                    type: "live",
                    isLive: true,
                    channel: channel.name,
                  };
                  handlePlay(liveTitle);
                }}
              />
            </motion.div>
          )}

          {activeTab === "addons" && (
            <motion.div
              key="addons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-20"
            >
              <AddonGrid />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      <DetailModal
        title={selectedTitle}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onPlay={handlePlay}
        onDownload={handleDownload}
      />

      <PlayerModal
        title={playerTitle}
        open={playerOpen}
        onClose={() => setPlayerOpen(false)}
      />

      <DownloadsPanel open={downloadsOpen} onClose={() => setDownloadsOpen(false)} />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onSelect={handleSearchSelect} />
    </div>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto max-w-[1920px] px-4 pb-6 md:px-8 md:pb-8">
      <h1 className="text-3xl font-black text-white md:text-5xl">{title}</h1>
      <p className="mt-2 text-base text-zinc-400 md:text-lg">{subtitle}</p>
    </div>
  );
}
