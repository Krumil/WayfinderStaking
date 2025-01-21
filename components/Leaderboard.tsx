import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import Link from "next/link";
import { toast } from "react-hot-toast";
import SlideUp from "@/components/ui/SlideUp";
import { Star } from "lucide-react";
import { formatNumberWithCommas, getOrdinalIndicator, isMobile } from "@/lib/utils";
import { getENSNameFromAddress } from "@/lib/contract";
import { motion } from "framer-motion";

interface LeaderboardProps {
	addressesData: any[];
	addressToHighlight: string;
	highlightKey: number;
	showOnlyFavorites: boolean;
	onLoadMore: () => void;
	isLoadingMore: boolean;
}

interface AddressItem {
	address: string;
	name: string;
	data: any;
	prime_amount_cached?: number;
}

interface BundleItem {
	addresses: string[];
	totalScore: number;
}

const calculateTotalScoreMultipleAddresses = (addressesData: any) => {
	const totalScore = addressesData.reduce((acc: number, curr: any) => {
		return acc + calculateTotalScore(curr.data);
	}, 0);
	return totalScore;
};

const calculateTotalScore = (data: any) => {
	const scores = data.scores || {
		prime_score: 0,
		community_score: 0,
		initialization_score: 0,
	};
	const baseScores = data.base_scores || {
		prime_score: 0,
		community_score: 0,
		initialization_score: 0,
	};

	return (
		scores.prime_score +
		baseScores.prime_score +
		scores.community_score +
		baseScores.community_score +
		scores.initialization_score +
		baseScores.initialization_score
	);
};

const AddressListItem = React.memo(({ index, style, data }: any) => {
	const { addresses, favorites, toggleFavorite } = data;
	const item = addresses[index];
	console.log(item.data.leaderboard_rank);
	const ordinalIndicator = getOrdinalIndicator(item.data.leaderboard_rank);
	const showOnlyAddress = item.name === item.address || item.name === `${item.address.slice(0, isMobile ? 4 : 8)}...${item.address.slice(isMobile ? -4 : -8)}`;
	const isFavorite = favorites.includes(item.address.toLowerCase());

	return (
		<div style={style} className="px-4 py-2">
			<Link href={`/address/${item.address}`} className={`p-4 border border-judge-gray-700 rounded-lg shadow-sm flex flex-row items-center cursor-pointer transition-colors duration-200 ${data.highlightedIndex === index ? 'bg-[#0b0f0d]' : 'hover:bg-[#0b0f0d] hover:bg-opacity-40'}`}>
				<div className="flex items-center space-x-4 flex-grow">
					<div className="flex-shrink-0 w-15 h-10 rounded-full bg-gradient-to-br from-judge-green-500 to-judge-blue-500 flex items-center justify-center">
						<span className="text-lg font-bold text-white">{item.data.leaderboard_rank}<sup className="text-xs">{ordinalIndicator}</sup></span>
					</div>
					<div className="flex flex-col">
						<div className="text-xl md:text-2xl text-judge-gray-200">{item.name}</div>
						{!showOnlyAddress && (
							<div className="text-sm text-judge-gray-400">
								{item.address.slice(0, isMobile ? 4 : 8)}...{item.address.slice(isMobile ? -4 : -8)}
							</div>
						)}
					</div>
				</div>
				<div className="flex flex-col items-end">
					<div className="text-end text-lg md:text-xl font-bold text-gradient-transparent">
						{formatNumberWithCommas(calculateTotalScore(item.data))}{!isMobile && " CS"}
					</div>
					{item.prime_amount_cached && (
						<div className="text-judge-gray-200 text-sm md:text-base">
							{item.prime_amount_cached.toFixed(2).toLocaleString()} $PRIME
						</div>
					)}
				</div>
				<div
					className="ml-4 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						toggleFavorite(item.address);
					}}
				>
					{isFavorite ? (
						<Star
							fill="#facc15"
							className="w-6 h-6 text-yellow-400 transition-all duration-300 ease-out scale-105 opacity-100"
						/>
					) : (
						<Star
							className="w-6 h-6 text-judge-gray-400 hover:text-yellow-400 transition-all duration-300 ease-out scale-100 opacity-100 hover:scale-110"
						/>
					)}
				</div>
			</Link>
		</div>
	);
});
AddressListItem.displayName = 'AddressListItem';

const BundleListItem = React.memo(({ bundle, addresses }: { bundle: BundleItem; addresses: AddressItem[] }) => {
	const bundleAddresses = bundle.addresses.map(addr => addresses.find(item => item.address.toLowerCase() === addr.toLowerCase()));

	if (bundleAddresses.some(addr => !addr?.name)) {
		return null;
	}

	return (
		<Link href={`/address/${bundle.addresses.join(',')}`} className="px-4 mb-4 w-full">
			<SlideUp>
				<div className="p-4 border border-judge-gray-700 rounded-lg shadow-sm flex flex-row items-center">
					<div className="ml-4 flex-grow">
						<div className="text-xl text-judge-gray-400">
							{bundleAddresses.map(addr => addr?.name).join(", ")}
						</div>
					</div>
					<div className="text-end text-lg md:text-xl font-bold text-gradient-transparent">
						{formatNumberWithCommas(bundle.totalScore)}{!isMobile && " CS"}
					</div>
				</div>
			</SlideUp>
		</Link>
	);
});
BundleListItem.displayName = 'BundleListItem';


