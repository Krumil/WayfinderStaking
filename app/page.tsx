"use client";

import "daisyui/dist/full.css";
import Leaderboard from "@/components/Leaderboard";
import AddressSearch from "@/components/AddressSearch";
import SlideUp from "@/components/ui/SlideUp";
import FadeIn from "@/components/ui/FadeIn";
import Loader from "@/components/ui/loader";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Star } from "lucide-react";
import { fetchPrimeValue } from "@/lib/utils";
import { getPrimeBalance, fetchENSList } from "@/lib/contract";
import { useAddressesStore, AddressData } from "@/stores/addresses";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const DEFAULT_PRIME_SUPPLY = 1111111111;
const PAGE_SIZE = 10;

const Home = () => {
	const { allAddressesData, setAllAddressesData } = useAddressesStore();
	const [highlightAddress, setHighlightAddress] = useState<string>("");
	const [highlightKey, setHighlightKey] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);
	const [loadingMore, setLoadingMore] = useState<boolean>(false);
	const [primeBalance, setPrimeBalance] = useState<number>(0);
	const [primeSupply, setPrimeSupply] = useState<number>(DEFAULT_PRIME_SUPPLY);
	const [primeValue, setPrimeValue] = useState<number>(0);
	const [showLeaderboard, setShowLeaderboard] = useState(false);
	const [totalPercentageStaked, setTotalPercentageStaked] = useState<number>(0);
	const [totalStakedValueInUSD, setTotalStakedValueInUSD] = useState<number>(0);
	const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [totalPages, setTotalPages] = useState<number>(1);
	const leaderboardRef = useRef<HTMLDivElement>(null);
	const loadMoreRef = useRef<HTMLDivElement>(null);

	const router = useRouter();

	const fetchPrimeBalance = useCallback(async () => {
		try {
			const balance = await getPrimeBalance();
			setPrimeBalance(parseFloat(balance));

			const response = await fetch("/api");
			const data = await response.json();
			setPrimeSupply(data.circulatingSupply);
		} catch (err: any) {
			console.error(err);
		}
	}, []);

	const getPrimeValue = useCallback(async () => {
		const value = await fetchPrimeValue();
		setPrimeValue(parseFloat(value));
	}, []);

	const fetchAddressesData = useCallback(async (page: number = 1, append: boolean = false) => {
		try {
			setLoadingMore(true);
			const response = await fetch(`/api/data/addresses?page=${page}&pageSize=${PAGE_SIZE}`);
			const data = await response.json();

			if (append) {
				setAllAddressesData(prev => [...prev, ...data.data] as AddressData[]);
			} else {
				setAllAddressesData(data.data as AddressData[]);
			}

			setTotalPages(data.total_pages);
			setHasMore(page < data.total_pages);
			setLoading(false);
			setLoadingMore(false);
		} catch (err) {
			console.error("Error fetching addresses data:", err);
			setLoading(false);
			setLoadingMore(false);
		}
	}, [setAllAddressesData]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowLeaderboard(true);
		}, 2500);

		fetchENSList();
		return () => clearTimeout(timer);
	}, []);

	// Initial data loading
	useEffect(() => {
		setLoading(true);
		fetchPrimeBalance();
		getPrimeValue();
		fetchAddressesData(1, false);
	}, [fetchPrimeBalance, getPrimeValue, fetchAddressesData]);

	// Handle filter changes
	useEffect(() => {
		if (showOnlyFavorites) {
			setCurrentPage(1);
			setHasMore(false);
		} else {
			setCurrentPage(1);
			setAllAddressesData([]);
			fetchAddressesData(1, false);
		}
	}, [showOnlyFavorites, fetchAddressesData]);

	const handleLoadMore = useCallback(() => {
		if (!loadingMore && currentPage < totalPages && !showOnlyFavorites) {
			const nextPage = currentPage + 1;
			setCurrentPage(nextPage);
			fetchAddressesData(nextPage, true);
		}
	}, [currentPage, loadingMore, totalPages, fetchAddressesData, showOnlyFavorites]);

	useEffect(() => {
		const totalPercentageStaked = (primeBalance / primeSupply) * 100;
		setTotalPercentageStaked(totalPercentageStaked);
	}, [primeBalance, primeSupply]);

	useEffect(() => {
		const totalValue = primeBalance * primeValue;
		setTotalStakedValueInUSD(totalValue);
	}, [primeBalance, primeValue]);

	const handleAddressDetails = useCallback((addresses: string[]) => {
		const validAddresses = addresses.filter(address =>
			address.startsWith("0x") || address.endsWith(".eth")
		);
		if (validAddresses.length > 0) {
			router.push(`/address/${validAddresses.join(',')}`);
		}
	}, [router]);

	const handleSearchPosition = useCallback(async (address: string) => {
		setShowOnlyFavorites(false);
		setLoading(true);

		try {
			// Search for the address and get all addresses above it
			const searchResponse = await fetch(`/api/data/search?address=${address}`);
			const searchData = await searchResponse.json();

			if (searchData.error) {
				toast.error("Address not found in the leaderboard");
				setLoading(false);
				return;
			}

			// Update the leaderboard with all addresses up to the searched one
			setAllAddressesData(searchData.addresses as AddressData[]);
			setCurrentPage(Math.floor(searchData.position / PAGE_SIZE) + 1);
			setTotalPages(searchData.total_pages);
			setHasMore(true); // We can load more since we're at the searched position

			// Scroll to the leaderboard first
			if (leaderboardRef.current) {
				leaderboardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}

			// Then highlight the address (this will trigger the scroll to the specific item)
			setTimeout(() => {
				setHighlightAddress(address);
				setHighlightKey(prevKey => prevKey + 1);
			}, 100);

		} catch (error) {
			console.error("Error searching address:", error);
			toast.error("Error searching for address");
		} finally {
			setLoading(false);
		}
	}, []);

	const toggleFavoritesFilter = useCallback((checked: boolean) => {
		setShowOnlyFavorites(checked);
	}, []);

	return (
		<div className="flex flex-col items-center min-h-screen md:mb-10">
			<div className="text-2xl md:text-3xl mt-[10vh] md:mt-[20vh] text-judge-gray-200">
				<SlideUp delay={0.4}>
					<p className="flex flex-col justify-center items-center md:flex-row ">
						There are currently{" "}
						<span className="text-5xl font-bold md:text-6xl mx-2 text-gradient-transparent">
							<AnimatedNumber value={primeBalance} />
						</span>{" "}
						$PRIME staked
						<span className="text-2xl md:text-3xl mx-2 text-gradient-transparent font-bold ">
							(<AnimatedNumber value={totalStakedValueInUSD} /> $USD)
						</span>{" "}
					</p>
				</SlideUp>
				<SlideUp delay={0.8}>
					<p className="flex flex-col justify-center items-center md:flex-row mt-6 mb-8">
						This is about
						<span className="text-5xl font-bold md:text-6xl mx-2 text-gradient-transparent">
							<AnimatedNumber value={totalPercentageStaked} precision={2} />%
						</span>{" "}
						of the total circulating supply
					</p>
				</SlideUp>
				<SlideUp delay={1.2}>
					<AddressSearch
						onAddressDetails={handleAddressDetails}
						onSearchPosition={handleSearchPosition}
					/>
				</SlideUp>
				<SlideUp delay={1.6}>
					<div className="flex flex-row items-center justify-center mt-6 mb-4 space-x-2">
						<h2 className="text-2xl font-bold text-judge-gray-200">Leaderboard</h2>
						<Star
							className={`w-5 h-5 cursor-pointer transition-all duration-300 ease-in-out ${showOnlyFavorites
								? 'text-yellow-400 fill-yellow-400 scale-110'
								: 'text-judge-gray-400 hover:text-yellow-400 hover:scale-110'
								}`}
							onClick={() => toggleFavoritesFilter(!showOnlyFavorites)}
						/>
					</div>
				</SlideUp>
			</div>
			{loading && (
				<FadeIn delay={1.8}>
					<div className="relative flex flex-col justify-center items-center text-md font-bold text-center mt-4 h-[200px]">
						<Loader />
					</div>
				</FadeIn>
			)}
			{!loading && Array.isArray(allAddressesData) && allAddressesData.length > 0 && showLeaderboard && (
				<SlideUp>
					<div ref={leaderboardRef} className="w-full">
						<Leaderboard
							addressesData={allAddressesData}
							addressToHighlight={highlightAddress}
							highlightKey={highlightKey}
							showOnlyFavorites={showOnlyFavorites}
							onLoadMore={handleLoadMore}
							isLoadingMore={loadingMore}
						/>
					</div>
				</SlideUp>
			)}
		</div>
	);
};

export default Home;