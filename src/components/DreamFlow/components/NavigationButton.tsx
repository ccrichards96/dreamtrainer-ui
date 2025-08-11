import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface NavigationButtonProps {
  onNext: () => void;
  onPrevious?: () => void;
  isLastModule: boolean;
  isFirstModule?: boolean;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  onNext,
  onPrevious,
  isLastModule,
  isFirstModule = false
}) => {
  return (
    <motion.div
      className="flex justify-center items-center space-x-4 w-full"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {/* Previous Button */}
      {!isFirstModule && onPrevious && (
        <motion.button
          onClick={onPrevious}
          className="group flex items-center space-x-3 px-6 py-4 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          whileInView={{ y: [10, 0] }}
        >
          <motion.div
            className="flex items-center justify-center w-6 h-6 bg-gray-500/20 rounded-full"
            animate={{ x: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronLeft size={16} />
          </motion.div>
          <span>Previous</span>
        </motion.button>
      )}

      {/* Next Button */}
      <motion.button
        onClick={onNext}
        className={`group flex items-center space-x-3 px-8 py-4 rounded-lg font-semibold text-white shadow-lg transition-all ${
          isLastModule
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
            : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        whileInView={{ y: [10, 0] }}
      >
        <span>{isLastModule ? 'Test Your Skills' : 'Next'}</span>
        <motion.div
          className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full"
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronRight size={16} />
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default NavigationButton;
