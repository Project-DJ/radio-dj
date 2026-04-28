from fastapi import APIRouter, status, Depends, HTTPException
from ..db.database import get_db        #allow us to access the database session for CRUD operations
from ..schemas.user import UserBase     #allow us to access user schema for request validation
from .. import models                   #allow us to access database user model
from sqlalchemy.orm import Session      #allow us to perform database operations using SQLAlchemy ORM


router = APIRouter(prefix="/users", tags=["Users"])

# Test endpoint - returns a simple message to confirm that the users router is working.
@router.get("/")
def get_users():
    return {"message": "Get users"}



"""CRUD endpoints for users"""


# Create user endpoint - creates a new user in the database using the data from the request body and returns a success message with the new user's ID.
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserBase, db: Session = Depends(get_db)):
    new_user = models.User(**dict(user)) # create a new user instance using the User model
    db.add(new_user)                     # and the data from the request body
    db.commit()
    db.refresh(new_user)

    return {"message": f"User {new_user.username} created successfully", "user_id": new_user.id}


# Get user endpoint - retrieves a user's information by ID and returns it. If the user is not found, it raises a 404 error.
@router.get("/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"id": user.id, "username": user.username,}


# Update user endpoint - updates a user's information by ID and returns a success message. If the user is not found, it raises a 404 error.
@router.put("/{user_id}")
async def update_user(user: UserBase, user_id: int, db: Session = Depends(get_db)):
    user_to_update = db.query(models.User).filter(models.User.id == user_id).first()
    if not user_to_update:
        raise HTTPException(status_code=404, detail="User not found")
    
    for key, value in dict(user).items():
        setattr(user_to_update, key, value)
    db.commit()
    db.refresh(user_to_update)

    return {"message": f"User {user_to_update.id} updated successfully"}


# Delete user endpoint - deletes a user by ID and returns a success message. If the user is not found, it raises a 404 error.
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    user_to_delete = db.query(models.User).filter(models.User.id == user_id).first()
    if not user_to_delete:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user_to_delete)
    db.commit()

    return {"message": f"User {user_id} deleted successfully"}