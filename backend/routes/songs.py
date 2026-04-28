"""
using spotify api to get music 
metadata, storing it within our own database
allowing user to only enter title, artist, and album.
"""

import os
import requests
import base64
from fastapi import APIRouter, status, HTTPException
from dotenv import load_dotenv
from pathlib import Path
from ..schemas.song import SongBase
from .. import models
from ..db.database import get_db
from sqlalchemy.orm import Session


load_dotenv()
CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
print(f"Loaded Spotify credentials: {CLIENT_ID}, {CLIENT_SECRET}")

router = APIRouter(prefix="/songs", tags=["Songs"])

"""CRUD endpoints for songs, including:"""


# Create a song (POST /songs/)
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_song(song: SongBase, db: Session = get_db()):
    new_song = models.Song(**dict(song))
    db.add(new_song)
    db.commit()
    db.refresh(new_song)
    return {"message": "Create a song"}


# Get a song by ID (GET /songs/{song_id})
@router.get("/{song_id}")
async def get_song(song_id: int, db: Session = get_db()):
    song = db.query(models.Song).filter(models.Song.id == song_id).first()
    if not song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Song with id {song_id} not found")
    return song


# Update a song by ID (PUT /songs/{song_id})
@router.put("/{song_id}")
async def update_song(song_id: int, song: SongBase, db: Session = get_db()):
    db_song = db.query(models.Song).filter(models.Song.id == song_id).first()
    if not db_song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Song with id {song_id} not found")
    for key, value in dict(song).items():
        setattr(db_song, key, value)
    db.commit()
    db.refresh(db_song)
    return {"message": f"Update song {song_id}"}


# Delete a song by ID (DELETE /songs/{song_id})
@router.delete("/{song_id}")
async def delete_song(song_id: int, db: Session = get_db()):
    song = db.query(models.Song).filter(models.Song.id == song_id).first()
    if not song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Song with id {song_id} not found")
    db.delete(song)
    db.commit()
    return {"message": f"Delete song {song_id}"}


# Spotify API integration to get song metadata based on title, artist, and album
def get_access_token():
    auth_string = f"{CLIENT_ID}:{CLIENT_SECRET}"
    auth_b64 = base64.b64encode(auth_string.encode()).decode()

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": f"Basic {auth_b64}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}

    r = requests.post(url, headers=headers, data=data, timeout=15)
    r.raise_for_status()
    return r.json()["access_token"]


# Search for a song on Spotify and return metadata based on title, artist, and album
def search_song(song_name, artist, album):
    token = get_access_token()

    query = f'track:"{song_name}" artist:"{artist}" album:"{album}"'
    url = "https://api.spotify.com/v1/search"
    headers = {"Authorization": f"Bearer {token}"}
    params = {
        "q": query,
        "type": "track",
        "limit": 5
    }

    r = requests.get(url, headers=headers, params=params, timeout=15)
    r.raise_for_status()
    return r.json()


# Get artist information from Spotify API
def get_artist(artist_id, token):
    url = f"https://api.spotify.com/v1/artists/{artist_id}"
    headers = {"Authorization": f"Bearer {token}"}

    r = requests.get(url, headers=headers, timeout=15)
    r.raise_for_status()
    return r.json()


# Main function to get song metadata based on title, artist, and album
def get_song_metadata(song_name, artist, album):
    token = get_access_token()

    query = f'track:"{song_name}" artist:"{artist}" album:"{album}"'
    search_url = "https://api.spotify.com/v1/search"
    headers = {"Authorization": f"Bearer {token}"}
    params = {"q": query, "type": "track", "limit": 5}

    r = requests.get(search_url, headers=headers, params=params, timeout=15)
    r.raise_for_status()

    items = r.json().get("tracks", {}).get("items", [])
    if not items:
        return None

    track = items[0]
    first_artist = track["artists"][0]
    artist_data = get_artist(first_artist["id"], token)

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
        "track_number": track.get("track_number"),
        "disc_number": track.get("disc_number"),
        "isrc": track.get("external_ids", {}).get("isrc"),
        "album_images": track["album"].get("images", []),
    }


# Example usage
if __name__ == "__main__":
    metadata = get_song_metadata("Blinding Lights", "The Weeknd", "After Hours")
    print(metadata)