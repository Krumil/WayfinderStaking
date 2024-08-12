import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
	title: string;
	subtitle: string;
	description?: string;
}

const Notification: React.FC<NotificationProps> = ({ title, subtitle, description }) => {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const storedVisibility = localStorage.getItem('notificationVisible');
		if (storedVisibility === 'false') {
			setIsVisible(false);
		}
	}, []);

	const handleClose = () => {
		setIsVisible(false);
		localStorage.setItem('notificationVisible', 'false');
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 1 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0, transition: { duration: 0.5 } }}
					role="alert"
					className="p-2 my-2 text-white rounded-full items-center leading-none lg:rounded-full flex lg:inline-flex relative overflow-hidden"
				>
					<div className="absolute inset-0 bg-gradient-to-r from-judge-gray-500 via-judge-gray-600 to-judge-gray-700 animate-gradient-x"></div>
					<span className="flex rounded-full bg-gradient-to-r from-judge-gray-600 to-judge-gray-900 text-white uppercase px-2 text-xs font-bold mr-3 mt-[4px] z-10 animate-bounce">
						{title}
					</span>
					<div className="md:mr-8 text-left flex-auto z-10 leading-tight">
						<div className='text-[16px] leading-tight'>{subtitle}</div>
						{description && <div className='text-[12px] leading-tight'>{description}</div>}
					</div>
					<button onClick={handleClose} className="absolute top-1/2 -translate-y-1/2 right-5 md:right-2 z-10 text-white text-4xl md:text-2xl mt-[1px]">
						&times;
					</button>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Notification;
