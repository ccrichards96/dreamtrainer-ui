import React from 'react';
import { useAuthContext } from '../contexts';

/**
 * Example component demonstrating how to use the AuthContext
 * This shows how to access authentication state and methods
 */
const AuthExample: React.FC = () => {
  const { isAuthenticated, user, login, logout, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Auth Status</h2>
      
      {isAuthenticated ? (
        <div className="space-y-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ You are logged in!
          </div>
          
          {user && (
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">User Information:</h3>
              <p><strong>Name:</strong> {user.name || 'N/A'}</p>
              <p><strong>Email:</strong> {user.email || 'N/A'}</p>
              {user.picture && (
                <img 
                  src={user.picture} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full mt-2"
                />
              )}
            </div>
          )}
          
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            ⚠️ You are not logged in
          </div>
          
          <button
            onClick={login}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthExample;
