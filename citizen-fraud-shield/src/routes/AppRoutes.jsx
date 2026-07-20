import { Routes, Route, Navigate } from 'react-router-dom';
import SidebarLayout from '../components/SidebarLayout';
import Home from '../pages/Home';
import Analyzer from '../pages/Analyzer';
import Dashboard from '../pages/Dashboard';
import Report from '../pages/Report';
import Contact from '../pages/Contact';
import QuickScan from '../pages/QuickScan';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scan" element={<QuickScan />} />
      <Route element={<SidebarLayout />}>
        <Route path="/analyzer" element={<Analyzer />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<Report />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
