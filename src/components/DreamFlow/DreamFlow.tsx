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

        {/* Sticky Next Button */}
        <NavigationButton
          onNext={handleNextModule}
          isLastModule={isLastModule}
        />

        {/* Mobile Bottom Padding */}
        <div className="h-24 md:hidden" />
      </div>
    </div>
  );
};

export default DreamFlow;
