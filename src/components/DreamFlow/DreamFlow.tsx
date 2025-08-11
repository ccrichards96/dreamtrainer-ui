import React, { useState } from 'react';
import type { DreamFlowProps } from './types';
import { ProgressTracker, ModuleContent, NavigationButton } from './components';

const DreamFlow: React.FC<DreamFlowProps> = ({ modules, onComplete }) => {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());

  const isLastModule = currentModuleIndex === modules.length - 1;
  const isFirstModule = currentModuleIndex === 0;

  const handleNextModule = () => {
    // Mark current module as completed
    setCompletedModules(prev => new Set([...prev, currentModuleIndex]));
    
    if (isLastModule) {
      onComplete?.();
    } else {
      setCurrentModuleIndex(prev => prev + 1);
    }
  };

  const handlePreviousModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(prev => prev - 1);
    }
  };

  const getProgressPercentage = () => {
    return ((completedModules.size + (currentModuleIndex > completedModules.size ? 1 : 0)) / modules.length) * 100;
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
            isLastModule={isLastModule}
            isFirstModule={isFirstModule}
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
