import React from 'react';
import { motion } from 'framer-motion';

const ScrollIndicator: React.FC = () => {
  return (
    <motion.div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 text-judge-gray-400/50 pointer-events-none"
      animate={{ y: [0, 4, 0] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </motion.div>
  );
};

export default ScrollIndicator; 