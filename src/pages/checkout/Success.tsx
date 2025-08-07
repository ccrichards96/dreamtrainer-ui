import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // You can verify the session with your backend here if needed
    if (sessionId) {
      console.log('Checkout session completed:', sessionId);
      // TODO: Call your backend to verify the session and update user subscription
    }
  }, [sessionId]);

  const handleContinue = () => {
    // Navigate to dashboard after successful payment
    navigate('/dashboard');
  };

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
        
        <button
          onClick={handleContinue}
          className="w-full py-3 px-6 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          Continue to Dashboard
          <ArrowRight className="w-4 h-4" />
        </button>
        
        {sessionId && (
          <p className="text-xs text-gray-400 mt-4">
            Session ID: {sessionId}
          </p>
        )}
      </div>
    </div>
  );
}
