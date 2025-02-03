import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { FixedSizeList as List, ListOnScrollProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import Link from "next/link";
import { Star } from "lucide-react";
import { formatNumberWithCommas, getOrdinalIndicator, isMobile, truncateText } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import Loader from "@/components/Loader/Loader";

interface LeaderboardProps {
	addressesData: any[];
	addressToHighlight: string;
	showOnlyFavorites: boolean;
	onLoadMore: () => void;
	isLoadingMore: boolean;
}

interface AddressItem {
	address: string;
	data: any;
	prime_amount_cached?: number;
}

interface BundleItem {
	addresses: string[];
	totalScore: number;
}

const calculateTotalScoreMultipleAddresses = (addressesData: any) => {
	const totalScore = addressesData.reduce((acc: number, curr: any) => {
		const mergedScores = curr.data.merged_score_data || {
			prime_score: 0,
			community_score: 0,
			initialization_score: 0
		};
		return acc + mergedScores.prime_score + mergedScores.community_score + mergedScores.initialization_score;
	}, 0);
	return totalScore;
};

const AddressListItem = React.memo(({ index, style, data }: any) => {
	const { addresses, favorites, toggleFavorite, highlightedAddress } = data;
	const isSkeletonItem = index >= addresses.length;
	const skeletonIndex = index - addresses.length;

	// Common container styles for both skeleton and data
	const containerStyles = `p-4 border rounded-lg shadow-sm cursor-pointer transition-all duration-200 ease-in-out ${isSkeletonItem
		? 'border-judge-gray-700'
		: highlightedAddress?.toLowerCase() === addresses[index].address.toLowerCase()
			? 'highlight-pulse'
			: 'border-judge-gray-700 group-hover:bg-black/30 group-hover:scale-[1.02]'
		}`;

	return (
		<motion.div
			style={{
				...style,
				padding: '8px 0',
				width: 'calc(100% - 16px)',
				left: '8px'
			}}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{
				duration: 0.2,
				delay: isSkeletonItem ? skeletonIndex * 0.05 : 0,
			}}
		>
			<Link
				href={isSkeletonItem ? '#' : `/address/${addresses[index].address}`}
				className="group relative block"
				onClick={e => isSkeletonItem && e.preventDefault()}
			>
				<div className={containerStyles} data-address={isSkeletonItem ? '' : addresses[index].address}>
					{isSkeletonItem ? (
						// Skeleton content without motion wrapper
						<div className="flex flex-row items-center">
							<div className="flex items-center space-x-4 flex-grow">
								<div className="flex-shrink-0 w-15 h-10 rounded-full bg-judge-gray-700/50 animate-pulse"></div>
								<div className="flex flex-col space-y-2">
									<div className="h-6 w-40 bg-judge-gray-700/50 rounded animate-pulse"></div>
									<div className="h-4 w-32 bg-judge-gray-700/50 rounded animate-pulse"></div>
								</div>
							</div>
							<div className="flex flex-col items-end space-y-2">
								<div className="h-6 w-24 bg-judge-gray-700/50 rounded animate-pulse"></div>
								<div className="h-4 w-20 bg-judge-gray-700/50 rounded animate-pulse"></div>
							</div>
							<div className="ml-4 w-6 h-6 bg-judge-gray-700/50 rounded animate-pulse"></div>
						</div>
					) : (
						// Actual content with fade in and slide up animation
						<motion.div
							className="flex flex-row items-center"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.4,
								ease: [0.2, 0.65, 0.3, 0.9]
							}}
							key={`content-${addresses[index].address}`}
						>
							<div className="flex items-center space-x-4 flex-grow">
								<div className="flex-shrink-0 w-15 h-10 rounded-full bg-gradient-to-br from-judge-green-500 to-judge-blue-500 flex items-center justify-center">
									<span className="text-lg font-bold text-white">{addresses[index].data.leaderboard_rank}<sup className="text-xs">{getOrdinalIndicator(addresses[index].data.leaderboard_rank)}</sup></span>
								</div>
								<div className={`flex flex-col ${!(addresses[index].data.ens_name) ? 'justify-center' : ''}`}>
									<div className="text-xl md:text-2xl text-judge-gray-200">
										{addresses[index].data.ens_name ? truncateText(addresses[index].data.ens_name, isMobile) : `${addresses[index].address.slice(0, isMobile ? 4 : 8)}...${addresses[index].address.slice(isMobile ? -4 : -8)}`}
									</div>
									{addresses[index].data.ens_name && (
										<div className="text-sm text-judge-gray-400 h-[1.25rem]">
											{addresses[index].address.slice(0, isMobile ? 4 : 8)}...{addresses[index].address.slice(isMobile ? -4 : -8)}
										</div>
									)}
								</div>
							</div>
							<div className="flex flex-col items-end">
								<div className="text-end text-lg md:text-xl font-bold text-gradient-transparent">
									{formatNumberWithCommas(
										(addresses[index].data.merged_score_data?.prime_score || 0) +
										(addresses[index].data.merged_score_data?.community_score || 0) +
										(addresses[index].data.merged_score_data?.initialization_score || 0)
									)}{!isMobile && " CS"}
								</div>
								{addresses[index].prime_amount_cached && (
									<div className="text-judge-gray-200 text-sm md:text-base">
										{addresses[index].prime_amount_cached.toFixed(2).toLocaleString()} $PRIME
									</div>
								)}
							</div>
							<div
								className="ml-4 cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									toggleFavorite(addresses[index].address);
								}}
							>
								{favorites.includes(addresses[index].address.toLowerCase()) ? (
									<Star
										fill="#facc15"
										className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform"
									/>
								) : (
									<Star
										className="w-6 h-6 text-judge-gray-400 group-hover:text-yellow-400 group-hover:scale-110 transition-transform"
									/>
								)}
							</div>
						</motion.div>
					)}
				</div>
			</Link>
		</motion.div>
	);
});
AddressListItem.displayName = 'AddressListItem';

