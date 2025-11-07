import { useState, useEffect } from "react";
import { Tv, Film, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimeCard from "@/components/AnimeCard";
import MovieCard from "@/components/MovieCard";
import StatsCard from "@/components/StatsCard";
import AddAnimeDialog from "@/components/AddAnimeDialog";
import AddMovieDialog from "@/components/AddMovieDialog";
import EmptyState from "@/components/EmptyState";
import ThemeToggle from "@/components/ThemeToggle";
import UnifiedSearch from "@/components/UnifiedSearch";
import type { AnimeInfo } from "@/lib/animeDatabase";

interface AnimeShow {
  id: string;
  title: string;
  episodesWatched: number;
  totalEpisodes?: number;
  totalSeasons?: number; // Added totalSeasons field
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
  const [editingAnime, setEditingAnime] = useState<AnimeShow | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [animeResponse, moviesResponse] = await Promise.all([
          fetch('/api/anime'),
          fetch('/api/movies')
        ]);
        
        if (animeResponse.ok) {
          const animeData = await animeResponse.json();
          setAnimeShows(animeData);
        }
        
        if (moviesResponse.ok) {
          const moviesData = await moviesResponse.json();
          setMovies(moviesData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    
    fetchData();
  }, []);

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

  const handleAddAnime = async (data: {
    title: string;
    episodesWatched: number;
    totalEpisodes?: number;
    totalSeasons?: number;
    status: string;
  }) => {
    // If total episodes is 1, add as movie instead
    if (data.totalEpisodes === 1) {
      await handleAddMovie({ title: data.title, isAnime: true });
      return;
    }

    try {
      const response = await fetch('/api/anime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const newAnime = await response.json();
        setAnimeShows([...animeShows, newAnime]);
      }
    } catch (error) {
      console.error('Failed to add anime:', error);
    }
  };

  const handleAddMovie = async (data: { title: string; isAnime: boolean }) => {
    try {
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const newMovie = await response.json();
        setMovies([...movies, newMovie]);
      }
    } catch (error) {
      console.error('Failed to add movie:', error);
    }
  };

  const handleIncrementEpisodes = async (id: string) => {
    const show = animeShows.find(s => s.id === id);
    if (!show) return;
    
    try {
      const response = await fetch(`/api/anime/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodesWatched: show.episodesWatched + 1 }),
      });
      
      if (response.ok) {
        setAnimeShows(
          animeShows.map((s) =>
            s.id === id ? { ...s, episodesWatched: s.episodesWatched + 1 } : s
          )
        );
      }
    } catch (error) {
      console.error('Failed to increment episodes:', error);
    }
  };

  const handleDecrementEpisodes = async (id: string) => {
    const show = animeShows.find(s => s.id === id);
    if (!show || show.episodesWatched <= 0) return;
    
    try {
      const response = await fetch(`/api/anime/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodesWatched: show.episodesWatched - 1 }),
      });
      
      if (response.ok) {
        setAnimeShows(
          animeShows.map((s) =>
            s.id === id && s.episodesWatched > 0
              ? { ...s, episodesWatched: s.episodesWatched - 1 }
              : s
          )
        );
      }
    } catch (error) {
      console.error('Failed to decrement episodes:', error);
    }
  };

  const handleDeleteAnime = async (id: string) => {
    try {
      const response = await fetch(`/api/anime/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setAnimeShows(animeShows.filter((show) => show.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete anime:', error);
    }
  };

  const handleEditAnime = (id: string) => {
    const anime = animeShows.find((a) => a.id === id);
    if (anime) {
      console.log("Edit anime:", id);
      setEditingAnime(anime);
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateAnime = async (data: {
    title: string;
    episodesWatched: number;
    totalEpisodes?: number;
    totalSeasons?: number;
    status: string;
  }) => {
    if (!editingAnime) return;

    try {
      const response = await fetch(`/api/anime/${editingAnime.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        setAnimeShows(animeShows.map(show =>
          show.id === editingAnime.id ? { ...show, ...data } : show
        ));
        setEditingAnime(null);
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to update anime:', error);
    }
  };

  const handleDeleteMovie = async (id: string) => {
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setMovies(movies.filter((movie) => movie.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete movie:', error);
    }
  };

  const handleAddAnimeQuick = async (anime: AnimeInfo) => {
    // If total episodes is 1, add as movie instead
    if (anime.totalEpisodes === 1) {
      await handleAddMovie({ title: anime.title, isAnime: true });
      return;
    }

    await handleAddAnime({
      title: anime.title,
      episodesWatched: 0,
      totalEpisodes: anime.totalEpisodes,
      totalSeasons: anime.totalSeasons,
      status: "watching",
    });
  };

  const handleCloseEditDialog = () => {
    setEditingAnime(null);
    setIsEditDialogOpen(false);
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
          <UnifiedSearch
            onFilterChange={setSearchQuery}
            onAddAnime={handleAddAnimeQuick}
            placeholder="Search or add anime..."
            className="max-w-md"
          />
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
            <div className="flex justify-end gap-2">
              <AddAnimeDialog onAdd={handleAddAnime} />
              {isEditDialogOpen && editingAnime && (
                <AddAnimeDialog
                  onAdd={handleAddAnime}
                  onEdit={handleUpdateAnime}
                  onClose={handleCloseEditDialog}
                  isEdit={true}
                  animeToEdit={editingAnime}
                />
              )}
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