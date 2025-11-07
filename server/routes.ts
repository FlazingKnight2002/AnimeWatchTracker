import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchAllSources, searchJikan, searchAniList } from "./services/animeApi";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all anime shows
  app.get("/api/anime", async (req, res) => {
    try {
      const shows = await storage.getAllAnimeShows();
      res.json(shows);
    } catch (error) {
      console.error("Get anime shows error:", error);
      res.status(500).json({ error: "Failed to get anime shows" });
    }
  });

  // Get single anime show
  app.get("/api/anime/:id", async (req, res) => {
    try {
      const show = await storage.getAnimeShow(req.params.id);
      if (!show) {
        return res.status(404).json({ error: "Anime show not found" });
      }
      res.json(show);
    } catch (error) {
      console.error("Get anime show error:", error);
      res.status(500).json({ error: "Failed to get anime show" });
    }
  });

  // Create anime show
  app.post("/api/anime", async (req, res) => {
    try {
      const show = await storage.createAnimeShow(req.body);
      res.json(show);
    } catch (error) {
      console.error("Create anime show error:", error);
      res.status(500).json({ error: "Failed to create anime show" });
    }
  });

  // Update anime show
  app.patch("/api/anime/:id", async (req, res) => {
    try {
      const show = await storage.updateAnimeShow(req.params.id, req.body);
      if (!show) {
        return res.status(404).json({ error: "Anime show not found" });
      }
      res.json(show);
    } catch (error) {
      console.error("Update anime show error:", error);
      res.status(500).json({ error: "Failed to update anime show" });
    }
  });

  // Delete anime show
  app.delete("/api/anime/:id", async (req, res) => {
    try {
      const success = await storage.deleteAnimeShow(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Anime show not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Delete anime show error:", error);
      res.status(500).json({ error: "Failed to delete anime show" });
    }
  });

  // Get all movies
  app.get("/api/movies", async (req, res) => {
    try {
      const movies = await storage.getAllMovies();
      res.json(movies);
    } catch (error) {
      console.error("Get movies error:", error);
      res.status(500).json({ error: "Failed to get movies" });
    }
  });

  // Get single movie
  app.get("/api/movies/:id", async (req, res) => {
    try {
      const movie = await storage.getMovie(req.params.id);
      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }
      res.json(movie);
    } catch (error) {
      console.error("Get movie error:", error);
      res.status(500).json({ error: "Failed to get movie" });
    }
  });

  // Create movie
  app.post("/api/movies", async (req, res) => {
    try {
      const movie = await storage.createMovie(req.body);
      res.json(movie);
    } catch (error) {
      console.error("Create movie error:", error);
      res.status(500).json({ error: "Failed to create movie" });
    }
  });

  // Delete movie
  app.delete("/api/movies/:id", async (req, res) => {
    try {
      const success = await storage.deleteMovie(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Movie not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Delete movie error:", error);
      res.status(500).json({ error: "Failed to delete movie" });
    }
  });

  // Search anime from external sources
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
