import AnimeSearchInput from '../AnimeSearchInput';

export default function AnimeSearchInputExample() {
  return (
    <div className="p-6 bg-background">
      <AnimeSearchInput
        onSelect={(anime) => console.log('Selected:', anime)}
        placeholder="Type to search anime..."
      />
    </div>
  );
}
