import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, type ApiSearchResult, type ApiSong } from "@/lib/api";
import { formatDuration } from "@/lib/format";

export default function SearchSong() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiSearchResult | null>(null);

  const [showBpmSection, setShowBpmSection] = useState(false);
  const [bpmFile, setBpmFile] = useState<File | null>(null);
  const [bpmLoading, setBpmLoading] = useState(false);
  const [bpmError, setBpmError] = useState<string | null>(null);
  const [detectedBpm, setDetectedBpm] = useState<number | null>(null);

  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>("");
  const [addingToPlaylist, setAddingToPlaylist] = useState(false);
  const [recommendations, setRecommendations] = useState<ApiSong[]>([]);
  const [addedSongs, setAddedSongs] = useState<Set<number>>(new Set());

  const { data: playlists = [] } = useQuery({
    queryKey: ["playlists"],
    queryFn: api.playlists.list,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim() || !album.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setDetectedBpm(null);
    setBpmFile(null);
    setShowBpmSection(false);
    setRecommendations([]);
    setAddedSongs(new Set());
    try {
      const data = await api.songs.searchAndAdd({
        title: title.trim(),
        artist: artist.trim(),
        album: album.trim(),
      });
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
    } catch {
      setBpmError("Detection failed — make sure the file is a valid audio file.");
    } finally {
      setBpmLoading(false);
    }
  };

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylistId || !result?.song.id) return;
    setAddingToPlaylist(true);
    try {
      const data = await api.playlists.addSong(Number(selectedPlaylistId), result.song.id);
      setAddedSongs((prev) => new Set(prev).add(result.song.id));
      setRecommendations(data.recommendations);
    } catch {
      // already in playlist
    } finally {
      setAddingToPlaylist(false);
    }
  };

  const handleAddRecommendation = async (rec: ApiSong) => {
    if (!selectedPlaylistId) return;
    try {
      await api.playlists.addSong(Number(selectedPlaylistId), rec.id);
      setAddedSongs((prev) => new Set(prev).add(rec.id));
    } catch {
      // ignore
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

      <h1 className="text-2xl font-display uppercase tracking-wider mb-2">★ Add Song ★</h1>
      <p className="text-xs font-body text-muted-foreground mb-6">
        Enter the title, artist, and album — we'll pull the full metadata from Spotify and save it to your catalog instantly.
      </p>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="y2k-border y2k-shadow bg-card p-6 mb-6">
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
            {loading ? "Searching Spotify..." : "Search & Save to Catalog ★"}
          </button>
        </div>
      </form>

      {error && (
        <div className="y2k-border bg-destructive/10 p-4 mb-6">
          <p className="font-display text-xs uppercase text-destructive">
            {error.includes("404") ? "Song not found on Spotify — check your spelling and try again" : error}
          </p>
        </div>
      )}

      {result && s && song && (
        <div className="y2k-border y2k-shadow bg-card overflow-hidden">

          {/* Status banner */}
          <div className="bg-y2k-blush border-b-[3px] border-foreground px-4 py-3 flex items-center justify-between">
            <span className="font-display text-xs uppercase tracking-wider">
              {result.created ? "✓ Saved to your catalog" : "Already in your catalog"}
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

          {/* Song header */}
          <div className="flex gap-4 p-4 border-b-2 border-foreground/10">
            {s.album_images[0] && (
              <img
                src={s.album_images[0].url}
                alt={s.album_name}
                className="w-24 h-24 shrink-0 y2k-border object-cover"
              />
            )}
            <div className="flex flex-col justify-center">
              <h2 className="font-display text-sm uppercase tracking-wider">{s.track_name}</h2>
              <p className="text-xs font-body text-muted-foreground mt-1">{s.artist_names.join(", ")}</p>
              <p className="text-xs font-body text-muted-foreground">{s.album_name}</p>
            </div>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 divide-x-2 divide-y-2 divide-foreground/10">
            <Row label="Duration" value={formatDuration(Math.floor(s.duration_ms / 1000))} />
            <Row label="Release Date" value={s.release_date ?? "—"} />
            <Row label="Genres" value={s.artist_genres.length ? s.artist_genres.join(", ") : "—"} />
            <Row label="Popularity" value={`${s.popularity} / 100`} />
            <Row label="Explicit" value={s.explicit ? "Yes" : "No"} />
            <Row label="ISRC" value={s.isrc ?? "—"} />
            <Row label="BPM" value={song.bpm ? `${song.bpm} BPM` : "Not detected"} />
            <Row label="Catalog ID" value={`#${song.id}`} />
          </div>

          {/* Add to playlist */}
          <div className="border-t-[3px] border-foreground p-4">
            <p className="text-[10px] font-display uppercase tracking-wider mb-3">Add to Playlist</p>
            <div className="flex gap-2">
              <select
                value={selectedPlaylistId}
                onChange={(e) => setSelectedPlaylistId(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs font-body y2k-border bg-background focus:outline-none"
              >
                <option value="">Select a playlist...</option>
                {playlists.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}{p.target_bpm ? ` — ${p.target_bpm} BPM` : ""}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddToPlaylist}
                disabled={!selectedPlaylistId || addingToPlaylist || addedSongs.has(song.id)}
                className="px-3 py-1.5 text-[10px] font-display uppercase tracking-wider y2k-border bg-foreground text-primary-foreground hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {addedSongs.has(song.id) ? "✓ Added" : addingToPlaylist ? "Adding..." : "Add"}
              </button>
            </div>
            {playlists.length === 0 && (
              <p className="text-[10px] font-body text-muted-foreground mt-2">
                No playlists yet —{" "}
                <Link to="/playlists/new" className="underline hover:text-primary">
                  create one first
                </Link>
              </p>
            )}
          </div>

          {/* BPM recommendations */}
          {recommendations.length > 0 && (
            <div className="border-t-[3px] border-foreground p-4 bg-y2k-blush/30">
              <p className="text-[10px] font-display uppercase tracking-wider mb-3">
                ★ Similar Energy — Songs within ±10 BPM
              </p>
              <div className="flex flex-col gap-2">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="flex items-center gap-3 y2k-border bg-card px-3 py-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-body font-semibold truncate">{rec.title}</p>
                      <p className="text-[10px] font-body text-muted-foreground truncate">{rec.artist}</p>
                    </div>
                    {rec.bpm && (
                      <span className="text-[10px] font-body text-muted-foreground shrink-0">
                        {rec.bpm} BPM
                      </span>
                    )}
                    <button
                      onClick={() => handleAddRecommendation(rec)}
                      disabled={addedSongs.has(rec.id)}
                      className="text-[10px] font-display uppercase y2k-border px-2 py-1 bg-foreground text-primary-foreground hover:bg-primary transition-colors disabled:opacity-50 shrink-0"
                    >
                      {addedSongs.has(rec.id) ? "✓" : "+ Add"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional BPM detection — collapsed by default */}
          <div className="border-t-[3px] border-foreground">
            <button
              onClick={() => setShowBpmSection((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-y2k-blush/30 transition-colors"
            >
              <span className="text-[10px] font-display uppercase tracking-wider">
                ♪ Detect BPM from audio file <span className="text-muted-foreground">(optional)</span>
              </span>
              {showBpmSection ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            {showBpmSection && (
              <div className="px-4 pb-4">
                <p className="text-[10px] font-body text-muted-foreground mb-3">
                  Upload the audio file to auto-detect the exact BPM using librosa. This improves playlist recommendations.
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
