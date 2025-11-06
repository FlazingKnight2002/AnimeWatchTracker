import MovieCard from '../MovieCard';

export default function MovieCardExample() {
  return (
    <div className="p-6 bg-background space-y-4 max-w-2xl">
      <MovieCard
        id="1"
        title="Your Name"
        isAnime={true}
        watchCount={2}
        onDelete={(id) => console.log('Delete', id)}
      />
      <MovieCard
        id="2"
        title="Inception"
        isAnime={false}
        watchCount={1}
        onDelete={(id) => console.log('Delete', id)}
      />
    </div>
  );
}
