import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-copy">© 2024 Citizen Fraud Shield. Professional Grade Protection.</span>
        <div className="footer-links">
          <Link to="/contact">Privacy Policy</Link>
          <Link to="/contact">Terms of Service</Link>
          <Link to="/contact">Security Disclosure</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
