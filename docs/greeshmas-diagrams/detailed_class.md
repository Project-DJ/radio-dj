
# Radio DJ — CS321 Design Diagrams - Greeshma

---

## Detailed Class Diagram

```mermaid
classDiagram
    class User {
        +int id
        +string username
        +string email
        +string hashed_password
        +List~Album~ albums
        +List~Playlist~ playlists
    }
    class Album {
        +int id
        +string title
        +string artist
        +int year
        +string genre
        +int owner_id
    }
    class Song {
        +int id
        +string title
        +string artist
        +string album
        +float bpm
        +int duration_ms
        +detect_bpm(file)
        +enrich_metadata()
    }
    class Playlist {
        +int id
        +string name
        +float target_bpm
        +int owner_id
        +List~Song~ songs
        +add_song(song_id)
        +get_recommendations()
    }

    User "1" --> "*" Album : creates
    User "1" --> "*" Playlist : manages
    Playlist "many" -- "many" Song : contains
```