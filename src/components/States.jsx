import { Alert } from './Icons';

export function SkeletonList({ count = 3, height = 320, className = '' }) {
  return (
    <div className={className} aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton" style={{ height }} />
      ))}
    </div>
  );
}

export function ErrorNote({ error, onRetry, what = 'this content' }) {
  return (
    <div className="notice" role="alert">
      <Alert width={18} height={18} style={{ flex: 'none', marginTop: 2 }} />
      <div>
        We couldn't load {what}. {error?.message}
        {onRetry && (
          <>
            {' '}
            <button type="button" onClick={onRetry} style={{ background: 'none', border: 0, padding: 0, color: 'inherit', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
