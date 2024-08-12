import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import SlideUp from "@/components/ui/SlideUp";
import { Star } from "lucide-react";
import { formatNumberWithCommas, getOrdinalIndicator, isMobile } from "@/lib/utils";
import { getENSNameFromAddress } from "@/lib/contract";

interface LeaderboardProps {
	addressesData: any[];
	addressToHighlight: string;
	highlightKey: number;
	showOnlyFavorites: boolean;
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
	const { addresses, handleClick, favorites, toggleFavorite } = data;
	const item = addresses[index];
	const ordinalIndicator = getOrdinalIndicator(item.data.position);
	const showOnlyAddress = item.name === item.address || item.name === `${item.address.slice(0, isMobile ? 4 : 8)}...${item.address.slice(isMobile ? -4 : -8)}`;
	const isFavorite = favorites.includes(item.address.toLowerCase());
	return (
		<div style={style} className="px-4">
			<SlideUp delay={0}>
				<div
					className={`p-4 border border-judge-gray-700 rounded-lg shadow-sm flex flex-row items-center cursor-pointer transition-colors duration-200 ${data.highlightedIndex === index ? 'bg-[#0b0f0d]' : 'hover:bg-[#0b0f0d] hover:bg-opacity-40'}`}
				>
					<div className="flex items-center space-x-4 flex-grow" onClick={() => handleClick(item.address)}>
						<div className="flex-shrink-0 w-15 h-10 rounded-full bg-gradient-to-br from-judge-green-500 to-judge-blue-500 flex items-center justify-center">
							<span className="text-lg font-bold text-white">{item.data.position}<sup className="text-xs">{ordinalIndicator}</sup></span>
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
				</div>
			</SlideUp>
		</div>
	);
});
AddressListItem.displayName = 'AddressListItem';


const BundleListItem = React.memo(({ bundle, addresses, handleClick }: { bundle: BundleItem; addresses: AddressItem[]; handleClick: (addresses: string[]) => void }) => {
	const bundleAddresses = bundle.addresses.map(addr => addresses.find(item => item.address.toLowerCase() === addr.toLowerCase()));

	if (bundleAddresses.some(addr => !addr?.name)) {
		return null;
	}

	return (
		<div className="px-4 mb-4 w-full" onClick={() => handleClick(bundle.addresses)}>
			<SlideUp delay={0}>
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
		</div>
	);
});
BundleListItem.displayName = 'BundleListItem';

const Leaderboard: React.FC<LeaderboardProps> = ({ addressesData, addressToHighlight, highlightKey, showOnlyFavorites }) => {
	const router = useRouter();
	const [allAddresses, setAllAddresses] = useState<AddressItem[]>([]);
	const [highlightedIndex, setHighlightedIndex] = useState(-1)
	const [favorites, setFavorites] = useState<string[]>([]);
	const [bundleFavorites, setBundleFavorites] = useState<string[][]>([]);
	const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);

	const handleClick = useCallback((addresses: string | string[]) => {
		const formattedAddresses = Array.isArray(addresses) ? addresses.join(',') : addresses;
		router.push(`/address/${formattedAddresses}`);
	}, [router]);

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
		return await Promise.all(
			addresses.map(async (item) => {
				const ensName = await getENSNameFromAddress(item.address, true);
				return { ...item, name: ensName || item.address };
			})
		);
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
		const loadAddresses = async () => {
			const addressesWithENS = await fetchENSNames(addressesData);
			setAllAddresses(addressesWithENS);
		};

		loadAddresses();
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

	const listRef = useRef<List>(null);

	const filteredAddresses = useMemo(() => {
		return showOnlyFavorites
			? allAddresses.filter(item => favorites.includes(item.address.toLowerCase()))
			: allAddresses;
	}, [allAddresses, favorites, showOnlyFavorites]);


	const listHeight = useMemo(() => {
		if (!showOnlyFavorites) {
			return '60vh'; // Fixed height when showing all addresses
		}
		const itemHeight = 82; // Height of each item in pixels
		const calculatedHeight = Math.min(filteredAddresses.length * itemHeight, window.innerHeight * 0.6);
		return `${calculatedHeight}px`;
	}, [showOnlyFavorites, filteredAddresses.length]);

	return (
		<div className="max-w-4xl mx-auto">
			{showOnlyFavorites && filteredAddresses.length === 0 ? (
				<div className="flex items-start justify-center h-full">
					<p className="text-xl text-judge-gray-400">No favorites added yet</p>
				</div>
			) :
				<div style={{ height: listHeight }}>
					<AutoSizer>
						{({ height, width }) => (
							<List
								ref={listRef}
								height={height}
								itemCount={filteredAddresses.length}
								itemSize={82}
								width={width}
								className="no-scrollbar"
								itemData={{
									addresses: filteredAddresses,
									handleClick,
									highlightedIndex,
									favorites,
									toggleFavorite
								}}
							>
								{AddressListItem}
							</List>
						)}
					</AutoSizer>
				</div>
			}
			{showOnlyFavorites && (
				<div className="mt-8 flex flex-col items-center justify-center">
					<h2 className="text-2xl font-bold mb-4">Bundles</h2>
					{bundleItems.length > 0 ? (
						bundleItems.map((bundle, index) => (
							<BundleListItem key={index} bundle={bundle} addresses={allAddresses} handleClick={handleClick} />
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