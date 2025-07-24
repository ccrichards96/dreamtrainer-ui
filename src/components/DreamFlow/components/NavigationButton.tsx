import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface NavigationButtonProps {
  onNext: () => void;
  isLastModule: boolean;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  onNext,
  isLastModule
}) => {
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-20"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <motion.button
        onClick={onNext}
        className={`group flex items-center space-x-3 px-6 py-4 rounded-full font-semibold text-white shadow-lg transition-all ${
          isLastModule
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
            : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        whileInView={{ y: [10, 0] }}
      >
        <span>{isLastModule ? 'Complete Course' : 'Next Module'}</span>
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
