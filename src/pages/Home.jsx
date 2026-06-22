import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Home.css';

export default function Home() {
  return (
    <div className="home-root">
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.25 3.75 10.2 9 11.4C17.25 21.2 21 16.25 21 11V5L12 1z"/></svg>
            PROFESSIONAL GRADE PROTECTION
          </div>
          <h1 className="hero-title">Vigilant Protection for the Digital Age.</h1>
          <p className="hero-desc">
            Citizen Fraud Shield leverages advanced AI to detect, analyze, and neutralize fraudulent threats in real-time. Designed for professionals who demand clarity and speed.
          </p>
          <div className="hero-actions">
            <Link to="/analyzer" className="btn-dark">Get Started →</Link>
            <Link to="/dashboard" className="btn-outline-light">View Demo</Link>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card">
            <div className="hero-card-header">
              <span className="hero-card-title">SECURITY_CORE_V4.0</span>
              <span className="hero-dot" />
            </div>
            <div className="hero-mockup">
              <div className="mock-bar">
                <div className="mock-bar-fill" style={{width:'72%'}} />
              </div>
              <div className="mock-bar">
                <div className="mock-bar-fill" style={{width:'48%', background:'#3b82f6'}} />
              </div>
              <div className="mock-bar">
                <div className="mock-bar-fill" style={{width:'61%', background:'#10b981'}} />
              </div>
              <div className="mock-grid">
                {[...Array(12)].map((_,i) => (
                  <div key={i} className="mock-cell" style={{height: `${20+Math.abs(Math.sin(i)*40)}px`}} />
                ))}
              </div>
            </div>
            <div className="hero-card-stats">
              <div className="hcs-item">
                <span className="hcs-label">RISK INDEX</span>
                <span className="hcs-val">0.002%</span>
              </div>
              <div className="hcs-divider" />
              <div className="hcs-item">
                <span className="hcs-label">ACTIVE MONITORING</span>
                <span className="hcs-val">24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features">
        <h2 className="features-heading">Powerful Analytical Core</h2>
        <p className="features-sub">Tools designed for deep investigation and immediate action.</p>
        <div className="features-grid">
          <div className="feat-card feat-light">
            <div className="feat-icon feat-icon-light">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </div>
            <h3>Central Dashboard</h3>
            <p>Monitor all suspicious activities from a unified command center. Real-time data feeds and heatmaps for global threat detection.</p>
            <Link to="/dashboard" className="feat-link">Open Dashboard →</Link>
          </div>
          <div className="feat-card feat-dark">
            <div className="feat-icon feat-icon-dark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <h3>Fraud Analyzer</h3>
            <p>Upload transaction data or identity files for an immediate deep-scan by our proprietary AI model.</p>
            <Link to="/analyzer" className="feat-link-dark">Run New Analysis →</Link>
          </div>
          <div className="feat-card feat-light">
            <div className="feat-icon feat-icon-light">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <h3>Generated Reports</h3>
            <p>Automated PDF summaries for legal compliance.</p>
          </div>
          <div className="feat-card feat-light">
            <div className="feat-icon feat-icon-light">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h3>Expert Support</h3>
            <p>24/7 dedicated support for critical security events.</p>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-bar">
        <div className="stats-inner">
          <div className="stat-item"><span className="stat-num">99.9%</span><span className="stat-lbl">DETECTION RATE</span></div>
          <div className="stat-item"><span className="stat-num">15ms</span><span className="stat-lbl">AVG. RESPONSE TIME</span></div>
          <div className="stat-item"><span className="stat-num">4.2M</span><span className="stat-lbl">DAILY ANALYZED EVENTS</span></div>
          <div className="stat-item"><span className="stat-num">0</span><span className="stat-lbl">COMPROMISE EVENTS</span></div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
