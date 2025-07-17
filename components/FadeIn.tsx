"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
	children: ReactNode;
	delay?: number;
}

const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0 }) => {
	return (
		<motion.div
			initial={{ opacity: 0, height: "auto" }}
			animate={{ opacity: 1, height: "auto" }}
			transition={{ duration: 0.5, delay }}
			style={{ height: "100%" }}
		>
			{children}
		</motion.div>
	);
};

export default FadeIn;