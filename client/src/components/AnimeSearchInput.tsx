import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { fuzzySearch, type AnimeInfo } from "@/lib/animeDatabase";
import { cn } from "@/lib/utils";

interface AnimeSearchInputProps {
  onSelect: (anime: AnimeInfo) => void;
  placeholder?: string;
  className?: string;
}

export default function AnimeSearchInput({
  onSelect,
  placeholder = "Search anime titles...",
  className,
}: AnimeSearchInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim()) {
      const matches = fuzzySearch(query);
      setResults(matches);
      setIsOpen(matches.length > 0);
    } else {
      setResults([]);
      setIsOpen(false);
    }
    setSelectedIndex(-1);
  }, [query]);

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

  const handleSelect = (anime: AnimeInfo) => {
    onSelect(anime);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
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
          placeholder={placeholder}
          className="pl-9 h-12"
          data-testid="input-anime-search"
        />
      </div>
      
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-popover border border-popover-border rounded-md shadow-lg max-h-64 overflow-auto"
          data-testid="dropdown-search-results"
        >
          {results.map((result, index) => (
            <button
              key={result.title}
              onClick={() => handleSelect(result)}
              className={cn(
                "w-full text-left px-4 py-3 text-sm hover-elevate active-elevate-2",
                selectedIndex === index && "bg-accent"
              )}
              data-testid={`button-result-${index}`}
            >
              <div className="flex items-center justify-between">
                <span>{result.title}</span>
                {result.totalEpisodes && (
                  <span className="text-xs text-muted-foreground ml-2">
                    {result.totalEpisodes} eps
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
