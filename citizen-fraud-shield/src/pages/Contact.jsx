import { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Name, email, and message are required.');
      return;
    }
    setError('');
    setSubmitted(true);
  }

  return (
    <div className="ct-page">
      <div className="ct-header">
        <h1>Contact Us</h1>
        <p>Reach out for support, security disclosures, or general inquiries. Our team responds within 24 hours.</p>
      </div>

      <div className="ct-body">
        {/* Form */}
        <div className="card ct-form-card">
          <h2>Send a Message</h2>
          {submitted ? (
            <div className="ct-success">
              <div className="ct-success-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3>Message Sent</h3>
              <p>Thank you for reaching out. Our security team will respond within 24 hours.</p>
              <button className="btn-dark" onClick={() => { setSubmitted(false); setForm({ name:'', email:'', subject:'', message:'' }); }}>
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="ct-form">
              <div className="ct-row">
                <div className="ct-field">
                  <label>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" />
                </div>
                <div className="ct-field">
                  <label>Email Address *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" />
                </div>
              </div>
              <div className="ct-field">
                <label>Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} placeholder="e.g. Fraud report, Technical support, Security disclosure" />
              </div>
              <div className="ct-field">
                <label>Message *</label>
                <textarea name="message" rows={6} value={form.message} onChange={handleChange} placeholder="Describe your issue or inquiry in detail..." />
              </div>
              {error && <p className="error-msg">{error}</p>}
              <button type="submit" className="btn-dark ct-submit">Send Message →</button>
            </form>
          )}
        </div>

        {/* Info panels */}
        <div className="ct-info">
          <div className="card ct-info-card">
            <div className="ct-info-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div>
              <h3>24/7 Support Hotline</h3>
              <p>Critical fraud cases receive immediate escalation. Our oncall team is always available.</p>
              <span className="ct-contact-val">support@citizenfraudshield.gov</span>
            </div>
          </div>

          <div className="card ct-info-card">
            <div className="ct-info-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <h3>Security Disclosure</h3>
              <p>Found a vulnerability? Report it responsibly through our coordinated disclosure program.</p>
              <span className="ct-contact-val">security@citizenfraudshield.gov</span>
            </div>
          </div>

          <div className="card ct-info-card">
            <div className="ct-info-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <h3>Response Times</h3>
              <p>We aim to respond to all inquiries promptly based on priority.</p>
              <div className="ct-response-times">
                <div className="ct-rt-row"><span>Critical / Active Fraud</span><span className="ct-rt-val ct-rt-red">&lt; 1 hour</span></div>
                <div className="ct-rt-row"><span>High Priority</span><span className="ct-rt-val ct-rt-orange">&lt; 4 hours</span></div>
                <div className="ct-rt-row"><span>General Inquiry</span><span className="ct-rt-val">&lt; 24 hours</span></div>
              </div>
            </div>
          </div>

          <div className="card ct-compliance">
            <p className="ct-comp-label">COMPLIANCE & LEGAL</p>
            <p className="ct-comp-text">Citizen Fraud Shield operates in accordance with SOC2 Type II, AES-256-GCM encryption standards, and all applicable data protection regulations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
