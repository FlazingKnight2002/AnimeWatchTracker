import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchAllSources, searchJikan, searchAniList } from "./services/animeApi";

export async function registerRoutes(app: Express): Promise<Server> {
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
