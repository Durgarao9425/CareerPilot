import { cn } from '@utils/helpers';

const SkeletonCard = ({ className }) => (
  <div className={cn('card', className)} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div className="skeleton" style={{ height: 14, width: '33%' }} />
    <div className="skeleton" style={{ height: 11, width: '100%' }} />
    <div className="skeleton" style={{ height: 11, width: '80%' }} />
    <div className="skeleton" style={{ height: 11, width: '60%' }} />
  </div>
);

const SkeletonStat = () => (
  <div className="card" style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="skeleton" style={{ height: 28, width: 60 }} />
      <div className="skeleton" style={{ height: 11, width: 90 }} />
      <div className="skeleton" style={{ height: 10, width: 70 }} />
    </div>
    <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%' }} />
  </div>
);

const SkeletonResumeCard = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
  }}>
    <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div className="skeleton" style={{ height: 13, width: '60%' }} />
      <div className="skeleton" style={{ height: 10, width: '40%' }} />
    </div>
    <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 99 }} />
  </div>
);

const SkeletonText = ({ lines = 3, className }) => (
  <div className={cn(className)} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="skeleton"
        style={{ height: 11, width: i === lines - 1 ? '70%' : '100%' }}
      />
    ))}
  </div>
);

export { SkeletonCard, SkeletonStat, SkeletonResumeCard, SkeletonText };
