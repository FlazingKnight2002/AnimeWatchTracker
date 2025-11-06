import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Film, Trash2 } from "lucide-react";

interface MovieCardProps {
  id: string;
  title: string;
  isAnime: boolean;
  watchCount: number;
  onDelete: (id: string) => void;
}

export default function MovieCard({
  id,
  title,
  isAnime,
  watchCount,
  onDelete,
}: MovieCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-movie-${id}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="h-10 w-10 rounded-md bg-accent flex items-center justify-center shrink-0">
              <Film className="h-5 w-5 text-accent-foreground" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate" data-testid="text-movie-title">
                {title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" data-testid="badge-type">
                  {isAnime ? "Anime Movie" : "Movie"}
                </Badge>
                {watchCount > 1 && (
                  <span className="text-xs text-muted-foreground" data-testid="text-watch-count">
                    Watched {watchCount}x
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(id)}
            className="h-8 w-8 shrink-0"
            data-testid="button-delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
