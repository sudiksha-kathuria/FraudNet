import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardData } from '../services/api';
import LiveFeed from '../components/LiveFeed';
import './Dashboard.css';

const LEVEL_LABEL = { critical: 'CRITICAL', suspicious: 'SUSPICIOUS', safe: 'VERIFIED SAFE', low: 'LOW', high: 'HIGH', medium: 'MEDIUM' };
const LEVEL_CLASS  = { critical: 'badge badge-critical', suspicious: 'badge badge-suspicious', safe: 'badge badge-safe', low: 'badge badge-low', high: 'badge badge-critical', medium: 'badge badge-suspicious' };

function riskLevelKey(level) {
  const l = (level || '').toLowerCase();
  if (l === 'critical') return 'critical';
  if (l === 'high') return 'high';
  if (l === 'medium') return 'medium';
  return 'low';
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const total    = data?.total_cases    ?? 0;
  const critical = data?.critical_cases ?? 0;
  const active   = data ? (data.high_cases ?? 0) + (data.medium_cases ?? 0) : 0;

  const categoriesObj = data?.categories ?? {};
  const catEntries = Object.entries(categoriesObj);
  const catTotal = catEntries.reduce((s, [, v]) => s + v, 0) || 1;
  const categories = catEntries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, pct: Math.round((count / catTotal) * 100) }));

  const avgScore = data?.average_risk_score ?? 0;

  const STATS = [
    { label: 'TOTAL CASES ANALYZED', value: total.toLocaleString(),          sub: 'All time analyses',      dark: false },
    { label: 'CRITICAL CASES',        value: critical.toLocaleString(),       sub: '⚠ High priority alerts',  dark: true  },
    { label: 'ACTIVE REPORTS',        value: active.toLocaleString(),         sub: '⏱ High & medium risk',   dark: false },
    { label: 'AVG RISK SCORE',        value: avgScore ? avgScore.toFixed(1) : '—', sub: 'Out of 100',        dark: false },
  ];

  return (
    <div className="db-page">
      {/* Header */}
      <div className="db-header">
        <div>
          <h1>Vigilance Overview</h1>
          <p>Real-time fraud analysis and threat landscape monitoring.</p>
        </div>
        <div className="db-header-actions">
          <button className="btn-outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Last 30 Days
          </button>
          <button className="btn-dark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="db-stats">
        {STATS.map(s => (
          <div key={s.label} className={`card db-stat${s.dark ? ' db-stat-danger' : ''}`}>
            <div className="db-stat-inner">
              <div>
                <p className="db-stat-label">{s.label}</p>
                <p className={`db-stat-val${s.dark ? ' db-stat-val-red' : ''}`}>
                  {loading ? '—' : s.value}
                </p>
                <p className="db-stat-sub">{s.sub}</p>
              </div>
              <div className={`db-stat-icon${s.dark ? ' db-stat-icon-red' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main 2-col */}
      <div className="db-main">
        {/* Category distribution */}
        <div className="card db-cat-card">
          <div className="db-cat-head">
            <h2>Scam Category Distribution</h2>
            <span className="db-live-badge">Live Data</span>
          </div>
          <div className="db-bars">
            {loading ? (
              <p style={{color:'#9ca3af',fontSize:'14px'}}>Loading...</p>
            ) : categories.length > 0 ? (
              categories.map(c => (
                <div key={c.name} className="db-bar-row">
                  <span className="db-bar-label">{c.name}</span>
                  <div className="db-bar-track">
                    <div className="db-bar-fill" style={{width: `${c.pct}%`}} />
                  </div>
                  <span className="db-bar-pct">{c.pct}%</span>
                </div>
              ))
            ) : (
              <p style={{color:'#9ca3af',fontSize:'14px'}}>No cases analyzed yet. Run an analysis to see data here.</p>
            )}
          </div>
          <div className="db-quote">
            <p>"Use the Fraud Analyzer to submit suspicious messages and see real threat data populate here."</p>
          </div>
        </div>

        {/* Recent analyses */}
        <div className="card db-recent-card">
          <div className="db-recent-head">
            <h2>Recent Analyses</h2>
            <Link to="/analyzer" className="db-view-all">New Analysis →</Link>
          </div>
          {loading ? (
            <p style={{color:'#9ca3af',fontSize:'14px',padding:'16px 0'}}>Loading...</p>
          ) : data && total > 0 ? (
            <table className="db-table">
              <thead>
                <tr>
                  <th>SCAM TYPE</th>
                  <th>RISK LEVEL</th>
                  <th>COUNT</th>
                </tr>
              </thead>
              <tbody>
                {catEntries.sort((a,b) => b[1]-a[1]).slice(0,5).map(([type, count]) => (
                  <tr key={type}>
                    <td>{type}</td>
                    <td><span className="badge badge-critical">DETECTED</span></td>
                    <td><code className="db-id">{count}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{color:'#9ca3af',fontSize:'14px',padding:'16px 0'}}>
              No analyses yet. <Link to="/analyzer" style={{color:'#111827'}}>Run your first analysis →</Link>
            </p>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="db-bottom">
        <div className="db-pulse">
          <h2>Global Threat Pulse</h2>
          <p>Live visualization of detected fraud attempts across the region.</p>
          <Link to="/analyzer" className="btn-dark db-pulse-btn">New Analysis</Link>
        </div>
        <div className="card db-ai-rec">
          <div className="db-ai-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div>
            <h3>AI Recommendation</h3>
            <p>
              {critical > 0
                ? `${critical} critical case${critical > 1 ? 's' : ''} detected. Review and report to NCRP at cybercrime.gov.in immediately.`
                : 'Submit suspicious messages via the Fraud Analyzer to receive AI-powered recommendations.'}
            </p>
            <Link to="/analyzer" className="db-apply-btn">Go to Analyzer →</Link>
          </div>
        </div>
      </div>

      {/* Live Threat Feed */}
      <LiveFeed />
    </div>
  );
}
