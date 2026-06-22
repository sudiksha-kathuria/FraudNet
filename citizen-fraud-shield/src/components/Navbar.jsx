import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ hideBrand = false }) {
  return (
    <nav className="top-nav">
      <Link to="/" className="nav-brand" style={hideBrand ? { visibility: 'hidden', pointerEvents: 'none' } : {}}>
        Citizen Fraud Shield
      </Link>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/analyzer" className={({ isActive }) => isActive ? 'active' : ''}>Analyzer</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
        <NavLink to="/report" className={({ isActive }) => isActive ? 'active' : ''}>Reports</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact Us</NavLink>
      </div>
      <div className="nav-right">
        <button className="icon-btn" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </button>
        <button className="icon-btn" aria-label="Account">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
        <Link to="/contact" className="btn-dark">Get Help</Link>
      </div>
    </nav>
  );
}
