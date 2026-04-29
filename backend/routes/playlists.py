from fastapi import APIRouter, Depends, HTTPException, status
from ..db.database import get_db
from ..schemas.playlist import PlaylistBase
from .. import models
from sqlalchemy.orm import Session


router = APIRouter(prefix="/playlists", tags=["Playlists"])


def playlist_to_dict(p):
    return {
        "id": p.id,
        "name": p.name,
        "description": p.description,
        "target_bpm": p.target_bpm,
    }

def song_to_dict(s):
    return {
        "id": s.id,
        "title": s.title,
        "artist": s.artist,
        "album": s.album,
        "duration_ms": s.duration_ms,
        "bpm": s.bpm,
        "owner_id": s.owner_id,
    }


@router.get("/")
async def get_playlists(db: Session = Depends(get_db)):
    playlists = db.query(models.Playlist).all()
    return [playlist_to_dict(p) for p in playlists]


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_playlist(playlist: PlaylistBase, db: Session = Depends(get_db)):
    new_playlist = models.Playlist(**playlist.model_dump(exclude_none=True))
    db.add(new_playlist)
    db.commit()
    db.refresh(new_playlist)
    return {"message": f"Playlist {new_playlist.name} created successfully", "playlist_id": new_playlist.id}


@router.post("/{playlist_id}/add_music")
async def add_music_to_playlist(playlist_id: int, song_id: int, db: Session = Depends(get_db)):
    playlist = db.query(models.Playlist).filter(models.Playlist.id == playlist_id).first()
    if not playlist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Playlist with id {playlist_id} not found")
    song_to_add = db.query(models.Song).filter(models.Song.id == song_id).first()
    if not song_to_add:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Song with id {song_id} not found")
    db.execute(models.playlist_songs.insert().values(playlist_id=playlist_id, song_id=song_id))
    db.commit()

    recommendations = []
    if song_to_add.bpm:
        existing_ids = {s.id for s in playlist.songs}
        recommendations = (
            db.query(models.Song)
            .filter(
                models.Song.bpm.between(song_to_add.bpm - 10, song_to_add.bpm + 10),
                models.Song.id != song_id,
                ~models.Song.id.in_(existing_ids),
            )
            .limit(5)
            .all()
        )

    return {
        "message": f"Song {song_to_add.title} added to playlist {playlist_id}",
        "recommendations": [song_to_dict(s) for s in recommendations],
    }


@router.post("/{playlist_id}/remove_music")
async def remove_music_from_playlist(playlist_id: int, song_id: int, db: Session = Depends(get_db)):
    song_to_remove = db.query(models.Song).filter(models.Song.id == song_id).first()
    if not song_to_remove:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Song with id {song_id} not found")
    db.execute(models.playlist_songs.delete().where(
        (models.playlist_songs.c.playlist_id == playlist_id) &
        (models.playlist_songs.c.song_id == song_id)
    ))
    db.commit()
    return {"message": f"Song {song_to_remove.title} removed from playlist {playlist_id}"}


@router.get("/{playlist_id}")
async def get_playlist(playlist_id: int, db: Session = Depends(get_db)):
    playlist = db.query(models.Playlist).filter(models.Playlist.id == playlist_id).first()
    if not playlist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Playlist with id {playlist_id} not found")
    return playlist_to_dict(playlist)


@router.get("/{playlist_id}/songs")
async def get_playlist_songs(playlist_id: int, db: Session = Depends(get_db)):
    playlist = db.query(models.Playlist).filter(models.Playlist.id == playlist_id).first()
    if not playlist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Playlist with id {playlist_id} not found")

    songs = playlist.songs
    if playlist.target_bpm and songs:
        songs = sorted(songs, key=lambda s: abs((s.bpm or 0) - playlist.target_bpm))

    return {
        "playlist": playlist_to_dict(playlist),
        "songs": [song_to_dict(s) for s in songs],
    }


@router.delete("/{playlist_id}")
async def delete_playlist(playlist_id: int, db: Session = Depends(get_db)):
    playlist = db.query(models.Playlist).filter(models.Playlist.id == playlist_id).first()
    if not playlist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Playlist with id {playlist_id} not found")
    db.delete(playlist)
    db.commit()
    return {"message": f"Playlist {playlist_id} deleted"}
