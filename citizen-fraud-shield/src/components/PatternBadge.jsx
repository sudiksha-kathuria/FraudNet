import { useEffect, useState } from 'react';
import { getPatternCount } from '../services/api';
import './PatternBadge.css';

/**
 * Shows "⚠️ This scam type has been reported X times in the last 7 days"
 * Fetches count from /api/pattern-count?scam_type=<type>
 */
export default function PatternBadge({ scamType }) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    if (!scamType || scamType === 'Unknown') return;
    getPatternCount(scamType)
      .then(data => setCount(data.count))
      .catch(() => {});
  }, [scamType]);

  if (count === null || count === 0) return null;

  return (
    <div className="pb-badge">
      <span className="pb-icon">⚠️</span>
      <span className="pb-text">
        This <strong>{scamType}</strong> pattern has been reported{' '}
        <strong>{count} time{count !== 1 ? 's' : ''}</strong> in the last 7 days across FraudNet users.
      </span>
      <span className="pb-pill">Community Alert</span>
    </div>
  );
}
