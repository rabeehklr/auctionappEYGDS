import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import AuctionItem from './components/AuctionItem';
import PostAuction from './components/PostAuction';
import EditAuction from './components/EditAuction';
import Landing from './components/Landing';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setNotification({ type: 'success', message: 'Successfully logged out' });
  };

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/signin" />;
  };

  return (
    <Router>
      <div>
        <header>
          <div className="container">
            <Link to="/" className="logo">AuctionHub</Link>
            <nav>
              {!isAuthenticated ? (
                <>
                  <Link to="/signup" className="signup">Sign Up</Link>
                  <Link to="/signin" className="signin">Sign In</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="signup">Dashboard</Link>
                  <Link to="/post-auction" className="signin">Post Auction</Link>
                  <button onClick={handleLogout} className="logout">Logout</button>
                </>
              )}
            </nav>
          </div>
        </header>

        <main>
          {notification && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup setNotification={setNotification} />} />
            <Route path="/signin" element={<Signin setNotification={setNotification} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard setNotification={setNotification} /></ProtectedRoute>} />
            <Route path="/auction/:id" element={<ProtectedRoute><AuctionItem setNotification={setNotification} /></ProtectedRoute>} />
            <Route path="/post-auction" element={<ProtectedRoute><PostAuction setNotification={setNotification} /></ProtectedRoute>} />
            <Route path="/edit-auction/:id" element={<ProtectedRoute><EditAuction setNotification={setNotification} /></ProtectedRoute>} />
          </Routes>
        </main>

        <footer>
          <p>© 2024 AuctionHub. All rights reserved.</p>
          <p className="small">The premier destination for online auctions</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;