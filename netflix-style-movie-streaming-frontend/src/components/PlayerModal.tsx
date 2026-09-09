import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Subtitles, Settings, Cast, Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Title } from "../data/mockData";

interface PlayerModalProps {
  title: Title | null;
  open: boolean;
  onClose: () => void;
}

export default function PlayerModal({ title, open, onClose }: PlayerModalProps) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [showControls, setShowControls] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setPlaying(false);
      setProgress(0);
      const t = setTimeout(() => {
        setLoading(false);
        setPlaying(true);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [open, title?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.3));
    }, 1000);
    return () => clearInterval(interval);
  }, [playing]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  if (!title) return null;

  const formatTime = (pct: number) => {
    const total = title.duration ? (parseInt(title.duration) || 120) * 60 : 7200;
    const seconds = Math.floor((pct / 100) * total);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
          onMouseMove={handleMouseMove}
        >
          {/* Video area */}
          <div className="relative w-full h-full">
            <div className={`absolute inset-0 bg-gradient-to-br ${title.posterGradient}`} />
            <img
              src={title.heroImage}
              alt={title.title}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-40" : "opacity-70"}`}
            />

            {/* Center play / loading */}
            <div className="absolute inset-0 flex items-center justify-center">
              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-red-500" />
                  <p className="text-sm text-zinc-300">Resolving stream from {title.providers[0]}...</p>
                </div>
              ) : (
                <button
                  onClick={() => setPlaying(!playing)}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:scale-110 hover:bg-white/20 transition-all"
                >
                  {playing ? <Pause className="h-8 w-8 fill-white" /> : <Play className="h-8 w-8 fill-white ml-1" />}
                </button>
              )}
            </div>

            {/* Top bar */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 md:p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-white">{title.title}</h2>
                      <p className="text-sm text-zinc-400">{title.type === "movie" ? title.duration : `S01E01 • ${title.duration || "42 min"}`}</p>
                    </div>
                    <button
                      onClick={onClose}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom controls */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 md:p-6"
                >
                  {/* Progress bar */}
                  <div className="mb-4 group">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={progress}
                      onChange={(e) => setProgress(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-red-600"
                      style={{
                        background: `linear-gradient(to right, #dc2626 ${progress}%, rgba(255,255,255,0.2) ${progress}%)`,
                      }}
                    />
                    <div className="mt-1 flex justify-between text-xs text-zinc-400">
                      <span>{formatTime(progress)}</span>
                      <span>{title.duration || "1:59:00"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-4">
                      <button
                        onClick={() => setPlaying(!playing)}
                        className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white text-black hover:bg-zinc-200 transition-colors"
                      >
                        {playing ? <Pause className="h-5 w-5 fill-black" /> : <Play className="h-5 w-5 fill-black ml-0.5" />}
                      </button>
                      <button className="p-2 text-white/70 hover:text-white transition-colors">
                        <SkipBack className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-white/70 hover:text-white transition-colors">
                        <SkipForward className="h-5 w-5" />
                      </button>

                      <div className="hidden md:flex items-center gap-2 group">
                        <Volume2 className="h-5 w-5 text-white/70" />
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={volume}
                          onChange={(e) => setVolume(Number(e.target.value))}
                          className="w-20 h-1 bg-white/20 rounded-full accent-red-600"
                          style={{
                            background: `linear-gradient(to right, #fff ${volume}%, rgba(255,255,255,0.2) ${volume}%)`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1 md:gap-3">
                      <button className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors" title="Subtitles">
                        <Subtitles className="h-5 w-5" />
                      </button>
                      <button className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors" title="Audio / Quality">
                        <Settings className="h-5 w-5" />
                      </button>
                      <button className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors" title="Cast">
                        <Cast className="h-5 w-5" />
                      </button>
                      <button className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors" title="Fullscreen">
                        <Maximize className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
