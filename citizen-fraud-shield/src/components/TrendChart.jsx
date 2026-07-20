import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './TrendChart.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="tc-tooltip">
        <p className="tc-tt-date">{label}</p>
        <p className="tc-tt-val">{payload[0].value} case{payload[0].value !== 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
};

export default function TrendChart({ data = [] }) {
  // Only show last 14 days for readability, format date labels
  const chartData = data.slice(-14).map(d => ({
    date:  d.date.slice(5),   // "MM-DD"
    cases: d.cases,
  }));

  const hasData = chartData.some(d => d.cases > 0);

  return (
    <div className="tc-container">
      <div className="tc-header">
        <h3 className="tc-title">📈 Daily Case Trend</h3>
        <span className="tc-sub">Last 14 days</span>
      </div>

      {!hasData ? (
        <div className="tc-empty">
          <p>No trend data yet. Run analyses to see the trend line populate.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="cases"
              stroke="#111827"
              strokeWidth={2}
              dot={{ fill: '#111827', r: 3 }}
              activeDot={{ r: 5, fill: '#ef4444' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
