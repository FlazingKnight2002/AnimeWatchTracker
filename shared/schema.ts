import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const animeShows = pgTable("anime_shows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  episodesWatched: integer("episodes_watched").notNull().default(0),
  totalEpisodes: integer("total_episodes"),
  totalSeasons: integer("total_seasons"),
  status: text("status").notNull().default("watching"),
});

export const movies = pgTable("movies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  isAnime: integer("is_anime").notNull().default(0),
  watchCount: integer("watch_count").notNull().default(1),
});

export const insertAnimeShowSchema = createInsertSchema(animeShows).omit({
  id: true,
});

export const insertMovieSchema = createInsertSchema(movies).omit({
  id: true,
});

export type InsertAnimeShow = z.infer<typeof insertAnimeShowSchema>;
export type AnimeShow = typeof animeShows.$inferSelect;
export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Movie = typeof movies.$inferSelect;
