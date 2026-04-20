import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Results from './pages/Results';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center gradient-bg-subtle">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      <p className="text-dark-500 dark:text-dark-400 font-medium">Loading...</p>
    </div>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
      <Route path="/results/:id" element={<ProtectedRoute><Results /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen gradient-bg-subtle">
            <Navbar />
            <AppRoutes />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                padding: '14px 20px',
                fontSize: '14px',
              },
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
