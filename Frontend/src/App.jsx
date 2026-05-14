import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VocabProvider } from './context/VocabContext';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import VocabList from './pages/VocabList';
import VocabTest from './pages/VocabTest';
import VocabReview from './pages/VocabReview';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="vocab-list" element={<VocabList />} />
        <Route path="vocab-test" element={<VocabTest />} />
        <Route path="vocab-review" element={<VocabReview />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VocabProvider>
          <AppRoutes />
        </VocabProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
