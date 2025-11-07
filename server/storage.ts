
import {
  type AnimeShow,
  type InsertAnimeShow,
  type Movie,
  type InsertMovie,
} from "@shared/schema";
import { randomUUID } from "crypto";
import Database from "@replit/database";

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

export class ReplitDBStorage implements IStorage {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  async getAnimeShow(id: string): Promise<AnimeShow | undefined> {
    const show = await this.db.get(`anime:${id}`);
    if (!show) return undefined;
    return typeof show === 'string' ? JSON.parse(show) : show;
  }

  async getAllAnimeShows(): Promise<AnimeShow[]> {
    const keys = await this.db.list("anime:");
    const shows: AnimeShow[] = [];
    
    for (const key of keys) {
      const show = await this.db.get(key);
      if (show) {
        shows.push(typeof show === 'string' ? JSON.parse(show) : show);
      }
    }
    
    return shows;
  }

  async createAnimeShow(insertShow: InsertAnimeShow): Promise<AnimeShow> {
    const id = randomUUID();
    const show: AnimeShow = {
      id,
      title: insertShow.title,
      episodesWatched: insertShow.episodesWatched ?? 0,
      totalEpisodes: insertShow.totalEpisodes ?? null,
      totalSeasons: insertShow.totalSeasons ?? null,
      status: insertShow.status ?? "watching",
    };
    await this.db.set(`anime:${id}`, JSON.stringify(show));
    return show;
  }

  async updateAnimeShow(
    id: string,
    updates: Partial<InsertAnimeShow>
  ): Promise<AnimeShow | undefined> {
    const show = await this.getAnimeShow(id);
    if (!show) return undefined;

    const updated = { ...show, ...updates };
    await this.db.set(`anime:${id}`, JSON.stringify(updated));
    return updated;
  }

  async deleteAnimeShow(id: string): Promise<boolean> {
    const show = await this.getAnimeShow(id);
    if (!show) return false;
    
    await this.db.delete(`anime:${id}`);
    return true;
  }

  async getMovie(id: string): Promise<Movie | undefined> {
    const movie = await this.db.get(`movie:${id}`);
    if (!movie) return undefined;
    return typeof movie === 'string' ? JSON.parse(movie) : movie;
  }

  async getAllMovies(): Promise<Movie[]> {
    const keys = await this.db.list("movie:");
    const movies: Movie[] = [];
    
    for (const key of keys) {
      const movie = await this.db.get(key);
      if (movie) {
        movies.push(typeof movie === 'string' ? JSON.parse(movie) : movie);
      }
    }
    
    return movies;
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const id = randomUUID();
    const movie: Movie = {
      id,
      title: insertMovie.title,
      isAnime: insertMovie.isAnime ?? 0,
      watchCount: insertMovie.watchCount ?? 1,
    };
    await this.db.set(`movie:${id}`, JSON.stringify(movie));
    return movie;
  }

  async deleteMovie(id: string): Promise<boolean> {
    const movie = await this.getMovie(id);
    if (!movie) return false;
    
    await this.db.delete(`movie:${id}`);
    return true;
  }
}

export const storage = new ReplitDBStorage();
