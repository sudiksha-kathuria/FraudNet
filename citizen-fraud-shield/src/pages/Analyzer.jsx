import { useState, useRef, useEffect } from 'react';
import { analyzeText, analyzeImage, checkUrl } from '../services/api';
import AgentThinking from '../components/AgentThinking';
import './Analyzer.css';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

function normalizeResult(data) {
  const level = (data.risk_level || 'low').toLowerCase();
  const score = data.risk_score != null ? (data.risk_score / 10).toFixed(1) : '0.0';
  const actions = data.recommendation
    ? data.recommendation.split('\n').filter(Boolean)
    : [];
  return {
    id:                data.id,
    scam_type:         data.scam_type || 'Unknown',
    risk_level:        level,
    risk_score:        parseFloat(score),
    red_flags:         data.red_flags || [],
    explanation:       data.explanation || '',
    recommended_actions: actions,
    evidence:          data.evidence || {},
    agents:            data.agents || null,
  };
}

export default function Analyzer() {
  const [text, setText]           = useState('');
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState('');
  const [dragOver, setDragOver]   = useState(false);
  const [locationCity, setCity]   = useState('');
  const [locationState, setState] = useState('');
  const [urlSafety, setUrlSafety] = useState({});
  const fileRef = useRef();

  // Prefill from QuickScan deep-link
  useEffect(() => {
    const prefill = sessionStorage.getItem('prefill_text');
    if (prefill) {
      setText(prefill);
      sessionStorage.removeItem('prefill_text');
    }
  }, []);

  function handleFileSelect(selected) {
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleAnalyze() {
    if (!text.trim() && !file) {
      setError('Please paste a message or upload a screenshot before analyzing.');
      return;
    }
    setError('');
    setResult(null);
    setUrlSafety({});
    setLoading(true);
    try {
      let data;
      if (file) {
        data = await analyzeImage(file, locationCity, locationState);
      } else {
        data = await analyzeText(text.trim(), locationCity, locationState);
      }
      if (data.error) {
        setError(data.error);
      } else {
        const normalized = normalizeResult(data);
        setResult(normalized);

        // Kick off URL safety checks in background
        const urls = normalized.evidence?.urls || [];
        urls.forEach(async (url) => {
          try {
            const safety = await checkUrl(url);
            setUrlSafety(prev => ({ ...prev, [url]: safety }));
          } catch (_) {}
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Failed to connect to the analysis server. Make sure the backend is running on port 8000.'
      );
    } finally {
      setLoading(false);
    }
  }

  const riskColor = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e' };
  const levelColor = riskColor[result?.risk_level] ?? '#6b7280';

  return (
    <div className="az-page">
      <div className="az-header">
        <h1>Fraud Analyzer</h1>
        <p>Intercept and dissect potential threats using real-time AI heuristics.</p>
      </div>

      {/* ── INPUT PANELS ── */}
      <div className="az-inputs">
        {/* Text panel */}
        <div className="card az-panel">
          <div className="az-panel-head">
            <span className="az-panel-title">Suspicious Message</span>
            <span className="az-panel-badge">TEXT INPUT</span>
          </div>
          <textarea
            className="az-textarea"
            rows={8}
            placeholder="Paste the SMS, email body, or chat log here for analysis..."
            value={text}
            onChange={e => setText(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Image panel */}
        <div className="card az-panel">
          <div className="az-panel-head">
            <span className="az-panel-title">Screenshot</span>
            <span className="az-panel-badge">IMG_001</span>
          </div>
          <div
            className={`az-upload${dragOver ? ' drag-over' : ''}`}
            onClick={() => fileRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]); }}
          >
            {preview ? (
              <img src={preview} alt="preview" className="az-preview-img" />
            ) : (
              <>
                <div className="az-upload-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                </div>
                <p className="az-upload-text">Drag and drop screenshots<br/>or click to browse files</p>
                <p className="az-upload-hint">PNG, JPG up to 10MB</p>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e => handleFileSelect(e.target.files[0])} />
          </div>
          {file && <p className="az-filename">{file.name}</p>}
        </div>
      </div>

      {/* ── LOCATION (optional) ── */}
      <div className="az-location-row">
        <span className="az-location-label">📍 Location (optional — helps build the fraud heatmap)</span>
        <input
          type="text"
          className="az-location-input"
          placeholder="City / District"
          value={locationCity}
          onChange={e => setCity(e.target.value)}
          disabled={loading}
        />
        <select
          className="az-location-select"
          value={locationState}
          onChange={e => setState(e.target.value)}
          disabled={loading}
        >
          <option value="">Select State</option>
          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="az-analyze-row">
        <button className="az-analyze-btn btn-dark" onClick={handleAnalyze} disabled={loading}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          {loading ? 'Analyzing...' : 'Analyze for Fraud'}
        </button>
      </div>

      {/* ── RESULT ── */}
      <div className="az-result-area">
        {!result && !loading && (
          <div className="az-awaiting">
            <div className="az-await-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            </div>
            <h3>Awaiting Input</h3>
            <p>Input message text or upload a screenshot to initiate the forensic analysis engine.</p>
          </div>
        )}

        {loading && (
          <div className="az-awaiting">
            <div className="az-spinner" />
            <h3>Analyzing...</h3>
            <p>Running multi-agent AI pipeline — Evidence → Classification → Risk → Advisory</p>
          </div>
        )}

        {result && (
          <div className="az-result-card card">
            <div className="az-result-top">
              <div>
                <h2 className="az-result-title">Analysis Complete</h2>
                <p className="az-result-type">{result.scam_type}</p>
              </div>
              <div className="az-risk-block" style={{borderColor: levelColor}}>
                <span className="az-risk-level" style={{color: levelColor}}>{result.risk_level?.toUpperCase()}</span>
                <span className="az-risk-score">{result.risk_score}/10</span>
              </div>
            </div>

            <div className="az-result-sections">
              <section className="az-section">
                <h4>Red Flags</h4>
                <ul className="az-flags">
                  {result.red_flags.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </section>
              <section className="az-section">
                <h4>Explanation</h4>
                <p>{result.explanation}</p>
              </section>
              {result.recommended_actions.length > 0 && (
                <section className="az-section">
                  <h4>Recommended Actions</h4>
                  <ol className="az-actions">
                    {result.recommended_actions.map((a, i) => <li key={i}>{a}</li>)}
                  </ol>
                </section>
              )}

              {/* URL Safety Cards */}
              {result.evidence?.urls?.length > 0 && (
                <section className="az-section">
                  <h4>Suspicious URLs Found</h4>
                  <div className="az-url-cards">
                    {result.evidence.urls.map((u, i) => {
                      const safety = urlSafety[u];
                      return (
                        <div key={i} className={`az-url-card ${safety?.malicious > 0 ? 'az-url-dangerous' : safety ? 'az-url-clean' : 'az-url-checking'}`}>
                          <code className="az-url-text">{u}</code>
                          {!safety && <span className="az-url-status">Checking VirusTotal...</span>}
                          {safety && (
                            <span className="az-url-status">
                              {safety.malicious > 0
                                ? `🚨 Malicious (${safety.malicious} engines flagged)`
                                : safety.suspicious > 0
                                ? `⚠️ Suspicious (${safety.suspicious} engines flagged)`
                                : '✅ Clean'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Multi-agent pipeline visualization */}
            {result.agents && <AgentThinking agents={result.agents} />}
          </div>
        )}
      </div>
    </div>
  );
}
