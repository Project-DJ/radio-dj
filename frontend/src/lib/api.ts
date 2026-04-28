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
