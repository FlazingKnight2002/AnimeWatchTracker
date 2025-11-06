import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Plus, Globe } from "lucide-react";
import { fuzzySearch, type AnimeInfo } from "@/lib/animeDatabase";
import { searchExternalAnime, type ExternalAnimeResult } from "@/lib/externalAnimeApi";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UnifiedSearchProps {
  onFilterChange: (query: string) => void;
  onAddAnime: (anime: AnimeInfo) => void;
  placeholder?: string;
  className?: string;
}

export default function UnifiedSearch({
  onFilterChange,
  onAddAnime,
  placeholder = "Search or add anime...",
  className,
}: UnifiedSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeInfo[]>([]);
  const [externalResults, setExternalResults] = useState<ExternalAnimeResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearchingExternal, setIsSearchingExternal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onFilterChange(query);
    
    if (query.trim()) {
      const matches = fuzzySearch(query);
      setResults(matches);
      
      // Search external sources with debounce
      setIsSearchingExternal(true);
      const timer = setTimeout(async () => {
        const external = await searchExternalAnime(query);
        setExternalResults(external);
        setIsSearchingExternal(false);
      }, 500);

      setIsOpen(true);
      
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setExternalResults([]);
      setIsOpen(false);
      setIsSearchingExternal(false);
    }
    setSelectedIndex(-1);
  }, [query, onFilterChange]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddAnime = (anime: AnimeInfo) => {
    onAddAnime(anime);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const totalResults = results.length + externalResults.length;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < totalResults - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      if (selectedIndex < results.length) {
        handleAddAnime(results[selectedIndex]);
      } else {
        const externalIndex = selectedIndex - results.length;
        handleAddExternalAnime(externalResults[externalIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleAddExternalAnime = (anime: ExternalAnimeResult) => {
    onAddAnime({
      title: anime.title,
      totalEpisodes: anime.totalEpisodes || undefined,
    });
    setQuery("");
    setResults([]);
    setExternalResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim() && results.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="pl-10"
          data-testid="input-search"
        />
      </div>
      
      {isOpen && (results.length > 0 || externalResults.length > 0 || isSearchingExternal) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-popover border border-popover-border rounded-md shadow-lg max-h-96 overflow-auto"
          data-testid="dropdown-search-results"
        >
          {results.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                Local Database
              </div>
              {results.map((result, index) => (
                <button
                  key={result.title}
                  onClick={() => handleAddAnime(result)}
                  className={cn(
                    "w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover-elevate active-elevate-2",
                    selectedIndex === index && "bg-accent"
                  )}
                  data-testid={`button-result-${index}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Plus className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="truncate">{result.title}</span>
                  </div>
                  {result.totalEpisodes && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {result.totalEpisodes} eps
                    </span>
                  )}
                </button>
              ))}
            </>
          )}

          {externalResults.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b flex items-center gap-2">
                <Globe className="h-3 w-3" />
                <span>From MyAnimeList & AniList</span>
              </div>
              {externalResults.map((result, index) => {
                const globalIndex = results.length + index;
                return (
                  <button
                    key={result.id}
                    onClick={() => handleAddExternalAnime(result)}
                    className={cn(
                      "w-full text-left px-4 py-3 flex items-center gap-3 hover-elevate active-elevate-2",
                      selectedIndex === globalIndex && "bg-accent"
                    )}
                    data-testid={`button-external-result-${index}`}
                  >
                    <img 
                      src={result.imageUrl} 
                      alt={result.title}
                      className="h-12 w-8 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{result.title}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="capitalize">{result.source}</span>
                        {result.totalEpisodes && (
                          <>
                            <span>•</span>
                            <span>{result.totalEpisodes} eps</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Plus className="h-4 w-4 text-primary flex-shrink-0" />
                  </button>
                );
              })}
            </>
          )}

          {isSearchingExternal && (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              Searching external sources...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
