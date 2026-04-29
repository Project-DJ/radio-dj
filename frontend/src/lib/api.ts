const BASE = "http://localhost:8000";

export interface ApiAlbum {
  id: number;
  title: string;
  artist: string;
  genre?: string | null;
  year?: number | null;
  cover?: string | null;
}

export interface ApiSong {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration_ms: number;
  bpm?: number | null;
  owner_id: number;
}

export interface ApiSpotifyMetadata {
  track_name: string;
  track_id: string;
  spotify_url: string;
  album_name: string;
  release_date: string | null;
  artist_names: string[];
  artist_genres: string[];
  duration_ms: number;
  explicit: boolean;
  popularity: number;
  isrc: string | null;
  album_images: { url: string; width: number; height: number }[];
}

export interface ApiSearchResult {
  song: ApiSong;
  spotify: ApiSpotifyMetadata;
  created: boolean;
}

export interface ApiPlaylist {
  id: number;
  name: string;
  description: string;
  target_bpm?: number | null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export const api = {
  albums: {
    list: () => request<ApiAlbum[]>("/albums/"),
    get: (id: number) => request<ApiAlbum>(`/albums/${id}`),
    songs: (id: number) => request<ApiSong[]>(`/albums/${id}/songs`),
    create: (data: Omit<ApiAlbum, "id">) =>
      request("/albums/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
  },
  songs: {
    list: () => request<ApiSong[]>("/songs/"),
    get: (id: number) => request<ApiSong>(`/songs/${id}`),
    create: (data: Omit<ApiSong, "id">) =>
      request("/songs/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
    searchAndAdd: (data: { title: string; artist: string; album: string }) =>
      request<ApiSearchResult>("/songs/search_and_add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    detectBpm: (songId: number, file: File) => {
      const form = new FormData();
      form.append("file", file);
      return request<{ song_id: number; title: string; bpm: number }>(
        `/songs/${songId}/detect_bpm`,
        { method: "POST", body: form }
      );
    },
  },
  playlists: {
    list: () => request<ApiPlaylist[]>("/playlists/"),
    get: (id: number) => request<ApiPlaylist>(`/playlists/${id}`),
    songs: (id: number) => request<{ playlist: ApiPlaylist; songs: ApiSong[] }>(`/playlists/${id}/songs`),
    create: (data: Omit<ApiPlaylist, "id">) =>
      request("/playlists/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
    addSong: (playlistId: number, songId: number) =>
      request(`/playlists/${playlistId}/add_music?song_id=${songId}`, { method: "POST" }),
    removeSong: (playlistId: number, songId: number) =>
      request(`/playlists/${playlistId}/remove_music?song_id=${songId}`, { method: "POST" }),
  },
};
