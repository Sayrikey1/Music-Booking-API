// src/seeds/seed-artists.ts
import "reflect-metadata";
import dotenv from "dotenv";
import path from "path";

// Load environment variables first before importing anything that uses them
// Load from the root .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import AppDataSource from "../data-source";
import { populateArtists } from "./populateArtist";

// Immediately-invoked async function expression (IIFE)
(async () => {
  try {
    console.log("Initializing database connection...");
    
    // Log connection details (without password) for debugging
    console.log("Database connection details:");
    console.log(`Host: ${process.env.POSTGRES_HOST}`);
    console.log(`Port: ${process.env.POSTGRES_PORT}`);
    console.log(`Database: ${process.env.POSTGRES_DATABASE}`);
    console.log(`Username: ${process.env.POSTGRES_USERNAME}`);
    console.log(`Password: ${process.env.POSTGRES_PASSWORD ? "******" : "NOT SET"}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV || "not set"}`);
    
    // Initialize database connection using AppDataSource
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
    
    // Run the population function
    await populateArtists();
    
    // Properly disconnect from database when done
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("Data Source has been disconnected!");
    }
    
    process.exit(0); // Exit successfully
  } catch (error) {
    console.error("Error in seed script:", error);
    
    // Try to clean up database connection if possible
    if (AppDataSource.isInitialized) {
      try {
        await AppDataSource.destroy();
      } catch (cleanupError) {
        console.error("Error during database cleanup:", cleanupError);
      }
    }
    
    process.exit(1); // Exit with error
  }
})();