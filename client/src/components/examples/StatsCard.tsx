import StatsCard from '../StatsCard';
import { Tv, Film } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="p-6 bg-background grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
      <StatsCard
        title="Total Episodes"
        value={1247}
        icon={Tv}
        description="Across all anime"
      />
      <StatsCard
        title="Movies Watched"
        value={89}
        icon={Film}
        description="Total count"
      />
    </div>
  );
}
