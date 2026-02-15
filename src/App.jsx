import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Display from './pages/Display';
import Login from './pages/admin/Login';
import ItemLibrary from './pages/admin/ItemLibrary';
import DailyMenu from './pages/admin/DailyMenu';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Display route */}
        <Route path="/display" element={<Display />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/items" element={<ItemLibrary />} />
        <Route path="/admin/daily" element={<DailyMenu />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/display" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
