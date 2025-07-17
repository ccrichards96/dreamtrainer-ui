import { useContext } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';

// Custom hook to use the Auth context with error handling
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error(
      'useAuthContext must be used within an AuthProvider. ' +
      'Make sure to wrap your component tree with <AuthProvider>.'
    );
  }
  
  return context;
}
