import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Annotation } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { getHeatmap } from '../services/api';
import './IndiaHeatmap.css';

// India GeoJSON from reliable public source
const GEO_URL = 'https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States';

// Mapping from our DB state names to GeoJSON NAME_1 property
const STATE_NAME_MAP = {
  'Andhra Pradesh':    'Andhra Pradesh',
  'Arunachal Pradesh': 'Arunachal Pradesh',
  'Assam':             'Assam',
  'Bihar':             'Bihar',
  'Chhattisgarh':      'Chhattisgarh',
  'Delhi':             'NCT of Delhi',
  'Goa':               'Goa',
  'Gujarat':           'Gujarat',
  'Haryana':           'Haryana',
  'Himachal Pradesh':  'Himachal Pradesh',
  'Jharkhand':         'Jharkhand',
  'Karnataka':         'Karnataka',
  'Kerala':            'Kerala',
  'Madhya Pradesh':    'Madhya Pradesh',
  'Maharashtra':       'Maharashtra',
  'Manipur':           'Manipur',
  'Meghalaya':         'Meghalaya',
  'Mizoram':           'Mizoram',
  'Nagaland':          'Nagaland',
  'Odisha':            'Odisha',
  'Punjab':            'Punjab',
  'Rajasthan':         'Rajasthan',
  'Sikkim':            'Sikkim',
  'Tamil Nadu':        'Tamil Nadu',
  'Telangana':         'Telangana',
  'Tripura':           'Tripura',
  'Uttar Pradesh':     'Uttar Pradesh',
  'Uttarakhand':       'Uttarakhand',
  'West Bengal':       'West Bengal',
};

export default function IndiaHeatmap() {
  const [heatData, setHeatData]     = useState({});
  const [maxCount, setMaxCount]     = useState(1);
  const [tooltip, setTooltip]       = useState(null);
  const [topStates, setTopStates]   = useState([]);

  useEffect(() => {
    getHeatmap()
      .then(data => {
        const map = {};
        let max = 1;
        data.forEach(({ state, count }) => {
          const geoName = STATE_NAME_MAP[state] || state;
          map[geoName] = count;
          if (count > max) max = count;
        });
        setHeatData(map);
        setMaxCount(max);

        // Top 5 states for the sidebar
        const sorted = data.sort((a, b) => b.count - a.count).slice(0, 5);
        setTopStates(sorted);
      })
      .catch(() => {});
  }, []);

  const colorScale = scaleLinear()
    .domain([0, maxCount])
    .range(['#fef2f2', '#dc2626']);

  const hasData = Object.keys(heatData).length > 0;

  return (
    <div className="ihm-container">
      <div className="ihm-header">
        <div>
          <h3 className="ihm-title">🗺️ India Fraud Heatmap</h3>
          <p className="ihm-subtitle">Geographic distribution of reported fraud cases</p>
        </div>
        {!hasData && (
          <span className="ihm-no-data">
            Submit analyses with a state selected to populate the map
          </span>
        )}
      </div>

      <div className="ihm-body">
        {/* Map */}
        <div className="ihm-map-wrap">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [82, 22], scale: 1000 }}
            style={{ width: '100%', height: '380px' }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const stateName = geo.properties.NAME_1;
                  const count     = heatData[stateName] || 0;
                  const fill      = count > 0 ? colorScale(count) : '#f3f4f6';
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke="#fff"
                      strokeWidth={0.5}
                      style={{
                        default:  { outline: 'none', transition: 'fill 0.2s' },
                        hover:    { fill: '#f97316', outline: 'none', cursor: 'pointer' },
                        pressed:  { outline: 'none' },
                      }}
                      onMouseEnter={() => setTooltip({ name: stateName, count })}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          {/* Tooltip */}
          {tooltip && (
            <div className="ihm-tooltip">
              <strong>{tooltip.name}</strong>
              <span>{tooltip.count} case{tooltip.count !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="ihm-sidebar">
          {/* Legend */}
          <div className="ihm-legend">
            <span className="ihm-legend-label">Low</span>
            <div className="ihm-legend-bar" />
            <span className="ihm-legend-label">High</span>
          </div>

          {/* Top states */}
          {topStates.length > 0 && (
            <div className="ihm-top">
              <p className="ihm-top-title">Top States</p>
              {topStates.map(({ state, count }, i) => (
                <div key={state} className="ihm-top-row">
                  <span className="ihm-top-rank">#{i + 1}</span>
                  <span className="ihm-top-state">{state}</span>
                  <span className="ihm-top-count">{count}</span>
                </div>
              ))}
            </div>
          )}

          {!hasData && (
            <div className="ihm-empty">
              <p>No location data yet.</p>
              <p>Select your state in the Analyzer when submitting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
