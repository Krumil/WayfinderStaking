"use client";

import React from "react";
import { AddressData } from "@/stores/addresses";
import { motion } from "framer-motion";

/**
 * Renders a position change indicator
 */
export const PositionChangeIndicator = ({ item, className = "" }: { item: AddressData; className?: string }) => {
  if (!item.changes) return null;

  const change = item.changes.position_change;
  
  if (change > 0) {
    return (
      <motion.div 
        className={`absolute -left-3 md:-left-4 flex items-center justify-center z-20 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-hampton-300 font-medium flex items-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-0.5">
            <path d="M12 4L12 20M12 4L18 10M12 4L6 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs">{change}</span>
        </div>
      </motion.div>
    );
  } else if (change < 0) {
    return (
      <motion.div 
        className={`absolute -left-3 md:-left-4 flex items-center justify-center z-20 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-red-400 font-medium flex items-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-0.5">
            <path d="M12 20L12 4M12 20L18 14M12 20L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs">{Math.abs(change)}</span>
        </div>
      </motion.div>
    );
  } else {
    return (
      <motion.div 
        className={`absolute -left-3 md:-left-4 flex items-center justify-center z-20 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-judge-gray-400 font-medium flex items-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-0.5">
            <path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.div>
    );
  }
};

/**
 * Renders a score change indicator
 */
export const ScoreChangeIndicator = ({ item, className = "" }: { item: AddressData; className?: string }) => {
  if (!item.changes) return null;

  const change = item.changes.score_change;
  const formattedChange = Math.abs(change).toFixed(2);
  
  if (change > 0) {
    return (
      <motion.div 
        className={`absolute -left-3 md:-left-4 flex items-center justify-center z-20 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-hampton-300 font-medium flex items-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-0.5">
            <path d="M12 4L12 20M12 4L18 10M12 4L6 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.div>
    );
  } else if (change < 0) {
    return (
      <motion.div 
        className={`absolute -left-3 md:-left-4 flex items-center justify-center z-20 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-red-400 font-medium flex items-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-0.5">
            <path d="M12 20L12 4M12 20L18 14M12 20L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.div>
    );
  } else {
    return (
      <motion.div 
        className={`absolute -left-3 md:-left-4 flex items-center justify-center z-20 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-judge-gray-400 font-medium flex items-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-0.5">
            <path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.div>
    );
  }
};

/**
 * Renders a percentage change indicator
 */
export const PercentageChangeIndicator = ({ item, className = "" }: { item: AddressData; className?: string }) => {
  if (!item.changes) return null;

  const change = item.changes.score_percentage_change;
  const formattedChange = Math.abs(change).toFixed(2);
  
  if (change > 0) {
    return (
      <motion.div 
        className={`absolute -left-3 md:-left-4 flex items-center justify-center z-20 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-hampton-300 font-medium flex items-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-0.5">
            <path d="M12 4L12 20M12 4L18 10M12 4L6 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.div>
    );
  } else if (change < 0) {
    return (
      <motion.div 
        className={`absolute -left-3 md:-left-4 flex items-center justify-center z-20 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-red-400 font-medium flex items-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-0.5">
            <path d="M12 20L12 4M12 20L18 14M12 20L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.div>
    );
  } else {
    return (
      <motion.div 
        className={`absolute -left-3 md:-left-4 flex items-center justify-center z-20 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-judge-gray-400 font-medium flex items-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-0.5">
            <path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.div>
    );
  }
}; 