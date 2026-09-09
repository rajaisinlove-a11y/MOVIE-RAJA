import { motion } from "framer-motion";
import { Puzzle, Plus, Check, Trash2, Globe, Star, RefreshCw } from "lucide-react";
import { useState } from "react";
import { ADDONS } from "../data/mockData";

export default function AddonGrid() {
  const [addons, setAddons] = useState(ADDONS);
  const [url, setUrl] = useState("");

  const toggleInstall = (id: string) => {
    setAddons((prev) =>
      prev.map((a) => (a.id === id ? { ...a, installed: !a.installed } : a))
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setAddons((prev) => [
      ...prev,
      {
        id: `addon-${Date.now()}`,
        name: url.split("/").pop() || "Custom Addon",
        description: "Community Stremio HTTP addon.",
        rating: 0,
        installed: true,
      },
    ]);
    setUrl("");
  };

  const removeAddon = (id: string) => {
    setAddons((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-[1920px] px-4 py-6 md:px-8"
    >
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
          <Puzzle className="h-8 w-8 text-red-500" />
          Addons
        </h1>
        <p className="mt-2 text-zinc-400">
          Install community Stremio HTTP addons and custom sources to expand your library.
        </p>
      </div>

      {/* Add addon */}
      <form onSubmit={handleAdd} className="mb-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://addon.example.com/manifest.json"
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-red-600 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Install Addon
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {addons.map((addon, idx) => (
          <motion.div
            key={addon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800">
                <Puzzle className="h-6 w-6 text-white" />
              </div>
              {addon.installed ? (
                <button
                  onClick={() => removeAddon(addon.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-red-600/20 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <h3 className="mt-4 text-lg font-bold text-white">{addon.name}</h3>
            <p className="mt-1 text-sm text-zinc-400">{addon.description}</p>

            <div className="mt-4 flex items-center justify-between">
              {addon.rating > 0 ? (
                <span className="flex items-center gap-1 text-sm text-yellow-400">
                  <Star className="h-4 w-4 fill-yellow-400" />
                  {addon.rating}
                </span>
              ) : (
                <span className="text-xs text-zinc-600">Custom addon</span>
              )}
              <button
                onClick={() => toggleInstall(addon.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                  addon.installed
                    ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                    : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                {addon.installed ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Installed
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" /> Install
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/30 p-6 text-zinc-500">
        <RefreshCw className="h-5 w-5" />
        <p className="text-sm">Addons are synced when you restart the backend.</p>
      </div>
    </motion.div>
  );
}
