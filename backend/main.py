import fastapi
from backend.routes import albums, songs, users, playlists
from backend.db.database import Base, engine

# Create the database tables from the models
Base.metadata.create_all(bind=engine)

app = fastapi.FastAPI()
app.include_router(users.router)
app.include_router(playlists.router)
app.include_router(albums.router)
app.include_router(songs.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}

