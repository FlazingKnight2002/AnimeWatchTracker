import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Pencil, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AnimeCardProps {
  id: string;
  title: string;
  episodesWatched: number;
  totalEpisodes?: number | null;
  status: string;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AnimeCard({
  id,
  title,
  episodesWatched,
  totalEpisodes,
  status,
  onIncrement,
  onDecrement,
  onEdit,
  onDelete,
}: AnimeCardProps) {
  const progress = totalEpisodes ? (episodesWatched / totalEpisodes) * 100 : 0;
  
  const statusColors: Record<string, string> = {
    watching: "bg-primary text-primary-foreground",
    completed: "bg-chart-3 text-primary-foreground",
    "on hold": "bg-chart-4 text-primary-foreground",
    dropped: "bg-muted text-muted-foreground",
  };

  return (
    <Card className="hover-elevate" data-testid={`card-anime-${id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-lg truncate" data-testid="text-anime-title">
                {title}
              </h3>
              <Badge className={statusColors[status] || ""} data-testid="badge-status">
                {status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <Button
                size="icon"
                variant="outline"
                onClick={() => onDecrement(id)}
                disabled={episodesWatched === 0}
                className="h-8 w-8"
                data-testid="button-decrement"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1 font-mono text-lg font-semibold min-w-[80px] justify-center">
                <span data-testid="text-episodes-watched">{episodesWatched}</span>
                {totalEpisodes && (
                  <>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-muted-foreground" data-testid="text-episodes-total">
                      {totalEpisodes}
                    </span>
                  </>
                )}
              </div>
              
              <Button
                size="icon"
                variant="outline"
                onClick={() => onIncrement(id)}
                className="h-8 w-8"
                data-testid="button-increment"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {totalEpisodes && (
              <Progress value={progress} className="h-2" data-testid="progress-episodes" />
            )}
          </div>
          
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(id)}
              className="h-8 w-8"
              data-testid="button-edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(id)}
              className="h-8 w-8"
              data-testid="button-delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
