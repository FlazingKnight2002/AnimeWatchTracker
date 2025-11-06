import AnimeCard from '../AnimeCard';

export default function AnimeCardExample() {
  return (
    <div className="p-6 bg-background space-y-4 max-w-2xl">
      <AnimeCard
        id="1"
        title="Attack on Titan"
        episodesWatched={75}
        totalEpisodes={87}
        status="watching"
        onIncrement={(id) => console.log('Increment', id)}
        onDecrement={(id) => console.log('Decrement', id)}
        onEdit={(id) => console.log('Edit', id)}
        onDelete={(id) => console.log('Delete', id)}
      />
      <AnimeCard
        id="2"
        title="Death Note"
        episodesWatched={37}
        totalEpisodes={37}
        status="completed"
        onIncrement={(id) => console.log('Increment', id)}
        onDecrement={(id) => console.log('Decrement', id)}
        onEdit={(id) => console.log('Edit', id)}
        onDelete={(id) => console.log('Delete', id)}
      />
    </div>
  );
}
