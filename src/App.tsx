import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import Dashboard from './pages/dashboard';
import ProtectedRoute from './components/routes/ProtectedRoute';
import AccountPage from './pages/account';
import Home from './pages/home';
import CMSRoute from './components/routes/CMSRoute';
import Navigation from './components/Navigation';
import { AuthProvider } from './contexts';

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
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navigation />
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
      </AuthProvider>
    </Auth0Provider>
  );
}

export default App;