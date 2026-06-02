import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import GalleryDetailPage from './pages/GalleryDetailPage';
import ScrollToTop from './components/ScrollToTop';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNews from './pages/admin/AdminNews';
import AdminGallery from './pages/admin/AdminGallery';
import AdminWelcome from './pages/admin/AdminWelcome';
import AdminContacts from './pages/admin/AdminContacts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCarousel from './pages/admin/AdminCarousel';
import AdminServiceLinks from './pages/admin/AdminServiceLinks';
import AdminEmployees from './pages/admin/AdminEmployees';
import { trackVisit } from './utils/visitorTracker';

function App() {
  useEffect(() => {
    trackVisit();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="carousel" element={<AdminCarousel />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="service-links" element={<AdminServiceLinks />} />
            <Route path="employees" element={<AdminEmployees />} />
            <Route path="welcome" element={<AdminWelcome />} />
            <Route path="contacts" element={<AdminContacts />} />
          </Route>
        </Route>

        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['superadmin']} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminUsers />} />
          </Route>
        </Route>

        {/* Public Routes */}
        <Route path="/" element={
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <HomePage />
            <Footer />
          </div>
        } />
        <Route path="/profile" element={
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <ProfilePage />
            <Footer />
          </div>
        } />
        <Route path="/gallery" element={
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <GalleryPage />
            <Footer />
          </div>
        } />
        <Route path="/gallery/:id" element={
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <GalleryDetailPage />
            <Footer />
          </div>
        } />
        <Route path="/contact" element={
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <ContactPage />
            <Footer />
          </div>
        } />
        <Route path="/news" element={
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <NewsPage />
            <Footer />
          </div>
        } />
        <Route path="/news/:id" element={
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <NewsDetailPage />
            <Footer />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
