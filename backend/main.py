import fastapi
import backend.models
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import albums, songs, users, playlists, auth
from backend.db.database import Base, engine

# Create the database tables from the models
Base.metadata.create_all(bind=engine)

app = fastapi.FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(users.router)
app.include_router(playlists.router)
app.include_router(albums.router)
app.include_router(songs.router)
app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}

