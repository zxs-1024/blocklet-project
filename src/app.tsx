import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import ProfilePage from './pages/index';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default function WrappedApp() {
  // While the blocklet is deploy to a sub path, this will be work properly.
  const basename = window?.blocklet?.prefix || '/';

  return (
    <Router basename={basename}>
      <App />
    </Router>
  );
}
