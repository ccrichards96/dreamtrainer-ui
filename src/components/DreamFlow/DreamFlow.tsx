import React, { useState } from "react";
import type { DreamFlowProps } from "./types";
import {
  ProgressTracker,
  ModuleContent,
  NavigationButton,
  TestContent,
} from "./components";
import { useCourseContext } from "../../contexts/useCourseContext";
import { motion } from "framer-motion";
import { CheckCircle, RotateCcw, Home } from "lucide-react";

const DreamFlow: React.FC<DreamFlowProps> = ({ onComplete }) => {
  const [testSubmitted, setTestSubmitted] = useState(false);

  const {
    modules,
    currentModuleIndex,
    completedModules,
    markModuleAsCompleted,
    nextModule,
    previousModule,
    getProgressPercentage,
    isLastModule,
    isFirstModule,
    setCurrentModuleIndex,
    // Test mode properties
    isTestMode,
    currentTest,
    currentTestIndex,
    markTestAsCompleted,
    startTestMode,
    exitTestMode,
    resetToFirstModule,
    resetCourseProgress,
    getNextTestInSequence,
    tests,
  } = useCourseContext();

  const handleNextModule = () => {
    // Mark current module as completed
    markModuleAsCompleted(currentModuleIndex);

    if (isLastModule()) {
      // When user clicks "Review Materials Again" or "Test Your Skills" on last module
      if (tests.length > 0) {
        // Start test mode if tests are available
        startTestMode();
      } else {
        // Reset to first module and clear progress to review materials again
        resetToFirstModule(true);
      }
    } else {
      // Move to next module after marking current as completed
      nextModule();
    }
  };

  const handlePreviousModule = () => {
    if (!isFirstModule()) {
      previousModule();
    }
  };

  const handleTestSubmit = (answers: Record<string, string | string[]>) => {
    // TODO: Submit test answers to API
    console.log("Test answers:", answers);

    // Mark current test as completed
    if (currentTest) {
      markTestAsCompleted(currentTest.id);
    }

    // Reset course progress after each test submission
    // This keeps test progression but resets module progress
    resetCourseProgress();

    // Check if there are more tests to complete
    const nextTest = getNextTestInSequence();
    if (nextTest && currentTestIndex < tests.length - 1) {
      // Move to next test - the CourseContext will handle updating currentTestIndex
      // and currentTest based on the completed tests
      startTestMode(); // This will automatically find the next incomplete test
    } else {
      // All tests completed - show success page
      setTestSubmitted(true);
    }
  };

  const handleReturnToCourse = () => {
    // Reset states and return to course
    setTestSubmitted(false);
    exitTestMode();
    resetToFirstModule(true);
    onComplete?.();
  };

  const handleExitTest = () => {
    exitTestMode();
  };

  const handleModuleClick = (index: number) => {
    // Calculate the highest module reached
    let highestReached = currentModuleIndex;
    completedModules.forEach(moduleIndex => {
      if (moduleIndex > highestReached) {
        highestReached = moduleIndex;
      }
    });
    
    // Allow navigation to any module up to the highest reached
    if (index <= highestReached) {
      setCurrentModuleIndex(index);
    }
  };

  return (
    <div className="py-8 px-4 pr-20 lg:pr-24">
      <div className="w-full max-w-none">
        {/* Main Content Area - Full width with sidebar space */}
        <div className="w-full">
          {testSubmitted ? (
            // Success Page
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center py-12"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Assessment Complete!
              </h2>

              <p className="text-xl text-gray-600 mb-8">
                Great job! Your assessment has been submitted successfully. Your
                score will update, we'll review your work, and send feedback to
                your email within 24-48 hours.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <RotateCcw className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-semibold text-blue-800">
                    Ready for Another Round?
                  </span>
                </div>
                <p className="text-blue-700 mb-4">
                  Continue your learning journey by going through the course
                  modules again to reinforce your skills and knowledge until you
                  get your dream score!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleReturnToCourse}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Return to Course
                </button>
              </div>
            </motion.div>
          ) : isTestMode && currentTest ? (
            <TestContent test={currentTest} onSubmit={handleTestSubmit} />
          ) : (
            <ModuleContent
              modules={modules}
              currentModuleIndex={currentModuleIndex}
            />
          )}
        </div>

        {/* Footer Navigation Button - Only show in module mode */}
        {!isTestMode && !testSubmitted && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <NavigationButton
              onNext={handleNextModule}
              onPrevious={handlePreviousModule}
              isLastModule={isLastModule()}
              isFirstModule={isFirstModule()}
              hasTests={tests.length > 0}
            />
          </div>
        )}

        {/* Test Mode Exit Button - Only show when in test (not success page) */}
        {isTestMode && !testSubmitted && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              {/* Exit Button */}
              <button
                onClick={handleExitTest}
                className="bg-gray-600 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Exit Test Mode
              </button>
            </div>
          </div>
        )}

        {/* Mobile Bottom Padding */}
        <div className="h-4 md:hidden" />
      </div>

      {/* Fixed Sidebar Progress Tracker - Only show in module mode */}
      {!isTestMode && !testSubmitted && (
        <ProgressTracker
          modules={modules}
          currentModuleIndex={currentModuleIndex}
          completedModules={completedModules}
          getProgressPercentage={getProgressPercentage}
          onModuleClick={handleModuleClick}
        />
      )}
    </div>
  );
};

export default DreamFlow;
