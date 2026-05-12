import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronLeft, ChevronRight, BarChart3, X, BarChart2 } from "lucide-react";
import type { Module } from "../types";

interface ProgressTrackerProps {
  modules: Module[];
  currentModuleIndex: number;
  completedModules: Set<number>;
  getProgressPercentage: () => number;
  onModuleClick?: (index: number) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  modules,
  currentModuleIndex,
  completedModules,
  getProgressPercentage,
  onModuleClick,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleModuleClick = (index: number) => {
    onModuleClick?.(index);
    setIsMobileOpen(false);
  };

  const progress = Math.round(getProgressPercentage());

  return (
    <>
      {/* ── Desktop sidebar (lg+) ──
          Wrapped in a plain hidden lg:block so Framer Motion never renders this
          into the mobile DOM — prevents the animated width causing horizontal overflow. */}
      <div className="hidden lg:block">
        <motion.div
          className={`fixed top-16 right-0 h-[calc(100vh-4rem)] bg-white shadow-xl border-l border-gray-200 z-40 flex flex-col ${
            isCollapsed ? "w-16" : "w-80"
          }`}
          initial={false}
          animate={{ width: isCollapsed ? 64 : 320 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-lg font-semibold text-gray-800">Section Progress</h2>
                  <span className="text-sm text-gray-600">
                    {completedModules.size} of {modules.length} completed
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={() => setIsCollapsed(!isCollapsed)}
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
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 space-y-4"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                      <BarChart3 size={16} className="text-indigo-600" />
                    </div>
                    <div className="text-xs font-medium text-gray-600 text-center">{progress}%</div>
                  </div>

                  <div className="space-y-2">
                    {modules.map((_, index) => (
                      <motion.div
                        key={index}
                        onClick={() => handleModuleClick(index)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors mx-auto cursor-pointer hover:ring-2 hover:ring-indigo-300 ${
                          completedModules.has(index)
                            ? "bg-green-500 text-white"
                            : index === currentModuleIndex
                              ? "bg-indigo-500 text-white"
                              : "bg-gray-200 text-gray-500"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {completedModules.has(index) ? <CheckCircle size={14} /> : index + 1}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 h-full overflow-y-auto"
                >
                  <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <motion.div
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgressPercentage()}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 text-right">{progress}% Complete</div>
                  </div>

                  <div className="space-y-4">
                    {modules.map((module, index) => (
                      <motion.div
                        key={index}
                        onClick={() => handleModuleClick(index)}
                        className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2"
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
                          {completedModules.has(index) ? <CheckCircle size={16} /> : index + 1}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-sm font-medium truncate ${
                              index === currentModuleIndex ? "text-indigo-600" : "text-gray-700"
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
      </div>

      {/* ── Mobile: floating "View My Progress" button (< lg) ── */}
      <button
        className="lg:hidden fixed bottom-6 right-4 z-40 flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
        onClick={() => setIsMobileOpen(true)}
      >
        <BarChart2 size={16} />
        View My Progress
      </button>

      {/* ── Mobile bottom sheet drawer ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-semibold text-gray-800">My Progress</h2>
                  <span className="text-xs text-gray-500">
                    {completedModules.size} of {modules.length} completed &middot; {progress}% done
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="px-5 pt-4 pb-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage()}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Module list */}
              <div className="flex-1 overflow-y-auto px-5 py-3 space-y-1">
                {modules.map((module, index) => (
                  <button
                    key={index}
                    onClick={() => handleModuleClick(index)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${
                      index === currentModuleIndex
                        ? "bg-indigo-50 border border-indigo-200"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                        completedModules.has(index)
                          ? "bg-green-500 text-white"
                          : index === currentModuleIndex
                            ? "bg-indigo-500 text-white"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {completedModules.has(index) ? <CheckCircle size={16} /> : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          index === currentModuleIndex ? "text-indigo-700" : "text-gray-800"
                        }`}
                      >
                        {module.topic}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{module.description}</p>
                      <span
                        className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          completedModules.has(index)
                            ? "bg-green-100 text-green-700"
                            : index === currentModuleIndex
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {completedModules.has(index)
                          ? "Completed"
                          : index === currentModuleIndex
                            ? "In Progress"
                            : "Not Started"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProgressTracker;
