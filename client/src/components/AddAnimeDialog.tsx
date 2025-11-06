import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import AnimeSearchInput from "./AnimeSearchInput";

interface AddAnimeDialogProps {
  onAdd: (data: {
    title: string;
    episodesWatched: number;
    totalEpisodes?: number;
    status: string;
  }) => void;
  onEdit: (data: {
    id: string;
    title: string;
    episodesWatched: number;
    totalEpisodes?: number;
    status: string;
  }) => void;
  onClose?: () => void;
  isEdit?: boolean;
  animeToEdit?: {
    id: string;
    title: string;
    episodesWatched: number;
    totalEpisodes?: number;
    status: string;
  };
}

export default function AddAnimeDialog({ onAdd, onEdit, onClose, isEdit = false, animeToEdit }: AddAnimeDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [episodesWatched, setEpisodesWatched] = useState("0");
  const [totalEpisodes, setTotalEpisodes] = useState("");
  const [totalSeasons, setTotalSeasons] = useState("");
  const [status, setStatus] = useState("watching");

  useEffect(() => {
    if (isEdit && animeToEdit) {
      setTitle(animeToEdit.title);
      setEpisodesWatched(animeToEdit.episodesWatched.toString());
      setTotalEpisodes(animeToEdit.totalEpisodes?.toString() || "");
      setTotalSeasons(animeToEdit.totalSeasons?.toString() || "");
      setStatus(animeToEdit.status);
      setOpen(true);
    } else if (!isEdit) {
      setOpen(false);
    }
  }, [isEdit, animeToEdit]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    const baseData = {
      title: title.trim(),
      episodesWatched: parseInt(episodesWatched) || 0,
      totalEpisodes: totalEpisodes ? parseInt(totalEpisodes) : undefined,
      status,
    };

    if (isEdit && animeToEdit) {
      onEdit({ ...baseData, id: animeToEdit.id });
    } else {
      onAdd(baseData);
    }

    setTitle("");
    setEpisodesWatched("0");
    setTotalEpisodes("");
    setTotalSeasons("");
    setStatus("watching");
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleAnimeSelect = (anime: { title: string; totalEpisodes?: number; totalSeasons?: number }) => {
    setTitle(anime.title);
    if (anime.totalEpisodes) {
      setTotalEpisodes(anime.totalEpisodes.toString());
    }
    if (anime.totalSeasons) {
      setTotalSeasons(anime.totalSeasons.toString());
    }
  };

  useEffect(() => {
    if (status === "completed" && totalEpisodes) {
      setEpisodesWatched(totalEpisodes);
    }
  }, [status, totalEpisodes]);

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen && isEdit && onClose) {
        onClose();
      }
    }}>
      {!isEdit && (
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2" data-testid="button-add-anime">
            <Plus className="h-5 w-5" />
            Add Anime
          </Button>
        </DialogTrigger>
      )}
      <DialogContent data-testid="dialog-add-anime">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Anime" : "Add Anime"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Edit your anime details." : "Search for an anime or enter the title manually to start tracking."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="search">Search Anime</Label>
              <AnimeSearchInput
                onSelect={handleAnimeSelect}
                placeholder="Type to search..."
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter anime title"
              data-testid="input-title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="watched">Episodes Watched</Label>
              <Input
                id="watched"
                type="number"
                min="0"
                value={episodesWatched}
                onChange={(e) => setEpisodesWatched(e.target.value)}
                data-testid="input-episodes-watched"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total">Total Episodes</Label>
              <Input
                id="total"
                type="number"
                min="0"
                value={totalEpisodes}
                onChange={(e) => setTotalEpisodes(e.target.value)}
                placeholder="Optional"
                data-testid="input-total-episodes"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seasons">Total Seasons</Label>
            <Input
              id="seasons"
              type="number"
              min="0"
              value={totalSeasons}
              onChange={(e) => setTotalSeasons(e.target.value)}
              placeholder="Optional"
              data-testid="input-total-seasons"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" data-testid="select-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="watching">Watching</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on hold">On Hold</SelectItem>
                <SelectItem value="dropped">Dropped</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => {
            setOpen(false);
            if (onClose) onClose();
          }} data-testid="button-cancel">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()} data-testid="button-submit">
            {isEdit ? "Save Changes" : "Add Anime"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}