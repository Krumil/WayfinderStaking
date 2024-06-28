"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SlideUpProps {
	children: ReactNode;
	delay: number;
	duration?: number;
}

const SlideUp: React.FC<SlideUpProps> = ({ children, delay, duration = 0.5 }) => {
	return (
		<div className='w-full overflow-hidden'>
			<motion.div
				className='w-full'
				initial={{ y: "100%", opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: duration, delay }}>
				{children}
			</motion.div>
		</div>
	);
};
export default SlideUp;
