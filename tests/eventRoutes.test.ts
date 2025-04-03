import request from "supertest";
import app from "../src/index";
import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "../src/data-source";
import "reflect-metadata";
process.env.NODE_ENV = "test";
import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { IUpdateEvent } from "../src/types";

let server: http.Server;

jest.setTimeout(90000);

beforeAll(async () => {
  try { // Initialize the DataSource.
    await AppDataSource.initialize();
    console.log("Test database connected.");

    // (Optional) Print table names.
    const tables = await AppDataSource.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    );
    console.log("Tables in the test database:", tables);
  } catch (error) {
    console.error("Error connecting to the test database:", error);
    throw error;
  }

  // Start an HTTP server for testing on port 3001.
  server = http.createServer(app);
  await new Promise<void>((resolve, reject) => {
    server.listen(3001, "0.0.0.0", (err?: Error) => {
      if (err) return reject(err);
      console.log("🚀 Test server running at http://localhost:3001/");
      resolve();
    });
  });
});

afterAll(async () => {
  // Close the HTTP server.
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    console.log("Test server closed.");
  }
  // Destroy the DataSource connection.
  try {
    await AppDataSource.destroy();
    console.log("Test database disconnected.");
  } catch (error) {
    console.error("Error disconnecting the test database:", error);
  }
});

describe("Admin Event Endpoints", () => {
  let adminToken: string;
  let eventId: string;
  const adminCredentials = {
    email: "essenapp1@gmail.com",
    password: "Adm1nP@ss!",
  };

  const adminUser = {
    first_name: "Ronaldo",
    last_name: "Okoro",
    username: "aokoro",
    email: "essenapp1@gmail.com",
    password: "Adm1nP@ss!",
    user_type: "Admin",
  };

  const testEventData = {
    name: "Test Event",
    date: new Date().toISOString(),
    duration: 120,
    description: "This is a test event",
    location: "Test Venue",
    totalTickets: 100,
    ticket_price: 20,
    artists: ["Burna Boy", "Wizkid"],
  };

  beforeAll(async () => {
    // Try logging in
    let response = await request(app).post("/api/login").send(adminCredentials);
    console.log("status", response.status);
    
    if (response.status === StatusCodes.NOT_FOUND) {
      // If login fails, create the admin user
      await request(app).post("/api/create").send(adminUser);
      response = await request(app).post("/api/login").send(adminCredentials);
    }
    
    adminToken = response.body.token;
  });

  describe("POST /api/event/create", () => {
    it("should create an event when authenticated", async () => {
      const response = await request(app)
        .post("/api/event/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(testEventData);      
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toHaveProperty("id");
      eventId = response.body.id;
    });
  });

  describe("GET /api/event/:id", () => {
    it("should retrieve the created event", async () => {
      const response = await request(app).get(`/api/event/${eventId}`)
      .set("Authorization", `Bearer ${adminToken}`);
      console.log("Get Event Response:", response.body);
      console.log("Get Event Status:", response.status);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.event).toHaveProperty("id", eventId);
    });
  });

  describe("PATCH /api/event/update", () => {
    const updateData: Partial<IUpdateEvent> = { 
      id: "", 
      location: "Updated Venue", 
      totalTickets: 150, 
      artists: ["Central Cee"] 
    };

    beforeAll(() => {
      updateData.id = eventId;
    });

    it("should update the event and merge artists when authenticated", async () => {
      const response = await request(app)
        .patch(`/api/event/update`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      console.log("Update Event Response:", response.body);
      console.log("Update Event Status:", response.status);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("id", eventId);
      expect(response.body).toMatchObject({
        location: updateData.location,
        totalTickets: updateData.totalTickets,
        artists: expect.arrayContaining(["Burna Boy", "Wizkid", "Central Cee"])
      });
    });
  });

  describe("DELETE /api/event/delete/:id", () => {
    it("should delete the event when authenticated", async () => {
      const response = await request(app)
        .delete(`/api/event/delete/${eventId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.message).toBe("Event deleted successfully");
    });
  });
});
