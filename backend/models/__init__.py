"""
Models to create database tables for:

        music metadata
        user accounts
        user playlists


    music table includes:
        title
        artist
        album
        genre
        duration

        
    user table includes:
        username
        email
        password
        public
        playlists foreign key (one to many relationship, connecting the user to their saved playlists)

    
    playlist table includes: (subject to change)
        name
        description
        public(boolean)
        duration
        creator_id
        created_at
        user foreign key (many to one relationship, connecting the playlist to its creator)
        music foreign key (many to many relationship, connecting the playlist to the music it contains)
        

"""


from sqlalchemy import Table, Column, Integer, ForeignKey
from ..db.database import Base

playlist_songs = Table("playlist_songs", Base.metadata,
    Column("playlist_id", Integer, ForeignKey("playlists.id"), primary_key=True),
    Column("song_id", Integer, ForeignKey("songs.id"), primary_key=True),
)

playlist_users = Table("playlist_users", Base.metadata,
    Column("playlist_id", Integer, ForeignKey("playlists.id"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
)

from .album import Album
from .song import Song
from .user import User
from .playlist import Playlist
