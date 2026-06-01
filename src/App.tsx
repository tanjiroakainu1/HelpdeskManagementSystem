import { Navigate, Route, Routes } from 'react-router-dom';
import { FloatingChatbot } from '@/components/chat/FloatingChatbot';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import RolePage from '@/pages/RolePage';

export default function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/:roleFolder/:slug" element={<RolePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <FloatingChatbot />
      </AuthProvider>
    </DataProvider>
  );
}
