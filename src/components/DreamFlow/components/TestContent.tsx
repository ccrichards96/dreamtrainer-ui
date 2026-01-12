import React from "react";
import type { Test } from "../../../types/tests";
import AssessmentForm from "../../forms/AssessmentForm";

interface TestContentProps {
  test: Test;
  onSubmit: (answers: Record<string, string | string[]>) => void;
}

const TestContent: React.FC<TestContentProps> = ({ test, onSubmit }) => {
  const handleFormSubmit = (answers?: Record<string, string | string[]>) => {
    // Handle both external form completion and internal assessment form submission
    onSubmit(answers || {});
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Video Section */}
      {test.videoUrl && (
        <div className="mb-8">
          <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={test.videoUrl}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`Test: ${test.name}`}
            />
          </div>
        </div>
      )}

      {/* Rich Text Content */}
      {test.richTextContent && (
        <div className="mb-8">
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-a:text-indigo-600 hover:prose-a:text-indigo-500"
            dangerouslySetInnerHTML={{ __html: test.richTextContent }}
          />
        </div>
      )}

      {/* Test Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Assessment: {test.name}</h2>

        {test.description && <p className="text-gray-600 mb-6">{test.description}</p>}

        {/* External Form Link */}
        {test.formLink ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Please complete the assessment using the form below:
            </p>
            <div className="aspect-video w-full bg-gray-50 rounded-lg overflow-hidden">
              <iframe
                src={test.formLink}
                className="w-full h-full border-0"
                title={`Assessment Form: ${test.name}`}
              />
            </div>
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => handleFormSubmit()}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Mark as Completed
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">Complete the assessment form below:</p>
            <AssessmentForm
              testName={`Assessment: ${test.name}`}
              onSubmit={handleFormSubmit}
              showHeader={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TestContent;
