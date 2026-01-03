import { Skeleton } from '../atoms/Skeleton';
import { Card } from '../atoms/Card';

export const BeneficiarySkeleton = () => {
  return (
    <Card>
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </Card>
  );
};
