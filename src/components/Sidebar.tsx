import { FilterDropdown } from "@/components/FilterDropdown.js";
import { albums } from "@/data/music.js";

interface Props {
  genres: string[];
  artists: string[];
  years: string[];
  onToggleGenre: (v: string) => void;
  onToggleArtist: (v: string) => void;
  onToggleYear: (v: string) => void;
  onClearAll: () => void;
  totalFiltered: number;
}

const unique = (key: "genre" | "artist" | "year") =>
  [...new Set(albums.map((a) => String(a[key])))].sort();

export function MusicLibrarySidebar({
  genres, artists, years,
  onToggleGenre, onToggleArtist, onToggleYear,
  onClearAll, totalFiltered,
}: Props) {
  const hasFilters = genres.length + artists.length + years.length > 0;

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
        options={unique("genre")}
        selected={genres}
        onToggle={onToggleGenre}
      />
      <FilterDropdown
        label="Artist"
        options={unique("artist")}
        selected={artists}
        onToggle={onToggleArtist}
      />
      <FilterDropdown
        label="Year"
        options={unique("year")}
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
