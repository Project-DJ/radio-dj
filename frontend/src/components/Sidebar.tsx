import { FilterDropdown } from "@/components/FilterDropdown";
import type { ApiAlbum } from "@/lib/api";

interface Props {
  allAlbums: ApiAlbum[];
  genres: string[];
  artists: string[];
  years: string[];
  onToggleGenre: (v: string) => void;
  onToggleArtist: (v: string) => void;
  onToggleYear: (v: string) => void;
  onClearAll: () => void;
  totalFiltered: number;
}

export function MusicLibrarySidebar({
  allAlbums,
  genres, artists, years,
  onToggleGenre, onToggleArtist, onToggleYear,
  onClearAll, totalFiltered,
}: Props) {
  const hasFilters = genres.length + artists.length + years.length > 0;

  const uniqueGenres = [...new Set(allAlbums.map((a) => a.genre).filter(Boolean) as string[])].sort();
  const uniqueArtists = [...new Set(allAlbums.map((a) => a.artist))].sort();
  const uniqueYears = [...new Set(allAlbums.map((a) => String(a.year)).filter((y) => y !== "null" && y !== "undefined"))].sort();

  return (
    <aside className="w-64 shrink-0 border-r-[3px] border-foreground bg-card min-h-screen p-4">
      <div className="mb-6">
        <h2 className="font-display text-lg uppercase tracking-wider flex items-center gap-1">
          ★ Filters ★
        </h2>
        <p className="text-[11px] text-muted-foreground font-body mt-1">
          {totalFiltered} album{totalFiltered !== 1 && "s"} found
        </p>
      </div>

      <FilterDropdown
        label="Genre"
        options={uniqueGenres}
        selected={genres}
        onToggle={onToggleGenre}
      />
      <FilterDropdown
        label="Artist"
        options={uniqueArtists}
        selected={artists}
        onToggle={onToggleArtist}
      />
      <FilterDropdown
        label="Year"
        options={uniqueYears}
        selected={years}
        onToggle={onToggleYear}
      />

      {hasFilters && (
        <button
          onClick={onClearAll}
          className="w-full mt-2 px-3 py-2 text-xs font-display uppercase y2k-border bg-foreground text-primary-foreground hover:bg-primary transition-colors y2k-shadow-sm"
        >
          Clear All ✕
        </button>
      )}
    </aside>
  );
}
