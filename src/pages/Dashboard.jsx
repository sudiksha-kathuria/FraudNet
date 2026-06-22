import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardData } from '../services/api';
import './Dashboard.css';

const LEVEL_LABEL = { critical: 'CRITICAL', suspicious: 'SUSPICIOUS', safe: 'VERIFIED SAFE', low: 'LOW' };
const LEVEL_CLASS = { critical: 'badge badge-critical', suspicious: 'badge badge-suspicious', safe: 'badge badge-safe', low: 'badge badge-low' };

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="db-page">
        <div className="db-header">
          <h1>Vigilance Overview</h1>
          <p>Real-time fraud analysis and threat landscape monitoring.</p>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          Loading dashboard data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="db-page">
        <div className="db-header">
          <h1>Vigilance Overview</h1>
          <p>Real-time fraud analysis and threat landscape monitoring.</p>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: '#f87171' }}>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'TOTAL CASES ANALYZED', value: data?.total_cases || 0, sub: '↑ All time', dark: false },
    { label: 'CRITICAL CASES', value: data?.critical_cases || 0, sub: '⚠ High priority alerts', dark: true },
    { label: 'HIGH PRIORITY', value: data?.high_cases || 0, sub: '⏱ Requires attention', dark: false },
  ];

  const categories = Object.entries(data?.categories || {}).map(([name, count]) => ({
    name,
    count,
    pct: data?.total_cases ? Math.round((count / data.total_cases) * 100) : 0,
  }));

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
        {stats.map(s => (
          <div key={s.label} className={`card db-stat${s.dark ? ' db-stat-danger' : ''}`}>
            <div className="db-stat-inner">
              <div>
                <p className="db-stat-label">{s.label}</p>
                <p className={`db-stat-val${s.dark ? ' db-stat-val-red' : ''}`}>{s.value}</p>
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
            {categories.map(c => (
              <div key={c.name} className="db-bar-row">
                <span className="db-bar-label">{c.name}</span>
                <div className="db-bar-track">
                  <div className="db-bar-fill" style={{width: `${c.pct}%`}} />
                </div>
                <span className="db-bar-pct">{c.pct}%</span>
              </div>
            ))}
          </div>
          <div className="db-quote">
            <p>"Phishing remains the primary vector for fraudulent entry into citizen accounts this quarter."</p>
          </div>
        </div>

        {/* Recent analyses */}
        <div className="card db-recent-card">
          <div className="db-recent-head">
            <h2>Recent Analyses</h2>
            <button className="db-view-all">View All Records</button>
          </div>
          <table className="db-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>SCAM TYPE</th>
                <th>ID</th>
                <th>RISK LEVEL</th>
              </tr>
            </thead>
            <tbody>
              {RECENT.map(r => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td>{r.type}</td>
                  <td><code className="db-id">{r.id}</code></td>
                  <td><span className={LEVEL_CLASS[r.level]}>{LEVEL_LABEL[r.level]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <p>Based on your recent 'Phishing' cases, we recommend updating the local security policy filters to include regional bank TLD variations.</p>
            <button className="db-apply-btn">Apply Filter Policy →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
