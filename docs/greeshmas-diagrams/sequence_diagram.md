
# Radio DJ — CS321 Design Diagrams - Greeshma

---

## Sequence Diagram - Album Search

```mermaid
sequenceDiagram
    participant U as User
    participant S as Sidebar (FilterDropdown)
    participant I as Index Page (Main)
    participant M as useMemo (Filter Logic)
    participant G as Album Grid

    U->>S: Clicks "Album" Dropdown
    S->>U: Displays Search Input & Album list
    U->>S: Types album name in Search Input
    S->>U: Displays filtered checkboxes
    U->>S: Checks an Album name
    S->>I: Calls onToggleAlbum(albumName)
    I->>I: Updates albumNames state array
    I->>M: Triggers re-calculation of "filtered" array
    M->>M: Checks: a.title.includes(selectedAlbumNames)
    M-->>I: Returns new "filtered" list
    I->>G: Re-renders grid with filtered albums
    G-->>U: Displays only selected albums
    User "1" --> "*" Album : creates
    User "1" --> "*" Playlist : manages
    Playlist "many" -- "many" Song : contains
```