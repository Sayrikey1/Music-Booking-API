import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { IArtist, ArtistService } from "../service/artistService";
import { ICreateArtist, IUpdateArtist } from "../types";
import { CustomRequest } from "../middlewares/TokenVerification";
import { getAuthenticatedUser, checkIsAdmin } from "../utils/authUtils";

export class ArtistController {
  artist: IArtist = new ArtistService();
  
  constructor() {}
  
  CreateArtist: RequestHandler = async (req, res) => {
    if (!checkIsAdmin(req)) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated or not authorized" });
      return;
    }
    
    const body = req.body as ICreateArtist;
    const response = await this.artist.CreateArtist(body);
    res.status(response.status || StatusCodes.CREATED).json(response);
  };
  
  GetArtist: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const response = await this.artist.GetArtist(id);
    res.status(response.status || StatusCodes.OK).json(response);
  };
  
  GetAllArtists: RequestHandler = async (req, res) => {
    const response = await this.artist.GetAllArtists();
    res.status(response.status || StatusCodes.OK).json(response);
  };

  UpdateArtist: RequestHandler = async (req: CustomRequest, res): Promise<void> => {
    if (!checkIsAdmin(req)) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated or not authorized" });
      return;
    }
    const { id } = req.params;

    const body = req.body as IUpdateArtist;
    const response = await this.artist.UpdateArtist(id, body);
    res.status(response.status || StatusCodes.OK).json(response);
  };

  DeleteArtist: RequestHandler = async (req: CustomRequest, res): Promise<void> => {
    const { id } = req.params;
    if (!checkIsAdmin(req)) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated or not authorized" });
      return;
    }
    const response = await this.artist.DeleteArtist(id);
    res.status(response.status || StatusCodes.OK).json(response);
  };

  GetAllAvailableGenres: RequestHandler = async (req, res) => {
    const response = await this.artist.GetAllAvailableGenres();
    res.status(response.status || StatusCodes.OK).json(response);
  };
}
