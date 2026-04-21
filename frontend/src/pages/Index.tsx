import { useState, useMemo, useCallback } from "react";
import { albums } from "@/data/music";
import { MusicLibrarySidebar } from "@/components/Sidebar";
import { AlbumCard } from "@/components/AlbumCard";
import { Link } from "react-router-dom";


const toggle = (arr: string[], val: string) =>
  arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

const Index = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return albums.filter((a) => {
      if (genres.length && !genres.includes(a.genre)) return false;
      if (artists.length && !artists.includes(a.artist)) return false;
      if (years.length && !years.includes(String(a.year))) return false;
      return true;
    });
  }, [genres, artists, years]);

  const clearAll = useCallback(() => {
    setGenres([]);
    setArtists([]);
    setYears([]);
  }, []);

  return (
    <div className="flex min-h-screen">
      <MusicLibrarySidebar
        genres={genres}
        artists={artists}
        years={years}
        onToggleGenre={(v) => setGenres((p) => toggle(p, v))}
        onToggleArtist={(v) => setArtists((p) => toggle(p, v))}
        onToggleYear={(v) => setYears((p) => toggle(p, v))}
        onClearAll={clearAll}
        totalFiltered={filtered.length}
      />

      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-display uppercase tracking-wider">
            ★ Music Library ★
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            3-2-1 Radio!!!
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">💔</span>
            <p className="font-display text-lg uppercase">No albums found</p>
            <p className="text-sm text-muted-foreground font-body mt-1">
              Try adjusting your filters
            </p>
          </div>
        ) : (
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
