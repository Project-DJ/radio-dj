import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { MusicLibrarySidebar } from "@/components/Sidebar";
import { AlbumCard } from "@/components/AlbumCard";
import { useAuth } from "@/contexts/AuthContext";

const toggle = (arr: string[], val: string) =>
  arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

const Index = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [albumNames, setAlbumNames] = useState<string[]>([])
  const [genres, setGenres] = useState<string[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);

  const { data: albums = [], isLoading, isError } = useQuery({
    queryKey: ["albums"],
    queryFn: api.albums.list,
  });

  const filtered = useMemo(() => {
    return albums.filter((a) => {
      if (albumNames.length && !albumNames.includes(a.title ?? "")) return false;
      if (genres.length && !genres.includes(a.genre ?? "")) return false;
      if (artists.length && !artists.includes(a.artist)) return false;
      if (years.length && !years.includes(String(a.year ?? ""))) return false;
      return true;
    });
  }, [albums, genres, artists, years, albumNames]);

  const clearAll = useCallback(() => {
    setAlbumNames([]);
    setGenres([]);
    setArtists([]);
    setYears([]);
  }, []);

  return (
    <div className="flex min-h-screen">
      <MusicLibrarySidebar
        allAlbums={albums}
        genres={genres}
        artists={artists}
        years={years}
        albumNames={albumNames}
        onToggleAlbum={(v) => setAlbumNames((p) => toggle(p, v))}  
        onToggleGenre={(v) => setGenres((p) => toggle(p, v))}
        onToggleArtist={(v) => setArtists((p) => toggle(p, v))}
        onToggleYear={(v) => setYears((p) => toggle(p, v))}
        
        onClearAll={clearAll}
        totalFiltered={filtered.length}
      />

      <main className="flex-1 p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-display uppercase tracking-wider">
              ★ Music Library ★
            </h1>
            <p className="text-sm text-muted-foreground font-body mt-1">
              3-2-1 Radio!!!
            </p>
          </div>
          <div className="flex gap-2 items-center">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                  ★ {user.username}
                </span>
                <button
                  onClick={() => { logout(); navigate("/login"); }}
                  className="px-3 py-2 text-xs font-display uppercase tracking-wider y2k-border y2k-shadow bg-card hover:bg-y2k-blush transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 text-xs font-display uppercase tracking-wider y2k-border y2k-shadow bg-card hover:bg-y2k-blush transition-colors"
              >
                Sign In
              </Link>
            )}
            <Link
              to="/catalog"
              className="px-3 py-2 text-xs font-display uppercase tracking-wider y2k-border y2k-shadow bg-card hover:bg-y2k-blush transition-colors"
            >
              My Catalog
            </Link>
            <Link
              to="/playlists/new"
              className="px-3 py-2 text-xs font-display uppercase tracking-wider y2k-border y2k-shadow bg-card hover:bg-y2k-blush transition-colors"
            >
              + New Playlist
            </Link>
            <Link
              to="/albums/new"
              className="px-3 py-2 text-xs font-display uppercase tracking-wider y2k-border y2k-shadow bg-card hover:bg-y2k-blush transition-colors"
            >
              + Add Album
            </Link>
            <Link
              to="/search"
              className="px-3 py-2 text-xs font-display uppercase tracking-wider y2k-border y2k-shadow bg-foreground text-primary-foreground hover:bg-primary transition-colors"
            >
              + Add Song
            </Link>
          </div>
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
            <p className="text-sm text-muted-foreground font-body mt-1">
              Make sure the server is running on port 8000
            </p>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">💔</span>
            <p className="font-display text-lg uppercase">
              {albums.length === 0 ? "No albums in the database yet" : "No albums found"}
            </p>
            <p className="text-sm text-muted-foreground font-body mt-1">
              {albums.length === 0 ? "Add some via POST /albums/" : "Try adjusting your filters"}
            </p>
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((album, i) => (
              <AlbumCard key={album.id} album={album} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
