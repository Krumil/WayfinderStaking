"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { fetchPrimeValue } from "@/lib/utils";

const Header = () => {
	const [primeValue, setPrimeValue] = useState<string>("");
	const [hidden, setHidden] = useState<boolean>(false);
	const scrollPosition = useRef(0);
	const router = useRouter();
	const pathname = usePathname();
	const [showBackButton, setShowBackButton] = useState<boolean>(pathname !== "/");
	const [scrollDirection, setScrollDirection] = useState<string>("");

	useEffect(() => {
		setShowBackButton(pathname !== "/");
	}, [pathname]);

	useEffect(() => {
		const getPrimeValue = async () => {
			const value = await fetchPrimeValue();
			setPrimeValue(value);
		};

		getPrimeValue();
	}, []);

	useEffect(() => {
		let lastScrollY = window.scrollY;

		const updateScrollDirection = () => {
			const scrollY = window.scrollY;
			const direction = scrollY > lastScrollY ? "down" : "up";
			if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
				setScrollDirection(direction);
			}
			lastScrollY = scrollY > 0 ? scrollY : 0;
		};
		window.addEventListener("scroll", updateScrollDirection); // add event listener
		return () => {
			window.removeEventListener("scroll", updateScrollDirection); // clean up
		};
	}, [scrollDirection]);

	const handleBackClick = () => {
		if (pathname !== "/") {
			router.push("/");
		}
	};

	return (
		<header
			className={`fixed top-0 bg-transparent text-white p-4 flex justify-between items-center w-full transition-transform duration-300 ${
				hidden ? "-translate-y-full" : "translate-y-0"
			}`}>
			<div className='flex items-center w-1/4'>
				{showBackButton && (
					<button onClick={handleBackClick} className='mr-4 p-2 rounded bg-transparent'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-6 w-6'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M10 19l-7-7m0 0l7-7m-7 7h18'
							/>
						</svg>
					</button>
				)}
				{!showBackButton && (
					<div className='flex items-center'>
						<Image src='/assets/prime-token.png' alt='PRIME' width={30} height={30} />
						<span className='ml-2 text-xl'>${primeValue}</span>
					</div>
				)}
			</div>
			<div className='relative flex-1 text-center hidden md:flex md:justify-center'>
				<h1 className='text-lg mt-2 font-bold uppercase'>Wayfinder Staking Dashboard</h1>
			</div>
			<div className='flex justify-end mr-2 cursor-pointer w-1/4 gap-2'>
				<Link href='https://x.com/Simo1028' target='_blank' rel='noopener noreferrer'>
					<Image src='/assets/x-logo.png' alt='PRIME' width={25} height={25} />
				</Link>
				<Link href='https://github.com/krumil' target='_blank' rel='noopener noreferrer'>
					<Image src='/assets/github-mark-white.png' alt='GitHub' width={25} height={25} />
				</Link>
			</div>
		</header>
	);
};

export default Header;
