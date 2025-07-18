import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts';
import AvatarDropdown from './AvatarDropdown';

export default function Navigation() {
  const { isAuthenticated, login } = useAuthContext();

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
              <AvatarDropdown />
            ) : (
              <>
                <Link
                  to="/"
                  className="text-black hover:text-[#c5a8de] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <button
                  onClick={() => login()}
                  className="text-black hover:text-[#c5a8de] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => login()}
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
