import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getHeatmap } from '../services/api';
import './IndiaHeatmap.css';

// Color scale from low to high fraud intensity
function getColor(pct) {
  // pct: 0-1
  if (pct > 0.8) return '#dc2626';
  if (pct > 0.6) return '#ef4444';
  if (pct > 0.4) return '#f97316';
  if (pct > 0.2) return '#fbbf24';
  return '#fde68a';
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="ihm-tooltip">
        <strong>{label}</strong>
        <span>{payload[0].value} case{payload[0].value !== 1 ? 's' : ''} reported</span>
      </div>
    );
  }
  return null;
};

export default function IndiaHeatmap() {
  const [chartData, setChartData] = useState([]);
  const [topStates, setTopStates] = useState([]);
  const [totalStates, setTotalStates] = useState(0);

  useEffect(() => {
    getHeatmap()
      .then(data => {
        if (!data.length) return;
        const sorted = [...data].sort((a, b) => b.count - a.count);
        setTotalStates(sorted.length);
        setTopStates(sorted.slice(0, 5));

        const max = sorted[0]?.count || 1;
        const chartable = sorted.slice(0, 12).map(d => ({
          state: d.state.length > 12 ? d.state.slice(0, 10) + '…' : d.state,
          fullName: d.state,
          count: d.count,
          pct: d.count / max,
        }));
        setChartData(chartable);
      })
      .catch(() => {});
  }, []);

  const hasData = chartData.length > 0;

  return (
    <div className="ihm-container">
      <div className="ihm-header">
        <div>
          <h3 className="ihm-title">🗺️ India Fraud Heatmap</h3>
          <p className="ihm-subtitle">
            {hasData
              ? `Fraud cases across ${totalStates} Indian state${totalStates !== 1 ? 's' : ''} — showing top ${Math.min(chartData.length, 12)}`
              : 'Geographic distribution of reported fraud cases'}
          </p>
        </div>
        {hasData && (
          <span className="ihm-total-badge">{topStates.reduce((s, x) => s + x.count, 0)} total reports</span>
        )}
      </div>

      {!hasData ? (
        <div className="ihm-empty">
          <div className="ihm-empty-icon">🗺️</div>
          <p className="ihm-empty-title">No location data yet</p>
          <p className="ihm-empty-sub">Select your <strong>state</strong> when submitting an analysis to populate this map.</p>
        </div>
      ) : (
        <div className="ihm-body">
          {/* Bar chart */}
          <div className="ihm-chart">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: -24, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="state"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={getColor(entry.pct)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Right panel */}
          <div className="ihm-sidebar">
            {/* Colour legend */}
            <div className="ihm-legend">
              <span className="ihm-legend-label">Low</span>
              <div className="ihm-legend-bar" />
              <span className="ihm-legend-label">High</span>
            </div>

            {/* Top 5 states */}
            <div className="ihm-top">
              <p className="ihm-top-title">🏆 Hot Spots</p>
              {topStates.map(({ state, count }, i) => (
                <div key={state} className="ihm-top-row">
                  <span className="ihm-top-rank">#{i + 1}</span>
                  <span className="ihm-top-state">{state}</span>
                  <span
                    className="ihm-top-count"
                    style={{ color: i === 0 ? '#dc2626' : i === 1 ? '#ef4444' : '#f97316' }}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
