import AddMovieDialog from '../AddMovieDialog';

export default function AddMovieDialogExample() {
  return (
    <div className="p-6 bg-background">
      <AddMovieDialog
        onAdd={(data) => console.log('Add movie:', data)}
      />
    </div>
  );
}
