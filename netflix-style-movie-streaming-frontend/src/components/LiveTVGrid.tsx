import { motion } from "framer-motion";
import { Tv, Radio, Users, Play, Calendar } from "lucide-react";
import { LIVE_TV } from "../data/mockData";

interface LiveTVGridProps {
  onPlayChannel: (channel: (typeof LIVE_TV)[0]) => void;
}

export default function LiveTVGrid({ onPlayChannel }: LiveTVGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-[1920px] px-4 py-6 md:px-8"
    >
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
          <Radio className="h-8 w-8 text-red-500" />
          Live TV
        </h1>
        <p className="mt-2 text-zinc-400">Watch live channels, sports, news, and community streams in real-time.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {LIVE_TV.map((channel, idx) => (
          <motion.div
            key={channel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 cursor-pointer"
            onClick={() => onPlayChannel(channel)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${channel.gradient} opacity-30 group-hover:opacity-50 transition-opacity`} />
            <div className="relative p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <Tv className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-red-600/90 px-2.5 py-1 text-[10px] font-bold text-white">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  LIVE
                </div>
              </div>

              <div className="mt-5">
                <h3 className="text-lg font-bold text-white">{channel.name}</h3>
                <p className="mt-1 text-sm text-zinc-400">{channel.category}</p>
                <div className="mt-3 rounded-lg bg-black/30 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 mb-1">Now Playing</p>
                  <p className="text-sm font-semibold text-white truncate">{channel.nowPlaying}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Users className="h-3.5 w-3.5" />
                  {channel.viewers}
                </span>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                  <Play className="h-4 w-4 fill-black" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* TV Guide preview */}
      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
          <Calendar className="h-5 w-5 text-red-500" />
          TV Guide
        </h3>
        <div className="space-y-3">
          {[
            { time: "20:00", title: "Global Headlines", channel: "MovieBox News" },
            { time: "20:30", title: "Sports Tonight", channel: "Sports One" },
            { time: "21:00", title: "Moonlit Blade — Episode 12", channel: "Anime Central" },
            { time: "22:00", title: "Casablanca (1942)", channel: "Cinema Classics" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl bg-zinc-800/30 p-3 hover:bg-zinc-800/60 transition-colors"
            >
              <span className="w-14 text-sm font-bold text-zinc-400">{item.time}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                <p className="text-xs text-zinc-500">{item.channel}</p>
              </div>
              <button className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors">
                <Play className="h-4 w-4 fill-white" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
