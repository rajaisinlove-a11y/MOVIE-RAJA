import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Plus,
  Check,
  Download,
  X,
  Star,
  Calendar,
  Clock,
  Globe,
  Server,
  Subtitles,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Title, LANGUAGES, PROVIDERS } from "../data/mockData";

interface DetailModalProps {
  title: Title | null;
  open: boolean;
  onClose: () => void;
  onPlay: (title: Title) => void;
  onDownload: (title: Title) => void;
}

export default function DetailModal({ title, open, onClose, onPlay, onDownload }: DetailModalProps) {
  const [inList, setInList] = useState(false);
  const [lang, setLang] = useState(title?.language || "English");
  const [provider, setProvider] = useState(title?.providers[0] || PROVIDERS[0]);
  const [season, setSeason] = useState(1);
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);
  const [downloadMode, setDownloadMode] = useState<"single" | "season">("single");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (title) {
      setLang(title.language);
      setProvider(title.providers[0] || PROVIDERS[0]);
    }
  }, [title]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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

  if (!title) return null;

  const episodes = Array.from({ length: title.episodes || 8 }, (_, i) => ({
    number: i + 1,
    title: `${title.title} S0${season}E${String(i + 1).padStart(2, "0")}`,
    duration: "42 min",
  }));

  const handleDownload = () => {
    onDownload(title);
    setToast(downloadMode === "season" ? `Added ${title.title} Season ${season} to downloads` : `Added ${title.title} to downloads`);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-none md:rounded-2xl bg-zinc-900 shadow-2xl"
          >
            {/* Hero image header */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${title.posterGradient}`} />
              <img src={title.heroImage} alt={title.title} className="h-full w-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="mb-2 inline-block rounded bg-red-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                  {title.type}
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-xl">{title.title}</h2>
                <p className="mt-2 text-base md:text-lg italic text-zinc-200">{title.tagline}</p>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* Meta + Actions */}
              <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-zinc-300">
                <span className="flex items-center gap-1 text-green-400 font-semibold">{title.match}% Match</span>
                <span>{title.year}</span>
                <span className="rounded border border-white/30 px-1.5 py-0.5 text-xs">{title.maturity}</span>
                {title.duration && <span>{title.duration}</span>}
                {title.seasons && (
                  <span>
                    {title.seasons} Season{title.seasons > 1 ? "s" : ""}
                  </span>
                )}
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-yellow-400" />
                  {title.rating}
                </span>
              </div>

              <p className="text-base leading-relaxed text-zinc-300 md:text-lg">{title.description}</p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onPlay(title)}
                  className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-bold text-black transition-transform hover:scale-105 hover:bg-zinc-200"
                >
                  <Play className="h-5 w-5 fill-black" />
                  Play Now
                </button>
                <button
                  onClick={() => setInList(!inList)}
                  className={`flex items-center gap-2 rounded-lg px-5 py-3 text-base font-bold transition-all border ${
                    inList
                      ? "bg-white/10 border-white text-white"
                      : "border-white/30 text-white hover:bg-white/10"
                  }`}
                >
                  {inList ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  {inList ? "In My List" : "My List"}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3 text-base font-bold text-white transition-all hover:bg-white/10"
                >
                  <Download className="h-5 w-5" />
                  Download
                </button>
              </div>

              {/* Options grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Provider */}
                <div className="rounded-xl bg-zinc-800/50 p-4">
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                    <Server className="h-4 w-4" /> Source
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none"
                  >
                    {title.providers.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                    {PROVIDERS.filter((p) => !title.providers.includes(p)).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Language */}
                <div className="rounded-xl bg-zinc-800/50 p-4">
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                    <Globe className="h-4 w-4" /> Audio / Language
                  </label>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none"
                  >
                    {title.languages.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                    {LANGUAGES.filter((l) => !title.languages.includes(l.name)).map((l) => (
                      <option key={l.code} value={l.name}>{l.name}</option>
                    ))}
                  </select>
                </div>

                {/* Subtitles */}
                <div className="rounded-xl bg-zinc-800/50 p-4">
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                    <Subtitles className="h-4 w-4" /> Subtitles
                  </label>
                  <select className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none">
                    <option>Auto ({lang})</option>
                    <option>Off</option>
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.name}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Season + Episodes */}
              {title.type !== "movie" && title.seasons && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-red-500" />
                      Episodes
                    </h3>
                    <select
                      value={season}
                      onChange={(e) => setSeason(Number(e.target.value))}
                      className="rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-sm text-white focus:border-red-600 focus:outline-none"
                    >
                      {Array.from({ length: title.seasons }, (_, i) => (
                        <option key={i + 1} value={i + 1}>Season {i + 1}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    {episodes.slice(0, showAllEpisodes ? undefined : 4).map((ep) => (
                      <div
                        key={ep.number}
                        className="group flex items-center gap-4 rounded-xl bg-zinc-800/30 p-3 hover:bg-zinc-800/60 transition-colors"
                      >
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-zinc-400 group-hover:bg-red-600 group-hover:text-white transition-colors">
                          {ep.number}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{ep.title}</p>
                          <p className="text-xs text-zinc-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {ep.duration}
                          </p>
                        </div>
                        <button
                          onClick={() => onPlay(title)}
                          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
                        >
                          <Play className="h-4 w-4 fill-white" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {episodes.length > 4 && (
                    <button
                      onClick={() => setShowAllEpisodes(!showAllEpisodes)}
                      className="flex w-full items-center justify-center gap-1 rounded-lg bg-zinc-800/50 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      {showAllEpisodes ? "Show Less" : `Show All ${episodes.length} Episodes`}
                      <ChevronDown className={`h-4 w-4 transition-transform ${showAllEpisodes ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>
              )}

              {/* Download options */}
              <div className="rounded-xl bg-zinc-800/30 p-4 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-500">Download Options</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setDownloadMode("single")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      downloadMode === "single" ? "bg-red-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {title.type === "movie" ? "This Movie" : "Single Episode"}
                  </button>
                  {title.type !== "movie" && (
                    <button
                      onClick={() => setDownloadMode("season")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        downloadMode === "season" ? "bg-red-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      Entire Season
                    </button>
                  )}
                </div>
                <p className="text-xs text-zinc-500">
                  Downloads use HTTP range resume and are organized into Movies/ or Series/ folders.
                </p>
              </div>

              {/* Cast / Info */}
              {(title.cast || title.director) && (
                <div className="grid gap-4 border-t border-zinc-800 pt-6 text-sm text-zinc-400 sm:grid-cols-2">
                  {title.cast && (
                    <div>
                      <span className="font-semibold text-zinc-200">Cast:</span> {title.cast.join(", ")}
                    </div>
                  )}
                  {title.director && (
                    <div>
                      <span className="font-semibold text-zinc-200">Director:</span> {title.director}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-zinc-200">Genres:</span> {title.genres.join(", ")}
                  </div>
                </div>
              )}
            </div>

            {/* Toast */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {toast}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