const Leaderboard: React.FC<LeaderboardProps> = ({
	addressesData,
	addressToHighlight,
	highlightKey,
	showOnlyFavorites,
	onLoadMore,
	isLoadingMore
}) => {
	const [allAddresses, setAllAddresses] = useState<AddressItem[]>([]);
	const [highlightedIndex, setHighlightedIndex] = useState(-1)
	const [favorites, setFavorites] = useState<string[]>([]);
	const [bundleFavorites, setBundleFavorites] = useState<string[][]>([]);
	const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);
	const [ensCache, setEnsCache] = useState<Record<string, string>>({});

	const listRef = useRef<List>(null);
	const prevScrollOffset = useRef(0);

	const scrollToTop = () => {
		if (listRef.current) {
			listRef.current.scrollToItem(0) // second parameter here could be 'auto', 'smart', 'center', 'end', 'start'

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

	const fetchENSNames = useCallback(async (addresses: any[]) => {
		const newAddresses = addresses.map(item => ({
			...item,
			name: ensCache[item.address.toLowerCase()] || item.address
		}));
		setAllAddresses(newAddresses);

		// Fetch ENS names for addresses not in cache
		const uncachedAddresses = addresses.filter(item => !ensCache[item.address.toLowerCase()]);
		if (uncachedAddresses.length > 0) {
			const ensPromises = uncachedAddresses.map(async (item) => {
				const ensName = await getENSNameFromAddress(item.address, true);
				return { address: item.address.toLowerCase(), name: ensName || item.address };
			});

			const ensResults = await Promise.all(ensPromises);
			const newCache = { ...ensCache };
			ensResults.forEach(result => {
				newCache[result.address] = result.name;
			});
			setEnsCache(newCache);

			// Update addresses with new ENS names
			setAllAddresses(prev => prev.map(item => ({
				...item,
				name: newCache[item.address.toLowerCase()] || item.name
			})));
		}
	}, [ensCache]);

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
		fetchENSNames(addressesData);
	}, [fetchENSNames, addressesData]);

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
		if (addressToHighlight) {
			const highlightedIndex = allAddresses.findIndex(
				item => item.address.toLowerCase() === addressToHighlight.toLowerCase() ||
					item.name.toLowerCase() === addressToHighlight.toLowerCase()
			);

			if (highlightedIndex !== -1) {
				setHighlightedIndex(highlightedIndex);
				if (listRef.current && 'scrollToItem' in listRef.current) {
					(listRef.current as any).scrollToItem(highlightedIndex, "center");
				}
			} else {
				toast.error("Address not found in the leaderboard");
			}
		}
	}, [addressToHighlight, allAddresses, highlightKey]);


	const filteredAddresses = useMemo(() => {
		return showOnlyFavorites
			? allAddresses.filter(item => favorites.includes(item.address.toLowerCase()))
			: allAddresses;
	}, [allAddresses, favorites, showOnlyFavorites]);


	const listHeight = useMemo(() => {
		if (!showOnlyFavorites) {
			return '60vh'; // Fixed height when showing all addresses
		}
		const itemHeight = 100; // Height of each item in pixels
		const calculatedHeight = Math.min(filteredAddresses.length * itemHeight, window.innerHeight * 0.6);
		return `${calculatedHeight}px`;
	}, [showOnlyFavorites, filteredAddresses.length]);

	// Add onScroll handler for infinite loading
	const handleScroll = useCallback(({ scrollOffset, scrollUpdateWasRequested }: { scrollOffset: number, scrollUpdateWasRequested: boolean }) => {
		if (scrollUpdateWasRequested) return;

		const scrollingDown = scrollOffset > prevScrollOffset.current;
		prevScrollOffset.current = scrollOffset;

		if (!showOnlyFavorites && scrollingDown) {
			const listElement = (listRef.current as any)?._outerRef;
			if (!listElement) return;

			const scrolledToBottom =
				Math.ceil(scrollOffset + listElement.clientHeight) >=
				listElement.scrollHeight - 100; // 100px threshold

			if (scrolledToBottom && !isLoadingMore) {
				onLoadMore();
			}
		}
	}, [showOnlyFavorites, isLoadingMore, onLoadMore]);

	return (
		<div className="max-w-4xl mx-auto">
			{showOnlyFavorites && filteredAddresses.length === 0 ? (
				<div className="flex items-start justify-center h-full">
					<p className="text-xl text-judge-gray-400">No favorites added yet</p>
				</div>
			) :
				<div>
					<div style={{ height: listHeight }}>
						<AutoSizer>
							{({ height, width }) => (
								<List
									ref={listRef}
									height={height}
									itemCount={filteredAddresses.length}
									itemSize={100}
									width={width}
									className="no-scrollbar"
									onScroll={handleScroll}
									overscanCount={5}
									itemData={{
										addresses: filteredAddresses,
										highlightedIndex,
										favorites,
										toggleFavorite
									}}
								>
									{AddressListItem}
								</List>
							)}
						</AutoSizer>
						{(!showOnlyFavorites && (
							<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 20 }}
									transition={{ duration: 0.3 }}
								>
									<button
										onClick={scrollToTop}
										className="bg-judge-gray-800 text-judge-gray-200 px-4 py-2 rounded-full shadow-lg hover:bg-judge-gray-700 transition-colors duration-300"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6 inline-block mr-2"
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
										Scroll to Top
									</button>
								</motion.div>
							</div>
						))}
					</div>
				</div>
			}
			{showOnlyFavorites && (
				<div className="mt-8 flex flex-col items-center justify-center">
					<h2 className="text-2xl font-bold mb-4">Bundles</h2>
					{bundleItems.length > 0 ? (
						bundleItems.map((bundle, index) => (
							<BundleListItem key={index} bundle={bundle} addresses={allAddresses} />
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