import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api, type ApiSearchResult } from "@/lib/api";
import { formatDuration } from "@/lib/format";

export default function SearchSong() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiSearchResult | null>(null);

  const [bpmFile, setBpmFile] = useState<File | null>(null);
  const [bpmLoading, setBpmLoading] = useState(false);
  const [bpmError, setBpmError] = useState<string | null>(null);
  const [detectedBpm, setDetectedBpm] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim() || !album.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setDetectedBpm(null);
    setBpmFile(null);
    try {
      const data = await api.songs.searchAndAdd({ title: title.trim(), artist: artist.trim(), album: album.trim() });
      setResult(data);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDetectBpm = async () => {
    if (!bpmFile || !result?.song.id) return;
    setBpmLoading(true);
    setBpmError(null);
    try {
      const data = await api.songs.detectBpm(result.song.id, bpmFile);
      setDetectedBpm(data.bpm);
      setResult((prev) => prev ? { ...prev, song: { ...prev.song, bpm: data.bpm } } : prev);
    } catch (err: any) {
      setBpmError("BPM detection failed — make sure the file is a valid audio file");
    } finally {
      setBpmLoading(false);
    }
  };

  const s = result?.spotify;
  const song = result?.song;

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs font-display uppercase tracking-wider hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Library
      </Link>

      <h1 className="text-2xl font-display uppercase tracking-wider mb-6">★ Add Song ★</h1>

      <form onSubmit={handleSubmit} className="y2k-border y2k-shadow bg-card p-6 mb-6">
        <p className="text-xs font-body text-muted-foreground mb-4">
          Enter the song details and we'll pull the full metadata from Spotify.
        </p>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-[10px] font-display uppercase tracking-wider mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blinding Lights"
              className="w-full px-3 py-2 text-sm font-body y2k-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-[10px] font-display uppercase tracking-wider mb-1">Artist</label>
            <input
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="e.g. The Weeknd"
              className="w-full px-3 py-2 text-sm font-body y2k-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-[10px] font-display uppercase tracking-wider mb-1">Album</label>
            <input
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              placeholder="e.g. After Hours"
              className="w-full px-3 py-2 text-sm font-body y2k-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !title.trim() || !artist.trim() || !album.trim()}
            className="mt-2 px-4 py-2 font-display text-xs uppercase tracking-wider y2k-border y2k-shadow bg-foreground text-primary-foreground hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Searching Spotify..." : "Search & Add ★"}
          </button>
        </div>
      </form>

      {error && (
        <div className="y2k-border bg-destructive/10 p-4 mb-6">
          <p className="font-display text-xs uppercase text-destructive">
            {error.includes("404") ? "Song not found on Spotify — try different search terms" : error}
          </p>
        </div>
      )}

      {result && s && song && (
        <div className="y2k-border y2k-shadow bg-card overflow-hidden">
          <div className="bg-y2k-blush border-b-[3px] border-foreground px-4 py-3 flex items-center justify-between">
            <span className="font-display text-xs uppercase tracking-wider">
              {result.created ? "✓ Added to Library" : "Already in Library"}
            </span>
            {s.spotify_url && (
              <a
                href={s.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-body underline hover:text-primary"
              >
                Open in Spotify ↗
              </a>
            )}
          </div>

          <div className="flex gap-4 p-4 border-b-2 border-foreground/10">
            {s.album_images[0] && (
              <img
                src={s.album_images[0].url}
                alt={s.album_name}
                className="w-24 h-24 shrink-0 y2k-border object-cover"
              />
            )}
            <div>
              <h2 className="font-display text-sm uppercase tracking-wider">{s.track_name}</h2>
              <p className="text-xs font-body text-muted-foreground mt-1">{s.artist_names.join(", ")}</p>
              <p className="text-xs font-body text-muted-foreground">{s.album_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-0 divide-x-2 divide-y-2 divide-foreground/10">
            <Row label="Duration" value={formatDuration(Math.floor(s.duration_ms / 1000))} />
            <Row label="Release Date" value={s.release_date ?? "—"} />
            <Row label="Genres" value={s.artist_genres.length ? s.artist_genres.join(", ") : "—"} />
            <Row label="Popularity" value={`${s.popularity} / 100`} />
            <Row label="Explicit" value={s.explicit ? "Yes" : "No"} />
            <Row label="ISRC" value={s.isrc ?? "—"} />
            <Row label="BPM" value={song.bpm ? `${song.bpm} BPM` : "Not detected yet"} />
            <Row label="Saved ID" value={`#${song.id}`} />
          </div>

          {/* BPM Detection */}
          <div className="border-t-[3px] border-foreground p-4">
            <p className="text-[10px] font-display uppercase tracking-wider mb-3">
              ♪ Detect BPM from Audio File
            </p>
            <p className="text-[10px] font-body text-muted-foreground mb-3">
              Upload the song's audio file (mp3, wav, flac) and we'll analyze it with librosa to detect the exact BPM.
            </p>
            <div className="flex gap-2 items-center">
              <input
                type="file"
                accept=".mp3,.wav,.flac,.ogg,.m4a"
                onChange={(e) => setBpmFile(e.target.files?.[0] ?? null)}
                className="flex-1 text-xs font-body y2k-border px-2 py-1.5 bg-background file:mr-2 file:text-[10px] file:font-display file:uppercase file:border-0 file:bg-y2k-lavender file:px-2 file:py-1 cursor-pointer"
              />
              <button
                onClick={handleDetectBpm}
                disabled={!bpmFile || bpmLoading}
                className="px-3 py-1.5 text-[10px] font-display uppercase tracking-wider y2k-border bg-foreground text-primary-foreground hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {bpmLoading ? "Analyzing..." : "Detect"}
              </button>
            </div>
            {bpmError && (
              <p className="text-[10px] font-body text-destructive mt-2">{bpmError}</p>
            )}
            {detectedBpm && (
              <p className="text-[10px] font-body text-green-600 mt-2">
                ✓ BPM detected and saved: <span className="font-semibold">{detectedBpm} BPM</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3">
      <p className="text-[9px] font-display uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-xs font-body mt-0.5 truncate">{value}</p>
    </div>
  );
}
