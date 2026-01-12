import { motion } from "framer-motion";
import { useAuth0, RedirectLoginOptions } from "@auth0/auth0-react";
import { ArrowRight, UserPlus } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function Signup() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Capture referralId from URL and store in localStorage for affiliate tracking
  useEffect(() => {
    const referralId = searchParams.get("via");
    if (referralId) {
      localStorage.setItem("rewardful_referral_id", referralId);
    }
  }, [searchParams]);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSignup = () => {
    const options: RedirectLoginOptions = {
      authorizationParams: {
        screen_hint: "signup",
      },
    };
    loginWithRedirect(options);
  };

  const handleGoogleSignup = () => {
    const options: RedirectLoginOptions = {
      authorizationParams: {
        connection: "google-oauth2",
        screen_hint: "signup",
      },
    };
    loginWithRedirect(options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c5a8de] mx-auto mb-4" />
          <p className="text-[#7c5e99]">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#c5a8de] mb-4">You're already signed up!</h1>
          <p className="text-[#7c5e99] mb-8">Redirecting you to the dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#c5a8de] via-[#e6d8f5] to-white flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e6d8f5] mb-4">
            <UserPlus className="w-8 h-8 text-[#c5a8de]" />
          </div>
          <h1 className="text-3xl font-bold text-[#7c5e99] mb-2">Create Your Account</h1>
          <p className="text-[#7c5e99]">
            Join Dream Trainer to unlock your learning journey, & pass your professional
            certification tests with ease.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSignup}
            className="w-full bg-[#c5a8de] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#7c5e99] transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Sign Up with Email
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#c5a8de]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#7c5e99]">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={handleGoogleSignup}
              className="flex items-center justify-center gap-2 bg-white border border-[#c5a8de] text-[#7c5e99] py-3 px-6 rounded-lg font-semibold hover:bg-[#f3eafd] transition-all"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Google
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-[#7c5e99]">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-[#c5a8de] hover:text-[#7c5e99] font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center text-sm text-[#7c5e99]">
          <p>
            By signing up, you agree to our{" "}
            <a href="#" className="text-[#c5a8de] hover:text-[#7c5e99]">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#c5a8de] hover:text-[#7c5e99]">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
