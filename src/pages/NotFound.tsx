import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Main 404 Page */}
      <div className="max-w-[50rem] flex flex-col mx-auto size-full">
        {/* Main Content */}
        <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
          {/* 404 Number */}
          <h1 className="block text-7xl font-bold text-gray-800 sm:text-9xl">
            404
          </h1>

          {/* Error Messages */}
          <p className="mt-3 text-gray-600">Oops, something went wrong.</p>
          <p className="text-gray-600">Sorry, we can't find that page.</p>

          {/* Action Buttons */}
          <div className="mt-5 flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-[#c5a8de] text-white hover:bg-[#b399d6] focus:outline-none focus:bg-[#b399d6] disabled:opacity-50 disabled:pointer-events-none"
            >
              <Home className="shrink-0 size-4" />
              Go back home
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              <ArrowLeft className="shrink-0 size-4" />
              Go back
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto text-center py-5">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-gray-500">
              © 2025 Dream Trainer. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default NotFound;
