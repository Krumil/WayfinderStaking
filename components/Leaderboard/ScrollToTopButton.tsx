import React from 'react';
import { motion } from 'framer-motion';

interface ScrollToTopButtonProps {
  onClick: () => void;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      <button
        onClick={onClick}
        className="bg-judge-gray-800 bg-opacity-80 px-4 py-2 rounded-full shadow-lg hover:bg-judge-gray-700 transition-all duration-300 ease-out hover:scale-105 backdrop-blur-sm flex items-center gap-2"
        aria-label="Scroll to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
        <span className="text-sm font-medium">Scroll to Top</span>
      </button>
    </motion.div>
  );
};

export default ScrollToTopButton; 