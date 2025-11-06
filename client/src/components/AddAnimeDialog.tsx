import { useState } from "react";
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
}

export default function AddAnimeDialog({ onAdd }: AddAnimeDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [episodesWatched, setEpisodesWatched] = useState("0");
  const [totalEpisodes, setTotalEpisodes] = useState("");
  const [status, setStatus] = useState("watching");

  const handleSubmit = () => {
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      episodesWatched: parseInt(episodesWatched) || 0,
      totalEpisodes: totalEpisodes ? parseInt(totalEpisodes) : undefined,
      status,
    });

    setTitle("");
    setEpisodesWatched("0");
    setTotalEpisodes("");
    setStatus("watching");
    setOpen(false);
  };

  const handleAnimeSelect = (anime: { title: string; totalEpisodes?: number }) => {
    setTitle(anime.title);
    if (anime.totalEpisodes) {
      setTotalEpisodes(anime.totalEpisodes.toString());
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2" data-testid="button-add-anime">
          <Plus className="h-5 w-5" />
          Add Anime
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="dialog-add-anime">
        <DialogHeader>
          <DialogTitle>Add New Anime</DialogTitle>
          <DialogDescription>
            Search for an anime or enter the title manually to start tracking.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Anime</Label>
            <AnimeSearchInput
              onSelect={handleAnimeSelect}
              placeholder="Type to search..."
            />
          </div>
          
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
          <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()} data-testid="button-submit">
            Add Anime
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
