import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

const COVER_OPTIONS = ["🎵","🎸","🎤","🥁","🎹","🎺","🎻","🔥","⚡","💀","🖤","🌙","✨","💔","🦋","☠️","🌀","🔊","💣","🩸"];

export default function AddAlbum() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [cover, setCover] = useState("🎵");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await api.albums.create({
        title: title.trim(),
        artist: artist.trim(),
        genre: genre.trim() || undefined,
        year: year ? Number(year) : undefined,
        cover,
      });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      navigate("/");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs font-display uppercase tracking-wider hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Library
      </Link>

      <h1 className="text-2xl font-display uppercase tracking-wider mb-2">★ Add Album ★</h1>
      <p className="text-xs font-body text-muted-foreground mb-6">
        Add an album to your library. Once created, add songs to it via the catalog search.
      </p>

      <form onSubmit={handleSubmit} className="y2k-border y2k-shadow bg-card p-6">
        <div className="flex flex-col gap-4">

          {/* Cover picker */}
          <div>
            <label className="block text-[10px] font-display uppercase tracking-wider mb-2">Cover</label>
            <div className="flex flex-wrap gap-2">
              {COVER_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setCover(emoji)}
                  className={`text-2xl w-10 h-10 flex items-center justify-center y2k-border transition-colors ${
                    cover === emoji ? "bg-y2k-lavender" : "bg-background hover:bg-y2k-blush"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-display uppercase tracking-wider mb-1">
              Album Title <span className="text-destructive">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. After Hours"
              className="w-full px-3 py-2 text-sm font-body y2k-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-[10px] font-display uppercase tracking-wider mb-1">
              Artist <span className="text-destructive">*</span>
            </label>
            <input
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="e.g. The Weeknd"
              className="w-full px-3 py-2 text-sm font-body y2k-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-display uppercase tracking-wider mb-1">Genre</label>
              <input
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g. Pop, Hip-Hop"
                className="w-full px-3 py-2 text-sm font-body y2k-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] font-display uppercase tracking-wider mb-1">Year</label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2020"
                className="w-full px-3 py-2 text-sm font-body y2k-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="y2k-border bg-y2k-blush p-3 flex items-center gap-3">
            <span className="text-3xl">{cover}</span>
            <div>
              <p className="font-display text-xs uppercase">{title || "Album Title"}</p>
              <p className="text-[10px] font-body text-muted-foreground">{artist || "Artist"}{year ? ` · ${year}` : ""}</p>
              {genre && <p className="text-[10px] font-body text-muted-foreground">{genre}</p>}
            </div>
          </div>

          {error && <p className="text-xs font-body text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading || !title.trim() || !artist.trim()}
            className="px-4 py-2 font-display text-xs uppercase tracking-wider y2k-border y2k-shadow bg-foreground text-primary-foreground hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add to Library ★"}
          </button>
        </div>
      </form>
    </div>
  );
}
