import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchAllSources, searchJikan, searchAniList } from "./services/animeApi";
import { type InsertAnimeShow, type InsertMovie } from "@shared/schema"; //

export async function registerRoutes(app: Express): Promise<Server> {

  // --- ANIME SHOWS CRUD ROUTES ---

  // GET /api/anime: Get all anime shows
  app.get("/api/anime", async (_req, res) => {
    try {
      const shows = await storage.getAllAnimeShows(); //
      res.json(shows);
    } catch (error) {
      console.error("GET /api/anime error:", error);
      res.status(500).json({ error: "Failed to retrieve anime shows" });
    }
  });

  // POST /api/anime: Create a new anime show
  app.post("/api/anime", async (req, res) => {
    try {
      // NOTE: The request body is typed as InsertAnimeShow from shared schema.
      const insertShow: InsertAnimeShow = req.body; //
      const newShow = await storage.createAnimeShow(insertShow); //
      res.status(201).json(newShow);
    } catch (error) {
      console.error("POST /api/anime error:", error);
      // In a real app, you'd add more checks (e.g., Zod validation) here.
      res.status(500).json({ error: "Failed to create anime show" });
    }
  });

  // PATCH /api/anime/:id: Update an existing anime show
  app.patch("/api/anime/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const updates: Partial<InsertAnimeShow> = req.body;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No update fields provided" });
      }

      const updatedShow = await storage.updateAnimeShow(id, updates); //

      if (!updatedShow) {
        return res.status(404).json({ error: `Anime show with ID ${id} not found` });
      }

      res.json(updatedShow);
    } catch (error) {
      console.error("PATCH /api/anime/:id error:", error);
      res.status(500).json({ error: "Failed to update anime show" });
    }
  });

  // DELETE /api/anime/:id: Delete an anime show
  app.delete("/api/anime/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const wasDeleted = await storage.deleteAnimeShow(id); //

      if (!wasDeleted) {
        return res.status(404).json({ error: `Anime show with ID ${id} not found` });
      }

      // 204 No Content is the standard response for successful deletion
      res.status(204).send();
    } catch (error) {
      console.error("DELETE /api/anime/:id error:", error);
      res.status(500).json({ error: "Failed to delete anime show" });
    }
  });

  // -------------------------

  // --- MOVIES CRUD ROUTES ---

  // GET /api/movies: Get all movies
  app.get("/api/movies", async (_req, res) => {
    try {
      const movies = await storage.getAllMovies(); //
      res.json(movies);
    } catch (error) {
      console.error("GET /api/movies error:", error);
      res.status(500).json({ error: "Failed to retrieve movies" });
    }
  });

  // POST /api/movies: Create a new movie
  app.post("/api/movies", async (req, res) => {
    try {
      // NOTE: The request body is typed as InsertMovie from shared schema.
      const insertMovie: InsertMovie = req.body; //
      const newMovie = await storage.createMovie(insertMovie); //
      res.status(201).json(newMovie);
    } catch (error) {
      console.error("POST /api/movies error:", error);
      res.status(500).json({ error: "Failed to create movie" });
    }
  });

  // DELETE /api/movies/:id: Delete a movie
  app.delete("/api/movies/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const wasDeleted = await storage.deleteMovie(id); //

      if (!wasDeleted) {
        return res.status(404).json({ error: `Movie with ID ${id} not found` });
      }

      // 204 No Content is the standard response for successful deletion
      res.status(204).send();
    } catch (error) {
      console.error("DELETE /api/movies/:id error:", error);
      res.status(500).json({ error: "Failed to delete movie" });
    }
  });

  // -------------------------

  // Search anime from external sources (Original Route)
  app.get("/api/anime/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const source = req.query.source as string | undefined;

      if (!query || query.trim().length === 0) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }

      let results;

      if (source === 'jikan') {
        results = await searchJikan(query);
      } else if (source === 'anilist') {
        results = await searchAniList(query);
      } else {
        results = await searchAllSources(query);
      }

      res.json({ results });
    } catch (error) {
      console.error("Anime search error:", error);
      res.status(500).json({ error: "Failed to search anime" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
