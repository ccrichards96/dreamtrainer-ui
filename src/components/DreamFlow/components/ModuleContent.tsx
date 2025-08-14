import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Module } from '../types';
import "react-quill/dist/quill.snow.css";

interface ModuleContentProps {
  modules: Module[];
  currentModuleIndex: number;
}

const ModuleContent: React.FC<ModuleContentProps> = ({
  modules,
  currentModuleIndex
}) => {
  const currentModule = modules[currentModuleIndex];

  // Animation variants
  const slideVariants = {
    enter: {
      x: 300,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: -300,
      opacity: 0,
    },
  };

  const contentVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="flex-1 lg:order-1 order-2">
      {/* Module Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentModuleIndex}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="w-full"
        >
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {/* Module Header */}
            <motion.div variants={itemVariants} className="p-8 pb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  Module {currentModuleIndex + 1}
                </span>
                <span className="text-sm text-gray-500">
                  {currentModuleIndex + 1} of {modules.length}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {currentModule.topic}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {currentModule.description}
              </p>
            </motion.div>

            {/* Video Section */}
            <motion.div variants={itemVariants} className="px-8 pb-6">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src={currentModule.videoUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${currentModule.topic} Video`}
                />
              </div>
            </motion.div>

            {/* Lesson Content Section */}
            {currentModule.lessonContent && (
              <motion.div variants={itemVariants} className="px-8 pb-6">
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Lesson Content
                  </h3>
                  <div 
                    className="ql-editor prose prose-lg max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: currentModule.lessonContent 
                    }}
                    style={{
                      lineHeight: '1.7',
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* Bot Iframe Section */}
            <motion.div variants={itemVariants} className="px-8 pb-8">
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Interactive Tutor
                </h3>
                <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  <iframe
                    src={currentModule.botIframeUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    title={`${currentModule.topic} Tutor`}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ModuleContent;
