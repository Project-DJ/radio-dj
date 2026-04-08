from fastapi import fastapi, APIRouter, status

router = fastapi.APIRouter()

@router.get(prefix="/users", tags=["Users"])
async def get_users():
    return {"message": "Get users"}



"""CRUD endpoints for users"""

@router.post("/users", status_code=status.HTTP_201_CREATED)
async def create_user():
    return {"message": "Create a user"}

@router.get("/users/{user_id}")
async def get_user(user_id: int):
    return {"message": f"Get user {user_id}"}

@router.put("/users/{user_id}")
async def update_user(user_id: int):
    return {"message": f"Update user {user_id}"}

@router.delete("/users/{user_id}")
async def delete_user(user_id: int):
    return {"message": f"Delete user {user_id}"}