"use client";

import React from "react";
import { motion } from "framer-motion";

interface SlideUpProps {
	children: React.ReactNode;
	delay: number;
}

const SlideUp: React.FC<SlideUpProps> = ({ children, delay }) => {
	return (
		<motion.div
			initial={{ y: 50, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5, delay }}>
			{children}
		</motion.div>
	);
};

export default SlideUp;
