import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials, logout } from './store/authSlice';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Reader from './pages/Reader';
import NovelDetails from './pages/NovelDetails';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import WriterDashboard from './pages/WriterDashboard';
import NovelEditor from './pages/NovelEditor';
import ChapterEditor from './pages/ChapterEditor';
import ChapterManagement from './pages/ChapterManagement';

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
          <Route path="/writer/novel/new" element={<NovelEditor />} />
          <Route path="/writer/novel/:id/edit" element={<NovelEditor />} />
          <Route path="/writer/novel/:novelId/chapters" element={<ChapterManagement />} />
          <Route path="/writer/novel/:novelId/chapter/new" element={<ChapterEditor />} />
          <Route path="/writer/novel/:novelId/chapter/:chapterId/edit" element={<ChapterEditor />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
      {!hideNavigation && <Footer />}
    </div>
  );
};

function App() {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('/api/v1/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (res.ok) {
            const userData = await res.json();
            dispatch(setCredentials({
              user: userData,
              token: token
            }));
          } else {
            // Token might be expired or invalid
            dispatch(logout());
          }
        } catch (error) {
          console.error("Failed to load user:", error);
        }
      }
      setIsInitializing(false);
    };
    
    initAuth();
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
