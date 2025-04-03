import AppDataSource from "../data-source";
import { Artist, ArtistRating, Genre } from "../entity/Artist";

export const populateArtists = async () => {
    const artistRepository = AppDataSource.getRepository(Artist);
    
    const artistsToAdd = [
        // Nigerian Artists
        { artist_name: "Burna Boy", rating: ArtistRating.A, nationality: "Nigeria", genre: [Genre.AFROBEATS] },
        { artist_name: "Wizkid", rating: ArtistRating.A, nationality: "Nigeria", genre: [Genre.AFROBEATS, Genre.AFRO_POP] },
        { artist_name: "Davido", rating: ArtistRating.A, nationality: "Nigeria", genre: [Genre.AFROBEATS] },
        { artist_name: "Tiwa Savage", rating: ArtistRating.B, nationality: "Nigeria", genre: [Genre.AFRO_POP] },
        { artist_name: "Olamide", rating: ArtistRating.B, nationality: "Nigeria", genre: [Genre.HIPHOP, Genre.AFROBEATS] },
        { artist_name: "Asake", rating: ArtistRating.B, nationality: "Nigeria", genre: [Genre.AFROBEATS, Genre.FUJI] },
        { artist_name: "Rema", rating: ArtistRating.B, nationality: "Nigeria", genre: [Genre.AFRO_POP] },
        { artist_name: "Tems", rating: ArtistRating.B, nationality: "Nigeria", genre: [Genre.AFRO_POP, Genre.SOUL] },
        { artist_name: "Fireboy DML", rating: ArtistRating.B, nationality: "Nigeria", genre: [Genre.AFRO_POP] },
        { artist_name: "Pheelz", rating: ArtistRating.C, nationality: "Nigeria", genre: [Genre.AFRO_POP, Genre.ELECTRONIC] },
        
        // USA Artists
        { artist_name: "Drake", rating: ArtistRating.A, nationality: "USA", genre: [Genre.HIPHOP, Genre.POP] },
        { artist_name: "Beyoncé", rating: ArtistRating.A, nationality: "USA", genre: [Genre.POP, Genre.RNB] },
        { artist_name: "Kendrick Lamar", rating: ArtistRating.A, nationality: "USA", genre: [Genre.HIPHOP] },
        { artist_name: "Billie Eilish", rating: ArtistRating.B, nationality: "USA", genre: [Genre.POP, Genre.ELECTRONIC] },
        { artist_name: "Taylor Swift", rating: ArtistRating.A, nationality: "USA", genre: [Genre.POP, Genre.COUNTRY] },
        
        // UK Artists
        { artist_name: "Stormzy", rating: ArtistRating.A, nationality: "UK", genre: [Genre.UK_DRILL, Genre.GRIME] },
        { artist_name: "Adele", rating: ArtistRating.A, nationality: "UK", genre: [Genre.POP, Genre.CLASSICAL] },
        { artist_name: "Ed Sheeran", rating: ArtistRating.A, nationality: "UK", genre: [Genre.POP] },
        { artist_name: "Skepta", rating: ArtistRating.B, nationality: "UK", genre: [Genre.GRIME, Genre.HIPHOP] },
        { artist_name: "Dua Lipa", rating: ArtistRating.B, nationality: "UK", genre: [Genre.POP, Genre.ELECTRONIC] },
        { artist_name: "Central Cee", rating: ArtistRating.B, nationality: "UK", genre: [Genre.UK_DRILL, Genre.HIPHOP] }
    ];

    try {
        // Get all existing artists
        const existingArtists = await artistRepository.find();
        const existingArtistNames = existingArtists.map(artist => artist.artist_name.toLowerCase());
        
        // Filter out artists that already exist in the database
        const newArtists = artistsToAdd.filter(artist => 
            !existingArtistNames.includes(artist.artist_name.toLowerCase())
        );
        
        // If there are new artists to add
        if (newArtists.length > 0) {
            await artistRepository.save(newArtists);
            console.log(`${newArtists.length} new artists added successfully!`);
            
            // Log the names of newly added artists
            console.log("Added artists:", newArtists.map(a => a.artist_name).join(", "));
        } else {
            console.log("No new artists to add. All artists already exist in the database.");
        }
        
        // Log total count of artists in database
        const totalCount = await artistRepository.count();
        console.log(`Total artists in database: ${totalCount}`);
        
    } catch (error) {
        console.error("Error populating artists:", error);
    }
};