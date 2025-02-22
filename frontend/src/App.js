import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import AuctionItem from './components/AuctionItem';
import PostAuction from './components/PostAuction';
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

  // Protected Route wrapper component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/signin" />;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
              AuctionHub
            </Link>
            <nav className="space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign Up</Link>
                  <Link to="/signin" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Sign In</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Dashboard</Link>
                  <Link to="/post-auction" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Post Auction</Link>
                  <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
          {notification && (
            <div className={`mb-4 p-4 rounded ${
              notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {notification.message}
            </div>
          )}
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup setNotification={setNotification} />} />
            <Route path="/signin" element={<Signin setNotification={setNotification} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard setNotification={setNotification} />
              </ProtectedRoute>
            } />
            <Route path="/auction/:id" element={
              <ProtectedRoute>
                <AuctionItem setNotification={setNotification} />
              </ProtectedRoute>
            } />
            <Route path="/post-auction" element={
              <ProtectedRoute>
                <PostAuction setNotification={setNotification} />
              </ProtectedRoute>
            } />
          </Routes>
        </main>

        <footer className="bg-gray-100 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <p className="text-center text-gray-600">© 2024 AuctionHub. All rights reserved.</p>
            <p className="text-center text-gray-500 text-sm">The premier destination for online auctions</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;