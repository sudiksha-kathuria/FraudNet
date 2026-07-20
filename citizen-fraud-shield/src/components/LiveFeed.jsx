import { useEffect, useState } from 'react';
import './LiveFeed.css';

const RISK_COLOR = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#eab308',
  low:      '#22c55e',
};

function timeAgo(isoStr) {
  const diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (diff < 60)  return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function LiveFeed() {
  const [feed, setFeed] = useState([]);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    async function fetchFeed() {
      try {
        const res = await fetch(`${API}/api/live-feed`);
        if (res.ok) {
          const data = await res.json();
          setFeed(data);
          setPulse(true);
          setTimeout(() => setPulse(false), 600);
        }
      } catch (_) {
        // backend not reachable — show empty state
      }
    }

    fetchFeed();
    const interval = setInterval(fetchFeed, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lf-container">
      <div className="lf-header">
        <span className={`lf-dot${pulse ? ' lf-dot-pulse' : ''}`} />
        <h3 className="lf-title">Live Threat Feed</h3>
        <span className="lf-count">{feed.length} recent</span>
      </div>

      {feed.length === 0 ? (
        <p className="lf-empty">No reports yet. Submit an analysis to populate the feed.</p>
      ) : (
        <div className="lf-list">
          {feed.map((item) => {
            const lvl = (item.risk_level || 'low').toLowerCase();
            const color = RISK_COLOR[lvl] || '#6b7280';
            return (
              <div key={item.id} className="lf-item">
                <span className="lf-badge" style={{ background: color }}>
                  {item.risk_level?.toUpperCase()}
                </span>
                <span className="lf-type">{item.scam_type}</span>
                <span className="lf-loc">
                  {item.location_city ? `📍 ${item.location_city}` : '📍 Unknown'}
                </span>
                <span className="lf-time">{timeAgo(item.timestamp)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
