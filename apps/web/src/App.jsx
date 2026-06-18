import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingServiceWidget from './components/FloatingServiceWidget';
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
import AdminFloatingWidgets from './pages/admin/AdminFloatingWidgets';
import AdminEmployees from './pages/admin/AdminEmployees';
import AdminRegulations from './pages/admin/AdminRegulations';
import { trackVisit } from './utils/visitorTracker';

function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {children}
      <Footer />
      <FloatingServiceWidget />
    </div>
  );
}

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
            <Route path="floating-widgets" element={<AdminFloatingWidgets />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="service-links" element={<AdminServiceLinks />} />
            <Route path="employees" element={<AdminEmployees />} />
            <Route path="regulations" element={<AdminRegulations />} />
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
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        } />
        <Route path="/profile" element={
          <PublicLayout>
            <ProfilePage />
          </PublicLayout>
        } />
        <Route path="/gallery" element={
          <PublicLayout>
            <GalleryPage />
          </PublicLayout>
        } />
        <Route path="/gallery/:id" element={
          <PublicLayout>
            <GalleryDetailPage />
          </PublicLayout>
        } />
        <Route path="/contact" element={
          <PublicLayout>
            <ContactPage />
          </PublicLayout>
        } />
        <Route path="/news" element={
          <PublicLayout>
            <NewsPage />
          </PublicLayout>
        } />
        <Route path="/news/:id" element={
          <PublicLayout>
            <NewsDetailPage />
          </PublicLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
