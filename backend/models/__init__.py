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