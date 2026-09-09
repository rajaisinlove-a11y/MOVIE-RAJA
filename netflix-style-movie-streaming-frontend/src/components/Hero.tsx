import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Plus, Check, Volume2, VolumeX, ChevronRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { HERO_TITLES, Title } from "../data/mockData";

interface HeroProps {
  onPlay: (title: Title) => void;
  onDetails: (title: Title) => void;
  onDownload: (title: Title) => void;
}

export default function Hero({ onPlay, onDetails, onDownload }: HeroProps) {
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [inMyList, setInMyList] = useState<Set<string>>(new Set());

  const current = HERO_TITLES[index];

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % HERO_TITLES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next]);

  const toggleList = (id: string) => {
    setInMyList((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="relative h-[70vh] min-h-[520px] w-full overflow-hidden md:h-[85vh]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${current.posterGradient} transition-colors duration-1000`}
          />
          <img
            src={current.heroImage}
            alt={current.title}
            className="absolute inset-0 h-full w-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Mute toggle */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute top-24 right-6 z-20 hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm hover:bg-white/10 transition-colors"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-end">
        <div className="mx-auto w-full max-w-[1920px] px-4 pb-16 md:px-8 md:pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-red-900/30">
                  {current.type === "movie" ? "Movie" : current.type === "series" ? "Series" : current.type === "anime" ? "Anime" : "Live"}
                </span>
                <span className="text-sm font-semibold text-green-400">{current.match}% Match</span>
                <span className="text-sm text-zinc-300">{current.year}</span>
                <span className="rounded border border-white/30 px-1.5 py-0.5 text-xs text-zinc-300">{current.maturity}</span>
                {current.duration && <span className="text-sm text-zinc-300">{current.duration}</span>}
                {current.seasons && (
                  <span className="text-sm text-zinc-300">
                    {current.seasons} Season{current.seasons > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <h1 className="mb-3 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl lg:text-7xl drop-shadow-2xl">
                {current.title}
              </h1>
              <p className="mb-2 text-lg font-medium italic text-zinc-200 md:text-xl">{current.tagline}</p>
              <p className="mb-8 line-clamp-3 text-base leading-relaxed text-zinc-300 md:text-lg">
                {current.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <button
                  onClick={() => onPlay(current)}
                  className="group flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-bold text-black transition-transform hover:scale-105 hover:bg-zinc-200 md:px-8 md:py-3.5 md:text-lg"
                >
                  <Play className="h-5 w-5 fill-black" />
                  Play Now
                </button>
                <button
                  onClick={() => onDetails(current)}
                  className="group flex items-center gap-2 rounded-lg bg-white/15 px-6 py-3 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/25 hover:scale-105 md:px-8 md:py-3.5 md:text-lg"
                >
                  <Info className="h-5 w-5" />
                  More Info
                </button>
                <button
                  onClick={() => toggleList(current.id)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                    inMyList.has(current.id)
                      ? "border-white bg-white/20 text-white"
                      : "border-white/40 text-white hover:border-white hover:bg-white/10"
                  }`}
                >
                  {inMyList.has(current.id) ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => onDownload(current)}
                  className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/40 text-white hover:border-white hover:bg-white/10 transition-all"
                  title="Download"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
                {current.genres.map((g) => (
                  <span key={g} className="flex items-center gap-2">
                    <span className="text-zinc-600">•</span>
                    {g}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Carousel indicators */}
      <div className="absolute bottom-6 right-4 z-20 flex items-center gap-2 md:right-8">
        {HERO_TITLES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-red-600" : "w-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
        <button
          onClick={next}
          className="ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
