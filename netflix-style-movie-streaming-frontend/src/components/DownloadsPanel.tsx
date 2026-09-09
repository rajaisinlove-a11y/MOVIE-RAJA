import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Trash2, FolderOpen, HardDrive, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { DOWNLOADS, SETTINGS } from "../data/mockData";

interface DownloadsPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function DownloadsPanel({ open, onClose }: DownloadsPanelProps) {
  const [downloads, setDownloads] = useState(DOWNLOADS);
  const [filter, setFilter] = useState<"all" | "downloading" | "completed" | "queued">("all");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
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
    if (!open) return;
    const interval = setInterval(() => {
      setDownloads((prev) =>
        prev.map((d) => {
          if (d.status === "downloading") {
            const next = Math.min(d.progress + 0.4, 100);
            return {
              ...d,
              progress: next,
              status: next >= 100 ? "completed" : "downloading",
              speed: next >= 100 ? "" : d.speed,
              eta: next >= 100 ? "" : d.eta,
            };
          }
          return d;
        })
      );
    }, 1200);
    return () => clearInterval(interval);
  }, [open]);

  const remove = (id: string) => setDownloads((prev) => prev.filter((d) => d.id !== id));

  const filtered = downloads.filter((d) => filter === "all" || d.status === filter);

  const stats = {
    total: downloads.length,
    completed: downloads.filter((d) => d.status === "completed").length,
    downloading: downloads.filter((d) => d.status === "downloading").length,
    queued: downloads.filter((d) => d.status === "queued").length,
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-md bg-zinc-900 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20 text-red-500">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Downloads</h2>
                  <p className="text-xs text-zinc-500">{SETTINGS.downloadPath}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 border-b border-zinc-800 p-4">
              {[
                { label: "Completed", value: stats.completed },
                { label: "Active", value: stats.downloading },
                { label: "Queued", value: stats.queued },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-zinc-800/50 p-3 text-center">
                  <p className="text-lg font-bold text-white">{s.value}</p>
                  <p className="text-[10px] uppercase tracking-wide text-zinc-500">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto p-4 no-scrollbar">
              {(["all", "downloading", "completed", "queued"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    filter === f ? "bg-white text-black" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-3 no-scrollbar">
              {filtered.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center gap-3 text-zinc-500">
                  <HardDrive className="h-10 w-10 opacity-50" />
                  <p className="text-sm">No downloads in this section</p>
                </div>
              ) : (
                filtered.map((d) => (
                  <motion.div
                    layout
                    key={d.id}
                    className="rounded-xl bg-zinc-800/40 p-4 border border-zinc-800"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-white">{d.title}</h3>
                        <p className="mt-0.5 text-xs text-zinc-500">{d.size}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {d.status === "completed" && (
                          <button className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors" title="Play">
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => remove(d.id)}
                          className="p-1.5 rounded-full text-zinc-400 hover:text-red-400 hover:bg-white/10 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className={`font-medium ${
                          d.status === "completed" ? "text-green-400" : d.status === "downloading" ? "text-blue-400" : "text-zinc-400"
                        }`}>
                          {d.status === "completed" ? "Completed" : d.status === "downloading" ? "Downloading" : "Queued"}
                        </span>
                        <span className="text-zinc-500">{Math.round(d.progress)}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${d.progress}%` }}
                          className={`h-full rounded-full ${
                            d.status === "completed" ? "bg-green-500" : d.status === "downloading" ? "bg-blue-500" : "bg-zinc-600"
                          }`}
                        />
                      </div>
                      {d.status === "downloading" && (
                        <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-500">
                          <span>{d.speed}</span>
                          <span>{d.eta} remaining</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-800 p-4">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-800 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-700 transition-colors">
                <FolderOpen className="h-4 w-4" />
                Open Download Folder
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
