"""Album routes for the API"""

from fastapi import APIRouter, Depends, status, HTTPException
from ..schemas.album import Album
from .. import models
from ..db.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/albums", tags=["Albums"])


def album_to_dict(a):
    return {
        "id": a.id,
        "title": a.title,
        "artist": a.artist,
        "genre": a.genre,
        "year": a.year,
        "cover": a.cover,
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

#retrieves all the albums from the database
@router.get("/")
async def get_albums(db: Session = Depends(get_db)):
    albums = db.query(models.Album).all()
    return [album_to_dict(a) for a in albums]

#creates an album and adds it to the database
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_album(album: Album, db: Session = Depends(get_db)):
    new_album = models.Album(**album.model_dump(exclude_none=True))
    db.add(new_album)
    db.commit()
    db.refresh(new_album)
    return {"message": "Album created successfully", "album_id": new_album.id}

#retrieves only the songs from an album in the database
@router.get("/{album_id}/songs")
async def get_album_songs(album_id: int, db: Session = Depends(get_db)):
    album = db.query(models.Album).filter(models.Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Album with id {album_id} not found")
    songs = db.query(models.Song).filter(models.Song.album == album.title).all()
    return [song_to_dict(s) for s in songs]

#retrieves a single album from the database
@router.get("/{album_id}")
async def get_album(album_id: int, db: Session = Depends(get_db)):
    album = db.query(models.Album).filter(models.Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Album with id {album_id} not found")
    return album_to_dict(album)

#updates the contents of an album
@router.put("/{album_id}")
async def update_album(album_id: int, album: Album, db: Session = Depends(get_db)):
    db_album = db.query(models.Album).filter(models.Album.id == album_id).first()
    if not db_album:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Album with id {album_id} not found")
    for key, value in album.model_dump(exclude_none=True).items():
        setattr(db_album, key, value)
    db.commit()
    db.refresh(db_album)
    return {"message": f"Album {album_id} updated successfully"}

#removes an album from the database
@router.delete("/{album_id}")
async def delete_album(album_id: int, db: Session = Depends(get_db)):
    album = db.query(models.Album).filter(models.Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Album with id {album_id} not found")
    db.delete(album)
    db.commit()
    return {"message": f"Album {album_id} deleted successfully"}
