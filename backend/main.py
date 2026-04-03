import fastapi
from backend.routes import users, playlists

app = fastapi.FastAPI()
app.include_router(users.router)
app.include_router(playlists.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}

