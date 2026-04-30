import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Reader from './pages/Reader';
import NovelDetails from './pages/NovelDetails';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import WriterDashboard from './pages/WriterDashboard';

const AppLayout = () => {
  const location = useLocation();
  // Hide Navbar and Footer on Reader and Auth pages
  const isReaderPage = location.pathname.includes('/read/');
  const isAuthPage = location.pathname === '/auth';
  const hideNavigation = isReaderPage || isAuthPage;

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavigation && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/novel/:id" element={<NovelDetails />} />
          <Route path="/read/:id" element={<Reader />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/categories" element={<Explore initialTab="categories" />} />
          <Route path="/ranking" element={<Explore initialTab="ranking" />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/writer" element={<WriterDashboard />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
      {!hideNavigation && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
