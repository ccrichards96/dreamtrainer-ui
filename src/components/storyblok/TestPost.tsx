import React from "react";

interface TestPostBlok {
  _uid: string;
  component: string;
  title?: string;
  intro?: string;
  [key: string]: unknown;
}

// Simple test post component to debug rendering
const TestPost: React.FC<{ blok: TestPostBlok }> = ({ blok }) => {
  console.log("TestPost rendered with blok:", blok);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <p className="font-bold">TEST POST COMPONENT</p>
        <p>Component: {String(blok.component)}</p>
        <p>UID: {String(blok._uid)}</p>
      </div>

      <h1 className="text-3xl font-bold mb-4">
        {blok.title || "Test Post Title"}
      </h1>

      <p className="text-gray-600 mb-4">
        {blok.intro || "This is a test post to verify component rendering."}
      </p>

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold mb-2">Blok Data:</h3>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(blok, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TestPost;
