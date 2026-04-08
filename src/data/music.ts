export interface Album {
  id: number;
  title: string;
  artist: string;
  genre: string;
  year: number;
  cover: string;
  tracks: number;
}

export const albums: Album[] = [
  { id: 1, title: "Fallen", artist: "Evanescence", genre: "Nu Metal", year: 2003, cover: "🦇", tracks: 12 },
  { id: 2, title: "The Black Parade", artist: "My Chemical Romance", genre: "Emo", year: 2006, cover: "💀", tracks: 13 },
  { id: 3, title: "Riot!", artist: "Paramore", genre: "Pop Punk", year: 2007, cover: "🔥", tracks: 12 },
  { id: 4, title: "Meteora", artist: "Linkin Park", genre: "Nu Metal", year: 2003, cover: "⚡", tracks: 13 },
  { id: 5, title: "Bleed American", artist: "Jimmy Eat World", genre: "Emo", year: 2001, cover: "💔", tracks: 11 },
  { id: 6, title: "Enema of the State", artist: "Blink-182", genre: "Pop Punk", year: 1999, cover: "👽", tracks: 12 },
  { id: 7, title: "Toxicity", artist: "System of a Down", genre: "Nu Metal", year: 2001, cover: "☠️", tracks: 14 },
  { id: 8, title: "From Under the Cork Tree", artist: "Fall Out Boy", genre: "Emo", year: 2005, cover: "🖤", tracks: 13 },
  { id: 9, title: "All Killer No Filler", artist: "Sum 41", genre: "Pop Punk", year: 2001, cover: "💣", tracks: 13 },
  { id: 10, title: "The Used", artist: "The Used", genre: "Emo", year: 2002, cover: "🩸", tracks: 12 },
  { id: 11, title: "Hybrid Theory", artist: "Linkin Park", genre: "Nu Metal", year: 2000, cover: "🦋", tracks: 12 },
  { id: 12, title: "Take Off Your Pants and Jacket", artist: "Blink-182", genre: "Pop Punk", year: 2001, cover: "🎸", tracks: 13 },
  { id: 13, title: "Three Cheers for Sweet Revenge", artist: "My Chemical Romance", genre: "Emo", year: 2004, cover: "🗡️", tracks: 13 },
  { id: 14, title: "Anywhere but Here", artist: "Mayday Parade", genre: "Emo", year: 2009, cover: "🌙", tracks: 12 },
  { id: 15, title: "Brand New Eyes", artist: "Paramore", genre: "Pop Punk", year: 2009, cover: "🦋", tracks: 11 },
  { id: 16, title: "Infinity on High", artist: "Fall Out Boy", genre: "Pop Punk", year: 2007, cover: "✨", tracks: 14 },
  { id: 17, title: "Relationship of Command", artist: "At the Drive-In", genre: "Post-Hardcore", year: 2000, cover: "🔊", tracks: 13 },
  { id: 18, title: "Sing the Sorrow", artist: "AFI", genre: "Post-Hardcore", year: 2003, cover: "🖤", tracks: 13 },
  { id: 19, title: "Saosin", artist: "Saosin", genre: "Post-Hardcore", year: 2006, cover: "🌀", tracks: 11 },
  { id: 20, title: "Dear Diary, My Teen Angst Has a Body Count", artist: "From First to Last", genre: "Post-Hardcore", year: 2004, cover: "📓", tracks: 11 },
];
