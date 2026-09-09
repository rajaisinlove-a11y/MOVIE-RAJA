import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Title, HERO_TITLES, TRENDING, MOVIES, SERIES, ANIME } from "../data/mockData";
import { useDebounce } from "../hooks/useDebounce";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onSelect: (title: Title) => void;
}

const ALL_TITLES = [...HERO_TITLES, ...TRENDING, ...MOVIES, ...SERIES, ...ANIME];
const RECENT_SEARCHES = ["cyberpunk", "anime 2025", "sci-fi horror", "medieval"];
const TRENDING_SEARCHES = ["Moonlit Blade", "Neon Nights", "Iron Crown", "space movies"];

export default function SearchOverlay({ open, onClose, onSelect }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 200);

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

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const results = useMemo(() => {
    if (!debounced.trim()) return [];
    const q = debounced.toLowerCase();
    const seen = new Set<string>();
    return ALL_TITLES.filter((t) => {
      const match =
        t.title.toLowerCase().includes(q) ||
        t.genres.some((g) => g.toLowerCase().includes(q)) ||
        t.description.toLowerCase().includes(q);
      if (match && !seen.has(t.id)) {
        seen.add(t.id);
        return true;
      }
      return false;
    }).slice(0, 12);
  }, [debounced]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-xl"
        >
          <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
            <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
              <Search className="h-7 w-7 text-zinc-500" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Titles, genres, cast, or keywords..."
                className="flex-1 bg-transparent text-2xl md:text-4xl font-bold text-white placeholder-zinc-700 focus:outline-none"
              />
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {query.trim() === "" ? (
              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-zinc-500">
                    <Clock className="h-4 w-4" /> Recent Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {RECENT_SEARCHES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-zinc-500">
                    <TrendingUp className="h-4 w-4" /> Trending
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="mt-16 text-center text-zinc-500">
                <p className="text-lg">No results for “{query}”</p>
                <p className="text-sm mt-2">Try a different keyword or check your spelling.</p>
              </div>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((t, idx) => (
                  <motion.button
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => {
                      onSelect(t);
                      onClose();
                    }}
                    className="flex items-center gap-4 rounded-xl bg-zinc-900/60 p-3 text-left hover:bg-zinc-800 transition-colors group"
                  >
                    <div className={`h-20 w-14 flex-shrink-0 rounded-lg bg-gradient-to-br ${t.posterGradient} overflow-hidden`}>
                      <img src={t.heroImage} alt={t.title} className="h-full w-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white truncate">{t.title}</p>
                      <p className="text-xs text-zinc-500">
                        {t.year} • {t.type} • {t.match}% match
                      </p>
                      <p className="mt-1 line-clamp-1 text-xs text-zinc-400">{t.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-white transition-colors" />
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
