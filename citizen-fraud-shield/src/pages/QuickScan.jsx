import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

/**
 * QuickScan — WhatsApp/SMS deep-link landing page
 * Usage: /scan?text=<url-encoded-message>
 * Reads the text from the URL, stores it in sessionStorage, and redirects to the Analyzer.
 */
export default function QuickScan() {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();

  useEffect(() => {
    const text = params.get('text');
    if (text) {
      sessionStorage.setItem('prefill_text', decodeURIComponent(text));
    }
    navigate('/analyzer', { replace: true });
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p style={{ color: '#6b7280', fontSize: '14px' }}>🔍 Loading analysis...</p>
    </div>
  );
}
