from fastapi import APIRouter, Depends, HTTPException, status
from ..db.database import get_db        #allow us to access the database session for CRUD operations
from ..schemas.playlist import PlaylistBase     #allow us to access user schema for request validation
from .. import models                   #allow us to access database user model
from sqlalchemy.orm import Session      #allow us to perform database operations using SQLAlchemy ORM


router = APIRouter(prefix="/playlists", tags=["Playlists"])



"""CRUD endpoints for playlists, including:"""


# Create a new playlist by providing a name, description, and user ID. Return a message confirming the creation of the playlist along with its ID.
@router.post("/")
async def create_playlist(playlist: PlaylistBase, db: Session = Depends(get_db)):
    new_playlist = models.Playlist(**dict(playlist))
    db.add(new_playlist)
    db.commit()
    db.refresh(new_playlist)

    return {"message": f"Playlist {new_playlist.name} created successfully", "playlist_id": new_playlist.id}


# Add a song to a playlist by its ID, and return a message confirming the addition. If the playlist or song does not exist, return a 404 error.
@router.post("/{playlist_id}/add_music")
async def add_music_to_playlist(playlist_id: int, song_id: int, db: Session = Depends(get_db)):
    song_to_add = db.query(models.Song).filter(models.Song.id == song_id).first()
    if not song_to_add:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Song with id {song_id} not found")
    db.execute(models.playlist_songs.insert().values(playlist_id=playlist_id, song_id=song_id))
    db.commit()

    return {"message": f"Song {song_to_add.title} added to playlist {playlist_id}"}


# Remove a song from a playlist by providing the playlist ID and song ID. If either the playlist or song does not exist, return a 404 error. Otherwise, return a message confirming the removal of the song from the playlist.
@router.post("/{playlist_id}/remove_music")
async def remove_music_from_playlist(playlist_id: int, song_id: int, db: Session = Depends(get_db)):
    song_to_remove = db.query(models.Song).filter(models.Song.id == song_id).first()
    if not song_to_remove:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Song with id {song_id} not found")
    db.execute(models.playlist_songs.delete().where(models.playlist_songs.c.playlist_id == playlist_id and models.playlist_songs.c.song_id == song_id))
    db.commit()
    return {"message": f"Song {song_to_remove.title} removed from playlist {playlist_id}"}

@router.get("/{playlist_id}")
async def get_playlist(playlist_id: int, db: Session = Depends(get_db)):
    playlist = db.query(models.Playlist).filter(models.Playlist.id == playlist_id).first()
    if not playlist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Playlist with id {playlist_id} not found")
    return playlist

# Delete a playlist by its ID, and return a message confirming the deletion. If the playlist does not exist, return a 404 error.
@router.delete("/{playlist_id}")
async def delete_playlist(playlist_id: int, db: Session = Depends(get_db)):
    playlist = db.query(models.Playlist).filter(models.Playlist.id == playlist_id).first()
    if not playlist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Playlist with id {playlist_id} not found")
    db.delete(playlist)
    db.commit()
    return {"message": f"Delete playlist {playlist_id}"}


