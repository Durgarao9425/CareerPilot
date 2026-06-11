import { cn } from '@utils/helpers';

const SkeletonCard = ({ className }) => (
  <div className={cn('card p-6 space-y-4', className)}>
    <div className="skeleton h-4 w-1/3" />
    <div className="skeleton h-3 w-full" />
    <div className="skeleton h-3 w-5/6" />
    <div className="skeleton h-3 w-4/6" />
  </div>
);

const SkeletonStat = () => (
  <div className="stat-card">
    <div className="skeleton w-12 h-12 rounded-xl" />
    <div className="space-y-2 flex-1">
      <div className="skeleton h-7 w-16" />
      <div className="skeleton h-3 w-24" />
    </div>
  </div>
);

const SkeletonResumeCard = () => (
  <div className="card p-5 space-y-4">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <div className="skeleton h-5 w-2/3" />
        <div className="skeleton h-3 w-1/2" />
      </div>
      <div className="skeleton w-8 h-8 rounded-lg" />
    </div>
    <div className="skeleton h-24 w-full rounded-xl" />
    <div className="flex gap-2">
      <div className="skeleton h-6 w-16 rounded-full" />
      <div className="skeleton h-6 w-20 rounded-full" />
    </div>
  </div>
);

const SkeletonText = ({ lines = 3, className }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={cn('skeleton h-3', i === lines - 1 ? 'w-3/4' : 'w-full')}
      />
    ))}
  </div>
);

export { SkeletonCard, SkeletonStat, SkeletonResumeCard, SkeletonText };
