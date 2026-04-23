"""Album routes for the API"""

from fastapi import APIRouter, status

router = APIRouter(prefix="/albums", tags=["Albums"])

"""CRUD endpoints for albums, including:"""

@router.post("/")
async def create_album():
    return {"message": "Create an album"}

@router.get("/{album_id}")
async def get_album(album_id: int):
    return {"message": f"Get album {album_id}"}

@router.put("/{album_id}")
async def update_album(album_id: int):
    return {"message": f"Update album {album_id}"}

@router.delete("/{album_id}")
async def delete_album(album_id: int):
    return {"message": f"Delete album {album_id}"}
