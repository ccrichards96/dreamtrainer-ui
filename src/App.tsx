import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { storyblokInit, apiPlugin } from '@storyblok/react';
import Login from './auth/login';
import Signup from './auth/signup';
import Dashboard from './dashboard';
import { validateAuth0Config } from './utils/auth0Config';
import ProtectedRoute from './routes/ProtectedRoute';
import AccountPage from './account';
import Home from './home';
import CMSRoute from './routes/CMSRoute';

// Initialize Storyblok
// storyblokInit({
//   accessToken: import.meta.env.VITE_STORYBLOK_API_TOKEN,
//   use: [apiPlugin],
// });

function NavigationBar() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/100 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-black">🤖 Dream Trainer</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-black hover:text-[#c5a8de] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/account"
                  className="text-black hover:text-[#c5a8de] px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Account
                </Link>
                <button
                  onClick={() => logout({ returnTo: window.location.origin })}
                  className="text-black hover:text-[#c5a8de] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-black hover:text-[#c5a8de] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <button
                  onClick={() => loginWithRedirect()}
                  className="text-black hover:text-[#c5a8de] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
                  className="bg-[#c5a8de] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#b399d6] border border-[#c5a8de]"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  // validateAuth0Config(); // Optionally call for side effects if needed
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <Router>
        <div className="min-h-screen bg-gray-100">
          <NavigationBar />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/account" 
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                } 
              />
              {/* CMS Routes */}
              <Route path="/p/:slug" element={<CMSRoute />} />
              <Route path="/p" element={<CMSRoute />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Auth0Provider>
  );
}

export default App;