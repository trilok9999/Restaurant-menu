import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Display from './pages/Display';
import Login from './pages/admin/Login';
import ItemLibrary from './pages/admin/ItemLibrary';
import DailyMenu from './pages/admin/DailyMenu';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Display route */}
          <Route path="/display" element={<Display />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/items"
            element={
              <ProtectedRoute>
                <ItemLibrary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/daily"
            element={
              <ProtectedRoute>
                <DailyMenu />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/display" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
