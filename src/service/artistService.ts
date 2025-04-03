import dotenv from 'dotenv';
import { StatusCodes } from "http-status-codes";
import { Artist, Genre } from '../entity/Artist';
import { ICreateArtist, IUpdateArtist } from 'src/types';
import { AppDataSource } from '../data-source';

dotenv.config();

export interface IArtist {
    CreateArtist: (load: ICreateArtist) => Promise<any>;
    GetArtist: (id: string) => Promise<any>;
    GetAllArtists: () => Promise<any>;
    UpdateArtist: (id: string, load: IUpdateArtist) => Promise<any>;
    DeleteArtist: (id: string) => Promise<any>;
    GetAllAvailableGenres: () => Promise<any>;
}

export class ArtistService implements IArtist {
    private artistRepository = AppDataSource.getRepository(Artist);

    async CreateArtist(load: ICreateArtist): Promise<any> {
        try {
            const artist = this.artistRepository.create(load);
            await this.artistRepository.save(artist);
            return { status: StatusCodes.CREATED, message: 'Artist created successfully', artist };
        } catch (error) {
            return { status: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Error creating artist', error };
        }
    }

    async GetArtist(id: string): Promise<any> {
        try {
            const artist = await this.artistRepository.findOne({ where: { id } });
            if (!artist) {
                return { status: StatusCodes.NOT_FOUND, message: 'Artist not found' };
            }
            return { status: StatusCodes.OK, artist };
        } catch (error) {
            return { status: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Error fetching artist', error };
        }
    }

    async GetAllArtists(): Promise<any> {
        try {
            const artists = await this.artistRepository.find();
            return { status: StatusCodes.OK, artists };
        } catch (error) {
            return { status: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Error fetching artists', error };
        }
    }

    async UpdateArtist(id: string, load: IUpdateArtist): Promise<any> {
        try {
            const artist = await this.artistRepository.findOne({ where: { id }});
            if (!artist) {
                return { status: StatusCodes.NOT_FOUND, message: 'Artist not found' };
            }
            await this.artistRepository.update(id, load);
            return { status: StatusCodes.OK, message: 'Artist updated successfully' };
        } catch (error) {
            return { status: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Error updating artist', error };
        }
    }

    async DeleteArtist(id: string): Promise<any> {
        try {
            const artist = await this.artistRepository.findOne({ where: { id } });
            if (!artist) {
                return { status: StatusCodes.NOT_FOUND, message: 'Artist not found' };
            }
            await this.artistRepository.delete(id);
            return { status: StatusCodes.OK, message: 'Artist deleted successfully' };
        } catch (error) {
            return { status: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Error deleting artist', error };
        }
    }

    async GetAllAvailableGenres(): Promise<any> {
        try {
            const genres = Object.values(Genre);
            return { status: StatusCodes.OK, genres: genres };
        } catch (error) {
            return { status: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Error fetching genres', error };
        }
    }
}
