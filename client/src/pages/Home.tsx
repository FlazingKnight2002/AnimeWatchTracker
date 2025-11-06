import { useState } from "react";
import { Tv, Film, BarChart3, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import AnimeCard from "@/components/AnimeCard";
import MovieCard from "@/components/MovieCard";
import StatsCard from "@/components/StatsCard";
import AddAnimeDialog from "@/components/AddAnimeDialog";
import AddMovieDialog from "@/components/AddMovieDialog";
import EmptyState from "@/components/EmptyState";
import ThemeToggle from "@/components/ThemeToggle";

interface AnimeShow {
  id: string;
  title: string;
  episodesWatched: number;
  totalEpisodes?: number;
  status: string;
}

interface Movie {
  id: string;
  title: string;
  isAnime: boolean;
  watchCount: number;
}

export default function Home() {
  const [animeShows, setAnimeShows] = useState<AnimeShow[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const totalEpisodes = animeShows.reduce((sum, show) => sum + show.episodesWatched, 0);
  const totalMovies = movies.length;
  const animeMovies = movies.filter(m => m.isAnime).length;
  const regularMovies = movies.filter(m => !m.isAnime).length;

  const filteredAnimeShows = animeShows.filter(show =>
    show.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAnime = (data: {
    title: string;
    episodesWatched: number;
    totalEpisodes?: number;
    status: string;
  }) => {
    const newAnime: AnimeShow = {
      id: Date.now().toString(),
      ...data,
    };
    setAnimeShows([...animeShows, newAnime]);
  };

  const handleAddMovie = (data: { title: string; isAnime: boolean }) => {
    const newMovie: Movie = {
      id: Date.now().toString(),
      ...data,
      watchCount: 1,
    };
    setMovies([...movies, newMovie]);
  };

  const handleIncrementEpisodes = (id: string) => {
    setAnimeShows(
      animeShows.map((show) =>
        show.id === id
          ? { ...show, episodesWatched: show.episodesWatched + 1 }
          : show
      )
    );
  };

  const handleDecrementEpisodes = (id: string) => {
    setAnimeShows(
      animeShows.map((show) =>
        show.id === id && show.episodesWatched > 0
          ? { ...show, episodesWatched: show.episodesWatched - 1 }
          : show
      )
    );
  };

  const handleDeleteAnime = (id: string) => {
    setAnimeShows(animeShows.filter((show) => show.id !== id));
  };

  const handleEditAnime = (id: string) => {
    console.log("Edit anime:", id);
  };

  const handleDeleteMovie = (id: string) => {
    setMovies(movies.filter((movie) => movie.id !== id));
  };

  const watchingShows = filteredAnimeShows.filter((s) => s.status === "watching");
  const completedShows = filteredAnimeShows.filter((s) => s.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-40 bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
                <Tv className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Anime Tracker</h1>
                <p className="text-sm text-muted-foreground">Track your anime journey</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search anime or movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Episodes"
            value={totalEpisodes}
            icon={Tv}
            description="Across all anime"
          />
          <StatsCard
            title="Movies Watched"
            value={totalMovies}
            icon={Film}
            description={`${animeMovies} anime, ${regularMovies} regular`}
          />
          <StatsCard
            title="Anime Shows"
            value={animeShows.length}
            icon={BarChart3}
            description={`${watchingShows.length} watching, ${completedShows.length} completed`}
          />
        </div>

        <Tabs defaultValue="anime" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="anime" data-testid="tab-anime">
              Anime Shows
            </TabsTrigger>
            <TabsTrigger value="movies" data-testid="tab-movies">
              Movies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="anime" className="mt-0 space-y-6">
            <div className="flex justify-end">
              <AddAnimeDialog onAdd={handleAddAnime} />
            </div>
            {animeShows.length === 0 ? (
              <EmptyState
                icon={Tv}
                title="No anime tracked yet"
                description="Start tracking your anime journey by adding your first show using the button above."
              />
            ) : (
              <div className="space-y-6">
                {watchingShows.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Watching</h2>
                    <div className="space-y-3">
                      {watchingShows.map((show) => (
                        <AnimeCard
                          key={show.id}
                          {...show}
                          onIncrement={handleIncrementEpisodes}
                          onDecrement={handleDecrementEpisodes}
                          onEdit={handleEditAnime}
                          onDelete={handleDeleteAnime}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {completedShows.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Completed</h2>
                    <div className="space-y-3">
                      {completedShows.map((show) => (
                        <AnimeCard
                          key={show.id}
                          {...show}
                          onIncrement={handleIncrementEpisodes}
                          onDecrement={handleDecrementEpisodes}
                          onEdit={handleEditAnime}
                          onDelete={handleDeleteAnime}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {filteredAnimeShows.filter(
                  (s) => s.status !== "watching" && s.status !== "completed"
                ).length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Other</h2>
                    <div className="space-y-3">
                      {filteredAnimeShows
                        .filter(
                          (s) => s.status !== "watching" && s.status !== "completed"
                        )
                        .map((show) => (
                          <AnimeCard
                            key={show.id}
                            {...show}
                            onIncrement={handleIncrementEpisodes}
                            onDecrement={handleDecrementEpisodes}
                            onEdit={handleEditAnime}
                            onDelete={handleDeleteAnime}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="movies" className="mt-0 space-y-6">
            <div className="flex justify-end">
              <AddMovieDialog onAdd={handleAddMovie} />
            </div>
            {movies.length === 0 ? (
              <EmptyState
                icon={Film}
                title="No movies tracked yet"
                description="Add movies you've watched to keep track of your viewing history."
              />
            ) : (
              <div className="space-y-3">
                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    {...movie}
                    onDelete={handleDeleteMovie}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
