"use client";

import React, { useEffect, useState } from "react";

const DisclaimerDialog = () => {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const hasSeenDisclaimer = localStorage.getItem("hasSeenDisclaimer");
		if (!hasSeenDisclaimer) {
			setIsOpen(true);
		}
	}, []);

	const handleClose = () => {
		localStorage.setItem("hasSeenDisclaimer", "true");
		setIsOpen(false);
	};

	return (
		<div>
			{isOpen && (
				<div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
					<div className='modal modal-open'>
						<div className='modal-box !bg-judge-gray-800  max-w-xl'>
							<div className='font-bold text-3xl !text-hampton-200'>Disclaimer</div>
							<div className='py-4 text-hampton-200'>
								<p className='mb-4'>I am not affiliated with Wayfinder in any way.</p>
								<p className='mb-4'>
									The data provided on this site could be incorrect. Please do not use it for making
									financial decisions.
								</p>
							</div>
							<div className='modal-action'>
								<button
									className='btn !bg-judge-gray-950 !text-judge-gray-200 !border-none'
									onClick={handleClose}>
									Understood
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default DisclaimerDialog;
