import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './SidebarLayout.css';

export default function SidebarLayout() {
  return (
    <div className="sl-root">
      <Navbar hideBrand />
      <div className="sl-body">
        <Sidebar />
        <div className="sl-main">
          <div className="sl-content">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
