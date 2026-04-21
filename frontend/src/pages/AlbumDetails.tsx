import { useParams, Link } from "react-router-dom";
import { albums } from "@/data/music";
import { formatDuration } from "@/lib/format";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const AlbumDetail = () => {
  const { id } = useParams();
  const album = albums.find((a) => a.id === Number(id));

  if (!album) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <span className="text-5xl mb-4">💔</span>
        <p className="font-display text-lg uppercase">Album not found</p>
        <Link to="/" className="mt-4 text-sm font-body text-primary underline">
          ← Back to Library
        </Link>
      </div>
    );
  }

  const totalSeconds = album.songs.reduce((s, t) => s + t.duration_seconds, 0);

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs font-display uppercase tracking-wider hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Library
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-6 mb-8"
      >
        <div className="w-40 h-40 shrink-0 y2k-border y2k-shadow bg-y2k-blush flex items-center justify-center text-7xl">
          {album.cover}
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-display uppercase tracking-wider">{album.title}</h1>
          <p className="text-sm font-body text-muted-foreground mt-1">
            {album.artist} · {album.year}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-block px-2 py-0.5 text-[9px] font-body font-semibold uppercase bg-y2k-lavender y2k-border">
              {album.genre}
            </span>
            <span className="text-xs font-body text-muted-foreground">
              {album.tracks} tracks · {formatDuration(totalSeconds)}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="y2k-border y2k-shadow bg-card overflow-hidden">
        {album.songs.map((song, i) => (
          <motion.div
            key={song.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-3 px-4 py-2.5 border-b-2 border-foreground/10 last:border-b-0 hover:bg-y2k-blush/50 transition-colors"
          >
            <span className="w-6 text-[10px] text-muted-foreground font-body text-right">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-body font-semibold truncate">{song.title}</p>
              <p className="text-[10px] font-body text-muted-foreground">{song.artist}</p>
            </div>
            <span className="text-xs font-body text-muted-foreground">
              {formatDuration(song.duration_seconds)}
            </span>
          </motion.div>
        ))}
        <div className="px-4 py-3 bg-y2k-blush border-t-[3px] border-foreground flex justify-between">
          <span className="font-display text-xs uppercase">Total Runtime</span>
          <span className="font-display text-xs">{formatDuration(totalSeconds)}</span>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetail;