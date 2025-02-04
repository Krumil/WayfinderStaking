"use client";

import "daisyui/dist/full.css";
import Leaderboard from "@/components/Leaderboard";
import AddressSearch from "@/components/AddressSearch";
import SlideUp from "@/components/ui/SlideUp";
import FadeIn from "@/components/ui/FadeIn";
import Loader from "@/components/Loader/Loader";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Star } from "lucide-react";
import { fetchPrimeValue } from "@/lib/utils";
import { getPrimeBalance } from "@/lib/contract";
import { useAddressesStore, AddressData } from "@/stores/addresses";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAddressSearch } from "@/hooks/useAddressSearch";

const PAGE_SIZE = 10;

const Home = () => {
	const { allAddressesData, setAllAddressesData } = useAddressesStore();
	const [highlightAddress, setHighlightAddress] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(true);
	const [loadingMore, setLoadingMore] = useState<boolean>(false);
	const [primeBalance, setPrimeBalance] = useState<number>(0);
	const [primeSupply, setPrimeSupply] = useState<number>(0);
	const [primeValue, setPrimeValue] = useState<number>(0);
	const [showLeaderboard, setShowLeaderboard] = useState(false);
	const [totalPercentageStaked, setTotalPercentageStaked] = useState<number>(0);
	const [totalStakedValueInUSD, setTotalStakedValueInUSD] = useState<number>(0);
	const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [totalPages, setTotalPages] = useState<number>(1);
	const leaderboardRef = useRef<HTMLDivElement>(null);

	const router = useRouter();

	const fetchPrimeBalance = useCallback(async () => {
		try {
			setPrimeBalance(0);
			setPrimeSupply(0);

			const [balance, response] = await Promise.all([
				getPrimeBalance(),
				fetch("/api/data/global")
			]);

			const data = await response.json();

			// Only update both values when we have all the data
			if (balance && data.circulatingSupply) {
				setPrimeBalance(parseFloat(balance));
				setPrimeSupply(data.circulatingSupply);
			}
		} catch (err: any) {
			console.error(err);
			setPrimeBalance(0);
			setPrimeSupply(0);
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
		if (primeSupply > 0) {
			const totalPercentageStaked = (primeBalance / primeSupply) * 100;
			setTotalPercentageStaked(totalPercentageStaked);
		}
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

	const { searchAddress } = useAddressSearch({
		allAddressesData,
		setAllAddressesData,
		setHighlightAddress,
		setCurrentPage,
		setTotalPages,
		setHasMore,
		setLoading,
		pageSize: PAGE_SIZE
	});

	const toggleFavoritesFilter = useCallback((checked: boolean) => {
		setShowOnlyFavorites(checked);
	}, []);

	return (
		<div className="flex flex-col items-center min-h-screen md:mb-10">
			<div className="flex flex-col items-center text-2xl md:text-3xl mt-[10vh] md:mt-[15vh] w-full text-judge-gray-200">
				<SlideUp delay={0.1}>
					<div className="flex flex-col items-center justify-center text-center w-full">
						<SlideUp delay={0.2}>
							<div className="text-center">There are currently</div>
						</SlideUp>{" "}
						<SlideUp delay={0.3}>
							<div className="text-5xl font-bold md:text-6xl mx-2 text-gradient-transparent text-center">
								<AnimatedNumber value={primeBalance} />
							</div>
						</SlideUp>{" "}
						<SlideUp delay={0.4}>
							<div className="text-center">$PRIME staked</div>
						</SlideUp>
						<SlideUp delay={0.5}>
							<div className="text-2xl md:text-3xl mx-2 text-gradient-transparent font-bold text-center">
								(<AnimatedNumber value={totalStakedValueInUSD} /> $USD)
							</div>
						</SlideUp>
					</div>
				</SlideUp>
				<SlideUp delay={1.1}>
					<div className="flex flex-col items-center justify-center text-center w-full mt-6 mb-8">
						<SlideUp delay={0.7}>
							<div className="text-center">This is about</div>
						</SlideUp>
						<SlideUp delay={0.8}>
							<div className="text-5xl font-bold md:text-6xl mx-2 text-gradient-transparent text-center">
								<AnimatedNumber value={totalPercentageStaked} precision={2} />%
							</div>
						</SlideUp>
						<SlideUp delay={0.9}>
							<div className="text-center">of the total circulating supply</div>
						</SlideUp>
					</div>
				</SlideUp>
				<SlideUp delay={1.0}>
					<div className="w-full flex justify-center">
						<AddressSearch
							onAddressDetails={handleAddressDetails}
							onSearchPosition={searchAddress}
						/>
					</div>
				</SlideUp>
				<SlideUp delay={1.1}>
					<div className="flex flex-row items-center justify-center mt-6 mb-4 space-x-2 w-full">
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
				<FadeIn delay={1.1}>
					<div className="relative flex flex-col justify-center items-center text-md font-bold text-center mt-4 h-[200px]">
						<Loader />
					</div>
				</FadeIn>
			)}
			{!loading && Array.isArray(allAddressesData) && allAddressesData.length > 0 && showLeaderboard && (
				<div ref={leaderboardRef} className="w-full">
					<FadeIn delay={1.1}>

						<Leaderboard
							addressesData={allAddressesData}
							addressToHighlight={highlightAddress}
							showOnlyFavorites={showOnlyFavorites}
							onLoadMore={handleLoadMore}
							isLoadingMore={loadingMore}
							hasMore={hasMore}
						/>
					</FadeIn>
				</div>
			)}
		</div>
	);
};

export default Home;