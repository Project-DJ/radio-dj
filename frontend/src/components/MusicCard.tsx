import { motion } from "framer-motion";
import type { Album } from "@/data/music";

interface AlbumCardProps {
  album: Album;
  index: number;
}

export function AlbumCard({ album, index }: AlbumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="y2k-border y2k-shadow bg-card group cursor-pointer"
    >
      <div className="aspect-square bg-y2k-blush flex items-center justify-center text-6xl border-b-[3px] border-foreground group-hover:bg-y2k-pink transition-colors relative overflow-hidden">
        <span className="relative z-10">{album.cover}</span>
        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,hsl(var(--foreground)/0.1)_10px,hsl(var(--foreground)/0.1)_11px)]" />
      </div>
      <div className="p-3">
        <h3 className="font-display text-xs uppercase leading-tight truncate">
          {album.title}
        </h3>
        <p className="text-[11px] text-muted-foreground font-body mt-1 truncate">
          {album.artist}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="inline-block px-2 py-0.5 text-[9px] font-body font-semibold uppercase bg-y2k-lavender y2k-border text-foreground">
            {album.genre}
          </span>
          <span className="text-[10px] font-body text-muted-foreground">
            {album.year}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground font-body mt-1.5">
          {album.tracks} tracks
        </p>
      </div>
    </motion.div>
  );
}
