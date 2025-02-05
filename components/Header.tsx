"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchPrimeValue, isMobile } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

interface HeaderProps {
	className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
	const router = useRouter();
	const pathname = usePathname();
	const deferredPrompt = useRef<any>(null);
	const [hidden, setHidden] = useState<boolean>(false);
	const [isInstallable, setIsInstallable] = useState<boolean>(false);
	const [primeValue, setPrimeValue] = useState<string>("");
	const [showBackButton, setShowBackButton] = useState<boolean>(
		pathname !== "/"
	);
	const scrollPosition = useRef(0);
	const scrollableDiv = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			deferredPrompt.current = e;
			setIsInstallable(true);
		};

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
		};
	}, []);

	useEffect(() => {
		const getPrimeValue = async () => {
			const value = await fetchPrimeValue();
			setPrimeValue(value);
		};

		getPrimeValue();

		const handleScroll = () => {
			if (!scrollableDiv.current) return;
			const currentScrollPosition = scrollableDiv.current.scrollTop;

			if (currentScrollPosition > scrollPosition.current) {
				setHidden(true);
			} else {
				setHidden(false);
			}

			scrollPosition.current = currentScrollPosition;
		};

		if (typeof window !== "undefined") {
			scrollableDiv.current = document.querySelector(".scrollable");

			if (scrollableDiv.current) {
				scrollableDiv.current.addEventListener("scroll", handleScroll);
			}
		}

		return () => {
			if (scrollableDiv.current) {
				scrollableDiv.current.removeEventListener("scroll", handleScroll);
			}
		};
	}, []);

	useEffect(() => {
		setShowBackButton(pathname !== "/");
	}, [pathname]);


	const handleBackClick = () => {
		if (pathname !== "/") {
			window.history.back();
		}
	};

	const handleInstall = async () => {
		if (deferredPrompt.current) {
			deferredPrompt.current.prompt();
			const { outcome } = await deferredPrompt.current.userChoice;
			if (outcome === 'accepted') {
				setIsInstallable(false);
			}
			deferredPrompt.current = null;
		}
	};

	return (
		<header
			className={`z-50 fixed top-0 text-white p-4 flex justify-between items-center w-full transition-opacity duration-300 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"
				} ${className}`}
		>
			<div className="flex items-center w-1/3">
				{showBackButton && (
					<button
						onClick={handleBackClick}
						className="mr-4 p-2 rounded bg-transparent"
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
								strokeWidth={2}
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
					</button>
				)}
				{!showBackButton && (
					<>
						{(!isMobile || (isMobile && !isInstallable)) && (
							<div className="flex items-center">
								<Image
									src="/assets/prime-token.png"
									alt="PRIME"
									width={30}
									height={30}
								/>
								{primeValue && (
									<span className="ml-2 text-xl animate-fadeIn">${primeValue}</span>
								)}
							</div>
						)}
						{isMobile && isInstallable && (
							<Button
								onClick={handleInstall}
								className="bg-[#0b0f0d] bg-opacity-20 hover:bg-opacity-80 text-judge-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
							>
								Install App
							</Button>
						)}
					</>
				)}
			</div>
			<div className="relative flex-1 text-center hidden md:flex md:justify-center">
				<h1 className="text-lg mt-2 font-bold uppercase">
					Wayfinder Staking Dashboard
				</h1>
			</div>
			<div className="flex items-center justify-end gap-4 w-1/3">
				{!isMobile && isInstallable && (
					<Button
						onClick={handleInstall}
						className="bg-[#0b0f0d] bg-opacity-20 hover:bg-opacity-40 text-judge-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
					>
						Install App
					</Button>
				)}
				<div className="flex items-center gap-2">
					<Link
						href="/faq"
						className="hover:opacity-80 transition-opacity"
						title="FAQ"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="23"
							height="23"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="12" cy="12" r="10" />
							<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
							<line x1="12" y1="17" x2="12.01" y2="17" />
						</svg>
					</Link>
					<Link
						href="https://x.com/Simo1028"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:opacity-80 transition-opacity"
						title="Twitter"
					>
						<Image src="/assets/x-logo.png" alt="X" width={20} height={20} />
					</Link>
					<Link
						href="https://github.com/krumil"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:opacity-80 transition-opacity"
						title="GitHub"
					>
						<Image
							src="/assets/github-mark-white.png"
							alt="GitHub"
							width={20}
							height={20}
						/>
					</Link>
					<Link
						href="https://cache.wayfinder.ai/login?referral=0x8e5e01DCa1706F9Df683c53a6Fc9D4bb8D237153"
						target="_blank"
						rel="noopener noreferrer"
						className="group relative hover:opacity-80 transition-opacity"
						title="Support me by using my referral link!"
					>
						<Image src="/assets/wayfinder.svg" alt="Wayfinder" width={20} height={20} />
						<span className="absolute hidden group-hover:block bg-black bg-opacity-80 text-white text-xs p-2 rounded whitespace-nowrap right-0 mt-2 z-50">
							Support me by using my referral! 🙏
						</span>
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Header;