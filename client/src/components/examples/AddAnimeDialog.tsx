import AddAnimeDialog from '../AddAnimeDialog';

export default function AddAnimeDialogExample() {
  return (
    <div className="p-6 bg-background">
      <AddAnimeDialog
        onAdd={(data) => console.log('Add anime:', data)}
      />
    </div>
  );
}
