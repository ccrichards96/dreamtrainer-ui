import React from 'react';
import type { DreamFlowProps } from './types';
import { ProgressTracker, ModuleContent, NavigationButton, TestContent } from './components';
import { useCourseContext } from '../../contexts/useCourseContext';

const DreamFlow: React.FC<DreamFlowProps> = ({ onComplete }) => {
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
    // Test mode properties
    isTestMode,
    currentTest,
    startTestMode,
    exitTestMode
  } = useCourseContext();

  const handleNextModule = () => {
    // Mark current module as completed
    markModuleAsCompleted(currentModuleIndex);
    
    if (isLastModule()) {
      // When user clicks "Test Your Skills" on last module, start test mode
      startTestMode();
    } else {
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
    console.log('Test answers:', answers);
    
    // Exit test mode and complete the course
    exitTestMode();
    onComplete?.();
  };

  const handleExitTest = () => {
    exitTestMode();
  };

  return (
    <div className="py-8 px-4 pr-20 lg:pr-24">
      <div className="w-full max-w-none">
        {/* Main Content Area - Full width with sidebar space */}
        <div className="w-full">
          {isTestMode && currentTest ? (
            <TestContent 
              test={currentTest}
              onSubmit={handleTestSubmit}
            />
          ) : (
            <ModuleContent 
              modules={modules}
              currentModuleIndex={currentModuleIndex}
            />
          )}
        </div>

        {/* Footer Navigation Button - Only show in module mode */}
        {!isTestMode && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <NavigationButton
              onNext={handleNextModule}
              onPrevious={handlePreviousModule}
              isLastModule={isLastModule()}
              isFirstModule={isFirstModule()}
            />
          </div>
        )}

        {/* Test Mode Exit Button */}
        {isTestMode && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleExitTest}
              className="bg-gray-600 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Exit Test Mode
            </button>
          </div>
        )}

        {/* Mobile Bottom Padding */}
        <div className="h-4 md:hidden" />
      </div>

      {/* Fixed Sidebar Progress Tracker - Only show in module mode */}
      {!isTestMode && (
        <ProgressTracker
          modules={modules}
          currentModuleIndex={currentModuleIndex}
          completedModules={completedModules}
          getProgressPercentage={getProgressPercentage}
        />
      )}
    </div>
  );
};

export default DreamFlow;
