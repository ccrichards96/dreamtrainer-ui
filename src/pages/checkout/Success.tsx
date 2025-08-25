import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApp } from '../../contexts/useAppContext';
import { useApiContext } from '../../contexts/useApiContext';
import { userService } from '../../services/api/users';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const { isInitialized: apiInitialized } = useApiContext();
  const { refreshUserProfile } = useApp();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    const handleCheckoutSuccess = async () => {
      // Wait for Auth0 and API to be ready before making API calls
      if (auth0Loading || !isAuthenticated || !apiInitialized) {
        console.log('Waiting for auth/API initialization:', { 
          auth0Loading, 
          isAuthenticated, 
          apiInitialized 
        });
        return;
      }

      console.log('Checkout success page loaded - marking onboarding as complete');
      
      try {
        setIsUpdating(true);
        setUpdateError(null);
        
        // Small delay to ensure token interceptor is fully set up
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Mark onboarding as complete since user has successfully subscribed
        await userService.updateCurrentUser({ 
          onboardingComplete: true 
        });
        
        console.log('User onboarding marked as complete');
        
        // Refresh the user profile in the app context
        await refreshUserProfile();
        
      } catch (error) {
        console.error('Failed to update user onboarding status:', error);
        setUpdateError(error instanceof Error ? error.message : 'Failed to update profile');
      } finally {
        setIsUpdating(false);
      }
    };

    handleCheckoutSuccess();
  }, [auth0Loading, isAuthenticated, apiInitialized]);

  const handleContinue = () => {
    // Navigate to dashboard after successful payment
    navigate('/dashboard');
  };

  // Show loading state while Auth0 is loading or API not ready
  if (auth0Loading || !apiInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Initializing...
          </h1>
          
          <p className="text-gray-600">
            Please wait while we prepare your account setup.
          </p>
        </div>
      </div>
    );
  }

  // Show loading state while updating user
  if (isUpdating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Setting up your account...
          </h1>
          
          <p className="text-gray-600">
            Please wait while we complete your subscription setup.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Welcome to TOEFL MAX Writing! Your subscription has been activated and you're ready to start your English learning journey.
        </p>
        
        {updateError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">
              ⚠️ Profile update failed: {updateError}
            </p>
            <p className="text-red-500 text-xs mt-1">
              Don't worry, your payment was successful. You can continue to your dashboard.
            </p>
          </div>
        )}
        
        <button
          onClick={handleContinue}
          className="w-full py-3 px-6 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          Continue to Dashboard
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
