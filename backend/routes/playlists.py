"""
routes for user playlists, including: CRUD
- creating a playlist
- adding music to a playlist
- removing music from a playlist
- deleting a playlist
"""




from fastapi import APIRouter, status
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter(prefix="/playlists", tags=["Playlists"])



"""CRUD endpoints for playlists, including:"""

@router.post("/")
async def create_playlist():
    return {"message": "Create a playlist"}

@router.post("/{playlist_id}/add_music")
async def add_music_to_playlist(playlist_id: int):
    return {"message": f"Add music to playlist {playlist_id}"}

@router.post("/{playlist_id}/remove_music")
async def remove_music_from_playlist(playlist_id: int):
    return {"message": f"Remove music from playlist {playlist_id}"}

@router.delete("/{playlist_id}")
async def delete_playlist(playlist_id: int):
    return {"message": f"Delete playlist {playlist_id}"}


