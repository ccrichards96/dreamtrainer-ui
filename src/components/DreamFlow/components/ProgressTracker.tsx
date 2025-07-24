import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import type { Module } from '../types';

interface ProgressTrackerProps {
  modules: Module[];
  currentModuleIndex: number;
  completedModules: Set<number>;
  getProgressPercentage: () => number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  modules,
  currentModuleIndex,
  completedModules,
  getProgressPercentage
}) => {
  return (
    <div className="w-full lg:w-80 flex-shrink-0 lg:order-2 order-1">
      <div className="lg:sticky lg:top-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Learning Progress</h2>
            <span className="text-sm text-gray-600">
              {completedModules.size} of {modules.length} completed
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <motion.div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="text-xs text-gray-500 text-right">
              {Math.round(getProgressPercentage())}% Complete
            </div>
          </div>
          
          {/* Vertical Step Indicators */}
          <div className="space-y-4 max-h-96 lg:max-h-none overflow-y-auto">
            {modules.map((module, index) => (
              <div key={index} className="flex items-start gap-3">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors flex-shrink-0 ${
                    completedModules.has(index)
                      ? 'bg-green-500 text-white'
                      : index === currentModuleIndex
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {completedModules.has(index) ? (
                    <CheckCircle size={16} />
                  ) : (
                    index + 1
                  )}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-medium truncate ${
                    index === currentModuleIndex ? 'text-indigo-600' : 'text-gray-700'
                  }`}>
                    {module.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {module.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${
                      completedModules.has(index)
                        ? 'bg-green-500'
                        : index === currentModuleIndex
                        ? 'bg-indigo-500'
                        : 'bg-gray-300'
                    }`} />
                    <span className="text-xs text-gray-500">
                      {completedModules.has(index) 
                        ? 'Completed' 
                        : index === currentModuleIndex 
                        ? 'In Progress' 
                        : 'Not Started'
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
