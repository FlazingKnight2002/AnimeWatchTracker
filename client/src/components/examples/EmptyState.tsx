import EmptyState from '../EmptyState';
import { Tv } from 'lucide-react';

export default function EmptyStateExample() {
  return (
    <div className="p-6 bg-background">
      <EmptyState
        icon={Tv}
        title="No anime tracked yet"
        description="Start tracking your anime journey by adding your first show using the button above."
      />
    </div>
  );
}
