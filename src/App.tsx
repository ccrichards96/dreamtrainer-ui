import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import Dashboard from "./pages/dashboard";
import Onboarding from "./pages/onboarding";
import CheckoutSuccess from "./pages/checkout/Success";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import AccountPage from "./pages/account";
import BlogPage from "./pages/blog";
import ExploreCourses from "./pages/explore";
import AdminDashboard from "./pages/admin";
import SubscriptionRequired from "./pages/renew";
import CMSRoute from "./components/routes/CMSRoute";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { AuthProvider, ApiProvider } from "./contexts";
import { AppProvider } from "./contexts/AppContext";
import NotFound from "./pages/NotFound";
import { Role } from "./types/user";
import usePageTracking from "./hooks/usePageTracking";

// Component to handle page tracking (must be inside Router)
function PageTracker() {
  usePageTracking();
  return null;
}

function App() {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN as string}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID as string}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE as string,
      }}
    >
      <AuthProvider>
        <ApiProvider>
          <AppProvider>
            <Router>
              <PageTracker />
              <div className="min-h-screen bg-gray-100">
                <Navigation />
                <div className="pt-16">
                  <Routes>
                    <Route path="/" element={<CMSRoute />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                      path="/courses"
                      element={
                        <ProtectedRoute requireSubscription={true}>
                          <ExploreCourses />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/onboarding"
                      element={
                        <ProtectedRoute>
                          <Onboarding />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/checkout/success" element={<CheckoutSuccess />} />
                    <Route
                      path="/renew"
                      element={
                        <ProtectedRoute>
                          <SubscriptionRequired />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute requireSubscription={true}>
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
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute allowedRoles={[Role.Admin]}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    {/* CMS Routes */}
                    <Route path="/site/*" element={<CMSRoute />} />
                    <Route path="/site" element={<CMSRoute />} />

                    {/* 404 Catch-all route - must be last */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            </Router>
          </AppProvider>
        </ApiProvider>
      </AuthProvider>
    </Auth0Provider>
  );
}

export default App;
