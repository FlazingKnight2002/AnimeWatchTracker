import {
  type AnimeShow,
  type InsertAnimeShow,
  type Movie,
  type InsertMovie,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAnimeShow(id: string): Promise<AnimeShow | undefined>;
  getAllAnimeShows(): Promise<AnimeShow[]>;
  createAnimeShow(show: InsertAnimeShow): Promise<AnimeShow>;
  updateAnimeShow(id: string, show: Partial<InsertAnimeShow>): Promise<AnimeShow | undefined>;
  deleteAnimeShow(id: string): Promise<boolean>;

  getMovie(id: string): Promise<Movie | undefined>;
  getAllMovies(): Promise<Movie[]>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  deleteMovie(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private animeShows: Map<string, AnimeShow>;
  private movies: Map<string, Movie>;

  constructor() {
    this.animeShows = new Map();
    this.movies = new Map();
  }

  async getAnimeShow(id: string): Promise<AnimeShow | undefined> {
    return this.animeShows.get(id);
  }

  async getAllAnimeShows(): Promise<AnimeShow[]> {
    return Array.from(this.animeShows.values());
  }

  async createAnimeShow(insertShow: InsertAnimeShow): Promise<AnimeShow> {
    const id = randomUUID();
    const show: AnimeShow = {
      id,
      title: insertShow.title,
      episodesWatched: insertShow.episodesWatched ?? 0,
      totalEpisodes: insertShow.totalEpisodes ?? null,
      status: insertShow.status ?? "watching",
    };
    this.animeShows.set(id, show);
    return show;
  }

  async updateAnimeShow(
    id: string,
    updates: Partial<InsertAnimeShow>
  ): Promise<AnimeShow | undefined> {
    const show = this.animeShows.get(id);
    if (!show) return undefined;

    const updated = { ...show, ...updates };
    this.animeShows.set(id, updated);
    return updated;
  }

  async deleteAnimeShow(id: string): Promise<boolean> {
    return this.animeShows.delete(id);
  }

  async getMovie(id: string): Promise<Movie | undefined> {
    return this.movies.get(id);
  }

  async getAllMovies(): Promise<Movie[]> {
    return Array.from(this.movies.values());
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const id = randomUUID();
    const movie: Movie = {
      id,
      title: insertMovie.title,
      isAnime: insertMovie.isAnime ?? 0,
      watchCount: insertMovie.watchCount ?? 1,
    };
    this.movies.set(id, movie);
    return movie;
  }

  async deleteMovie(id: string): Promise<boolean> {
    return this.movies.delete(id);
  }
}

export const storage = new MemStorage();
