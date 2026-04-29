from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from .. import models
from ..db.database import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class RegisterInput(BaseModel):
    username: str
    email: str
    password: str


class LoginInput(BaseModel):
    email: str
    password: str


def user_to_dict(u):
    return {"id": u.id, "username": u.username, "email": u.email}


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(body: RegisterInput, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(models.User).filter(models.User.username == body.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    new_user = models.User(
        username=body.username,
        email=body.email,
        password_hash=pwd_context.hash(body.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": f"Welcome, {new_user.username}!", "user": user_to_dict(new_user)}


@router.post("/login")
async def login(body: LoginInput, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == body.email).first()
    if not user or not pwd_context.verify(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": f"Welcome back, {user.username}!", "user": user_to_dict(user)}
