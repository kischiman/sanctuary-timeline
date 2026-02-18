import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TimelinePage } from './pages/TimelinePage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TimelinePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
