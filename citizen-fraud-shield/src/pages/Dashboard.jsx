import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardData } from '../services/api';
import LiveFeed from '../components/LiveFeed';
import TrendChart from '../components/TrendChart';
import IndiaHeatmap from '../components/IndiaHeatmap';
import './Dashboard.css';

const LEVEL_LABEL = { critical: 'CRITICAL', suspicious: 'SUSPICIOUS', safe: 'VERIFIED SAFE', low: 'LOW', high: 'HIGH', medium: 'MEDIUM' };
const LEVEL_CLASS  = { critical: 'badge badge-critical', suspicious: 'badge badge-suspicious', safe: 'badge badge-safe', low: 'badge badge-low', high: 'badge badge-critical', medium: 'badge badge-suspicious' };

export default function Dashboard() {
  const [data, setData]       = useState(null);
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
  const avgScore = data?.average_risk_score ?? 0;

  const categoriesObj = data?.categories ?? {};
  const catEntries    = Object.entries(categoriesObj);
  const catTotal      = catEntries.reduce((s, [, v]) => s + v, 0) || 1;
  const categories    = catEntries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, pct: Math.round((count / catTotal) * 100) }));

  const STATS = [
    { label: 'TOTAL CASES',    value: total.toLocaleString(),               sub: 'All time analyses',     dark: false },
    { label: 'CRITICAL CASES', value: critical.toLocaleString(),            sub: '⚠ High priority alerts', dark: true  },
    { label: 'ACTIVE REPORTS', value: active.toLocaleString(),              sub: '⏱ High & medium risk',  dark: false },
    { label: 'AVG RISK SCORE', value: avgScore ? avgScore.toFixed(1) : '—', sub: 'Out of 100',            dark: false },
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
          <Link to="/analyzer" className="btn-dark">+ New Analysis</Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="db-stats db-stats-4">
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
            </div>
          </div>
        ))}
      </div>

      {/* Trend + Category row */}
      <div className="db-trend-row">
        <TrendChart data={data?.daily_trends ?? []} />

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
              <p style={{color:'#9ca3af',fontSize:'14px'}}>No cases yet. Run an analysis to see data here.</p>
            )}
          </div>
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
              {catEntries.sort((a,b) => b[1]-a[1]).slice(0,6).map(([type, count]) => (
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

      {/* India Heatmap */}
      <IndiaHeatmap />

      {/* Live Threat Feed */}
      <LiveFeed />
    </div>
  );
}
