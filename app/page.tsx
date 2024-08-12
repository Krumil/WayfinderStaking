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
import { getPrimeBalance, fetchENSList } from "@/lib/contract";
import { useAddressesStore } from "@/stores/addresses";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_PRIME_SUPPLY = 1111111111;

const Home = () => {
	const { allAddressesData, setAllAddressesData } = useAddressesStore();
	const [highlightAddress, setHighlightAddress] = useState<string>("");
	const [highlightKey, setHighlightKey] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);
	const [primeBalance, setPrimeBalance] = useState<number>(0);
	const [primeSupply, setPrimeSupply] = useState<number>(DEFAULT_PRIME_SUPPLY);
	const [primeValue, setPrimeValue] = useState<number>(0);
	const [showLeaderboard, setShowLeaderboard] = useState(false);
	const [totalPercentageStaked, setTotalPercentageStaked] = useState<number>(0);
	const [totalStakedValueInUSD, setTotalStakedValueInUSD] = useState<number>(0);
	const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
	const leaderboardRef = useRef<HTMLDivElement>(null);

	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowLeaderboard(true);
		}, 2500);

		fetchENSList();
		return () => clearTimeout(timer);
	}, []);

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

	const fetchAddressesData = useCallback(async () => {
		try {
			const response = await fetch("/api/data/addresses");
			const data = await response.json();
			setAllAddressesData(data);
			setLoading(false);
		} catch (err) {
			console.error("Error fetching addresses data:", err);
			setLoading(false);
		}
	}, [setAllAddressesData]);

	useEffect(() => {
		setLoading(true);
		fetchPrimeBalance();
		getPrimeValue();
		if (allAddressesData.length === 0) {
			fetchAddressesData();
		} else {
			setLoading(false)
		}
	}, [fetchPrimeBalance, getPrimeValue, fetchAddressesData, allAddressesData]);

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

	const handleSearchPosition = useCallback((address: string) => {
		setShowOnlyFavorites(false);
		setTimeout(() => {
			if (leaderboardRef.current) {
				leaderboardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
			setHighlightAddress(address);
			setHighlightKey(prevKey => prevKey + 1);
		}, 100);
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
			{!loading && allAddressesData.length > 0 && showLeaderboard && (
				<SlideUp>
					<div ref={leaderboardRef} className="w-full">
						<Leaderboard
							addressesData={allAddressesData}
							addressToHighlight={highlightAddress}
							highlightKey={highlightKey}
							showOnlyFavorites={showOnlyFavorites}
						/>
					</div>
				</SlideUp>
			)}
		</div>
	);
};

export default Home;