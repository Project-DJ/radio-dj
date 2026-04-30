"""
using spotify api to get music
metadata, storing it within our own database
allowing user to only enter title, artist, and album.
"""

import os
import tempfile
import requests
import base64
import librosa
from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File
from dotenv import load_dotenv
from pydantic import BaseModel
from ..schemas.song import SongBase
from .. import models
from ..db.database import get_db
from sqlalchemy.orm import Session


class SongSearchInput(BaseModel):
    title: str
    artist: str
    album: str
    owner_id: int | None = None


load_dotenv()
CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

router = APIRouter(prefix="/songs", tags=["Songs"])


def song_to_dict(s):
    return {
        "id": s.id,
        "title": s.title,
        "artist": s.artist,
        "album": s.album,
        "duration_ms": s.duration_ms,
        "bpm": s.bpm,
        "artist_genre": s.artist_genre,
        "release_date": s.release_date,
        "owner_id": s.owner_id,
    }

#retrives songs from the database
@router.get("/")
async def get_songs(db: Session = Depends(get_db)):
    songs = db.query(models.Song).all()
    return [song_to_dict(s) for s in songs]

#creates a song and adds it to the database
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_song(song: SongBase, db: Session = Depends(get_db)):
    new_song = models.Song(**song.model_dump(exclude_none=True))
    db.add(new_song)
    db.commit()
    db.refresh(new_song)
    return {"message": "Song created successfully", "song_id": new_song.id}

#searches for a song with inputs and adds it to the database HTTPException on error
@router.post("/search_and_add", status_code=status.HTTP_201_CREATED)
async def search_and_add(body: SongSearchInput, db: Session = Depends(get_db)):
    metadata = get_song_metadata(body.title, body.artist, body.album)
    if not metadata:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found on Spotify")

    artist_str = ", ".join(metadata["artist_names"])
    genre_str = ", ".join(metadata["artist_genres"][:3]) if metadata["artist_genres"] else None

    existing = db.query(models.Song).filter(
        models.Song.title == metadata["track_name"],
        models.Song.artist == artist_str,
    ).first()
    if existing:
        return {"song": song_to_dict(existing), "spotify": metadata, "created": False}

    new_song = models.Song(
        title=metadata["track_name"],
        artist=artist_str,
        album=metadata["album_name"],
        duration_ms=metadata["duration_ms"],
        artist_genre=genre_str,
        release_date=metadata.get("release_date"),
        bpm=metadata.get("tempo"),
        owner_id=body.owner_id,
    )
    db.add(new_song)
    db.commit()
    db.refresh(new_song)
    return {"song": song_to_dict(new_song), "spotify": metadata, "created": True}

#finds the bpm of a selected song
@router.post("/{song_id}/detect_bpm")
async def detect_bpm(song_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    song = db.query(models.Song).filter(models.Song.id == song_id).first()
    if not song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")

    suffix = os.path.splitext(file.filename)[1] or ".mp3"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    y, sr = librosa.load(tmp_path, mono=True)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    os.unlink(tmp_path)

    song.bpm = round(float(tempo), 1)
    db.commit()
    db.refresh(song)
    return {"song_id": song.id, "title": song.title, "bpm": song.bpm}

#finds a song in the database using id number
@router.get("/{song_id}")
async def get_song(song_id: int, db: Session = Depends(get_db)):
    song = db.query(models.Song).filter(models.Song.id == song_id).first()
    if not song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Song with id {song_id} not found")
    return song_to_dict(song)

#updates the fields of a song in the database
@router.put("/{song_id}")
async def update_song(song_id: int, song: SongBase, db: Session = Depends(get_db)):
    db_song = db.query(models.Song).filter(models.Song.id == song_id).first()
    if not db_song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Song with id {song_id} not found")
    for key, value in song.model_dump(exclude_none=True).items():
        setattr(db_song, key, value)
    db.commit()
    db.refresh(db_song)
    return {"message": f"Song {song_id} updated successfully"}

#removes a song from the database HTTPException on error
@router.delete("/{song_id}")
async def delete_song(song_id: int, db: Session = Depends(get_db)):
    song = db.query(models.Song).filter(models.Song.id == song_id).first()
    if not song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Song with id {song_id} not found")
    db.delete(song)
    db.commit()
    return {"message": f"Song {song_id} deleted successfully"}

#edits the metadata of a song in the database HTTPException upon failure to find selected song
@router.post("/{song_id}/enrich_metadata")
async def enrich_metadata(song_id: int, db: Session = Depends(get_db)):
    song = db.query(models.Song).filter(models.Song.id == song_id).first()
    if not song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Song with id {song_id} not found")
    metadata = get_song_metadata(song.title, song.artist, song.album)
    if not metadata:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found on Spotify")
    song.release_date = metadata.get("release_date")
    song.artist_genre = ", ".join(metadata.get("artist_genres", []))
    db.commit()
    db.refresh(song)
    return metadata


def get_access_token():
    auth_string = f"{CLIENT_ID}:{CLIENT_SECRET}"
    auth_b64 = base64.b64encode(auth_string.encode()).decode()
    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": f"Basic {auth_b64}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    r = requests.post(url, headers=headers, data={"grant_type": "client_credentials"}, timeout=15)
    r.raise_for_status()
    return r.json()["access_token"]

#finds song artist through spotify api
def get_artist(artist_id, token):
    r = requests.get(f"https://api.spotify.com/v1/artists/{artist_id}",
                     headers={"Authorization": f"Bearer {token}"}, timeout=15)
    r.raise_for_status()
    return r.json()

#finds audio features through spotify api
def get_audio_features(track_id, token):
    r = requests.get(f"https://api.spotify.com/v1/audio-features/{track_id}",
                     headers={"Authorization": f"Bearer {token}"}, timeout=15)
    if r.status_code == 200:
        return r.json()
    return None

#finds song metadata through spotify api
def get_song_metadata(song_name, artist, album):
    token = get_access_token()
    query = f'track:"{song_name}" artist:"{artist}" album:"{album}"'
    r = requests.get("https://api.spotify.com/v1/search",
                     headers={"Authorization": f"Bearer {token}"},
                     params={"q": query, "type": "track", "limit": 5}, timeout=15)
    r.raise_for_status()
    items = r.json().get("tracks", {}).get("items", [])
    if not items:
        return None
    track = items[0]
    artist_data = get_artist(track["artists"][0]["id"], token)
    audio_features = get_audio_features(track["id"], token)
    tempo = round(audio_features["tempo"], 1) if audio_features and audio_features.get("tempo") else None
    return {
        "track_name": track["name"],
        "track_id": track["id"],
        "spotify_url": track["external_urls"]["spotify"],
        "album_name": track["album"]["name"],
        "release_date": track["album"].get("release_date"),
        "artist_names": [a["name"] for a in track["artists"]],
        "artist_genres": artist_data.get("genres", []),
        "duration_ms": track.get("duration_ms"),
        "explicit": track.get("explicit"),
        "popularity": track.get("popularity"),
        "isrc": track.get("external_ids", {}).get("isrc"),
        "album_images": track["album"].get("images", []),
        "tempo": tempo,
    }
