import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './features/dashboard/Dashboard/Dashboard'
import Inventory from './features/inventory/Inventory/Inventory'
import InventoryDetailWrapper from './features/inventory/InventoryDetail/InventoryDetailWrapper'
import Recipe from './features/recipe/Recipe'
import RecipeDetailWrapper from './features/recipe/RecipeDetailWrapper'
import Brewing from './features/brewing/Brewing'
import StyleExplorer from './features/style/StyleExplorer'
import StyleDetailWrapper from './features/style/StyleDetail/StyleDetailWrapper'
import Login from './features/auth/Login'
import Signup from './features/auth/Signup'
import { AuthProvider, useAuth } from './features/auth/AuthContext'
import './App.css'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div data-testid="loading">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      
      <Route path="/inventory" element={<ProtectedRoute><Layout><Inventory /></Layout></ProtectedRoute>} />
      <Route path="/inventory/:category/:id" element={<ProtectedRoute><Layout><InventoryDetailWrapper /></Layout></ProtectedRoute>} />
      
      <Route path="/recipes" element={<ProtectedRoute><Layout><Recipe /></Layout></ProtectedRoute>} />
      <Route path="/recipes/:id" element={<ProtectedRoute><Layout><RecipeDetailWrapper /></Layout></ProtectedRoute>} />
      
      <Route path="/brewing" element={<ProtectedRoute><Layout><Brewing /></Layout></ProtectedRoute>} />
      
      <Route path="/styles" element={<ProtectedRoute><Layout><StyleExplorer /></Layout></ProtectedRoute>} />
      <Route path="/styles/:id" element={<ProtectedRoute><Layout><StyleDetailWrapper /></Layout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
