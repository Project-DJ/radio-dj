import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type ApiSong } from "@/lib/api";
import { formatDuration } from "@/lib/format";

export default function Catalog() {
  const queryClient = useQueryClient();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>("");
  const [addedSongs, setAddedSongs] = useState<Set<number>>(new Set());
  const [recommendations, setRecommendations] = useState<{ forSong: number; songs: ApiSong[] } | null>(null);

  const { data: songs = [], isLoading, isError } = useQuery({
    queryKey: ["songs"],
    queryFn: api.songs.list,
  });

  const { data: playlists = [] } = useQuery({
    queryKey: ["playlists"],
    queryFn: api.playlists.list,
  });

  const handleAddToPlaylist = async (song: ApiSong) => {
    if (!selectedPlaylistId) return;
    try {
      const data = await api.playlists.addSong(Number(selectedPlaylistId), song.id);
      setAddedSongs((prev) => new Set(prev).add(song.id));
      if (data.recommendations.length > 0) {
        setRecommendations({ forSong: song.id, songs: data.recommendations });
      }
    } catch {
      // already in playlist — ignore
    }
  };

  const handleAddRecommendation = async (rec: ApiSong) => {
    if (!selectedPlaylistId) return;
    try {
      await api.playlists.addSong(Number(selectedPlaylistId), rec.id);
      setAddedSongs((prev) => new Set(prev).add(rec.id));
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs font-display uppercase tracking-wider hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Library
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display uppercase tracking-wider">★ Song Catalog ★</h1>
          <p className="text-xs font-body text-muted-foreground mt-1">
            {songs.length} song{songs.length !== 1 && "s"} saved
          </p>
        </div>
        <Link
          to="/search"
          className="px-3 py-2 text-xs font-display uppercase tracking-wider y2k-border y2k-shadow bg-foreground text-primary-foreground hover:bg-primary transition-colors"
        >
          + Add Song
        </Link>
      </div>

      {/* Playlist selector — sticky at top */}
      <div className="y2k-border bg-y2k-blush p-3 mb-4 flex items-center gap-3">
        <p className="text-[10px] font-display uppercase tracking-wider shrink-0">Add to:</p>
        <select
          value={selectedPlaylistId}
          onChange={(e) => {
            setSelectedPlaylistId(e.target.value);
            setAddedSongs(new Set());
            setRecommendations(null);
          }}
          className="flex-1 px-3 py-1.5 text-xs font-body y2k-border bg-background focus:outline-none"
        >
          <option value="">Select a playlist...</option>
          {playlists.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}{p.target_bpm ? ` — ${p.target_bpm} BPM` : ""}
            </option>
          ))}
        </select>
        {playlists.length === 0 && (
          <Link
            to="/playlists/new"
            className="text-[10px] font-display uppercase tracking-wider underline shrink-0 hover:text-primary"
          >
            Create one →
          </Link>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <p className="font-display text-lg uppercase animate-pulse">Loading...</p>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">⚠️</span>
          <p className="font-display text-lg uppercase">Could not reach backend</p>
        </div>
      )}

      {!isLoading && !isError && songs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">🎵</span>
          <p className="font-display text-lg uppercase">No songs yet</p>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Use the search page to find and save songs from Spotify
          </p>
          <Link
            to="/search"
            className="mt-4 px-4 py-2 text-xs font-display uppercase y2k-border y2k-shadow bg-foreground text-primary-foreground hover:bg-primary transition-colors"
          >
            + Add Your First Song
          </Link>
        </div>
      )}

      {!isLoading && !isError && songs.length > 0 && (
        <div className="y2k-border y2k-shadow bg-card overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-[2rem_1fr_1fr_6rem_5rem_5rem_6rem] gap-2 px-4 py-2 border-b-[3px] border-foreground bg-y2k-blush">
            <span className="text-[9px] font-display uppercase">#</span>
            <span className="text-[9px] font-display uppercase">Title</span>
            <span className="text-[9px] font-display uppercase">Artist</span>
            <span className="text-[9px] font-display uppercase">Genre</span>
            <span className="text-[9px] font-display uppercase">BPM</span>
            <span className="text-[9px] font-display uppercase text-right">Duration</span>
            <span className="text-[9px] font-display uppercase text-right">Playlist</span>
          </div>

          {songs.map((song, i) => (
            <div key={song.id}>
              <div
                className="grid grid-cols-[2rem_1fr_1fr_6rem_5rem_5rem_6rem] gap-2 px-4 py-2.5 border-b-2 border-foreground/10 last:border-b-0 hover:bg-y2k-blush/40 transition-colors items-center"
              >
                <span className="text-[10px] text-muted-foreground font-body">{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-xs font-body font-semibold truncate">{song.title}</p>
                  <p className="text-[10px] font-body text-muted-foreground truncate">{song.album}</p>
                </div>
                <p className="text-xs font-body text-muted-foreground truncate">{song.artist}</p>
                <p className="text-[10px] font-body text-muted-foreground truncate">
                  {song.artist_genre ?? "—"}
                </p>
                <p className="text-xs font-body text-muted-foreground">
                  {song.bpm ? `${song.bpm}` : <span className="text-[10px] text-muted-foreground/50">—</span>}
                </p>
                <p className="text-xs font-body text-muted-foreground text-right">
                  {formatDuration(Math.floor(song.duration_ms / 1000))}
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleAddToPlaylist(song)}
                    disabled={!selectedPlaylistId || addedSongs.has(song.id)}
                    className="text-[10px] font-display uppercase y2k-border px-2 py-1 bg-foreground text-primary-foreground hover:bg-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {addedSongs.has(song.id) ? "✓" : "+ Add"}
                  </button>
                </div>
              </div>

              {/* Inline recommendations for this song */}
              {recommendations?.forSong === song.id && (
                <div className="border-b-2 border-foreground/10 bg-y2k-lavender/20 px-4 py-3">
                  <p className="text-[9px] font-display uppercase tracking-wider mb-2">
                    ★ Similar Energy — within ±10 BPM
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {recommendations.songs.map((rec) => (
                      <div key={rec.id} className="flex items-center gap-3 y2k-border bg-card px-3 py-1.5">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
