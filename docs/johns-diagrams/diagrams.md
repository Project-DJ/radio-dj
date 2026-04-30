# Radio DJ — CS321 Design Diagrams

---

## Diagram 1: Conceptual Class Diagram

```mermaid
classDiagram
    class DJ {
        name
        email
    }

    class Song {
        title
        artist
        bpm
        duration
    }

    class Album {
        title
        artist
        genre
        year
    }

    class Playlist {
        name
        description
        targetBpm
    }

    class Queue {
        currentPosition
    }

    class DJSession {
        startTime
        status
    }

    DJ "1" --> "0..*" Playlist : creates
    DJ "1" --> "0..1" DJSession : conducts
    Playlist "1" --> "0..*" Song : contains
    Album "1" --> "1..*" Song : groups
    Queue "1" --> "0..*" Song : holds
    DJSession "1" --> "1" Queue : manages
```

---

## Diagram 2: Detailed Class Diagram

```mermaid
classDiagram
    %% Domain Objects
    class User {
        +int id
        +String username
        +String email
        -String passwordHash
    }

    class Song {
        +int id
        +String title
        +String artist
        +String album
        +float bpm
        +int durationMs
        +String genre
        +String releaseDate
    }

    class Album {
        +int id
        +String title
        +String artist
        +String genre
        +int year
        +String cover
    }

    class Playlist {
        +int id
        +String name
        +String description
        +float targetBpm
    }

    class Queue {
        +int id
        +int currentPosition
        +addSong(song)
        +removeSong(songId)
        +advance()
    }

    class DJSession {
        +int id
        +DateTime startTime
        +String status
        +start()
        +end()
    }

    %% Business Logic Layer
    class PlaylistService {
        +addSongToPlaylist(playlistId, songId)
        +removeSongFromPlaylist(playlistId, songId)
        +getRecommendations(songId)
        +createPlaylist(name, targetBpm)
    }

    class QueueService {
        +addSongToQueue(songId)
        +removeSongFromQueue(songId)
        +getNextSong()
        +getCurrentQueue()
        +reorderQueue(songId, position)
    }

    %% Persistence Layer
    class SongRepository {
        +save(song)
        +findById(id)
        +findAll()
        +findByBpmRange(min, max)
        +delete(id)
    }

    class PlaylistRepository {
        +save(playlist)
        +findById(id)
        +findAll()
        +delete(id)
    }

    %% Relationships — Domain
    User "1" --> "0..*" Playlist : owns
    User "1" --> "0..1" DJSession : conducts
    Playlist "1" --> "0..*" Song : contains
    Album "1" --> "1..*" Song : groups
    Queue "1" --> "0..*" Song : holds
    DJSession "1" --> "1" Queue : manages

    %% Relationships — Service to Domain
    PlaylistService ..> Playlist : manages
    PlaylistService ..> Song : references
    QueueService ..> Queue : manages
    QueueService ..> Song : references

    %% Relationships — Service to Repository
    PlaylistService --> PlaylistRepository : uses
    QueueService --> SongRepository : uses
    PlaylistService --> SongRepository : uses
```

---

## Diagram 3: Sequence Diagram — Add Song to Queue

```mermaid
sequenceDiagram
    actor DJ
    participant UI as RadioDJ UI
    participant QC as QueueController
    participant QS as QueueService
    participant SR as SongRepository
    participant DB as Database

    DJ->>UI: Clicks "Add to Queue" on a song
    UI->>QC: addToQueue(songId)

    Note over QC,SR: Application Layer
    QC->>QS: addSongToQueue(songId)
    QS->>SR: findById(songId)

    Note over SR,DB: Persistence Layer
    SR->>DB: SELECT * FROM songs WHERE id = songId
    DB-->>SR: Song record
    SR-->>QS: Song object

    QS->>QS: validate(song)
    QS->>QS: appendToQueue(song)
    QS->>SR: save(updatedQueue)
    SR->>DB: INSERT / UPDATE queue record
    DB-->>SR: OK

    QS-->>QC: updatedQueue
    QC-->>UI: 200 OK { queue: [...] }
    UI-->>DJ: Queue panel updates with new song
```

---

## Diagram 4: Layered Architecture Diagram

```mermaid
flowchart TD
    subgraph UI["UI Layer"]
        SLS[SongLibraryScreen]
        PS[PlaylistScreen]
        QP[QueuePanel]
        PBC[PlaybackControls]
    end

    subgraph APP["Application / Business Logic Layer"]
        PLsvc[PlaylistService]
        QSvc[QueueService]
        DSM[DJSessionManager]
        VAL[Validation Logic]
    end

    subgraph PERSIST["Persistence Layer"]
        SR[SongRepository]
        PLR[PlaylistRepository]
        DB[(Database)]
    end

    SLS --> PLsvc
    SLS --> QSvc
    PS  --> PLsvc
    QP  --> QSvc
    PBC --> DSM

    PLsvc --> SR
    PLsvc --> PLR
    QSvc  --> SR
    DSM   --> QSvc

    SR  --> DB
    PLR --> DB

    note["Business logic lives in the Application Layer.\nUI components only call services.\nRepositories only access the database."]

    style UI      fill:#dbeafe,stroke:#3b82f6,color:#1e3a8a
    style APP     fill:#dcfce7,stroke:#22c55e,color:#14532d
    style PERSIST fill:#fef9c3,stroke:#eab308,color:#713f12
    style note    fill:#f3f4f6,stroke:#9ca3af,color:#374151
```
