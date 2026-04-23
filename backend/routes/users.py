from fastapi import APIRouter, status, Depends, HTTPException

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/")
def get_users():
    return {"message": "Get users"}



"""CRUD endpoints for users"""

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user():
    return {"message": "Create a user"}

@router.get("/{user_id}")
async def get_user(user_id: int):
    return {"message": f"Get user {user_id}"}

@router.put("/{user_id}")
async def update_user(user_id: int):
    return {"message": f"Update user {user_id}"}

@router.delete("/{user_id}")
async def delete_user(user_id: int):
    return {"message": f"Delete user {user_id}"}