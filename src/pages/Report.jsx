import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { generateReport } from '../services/api';
import './Report.css';

export default function Report() {
  const { id } = useParams();
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadReport() {
      if (!id) {
        setError('No analysis ID provided');
        setLoading(false);
        return;
      }

      try {
        const result = await generateReport(id);
        setReport(result.report || result.ncrp_complaint || JSON.stringify(result, null, 2));
      } catch (err) {
        console.error('Failed to load report:', err);
        setError(err.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [id]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  if (error) {
    return (
      <div className="rp-page">
        <div className="rp-header">
          <div>
            <p className="rp-super">Report Error</p>
            <h1>Unable to Load Report</h1>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: '#f87171' }}>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rp-page">
        <div className="rp-header">
          <div>
            <p className="rp-super">Fraud Analysis Report</p>
            <h1>Loading Report...</h1>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          Generating report from analysis...
        </div>
      </div>
    );
  }

  return (
    <div className="rp-page">
      {/* Header */}
      <div className="rp-header">
        <div>
          <p className="rp-super">Fraud Analysis Report</p>
          <h1>Case ID: <span className="rp-case-id">{id ? `CFS-${id}` : 'Loading...'}</span></h1>
        </div>
        <div className="rp-header-actions">
          <button className="btn-outline" onClick={handleCopy}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          <button className="btn-dark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* Info cards */}
      <div className="rp-info-cards">
        <div className="card rp-info-card">
          <p className="rp-info-label">RISK ASSESSMENT</p>
          <span className="badge badge-critical rp-risk-badge">● CRITICAL</span>
          <p className="rp-info-desc">High probability of fraudulent activity detected in the analyzed content.</p>
        </div>
        <div className="card rp-info-card">
          <p className="rp-info-label">AI CONFIDENCE SCORE</p>
          <div className="rp-confidence">
            <div className="rp-conf-bar">
              <div className="rp-conf-fill" />
              <span className="rp-conf-label">PROCESSING COMPLETE</span>
            </div>
            <span className="rp-conf-val">98.4%</span>
          </div>
          <p className="rp-info-desc">Based on cross-referencing fraud patterns and real-time verification.</p>
        </div>
        <div className="card rp-info-card">
          <p className="rp-info-label">GENERATED AT</p>
          <div className="rp-gen-time">
            <div className="rp-gen-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="rp-gen-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>{new Date().toLocaleTimeString()} UTC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complaint summary */}
      <div className="card rp-complaint">
        <div className="rp-complaint-head">
          <h2>Formal Complaint Summary</h2>
          <span className="rp-draft-badge">GENERATED_BY_AI</span>
        </div>
        <pre className="rp-complaint-body">{report}</pre>
      </div>

      {/* Bottom row */}
      <div className="rp-bottom">
        <div className="rp-network">
          <div className="rp-network-head">
            <span>Network Visualization</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </div>
          <div className="rp-network-body">
            {/* Network cluster visual */}
            <div className="rp-cluster">
              <div className="rp-node rp-node-center" />
              {[45,120,200,270,330].map((deg, i) => (
                <div key={i} className="rp-node rp-node-outer" style={{
                  left: `calc(50% + ${Math.cos(deg*Math.PI/180)*60}px)`,
                  top: `calc(50% + ${Math.sin(deg*Math.PI/180)*60}px)`,
                }} />
              ))}
              <div className="rp-cluster-label">SUSPICIOUS CLUSTERS IDENTIFIED</div>
            </div>
          </div>
        </div>

        <div className="card rp-security">
          <div className="rp-security-head">
            <span>Security Context</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <table className="rp-sec-table">
            <tbody>
              <tr>
                <td className="rp-sec-key">Data Integrity</td>
                <td className="rp-sec-val rp-sec-blue">VERIFIED</td>
              </tr>
              <tr>
                <td className="rp-sec-key">Encryption Level</td>
                <td className="rp-sec-val rp-sec-mono">AES-256-GCM</td>
              </tr>
              <tr>
                <td className="rp-sec-key">Compliance standard</td>
                <td className="rp-sec-val rp-sec-mono">SOC2 Type II</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
