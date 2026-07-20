import { useState } from 'react';
import NCRPStepper from '../components/NCRPStepper';
import { generateReport } from '../services/api';
import './Report.css';

const MOCK_REPORT = `I. SUBJECT INFORMATION

Entity Name: Global Trade Logistics (Flagged)    Address Hash: 0x71C7...5974

II. NARRATIVE OF INCIDENT

This report documents a sequence of suspicious high-value transfers initiated between October 20th and October 23rd, 2024. The automated Citizen Fraud Shield analysis indicates a clear pattern of "Layering," where multiple micro-transactions (averaging $199.00 each) were executed immediately preceding three primary outbound transfers of $50,000.00 each to offshore custodial accounts.

The behavioral profile of the initiating account changed abruptly on October 20th, transitioning from a "Consumer-Standard" profile to a high-frequency "Institutional-Aggressive" profile within a 12-minute window. This rapid pivot is characteristic of account takeover (ATO) or credential harvesting exploitation.

III. EVIDENCE & LOG ANALYSIS

[LOG_ENTRY_20241023_1420] - Suspicious IP mismatch: Client reported location 'London, UK', IP resolution 'Lagos, NG'.
[LOG_ENTRY_20241023_1421] - Auth bypass attempt detected: Biometric mismatch on 2nd factor secondary device.
[LOG_ENTRY_20241023_1422] - Transaction ID #TRX-9981-A blocked by Risk Engine.
[LOG_ENTRY_20241023_1422] - Citizen Fraud Shield auto-generated report initiated.`;

export default function Report() {
  const [copied, setCopied]       = useState(false);
  const [analysisId, setAnalysisId] = useState('');
  const [report, setReport]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [fetchError, setFetchError] = useState('');

  async function handleGenerate() {
    const id = parseInt(analysisId, 10);
    if (!id) { setFetchError('Please enter a valid Analysis ID'); return; }
    setFetchError('');
    setLoading(true);
    setReport(null);
    try {
      const data = await generateReport(id);
      if (data.report) setReport(data.report);
      else setFetchError('No report found for that ID');
    } catch (e) {
      setFetchError(e.response?.data?.error || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    const text = report ? JSON.stringify(report, null, 2) : MOCK_REPORT;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="rp-page">
      {/* Header */}
      <div className="rp-header">
        <div>
          <p className="rp-super">Fraud Analysis Report</p>
          <h1>Case ID: <span className="rp-case-id">{report?.complaint_id || 'CFS-2024-8892-XT'}</span></h1>
        </div>
        <div className="rp-header-actions">
          {/* Fetch by Analysis ID */}
          <div className="rp-fetch-row">
            <input
              type="number"
              className="rp-fetch-input"
              placeholder="Analysis ID"
              value={analysisId}
              onChange={e => setAnalysisId(e.target.value)}
            />
            <button className="btn-dark" onClick={handleGenerate} disabled={loading}>
              {loading ? 'Loading...' : 'Generate Report'}
            </button>
          </div>
          <button className="btn-outline" onClick={handleCopy}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      </div>
      {fetchError && <p style={{color:'#ef4444', fontSize:'13px', marginBottom:'12px'}}>{fetchError}</p>}
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
          <p className="rp-info-desc">High probability of sophisticated financial engineering detected in the analyzed transaction sequence.</p>
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
          <p className="rp-info-desc">Based on cross-referencing 4.2M known fraud patterns and real-time ledger verification.</p>
        </div>
        <div className="card rp-info-card">
          <p className="rp-info-label">GENERATED AT</p>
          <div className="rp-gen-time">
            <div className="rp-gen-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>Oct 24, 2024</span>
            </div>
            <div className="rp-gen-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>14:22:10 UTC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complaint summary */}
      <div className="card rp-complaint">
        <div className="rp-complaint-head">
          <h2>Formal Complaint Summary</h2>
          <span className="rp-draft-badge">DRAFT_VERSION_B4</span>
        </div>
        <pre className="rp-complaint-body">{MOCK_REPORT}</pre>
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
      {/* NCRP Filing Stepper */}
      {report && <NCRPStepper report={report} />}
    </div>
  );
}
