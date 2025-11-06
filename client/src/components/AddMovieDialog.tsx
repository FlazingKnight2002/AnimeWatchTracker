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
import { Checkbox } from "@/components/ui/checkbox";
import { Film } from "lucide-react";

interface AddMovieDialogProps {
  onAdd: (data: { title: string; isAnime: boolean }) => void;
}

export default function AddMovieDialog({ onAdd }: AddMovieDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isAnime, setIsAnime] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      isAnime,
    });

    setTitle("");
    setIsAnime(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="gap-2" data-testid="button-add-movie">
          <Film className="h-5 w-5" />
          Add Movie
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="dialog-add-movie">
        <DialogHeader>
          <DialogTitle>Add New Movie</DialogTitle>
          <DialogDescription>
            Add a movie you've watched to your collection.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="movie-title">Movie Title</Label>
            <Input
              id="movie-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter movie title"
              data-testid="input-movie-title"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is-anime"
              checked={isAnime}
              onCheckedChange={(checked) => setIsAnime(checked as boolean)}
              data-testid="checkbox-is-anime"
            />
            <Label
              htmlFor="is-anime"
              className="text-sm font-normal cursor-pointer"
            >
              This is an anime movie
            </Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()} data-testid="button-submit">
            Add Movie
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
