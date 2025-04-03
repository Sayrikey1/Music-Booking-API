import express from "express";
import TokenVerification from "../middlewares/TokenVerification";
import { ArtistController } from "../controller/artistController";

const artistRouter = express.Router();
const artistController = new ArtistController();

/**
 * @openapi
 * /api/artist/genres:
 *   get:
 *     summary: Get all available genres (Public)
 *     tags:
 *       - Manage Artist
 *     responses:
 *       200:
 *         description: List of available genres retrieved successfully
 */
artistRouter.get("/api/artist/genres", artistController.GetAllAvailableGenres);

/**
 * @openapi
 * /api/artist/create:
 *   post:
 *     summary: Create a new artist (Admin Only)
 *     tags:
 *       - Manage Artist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               artist_name:
 *                 type: string
 *                 example: "Alex Carter"
 *               rating:
 *                 type: string
 *                 enum:
 *                   - A-Rated
 *                   - B-Rated
 *                   - C-Rated
 *                 example: "C-Rated"
 *               nationality:
 *                 type: string
 *                 example: "American"
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum:
 *                     - Pop
 *                     - Rock
 *                     - Jazz
 *                     - HipHop
 *                     - Classical
 *                     - Electronic
 *                     - Country
 *                 example: ["Pop", "Rock"]
 *     responses:
 *       201:
 *         description: Artist created successfully
 *       401:
 *         description: Unauthorized – user not authenticated or not an admin
 *       400:
 *         description: Bad Request
 */
artistRouter.post("/api/artist/create", TokenVerification, artistController.CreateArtist);

/**
 * @openapi
 * /api/artist/{id}:
 *   get:
 *     summary: Get an artist by ID (Public)
 *     tags:
 *       - Manage Artist
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the artist
 *     responses:
 *       200:
 *         description: Artist found
 *       404:
 *         description: Artist not found
 */
artistRouter.get("/api/artist/:id", artistController.GetArtist);

/**
 * @openapi
 * /api/artist:
 *   get:
 *     summary: Get all artists (Public)
 *     tags:
 *       - Manage Artist
 *     responses:
 *       200:
 *         description: List of artists retrieved successfully
 */
artistRouter.get("/api/artist", artistController.GetAllArtists);

/**
 * @openapi
 * /api/artist/update/{id}:
 *   put:
 *     summary: Update an existing artist by ID (Admin Only)
 *     tags:
 *       - Manage Artist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the artist to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               artist_name:
 *                 type: string
 *                 example: "Alex Carter"
 *               rating:
 *                 type: string
 *                 enum:
 *                   - A-Rated
 *                   - B-Rated
 *                   - C-Rated
 *                 example: "A-Rated"
 *               nationality:
 *                 type: string
 *                 example: "American"
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum:
 *                     - Pop
 *                     - Rock
 *                     - Jazz
 *                     - HipHop
 *                     - Classical
 *                     - Electronic
 *                     - Country
 *                 example: ["Pop", "Electronic"]
 *     responses:
 *       200:
 *         description: Artist updated successfully
 *       401:
 *         description: Unauthorized – user not authenticated or not an admin
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Artist not found
 */
artistRouter.put("/api/artist/update/:id", TokenVerification, artistController.UpdateArtist);

/**
 * @openapi
 * /api/artist/delete/{id}:
 *   delete:
 *     summary: Delete an artist by ID (Admin Only)
 *     tags:
 *       - Manage Artist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the artist to delete
 *     responses:
 *       200:
 *         description: Artist deleted successfully
 *       401:
 *         description: Unauthorized – user not authenticated or not an admin
 *       404:
 *         description: Artist not found
 */
artistRouter.delete("/api/artist/delete/:id", TokenVerification, artistController.DeleteArtist);


export default artistRouter;
