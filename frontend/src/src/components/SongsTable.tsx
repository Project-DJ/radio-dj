import { useState, useMemo } from "react";
import { ArrowUpDown, Plus } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { formatDuration } from "@/lib/format";
//import { usePlaylist } from "@/contexts/PlaylistContext";
import type { SongWithAlbum } from "@/data/music";

type SortKey = "title" | "artist" | "duration_seconds";

interface Props {
  songs: SongWithAlbum[];
}

export function SongsTable({ songs }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortAsc, setSortAsc] = useState(true);
  //const { addSong } = usePlaylist();

  const sorted = useMemo(() => {
    return [...songs].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      const cmp = typeof va === "string" ? va.localeCompare(vb as string) : (va as number) - (vb as number);
      return sortAsc ? cmp : -cmp;
    });
  }, [songs, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const headBtn = (label: string, key: SortKey) => (
    <button onClick={() => toggleSort(key)} className="flex items-center gap-1 font-display text-[11px] uppercase tracking-wider hover:text-primary transition-colors">
      {label} <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  return (
    <div className="y2k-border y2k-shadow bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b-[3px] border-foreground bg-y2k-blush hover:bg-y2k-blush">
            <TableHead className="w-10">#</TableHead>
            <TableHead>{headBtn("Title", "title")}</TableHead>
            <TableHead>{headBtn("Artist", "artist")}</TableHead>
            <TableHead className="hidden md:table-cell">Album</TableHead>
            <TableHead className="text-right">{headBtn("Time", "duration_seconds")}</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((song, i) => (
            <TableRow key={`${song.albumId}-${song.title}-${i}`} className="border-b-2 border-foreground/10 hover:bg-y2k-blush/50">
              <TableCell className="text-[10px] text-muted-foreground font-body">{i + 1}</TableCell>
              <TableCell className="font-body text-xs font-semibold">{song.title}</TableCell>
              <TableCell className="font-body text-xs text-muted-foreground">{song.artist}</TableCell>
              <TableCell className="font-body text-xs text-muted-foreground hidden md:table-cell">{song.albumTitle}</TableCell>
              <TableCell className="text-right font-body text-xs text-muted-foreground">{formatDuration(song.duration_seconds)}</TableCell>
              <TableCell>
                <button
                  //onClick={() => addSong(song)}
                  className="p-1 hover:bg-primary hover:text-primary-foreground y2k-border transition-colors"
                  title="Add to Playlist"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
