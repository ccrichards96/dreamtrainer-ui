import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import type { Module } from "../types";

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
  getProgressPercentage,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Fixed Sidebar - Full Screen Overlay */}
      <motion.div
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] bg-white shadow-xl border-l border-gray-200 z-40 flex flex-col ${
          isCollapsed ? "w-16" : "w-80"
        }`}
        initial={false}
        animate={{
          width: isCollapsed ? 64 : 320,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Header with Toggle Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  Course Progress
                </h2>
                <span className="text-sm text-gray-600">
                  {completedModules.size} of {modules.length} completed
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCollapsed ? (
              <ChevronLeft size={20} className="text-gray-600" />
            ) : (
              <ChevronRight size={20} className="text-gray-600" />
            )}
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {isCollapsed ? (
              /* Collapsed View - Compact Progress */
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 space-y-4"
              >
                {/* Compact Progress Indicator */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                    <BarChart3 size={16} className="text-indigo-600" />
                  </div>
                  <div className="text-xs font-medium text-gray-600 text-center">
                    {Math.round(getProgressPercentage())}%
                  </div>
                </div>

                {/* Compact Module Indicators */}
                <div className="space-y-2">
                  {modules.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors mx-auto ${
                        completedModules.has(index)
                          ? "bg-green-500 text-white"
                          : index === currentModuleIndex
                            ? "bg-indigo-500 text-white"
                            : "bg-gray-200 text-gray-500"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {completedModules.has(index) ? (
                        <CheckCircle size={14} />
                      ) : (
                        index + 1
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Expanded View - Full Progress */
              <motion.div
                key="expanded"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="p-6 h-full overflow-y-auto"
              >
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

                {/* Detailed Module List */}
                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors flex-shrink-0 ${
                          completedModules.has(index)
                            ? "bg-green-500 text-white"
                            : index === currentModuleIndex
                              ? "bg-indigo-500 text-white"
                              : "bg-gray-200 text-gray-500"
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
                        <h4
                          className={`text-sm font-medium truncate ${
                            index === currentModuleIndex
                              ? "text-indigo-600"
                              : "text-gray-700"
                          }`}
                        >
                          {module.topic}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {module.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              completedModules.has(index)
                                ? "bg-green-500"
                                : index === currentModuleIndex
                                  ? "bg-indigo-500"
                                  : "bg-gray-300"
                            }`}
                          />
                          <span className="text-xs text-gray-500">
                            {completedModules.has(index)
                              ? "Completed"
                              : index === currentModuleIndex
                                ? "In Progress"
                                : "Not Started"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Overlay for mobile when sidebar is open */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="fixed top-16 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProgressTracker;
