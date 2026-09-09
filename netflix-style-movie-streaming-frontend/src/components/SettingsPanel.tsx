import { motion, AnimatePresence } from "framer-motion";
import { X, Monitor, HardDrive, Globe, Type, Zap, Subtitles, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { LANGUAGES, PROVIDERS } from "../data/mockData";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const [settings, setSettings] = useState({
    player: "mpv",
    downloadPath: "~/Downloads/MovieBox",
    quality: "1080p",
    theme: "Dark",
    autoSubtitles: true,
    subtitleLang: "English",
    resumePlayback: true,
    hardwareAcceleration: true,
    defaultProvider: "MovieBox",
    contentMode: "All",
  });

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

  const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="space-y-4 border-b border-zinc-800 pb-6 last:border-0">
      <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-zinc-500">
        <Icon className="h-4 w-4" />
        {title}
      </h3>
      {children}
    </div>
  );

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      {children}
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-none md:rounded-2xl bg-zinc-900 shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/95 backdrop-blur p-5">
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-8">
              <Section title="Media Player" icon={Monitor}>
                <Row label="Default player">
                  <select
                    value={settings.player}
                    onChange={(e) => setSettings({ ...settings, player: e.target.value })}
                    className="w-full sm:w-56 rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none"
                  >
                    {["mpv", "VLC", "IINA"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </Row>
                <Row label="Hardware acceleration">
                  <button
                    onClick={() => setSettings({ ...settings, hardwareAcceleration: !settings.hardwareAcceleration })}
                    className={`relative h-6 w-11 rounded-full transition-colors ${settings.hardwareAcceleration ? "bg-red-600" : "bg-zinc-700"}`}
                  >
                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${settings.hardwareAcceleration ? "left-6" : "left-1"}`} />
                  </button>
                </Row>
                <Row label="Resume playback">
                  <button
                    onClick={() => setSettings({ ...settings, resumePlayback: !settings.resumePlayback })}
                    className={`relative h-6 w-11 rounded-full transition-colors ${settings.resumePlayback ? "bg-red-600" : "bg-zinc-700"}`}
                  >
                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${settings.resumePlayback ? "left-6" : "left-1"}`} />
                  </button>
                </Row>
              </Section>

              <Section title="Downloads" icon={HardDrive}>
                <Row label="Download folder">
                  <div className="flex w-full sm:w-56 items-center gap-2">
                    <input
                      type="text"
                      value={settings.downloadPath}
                      onChange={(e) => setSettings({ ...settings, downloadPath: e.target.value })}
                      className="flex-1 rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </Row>
                <Row label="Preferred quality">
                  <select
                    value={settings.quality}
                    onChange={(e) => setSettings({ ...settings, quality: e.target.value })}
                    className="w-full sm:w-56 rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none"
                  >
                    {["4K", "1080p", "720p", "480p"].map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </Row>
              </Section>

              <Section title="Content & Sources" icon={Globe}>
                <Row label="Default provider">
                  <select
                    value={settings.defaultProvider}
                    onChange={(e) => setSettings({ ...settings, defaultProvider: e.target.value })}
                    className="w-full sm:w-56 rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none"
                  >
                    {PROVIDERS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </Row>
                <Row label="Content mode">
                  <select
                    value={settings.contentMode}
                    onChange={(e) => setSettings({ ...settings, contentMode: e.target.value })}
                    className="w-full sm:w-56 rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none"
                  >
                    {["All", "Movies", "Series", "Anime", "Live TV"].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </Row>
              </Section>

              <Section title="Subtitles" icon={Subtitles}>
                <Row label="Auto-download subtitles">
                  <button
                    onClick={() => setSettings({ ...settings, autoSubtitles: !settings.autoSubtitles })}
                    className={`relative h-6 w-11 rounded-full transition-colors ${settings.autoSubtitles ? "bg-red-600" : "bg-zinc-700"}`}
                  >
                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${settings.autoSubtitles ? "left-6" : "left-1"}`} />
                  </button>
                </Row>
                <Row label="Subtitle language">
                  <select
                    value={settings.subtitleLang}
                    onChange={(e) => setSettings({ ...settings, subtitleLang: e.target.value })}
                    className="w-full sm:w-56 rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.name}>{l.flag} {l.name}</option>
                    ))}
                  </select>
                </Row>
              </Section>

              <Section title="Appearance" icon={Type}>
                <Row label="Theme">
                  <select
                    value={settings.theme}
                    onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                    className="w-full sm:w-56 rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none"
                  >
                    {["Dark", "Midnight", "Catppuccin", "Nord", "TokyoNight"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Row>
              </Section>

              <Section title="Performance" icon={Zap}>
                <Row label="Stream preloading">
                  <button className="relative h-6 w-11 rounded-full bg-red-600">
                    <span className="absolute top-1 left-6 h-4 w-4 rounded-full bg-white" />
                  </button>
                </Row>
                <Row label="Proxy streams">
                  <button className="relative h-6 w-11 rounded-full bg-zinc-700">
                    <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white" />
                  </button>
                </Row>
              </Section>
            </div>

            <div className="sticky bottom-0 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur p-5 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                <Check className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