const BundleListItem = React.memo(({ bundle, addresses, index }: { bundle: BundleItem; addresses: AddressItem[]; index: number }) => {
	const bundleAddresses = bundle.addresses.map(addr => addresses.find(item => item.address.toLowerCase() === addr.toLowerCase()));

	if (bundleAddresses.some(addr => !addr?.data?.ens_name)) {
		return null;
	}

	return (
		<Link href={`/address/${bundle.addresses.join(',')}`} className="px-4 mb-4 w-full">
			<motion.div
				className="p-4 border border-judge-gray-700 rounded-lg shadow-sm flex flex-row items-center"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					duration: 0.4,
					delay: index * 0.1,
					ease: [0.4, 0, 0.2, 1]
				}}
			>
				<div className="ml-4 flex-grow">
					<div className="text-xl text-judge-gray-400">
						{bundleAddresses.map(addr => addr?.data?.ens_name || addr?.address).join(", ")}
					</div>
				</div>
				<div className="text-end text-lg md:text-xl font-bold text-gradient-transparent">
					{formatNumberWithCommas(bundle.totalScore)}{!isMobile && " CS"}
				</div>
			</motion.div>
		</Link>
	);
});
BundleListItem.displayName = 'BundleListItem';


const Leaderboard: React.FC<LeaderboardProps> = ({
	addressesData,
	addressToHighlight,
	showOnlyFavorites,
	onLoadMore,
	isLoadingMore
}) => {
	const [allAddresses, setAllAddresses] = useState<AddressItem[]>([]);
	const [favorites, setFavorites] = useState<string[]>([]);
	const [bundleFavorites, setBundleFavorites] = useState<string[][]>([]);
	const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);
	const [isNearBottom, setIsNearBottom] = useState(false);
	const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
	const [isInitialLoading, setIsInitialLoading] = useState(true);

	const listRef = useRef<List>(null);
	const prevScrollOffset = useRef(0);
	const loadingRef = useRef(false);
	const scrollThresholdRef = useRef(0);
	const SCROLL_THRESHOLD = 300;

	const scrollToTop = () => {
		if (listRef.current) {
			listRef.current.scrollToItem(0)
		}
	};

	const toggleFavorite = useCallback((address: string) => {
		setFavorites(prev => {
			const newFavorites = prev.includes(address.toLowerCase())
				? prev.filter(fav => fav !== address.toLowerCase())
				: [...prev, address.toLowerCase()];
			localStorage.setItem('favoriteAddresses', JSON.stringify(newFavorites));
			return newFavorites;
		});
	}, []);

	useEffect(() => {
		const storedFavorites = localStorage.getItem('favoriteAddresses');
		if (storedFavorites) {
			setFavorites(JSON.parse(storedFavorites));
		}

		const storedBundleFavorites = localStorage.getItem('favoriteBundles');
		if (storedBundleFavorites) {
			setBundleFavorites(JSON.parse(storedBundleFavorites));
		}
	}, []);

	useEffect(() => {
		if (addressesData.length > 0) {
			setAllAddresses(addressesData);
			setIsInitialLoading(false);
		} else {
			setIsInitialLoading(false);
		}
	}, [addressesData]);

	useEffect(() => {
		const calculateBundleScores = () => {
			const newBundleItems = bundleFavorites.map(bundle => {
				const bundleData = bundle.map(addr =>
					addressesData.find(item => item.address.toLowerCase() === addr.toLowerCase())
				).filter(Boolean);
				const totalScore = calculateTotalScoreMultipleAddresses(bundleData);
				return { addresses: bundle, totalScore };
			});
			setBundleItems(newBundleItems);
		};

		calculateBundleScores();
	}, [bundleFavorites, addressesData]);

	useEffect(() => {
		if (addressToHighlight && allAddresses.length > 0) {
			const index = allAddresses.findIndex(
				item => item.address.toLowerCase() === addressToHighlight.toLowerCase()
			);
			if (index !== -1) {
				setActiveHighlight(addressToHighlight);

				const scrollToHighlightedAddress = () => {
					if (listRef.current) {
						listRef.current.scrollToItem(index, "center");
					} else {
						setTimeout(scrollToHighlightedAddress, 100);
					}
				};

				scrollToHighlightedAddress();
			}
		} else {
			setActiveHighlight(null);
		}
	}, [addressToHighlight, allAddresses]);

	const filteredAddresses = useMemo(() => {
		return showOnlyFavorites
			? allAddresses.filter(item => favorites.includes(item.address.toLowerCase()))
			: allAddresses;
	}, [allAddresses, favorites, showOnlyFavorites]);


	const listHeight = useMemo(() => {
		if (!showOnlyFavorites) {
			return 'calc(60vh - 40px)'; // Show partial item by subtracting 40px from height
		}
		const itemHeight = 100; // Height of each item in pixels
		const calculatedHeight = Math.min(filteredAddresses.length * itemHeight, window.innerHeight * 0.6);
		return `${calculatedHeight}px`;
	}, [showOnlyFavorites, filteredAddresses.length]);

	const handleScroll = useCallback(({ scrollOffset, scrollUpdateWasRequested }: { scrollOffset: number, scrollUpdateWasRequested: boolean }) => {
		if (scrollUpdateWasRequested) return;

		const scrollingDown = scrollOffset > prevScrollOffset.current;
		prevScrollOffset.current = scrollOffset;

		if (!showOnlyFavorites && scrollingDown && listRef.current) {
			const listElement = (listRef.current as any)._outerRef as HTMLDivElement;
			if (!listElement) return;

			const scrolledPercentage = (scrollOffset + listElement.clientHeight) / listElement.scrollHeight;
			const nearBottom = scrolledPercentage > 0.8;

			setIsNearBottom(nearBottom);

			if (nearBottom && !isLoadingMore && !loadingRef.current) {
				loadingRef.current = true;
				onLoadMore();
				setTimeout(() => {
					loadingRef.current = false;
				}, 1000);
			}
		}
	}, [showOnlyFavorites, isLoadingMore, onLoadMore]);

	const totalItemCount = useMemo(() => {
		const baseCount = filteredAddresses.length;
		// Show skeleton items when near bottom OR when loading more
		return (isNearBottom || isLoadingMore) && !showOnlyFavorites ? baseCount + 10 : baseCount;
	}, [filteredAddresses.length, isLoadingMore, showOnlyFavorites, isNearBottom]);

	if (isInitialLoading) {
		return (
			<div className="flex justify-center items-center min-h-[60vh]">
				<Loader />
			</div>
		);
	}

	return (
		<div className="w-full max-w-4xl mx-auto relative px-2">
			{showOnlyFavorites && filteredAddresses.length === 0 ? (
				<div className="flex items-start justify-center h-full">
					<p className="text-xl text-judge-gray-400">No favorites added yet</p>
				</div>
			) :
				<div>
					<div style={{ height: listHeight }} className="overflow-visible relative">
						<AutoSizer>
							{({ height, width }) => (
								<List
									ref={listRef}
									height={height}
									itemCount={totalItemCount}
									itemSize={100}
									width={width}
									className="no-scrollbar overflow-visible px-0"
									onScroll={handleScroll}
									overscanCount={10}
									itemData={{
										addresses: filteredAddresses,
										favorites,
										toggleFavorite,
										highlightedAddress: activeHighlight
									}}
									useIsScrolling
								>
									{AddressListItem}
								</List>
							)}
						</AutoSizer>
						{!showOnlyFavorites && !isNearBottom && (
							<motion.div
								className="absolute bottom-4 left-1/2 -translate-x-1/2 text-judge-gray-400/50 pointer-events-none"
								animate={{ y: [0, 4, 0] }}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: "easeInOut"
								}}
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
						)}
						<div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-4">
							{!showOnlyFavorites && (
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
										onClick={scrollToTop}
										className="bg-judge-gray-800 bg-opacity-80 px-4 py-2 rounded-full shadow-lg hover:bg-judge-gray-700 transition-all duration-300 ease-out hover:scale-105 backdrop-blur-sm flex items-center gap-2"
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
							)}
						</div>
					</div>
				</div>
			}
			{showOnlyFavorites && (
				<div className="mt-8 flex flex-col items-center justify-center">
					<h2 className="text-2xl font-bold mb-4">Bundles</h2>
					{bundleItems.length > 0 ? (
						bundleItems.map((bundle, index) => (
							<BundleListItem
								key={index}
								bundle={bundle}
								addresses={allAddresses}
								index={index}
							/>
						))
					) : (
						<p className="text-xl text-judge-gray-400">No favorite bundles added yet</p>
					)}
				</div>
			)}
		</div>
	);
};

export default React.memo(Leaderboard);