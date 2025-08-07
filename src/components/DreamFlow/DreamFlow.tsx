import React, { useState } from 'react';
import type { DreamFlowProps } from './types';
import { ProgressTracker, ModuleContent, NavigationButton } from './components';

const DreamFlow: React.FC<DreamFlowProps> = ({ modules, onComplete }) => {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());

  const isLastModule = currentModuleIndex === modules.length - 1;

  const handleNextModule = () => {
    // Mark current module as completed
    setCompletedModules(prev => new Set([...prev, currentModuleIndex]));
    
    if (isLastModule) {
      onComplete?.();
    } else {
      setCurrentModuleIndex(prev => prev + 1);
    }
  };

  const getProgressPercentage = () => {
    return ((completedModules.size + (currentModuleIndex > completedModules.size ? 1 : 0)) / modules.length) * 100;
  };

  return (
    <div className="py-8 px-4">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <ModuleContent 
            modules={modules}
            currentModuleIndex={currentModuleIndex}
          />

          {/* Vertical Progress Tracker - Right Side */}
          <ProgressTracker
            modules={modules}
            currentModuleIndex={currentModuleIndex}
            completedModules={completedModules}
            getProgressPercentage={getProgressPercentage}
          />
        </div>

        {/* Footer Navigation Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <NavigationButton
            onNext={handleNextModule}
            isLastModule={isLastModule}
          />
        </div>

        {/* Mobile Bottom Padding */}
        <div className="h-4 md:hidden" />
      </div>
    </div>
  );
};

export default DreamFlow;
