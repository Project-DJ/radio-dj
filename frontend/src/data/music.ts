export interface Song {
  title: string;
  duration_seconds: number;
  artist: string;
}

export interface Album {
  id: number;
  title: string;
  artist: string;
  genre: string;
  year: number;
  cover: string;
  tracks: number;
  songs: Song[];
}

const s = (title: string, duration_seconds: number, artist: string): Song => ({ title, duration_seconds, artist });

export const albums: Album[] = [
  { id: 1, title: "Fallen", artist: "Evanescence", genre: "Nu Metal", year: 2003, cover: "🦇", tracks: 12, songs: [
    s("Going Under", 212, "Evanescence"), s("Bring Me to Life", 229, "Evanescence"), s("Everybody's Fool", 220, "Evanescence"),
    s("My Immortal", 262, "Evanescence"), s("Haunted", 195, "Evanescence"), s("Tourniquet", 246, "Evanescence"),
    s("Imaginary", 238, "Evanescence"), s("Taking Over Me", 227, "Evanescence"), s("Hello", 232, "Evanescence"),
    s("My Last Breath", 241, "Evanescence"), s("Whisper", 298, "Evanescence"), s("Breathe No More", 252, "Evanescence"),
  ]},
  { id: 2, title: "The Black Parade", artist: "My Chemical Romance", genre: "Emo", year: 2006, cover: "💀", tracks: 13, songs: [
    s("The End.", 82, "My Chemical Romance"), s("Dead!", 197, "My Chemical Romance"), s("This Is How I Disappear", 234, "My Chemical Romance"),
    s("The Sharpest Lives", 195, "My Chemical Romance"), s("Welcome to the Black Parade", 311, "My Chemical Romance"),
    s("I Don't Love You", 234, "My Chemical Romance"), s("House of Wolves", 196, "My Chemical Romance"),
    s("Cancer", 142, "My Chemical Romance"), s("Mama", 256, "My Chemical Romance"), s("Sleep", 260, "My Chemical Romance"),
    s("Teenagers", 163, "My Chemical Romance"), s("Disenchanted", 280, "My Chemical Romance"), s("Famous Last Words", 290, "My Chemical Romance"),
  ]},
  { id: 3, title: "Riot!", artist: "Paramore", genre: "Pop Punk", year: 2007, cover: "🔥", tracks: 12, songs: [
    s("For a Pessimist, I'm Pretty Optimistic", 217, "Paramore"), s("That's What You Get", 244, "Paramore"),
    s("Hallelujah", 194, "Paramore"), s("Misery Business", 210, "Paramore"), s("When It Rains", 207, "Paramore"),
    s("Let the Flames Begin", 210, "Paramore"), s("Miracle", 224, "Paramore"), s("crushcrushcrush", 202, "Paramore"),
    s("We Are Broken", 249, "Paramore"), s("Fences", 195, "Paramore"), s("Born for This", 224, "Paramore"),
    s("Decoy", 191, "Paramore"),
  ]},
  { id: 4, title: "Meteora", artist: "Linkin Park", genre: "Nu Metal", year: 2003, cover: "⚡", tracks: 13, songs: [
    s("Foreword", 13, "Linkin Park"), s("Don't Stay", 192, "Linkin Park"), s("Somewhere I Belong", 214, "Linkin Park"),
    s("Lying from You", 175, "Linkin Park"), s("Hit the Floor", 164, "Linkin Park"), s("Easier to Run", 204, "Linkin Park"),
    s("Faint", 162, "Linkin Park"), s("Figure.09", 198, "Linkin Park"), s("Breaking the Habit", 196, "Linkin Park"),
    s("From the Inside", 174, "Linkin Park"), s("Nobody's Listening", 178, "Linkin Park"), s("Session", 144, "Linkin Park"),
    s("Numb", 187, "Linkin Park"),
  ]},
  { id: 5, title: "Bleed American", artist: "Jimmy Eat World", genre: "Emo", year: 2001, cover: "💔", tracks: 11, songs: [
    s("Bleed American", 213, "Jimmy Eat World"), s("A Praise Chorus", 244, "Jimmy Eat World"),
    s("The Middle", 166, "Jimmy Eat World"), s("Your House", 297, "Jimmy Eat World"),
    s("Sweetness", 202, "Jimmy Eat World"), s("Hear You Me", 266, "Jimmy Eat World"),
    s("If You Don't, Don't", 272, "Jimmy Eat World"), s("Get It Faster", 238, "Jimmy Eat World"),
    s("Cautioners", 288, "Jimmy Eat World"), s("The Authority Song", 239, "Jimmy Eat World"),
    s("My Sundown", 334, "Jimmy Eat World"),
  ]},
  { id: 6, title: "Enema of the State", artist: "Blink-182", genre: "Pop Punk", year: 1999, cover: "👽", tracks: 12, songs: [
    s("Dumpweed", 213, "Blink-182"), s("Don't Leave Me", 137, "Blink-182"), s("Aliens Exist", 220, "Blink-182"),
    s("Going Away to College", 195, "Blink-182"), s("What's My Age Again?", 149, "Blink-182"),
    s("Dysentery Gary", 133, "Blink-182"), s("Adam's Song", 245, "Blink-182"), s("All the Small Things", 167, "Blink-182"),
    s("The Party Song", 132, "Blink-182"), s("Mutt", 181, "Blink-182"), s("Wendy Clear", 152, "Blink-182"),
    s("Anthem", 222, "Blink-182"),
  ]},
  { id: 7, title: "Toxicity", artist: "System of a Down", genre: "Nu Metal", year: 2001, cover: "☠️", tracks: 14, songs: [
    s("Prison Song", 210, "System of a Down"), s("Needles", 202, "System of a Down"),
    s("Deer Dance", 178, "System of a Down"), s("Jet Pilot", 107, "System of a Down"),
    s("X", 120, "System of a Down"), s("Chop Suey!", 210, "System of a Down"),
    s("Bounce", 118, "System of a Down"), s("Forest", 244, "System of a Down"),
    s("ATWA", 156, "System of a Down"), s("Science", 230, "System of a Down"),
    s("Shimmy", 165, "System of a Down"), s("Toxicity", 213, "System of a Down"),
    s("Psycho", 149, "System of a Down"), s("Aerials", 374, "System of a Down"),
  ]},
  { id: 8, title: "From Under the Cork Tree", artist: "Fall Out Boy", genre: "Emo", year: 2005, cover: "🖤", tracks: 13, songs: [
    s("Our Lawyer Made Us Change the Name", 181, "Fall Out Boy"), s("Of All the Gin Joints", 175, "Fall Out Boy"),
    s("Dance, Dance", 183, "Fall Out Boy"), s("Sugar, We're Goin Down", 228, "Fall Out Boy"),
    s("Nobody Puts Baby in the Corner", 194, "Fall Out Boy"), s("I've Got a Dark Alley", 201, "Fall Out Boy"),
    s("7 Minutes in Heaven", 230, "Fall Out Boy"), s("Sophomore Slump or Comeback of the Year", 200, "Fall Out Boy"),
    s("Champagne for My Real Friends", 208, "Fall Out Boy"), s("I Slept with Someone in Fall Out Boy", 189, "Fall Out Boy"),
    s("A Little Less Sixteen Candles", 194, "Fall Out Boy"), s("Get Busy Living or Get Busy Dying", 202, "Fall Out Boy"),
    s("XO", 203, "Fall Out Boy"),
  ]},
  { id: 9, title: "All Killer No Filler", artist: "Sum 41", genre: "Pop Punk", year: 2001, cover: "💣", tracks: 13, songs: [
    s("Introduction to Destruction", 52, "Sum 41"), s("Nothing on My Back", 197, "Sum 41"),
    s("Never Wake Up", 175, "Sum 41"), s("Fat Lip", 179, "Sum 41"), s("Rhythms", 164, "Sum 41"),
    s("Motivation", 158, "Sum 41"), s("In Too Deep", 208, "Sum 41"), s("Summer", 178, "Sum 41"),
    s("Handle This", 167, "Sum 41"), s("Crazy Amanda Bunkface", 137, "Sum 41"),
    s("All She's Got", 186, "Sum 41"), s("Heart Attack", 132, "Sum 41"), s("Pain for Pleasure", 170, "Sum 41"),
  ]},
  { id: 10, title: "The Used", artist: "The Used", genre: "Emo", year: 2002, cover: "🩸", tracks: 12, songs: [
    s("Maybe Memories", 200, "The Used"), s("The Taste of Ink", 243, "The Used"),
    s("Bulimic", 162, "The Used"), s("Say Days Ago", 208, "The Used"),
    s("Poetic Tragedy", 228, "The Used"), s("On My Own", 248, "The Used"),
    s("Noise and Kisses", 213, "The Used"), s("Blue and Yellow", 247, "The Used"),
    s("Greener with the Scenery", 211, "The Used"), s("Pieces Mended", 202, "The Used"),
    s("Buried Myself Alive", 234, "The Used"), s("A Box Full of Sharp Objects", 209, "The Used"),
  ]},
  { id: 11, title: "Hybrid Theory", artist: "Linkin Park", genre: "Nu Metal", year: 2000, cover: "🦋", tracks: 12, songs: [
    s("Papercut", 184, "Linkin Park"), s("One Step Closer", 156, "Linkin Park"),
    s("With You", 203, "Linkin Park"), s("Points of Authority", 201, "Linkin Park"),
    s("Crawling", 209, "Linkin Park"), s("Runaway", 184, "Linkin Park"),
    s("By Myself", 190, "Linkin Park"), s("In the End", 216, "Linkin Park"),
    s("A Place for My Head", 182, "Linkin Park"), s("Forgotten", 194, "Linkin Park"),
    s("Cure for the Itch", 157, "Linkin Park"), s("Pushing Me Away", 192, "Linkin Park"),
  ]},
  { id: 12, title: "Take Off Your Pants and Jacket", artist: "Blink-182", genre: "Pop Punk", year: 2001, cover: "🎸", tracks: 13, songs: [
    s("Anthem Part Two", 232, "Blink-182"), s("Online Songs", 137, "Blink-182"),
    s("First Date", 181, "Blink-182"), s("Happy Holidays, You Bastard", 42, "Blink-182"),
    s("Story of a Lonely Guy", 175, "Blink-182"), s("The Rock Show", 173, "Blink-182"),
    s("Stay Together for the Kids", 230, "Blink-182"), s("Roller Coaster", 143, "Blink-182"),
    s("Reckless Abandon", 147, "Blink-182"), s("Everytime I Look for You", 195, "Blink-182"),
    s("Give Me One Good Reason", 184, "Blink-182"), s("Shut Up", 141, "Blink-182"),
    s("Please Take Me Home", 190, "Blink-182"),
  ]},
  { id: 13, title: "Three Cheers for Sweet Revenge", artist: "My Chemical Romance", genre: "Emo", year: 2004, cover: "🗡️", tracks: 13, songs: [
    s("Helena", 210, "My Chemical Romance"), s("Give 'Em Hell, Kid", 135, "My Chemical Romance"),
    s("To the End", 178, "My Chemical Romance"), s("You Know What They Do to Guys Like Us", 188, "My Chemical Romance"),
    s("I'm Not Okay (I Promise)", 195, "My Chemical Romance"), s("The Ghost of You", 219, "My Chemical Romance"),
    s("The Jetset Life Is Gonna Kill You", 219, "My Chemical Romance"), s("Interlude", 57, "My Chemical Romance"),
    s("Thank You for the Venom", 214, "My Chemical Romance"), s("Hang 'Em High", 186, "My Chemical Romance"),
    s("It's Not a Fashion Statement, It's a Deathwish", 186, "My Chemical Romance"),
    s("Cemetery Drive", 195, "My Chemical Romance"), s("I Never Told You What I Do for a Living", 273, "My Chemical Romance"),
  ]},
  { id: 14, title: "Anywhere but Here", artist: "Mayday Parade", genre: "Emo", year: 2009, cover: "🌙", tracks: 12, songs: [
    s("Kids in Love", 233, "Mayday Parade"), s("If You Wanted a Song Written About You", 237, "Mayday Parade"),
    s("The Silence", 235, "Mayday Parade"), s("Still Breathing", 222, "Mayday Parade"),
    s("Get Up", 199, "Mayday Parade"), s("Bruised and Scarred", 207, "Mayday Parade"),
    s("I Swear This Time I Mean It", 260, "Mayday Parade"), s("The End", 225, "Mayday Parade"),
    s("You Be the Anchor", 252, "Mayday Parade"), s("Center of Attention", 198, "Mayday Parade"),
    s("Miserable at Best", 275, "Mayday Parade"), s("When You See My Friends", 213, "Mayday Parade"),
  ]},
  { id: 15, title: "Brand New Eyes", artist: "Paramore", genre: "Pop Punk", year: 2009, cover: "🦋", tracks: 11, songs: [
    s("Careful", 224, "Paramore"), s("Ignorance", 217, "Paramore"), s("Playing God", 209, "Paramore"),
    s("Brick by Boring Brick", 250, "Paramore"), s("Turn It Off", 255, "Paramore"),
    s("The Only Exception", 263, "Paramore"), s("Feeling Sorry", 216, "Paramore"),
    s("Looking Up", 212, "Paramore"), s("Where the Lines Overlap", 183, "Paramore"),
    s("Misguided Ghosts", 206, "Paramore"), s("All I Wanted", 275, "Paramore"),
  ]},
  { id: 16, title: "Infinity on High", artist: "Fall Out Boy", genre: "Pop Punk", year: 2007, cover: "✨", tracks: 14, songs: [
    s("Thriller", 57, "Fall Out Boy"), s("The Take Over, the Breaks Over", 205, "Fall Out Boy"),
    s("This Ain't a Scene, It's an Arms Race", 203, "Fall Out Boy"), s("I'm Like a Lawyer", 232, "Fall Out Boy"),
    s("Hum Hallelujah", 231, "Fall Out Boy"), s("Golden", 196, "Fall Out Boy"),
    s("Thnks fr th Mmrs", 214, "Fall Out Boy"), s("Don't You Know Who I Think I Am?", 233, "Fall Out Boy"),
    s("The (After) Life of the Party", 212, "Fall Out Boy"), s("The Carpal Tunnel of Love", 193, "Fall Out Boy"),
    s("Bang the Doldrums", 186, "Fall Out Boy"), s("Fame < Infamy", 200, "Fall Out Boy"),
    s("You're Crashing, But You're No Wave", 187, "Fall Out Boy"), s("I've Got All This Ringing", 192, "Fall Out Boy"),
  ]},
  { id: 17, title: "Relationship of Command", artist: "At the Drive-In", genre: "Post-Hardcore", year: 2000, cover: "🔊", tracks: 13, songs: [
    s("Arcarsenal", 213, "At the Drive-In"), s("Pattern Against User", 192, "At the Drive-In"),
    s("One Armed Scissor", 272, "At the Drive-In"), s("Sleepwalk Capsules", 136, "At the Drive-In"),
    s("Invalid Litter Dept.", 260, "At the Drive-In"), s("Mannequin Republic", 135, "At the Drive-In"),
    s("Enfilade", 208, "At the Drive-In"), s("Rolodex Propaganda", 200, "At the Drive-In"),
    s("Quarantined", 226, "At the Drive-In"), s("Cosmonaut", 234, "At the Drive-In"),
    s("Non-Zero Possibility", 276, "At the Drive-In"), s("Catacombs", 108, "At the Drive-In"),
    s("Extracurricular", 158, "At the Drive-In"),
  ]},
  { id: 18, title: "Sing the Sorrow", artist: "AFI", genre: "Post-Hardcore", year: 2003, cover: "🖤", tracks: 13, songs: [
    s("Miseria Cantare", 98, "AFI"), s("The Leaving Song Pt. II", 235, "AFI"),
    s("Bleed Black", 206, "AFI"), s("Silver and Cold", 265, "AFI"),
    s("Dancing Through Sunday", 208, "AFI"), s("Girl's Not Grey", 192, "AFI"),
    s("Death of Seasons", 306, "AFI"), s("The Great Disappointment", 243, "AFI"),
    s("Paper Airplanes (Makeshift Wings)", 222, "AFI"), s("This Time Imperfect", 230, "AFI"),
    s("The Leaving Song", 155, "AFI"), s("...but home is nowhere", 346, "AFI"),
    s("Synesthesia", 39, "AFI"),
  ]},
  { id: 19, title: "Saosin", artist: "Saosin", genre: "Post-Hardcore", year: 2006, cover: "🌀", tracks: 11, songs: [
    s("It's Far Better to Learn", 195, "Saosin"), s("Voices", 201, "Saosin"),
    s("Sleepers", 240, "Saosin"), s("Finding Home", 217, "Saosin"),
    s("You're Not Alone", 237, "Saosin"), s("Follow and Feel", 210, "Saosin"),
    s("Bury Your Head", 219, "Saosin"), s("Collapse", 185, "Saosin"),
    s("Some Sense of Security", 188, "Saosin"), s("Pentagon", 204, "Saosin"),
    s("Come Close", 282, "Saosin"),
  ]},
  { id: 20, title: "Dear Diary, My Teen Angst Has a Body Count", artist: "From First to Last", genre: "Post-Hardcore", year: 2004, cover: "📓", tracks: 11, songs: [
    s("Populace in Two", 213, "From First to Last"), s("Note to Self", 199, "From First to Last"),
    s("Emily", 220, "From First to Last"), s("Ride the Wings of Pestilence", 198, "From First to Last"),
    s("Kiss Me, I'm Contagious", 210, "From First to Last"), s("The Latest Plague", 165, "From First to Last"),
    s("I Liked You Better Before You Were Naked on the Internet", 162, "From First to Last"),
    s("Secrets Don't Make Friends", 199, "From First to Last"), s("The Levy", 237, "From First to Last"),
    s("Minuet", 191, "From First to Last"), s("World War Me", 242, "From First to Last"),
  ]},
];

export const allSongs = albums.flatMap((a) =>
  a.songs.map((song) => ({ ...song, albumId: a.id, albumTitle: a.title, genre: a.genre, year: a.year }))
);

export type SongWithAlbum = (typeof allSongs)[number];
