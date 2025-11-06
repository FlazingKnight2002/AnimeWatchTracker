import AnimeSearchInput from '../AnimeSearchInput';

export default function AnimeSearchInputExample() {
  return (
    <div className="p-6 bg-background">
      <AnimeSearchInput
        onSelect={(title) => console.log('Selected:', title)}
        placeholder="Type to search anime..."
      />
    </div>
  );
}
