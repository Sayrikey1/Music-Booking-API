import { IsNotEmpty, IsEnum, ArrayNotEmpty } from "class-validator";
import { Column, Entity, ManyToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Event } from "./Event";

export enum ArtistRating {
    A = "A-Rated",
    B = "B-Rated",
    C = "C-Rated"
}

// Define a list of available genres.
export enum Genre {
    POP = "Pop",
    ROCK = "Rock",
    JAZZ = "Jazz",
    HIPHOP = "HipHop",
    CLASSICAL = "Classical",
    ELECTRONIC = "Electronic",
    COUNTRY = "Country",
    AFROBEATS = "Afrobeats",   
    AFRO_POP = "Afro Pop",     
    FUJI = "Fuji",             
    UK_DRILL = "UK Drill",     
    GRIME = "Grime",            
    SOUL = "SOUL",
    RNB = "RNB"
}


@Entity('artist')
export class Artist extends BaseModel {
    @Column({ nullable: false })
    @IsNotEmpty({ message: "Artist name required" })
    artist_name!: string;

    @Column({ type: "enum", enum: ArtistRating, default: ArtistRating.C })
    rating!: ArtistRating;

    @Column({ nullable: false })
    @IsNotEmpty({ message: "Artist nationality required" })
    nationality!: string;

    // Using the Genre enum and storing multiple genres as an array.
    @Column({
        type: "enum",
        enum: Genre,
        array: true, // Note: This works on PostgreSQL.
        nullable: false
    })
    @ArrayNotEmpty({ message: "Artist genre required" })
    @IsEnum(Genre, { each: true, message: "Each genre must be a valid Genre value" })
    genre!: Genre[];

    @ManyToMany(() => Event, (event) => event.artists)
    events: Event[];
}
