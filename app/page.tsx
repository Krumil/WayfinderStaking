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
import useSWR from 'swr';

const PAGE_SIZE = 10;

// Fetcher functions
const fetcherWithBalance = async () => {
	const [balance, response] = await Promise.all([
		getPrimeBalance(),
		fetch("/api/data/global")
	]);
	const data = await response.json();
	return {
		balance: balance ? parseFloat(balance) : 0,
		circulatingSupply: data.circulatingSupply || 0
	};
};

const fetcherPrimeValue = async () => {
	const value = await fetchPrimeValue();
	return parseFloat(value);
};

const fetcherAddresses = async (url: string) => {
	const response = await fetch(url);
	const data = await response.json();
	return data;
};

const Home = () => {
	const { allAddressesData, setAllAddressesData } = useAddressesStore();
	const [highlightAddress, setHighlightAddress] = useState<string>("");
	const [showLeaderboard, setShowLeaderboard] = useState(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [hasMore, setHasMore] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
	const leaderboardRef = useRef<HTMLDivElement>(null);

	const router = useRouter();

	// SWR hooks for data fetching
	const { data: primeData, error: primeError } = useSWR('prime-balance', fetcherWithBalance);
	const { data: primeValue, error: valueError } = useSWR('prime-value', fetcherPrimeValue);
	const { data: addressesData, error: addressesError } = useSWR(
		showOnlyFavorites ? null : `/api/data/addresses?page=${currentPage}&pageSize=${PAGE_SIZE}`,
		fetcherAddresses
	);

	// Derived states
	const loading = !primeData || !primeValue || (!addressesData && !showOnlyFavorites) || isLoading;
	const loadingMore = false; // SWR handles loading states
	const hasMoreData = addressesData ? currentPage < addressesData.total_pages : hasMore;
	const primeBalance = primeData?.balance || 0;
	const primeSupply = primeData?.circulatingSupply || 0;
	const totalPercentageStaked = primeSupply > 0 ? (primeBalance / primeSupply) * 100 : 0;
	const totalStakedValueInUSD = primeBalance * (primeValue || 0);

	// Update addresses store when data changes
	useEffect(() => {
		if (addressesData?.data) {
			if (currentPage === 1) {
				setAllAddressesData(addressesData.data);
			} else {
				setAllAddressesData(prev => [...prev, ...addressesData.data]);
			}
		}
	}, [addressesData, currentPage, setAllAddressesData]);

	// Show leaderboard after delay
	useEffect(() => {
		const timer = setTimeout(() => {
			setShowLeaderboard(true);
		}, 2500);
		return () => clearTimeout(timer);
	}, []);

	// Event handlers
	const toggleFavoritesFilter = useCallback((checked: boolean) => {
		setShowOnlyFavorites(checked);
		setCurrentPage(1);
		if (!checked) {
			setAllAddressesData([]);
		}
	}, [setAllAddressesData]);

	const handleLoadMore = useCallback(() => {
		if (!loadingMore && hasMoreData && !showOnlyFavorites) {
			setCurrentPage(prev => prev + 1);
		}
	}, [hasMoreData, loadingMore, showOnlyFavorites]);

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
		setLoading: setIsLoading,
		pageSize: PAGE_SIZE
	});

	// Scroll to highlighted address when it changes
	useEffect(() => {
		if (highlightAddress && !loading) {
			// Give more time for the DOM to update and the virtualized list to render
			setTimeout(() => {
				const highlightedElement = document.getElementById(`address-${highlightAddress}`);
				if (highlightedElement) {
					// First try to use the element's scrollIntoView method
					highlightedElement.scrollIntoView({
						behavior: 'smooth',
						block: 'center'
					});
					
					// Add a visual indicator by adding a temporary class
					highlightedElement.classList.add('highlight-pulse-strong');
					setTimeout(() => {
						highlightedElement.classList.remove('highlight-pulse-strong');
					}, 2000);
				}
			}, 500); // Increased delay to ensure the list has time to render
		}
	}, [highlightAddress, loading]);

	// Show error states if any
	if (primeError || valueError || addressesError) {
		console.error('Error fetching data:', { primeError, valueError, addressesError });
		// You might want to add error UI here
	}

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
							hasMore={hasMoreData}
						/>
					</FadeIn>
				</div>
			)}
		</div>
	);
};

export default Home;