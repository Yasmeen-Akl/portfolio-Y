import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider.jsx';
import Login from './Login/Login.jsx';
import AdminLayout from './Layout/AdminLayout.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import StatsPage from './pages/StatsPage/StatsPage.jsx';
import AboutPage from './pages/AboutPage/AboutPage.jsx';
import EducationPage from './pages/EducationPage/EducationPage.jsx';
import JourneyPage from './pages/JourneyPage/JourneyPage.jsx';
import SkillsPage from './pages/SkillsPage/SkillsPage.jsx';
import ServicesPage from './pages/ServicesPage/ServicesPage.jsx';
import ProjectsPage from './pages/ProjectsPage/ProjectsPage.jsx';
import ContactPage from './pages/ContactPage/ContactPage.jsx';
import MessagesPage from './pages/MessagesPage/MessagesPage.jsx';
import './admin.css';

// Entry of the lazy-loaded dashboard chunk (everything under /admin).
export default function AdminApp() {
  return (
    <AuthProvider>
      <div className="admin">
        <Routes>
          <Route path="login" element={<Login />} />
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/profile" replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="education" element={<EducationPage />} />
            <Route path="journey" element={<JourneyPage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="messages" element={<MessagesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
