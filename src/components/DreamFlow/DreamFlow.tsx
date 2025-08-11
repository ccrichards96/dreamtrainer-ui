import React from 'react';
import type { DreamFlowProps } from './types';
import { ProgressTracker, ModuleContent, NavigationButton } from './components';
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
    isFirstModule
  } = useCourseContext();

  const handleNextModule = () => {
    // Mark current module as completed
    markModuleAsCompleted(currentModuleIndex);
    
    if (isLastModule()) {
      onComplete?.();
    } else {
      nextModule();
    }
  };

  const handlePreviousModule = () => {
    if (!isFirstModule()) {
      previousModule();
    }
  };

  return (
    <div className="py-8 px-4 pr-20 lg:pr-24">
      <div className="w-full max-w-none">
        {/* Main Content Area - Full width with sidebar space */}
        <div className="w-full">
          <ModuleContent 
            modules={modules}
            currentModuleIndex={currentModuleIndex}
          />
        </div>

        {/* Footer Navigation Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <NavigationButton
            onNext={handleNextModule}
            onPrevious={handlePreviousModule}
            isLastModule={isLastModule()}
            isFirstModule={isFirstModule()}
          />
        </div>

        {/* Mobile Bottom Padding */}
        <div className="h-4 md:hidden" />
      </div>

      {/* Fixed Sidebar Progress Tracker */}
      <ProgressTracker
        modules={modules}
        currentModuleIndex={currentModuleIndex}
        completedModules={completedModules}
        getProgressPercentage={getProgressPercentage}
      />
    </div>
  );
};

export default DreamFlow;
