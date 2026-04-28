"""Album routes for the API"""

from fastapi import APIRouter, status, HTTPException
from ..schemas.album import Album
from .. import models
from ..db.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/albums", tags=["Albums"])

"""CRUD endpoints for albums, including:"""


# Create an album by providing the title and artist. Return a message confirming the creation of the album along with its ID.
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_album(album: Album, db: Session = get_db()):
    new_album = models.Album(**dict(album))
    db.add(new_album)
    db.commit()
    db.refresh(new_album)
    return {"message": "Create an album"}


# Get an album by ID (GET /albums/{album_id})
@router.get("/{album_id}")
async def get_album(album_id: int, db: Session = get_db()):
    album = db.query(models.Album).filter(models.Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Album with id {album_id} not found")
    return album


# Update an album by ID (PUT /albums/{album_id})
@router.put("/{album_id}")
async def update_album(album_id: int, album: Album, db: Session = get_db()):
    db_album = db.query(models.Album).filter(models.Album.id == album_id).first()
    if not db_album:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Album with id {album_id} not found")
    for key, value in dict(album).items():
        setattr(db_album, key, value)
    db.commit()
    db.refresh(db_album)
    return {"message": f"Update album {album_id}"}


# Delete an album by ID (DELETE /albums/{album_id})
@router.delete("/{album_id}")
async def delete_album(album_id: int, db: Session = get_db()):
    album = db.query(models.Album).filter(models.Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Album with id {album_id} not found")
    db.delete(album)
    db.commit()
    return {"message": f"Delete album {album_id}"}

