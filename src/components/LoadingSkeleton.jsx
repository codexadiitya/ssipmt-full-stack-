/** Animated skeleton placeholder cards */
export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          background: 'var(--w)',
          borderRadius: 32,
          padding: 32,
          marginBottom: 20,
          boxShadow: 'var(--sh)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* shimmer overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(162,142,249,0.08) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'skshimmer 1.5s infinite',
          }} />
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 24, background: 'var(--bg)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 14, borderRadius: 8, background: 'var(--bg)', marginBottom: 10, width: '60%' }} />
              <div style={{ height: 11, borderRadius: 8, background: 'var(--bg)', width: '40%' }} />
            </div>
          </div>
          <div style={{ height: 11, borderRadius: 8, background: 'var(--bg)', marginBottom: 10 }} />
          <div style={{ height: 11, borderRadius: 8, background: 'var(--bg)', width: '80%' }} />
        </div>
      ))}
      <style>{`
        @keyframes skshimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
