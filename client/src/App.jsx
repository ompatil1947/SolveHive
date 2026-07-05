import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileSetup from './pages/ProfileSetup';
import Browse from './pages/Browse';
import CategoryPage from './pages/CategoryPage';
import NewQuery from './pages/NewQuery';
import QueryDetail from './pages/QueryDetail';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600" />
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)]">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={user ? <Navigate to="/browse" replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/browse" replace /> : <Signup />} />
          <Route path="/profile-setup" element={
            <ProtectedRoute><ProfileSetup /></ProtectedRoute>
          } />
          <Route path="/browse" element={<Browse />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/query/new" element={<NewQuery />} />
          <Route path="/query/:id" element={<QueryDetail />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: { primary: '#6366f1', secondary: '#fff' },
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
