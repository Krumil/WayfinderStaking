"use client";

import "daisyui/dist/full.css";
import AddressSearch from "@/components/AddressSearch";
// import DistributionChart from "@/components/DistributionChart";
// import DistributionInfo from "@/components/DistributionInfo";
import Leaderboard from "@/components/Leaderboard";
import SlideUp from "@/components/ui/SlideUp";

import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchPrimeValue } from "../lib/utils";
import { getPrimeBalance } from "../lib/contract";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

ChartJS.register(ArcElement, Tooltip, Legend);

const DEFAULT_PRIME_SUPPLY = 1111111111;

const Home = () => {
	const [addressInput, setAddressInput] = useState<string>("");
	const [addressesData, setAddressesData] = useState<any[]>([]);
	const [averageWeightedStakingPeriod, setAverageWeightedStakingPeriod] =
		useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);
	const [primeBalance, setPrimeBalance] = useState<number>(0);
	const [primeSupply, setPrimeSupply] = useState<number>(DEFAULT_PRIME_SUPPLY);
	const [primeValue, setPrimeValue] = useState<number>(0);
	const [showLeaderboard, setShowLeaderboard] = useState(false);
	const [totalPercentageStaked, setTotalPercentageStaked] = useState<number>(0);
	const [totalStakedValueInUSD, setTotalStakedValueInUSD] = useState<number>(0);
	const [unlockData, setUnlockData] = useState<UnlockData>({
		months: [],
		amounts: [],
	});

	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowLeaderboard(true);
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		const fetchPrimeBalance = async () => {
			try {
				const balance = await getPrimeBalance();
				setPrimeBalance(parseFloat(balance));

				const response = await fetch("/api");
				const data = await response.json();
				setPrimeSupply(data.circulatingSupply);
			} catch (err: any) {
				console.error(err);
			}
		};

		const getPrimeValue = async () => {
			const value = await fetchPrimeValue();
			setPrimeValue(parseFloat(value));
		};

		const fetchAddressesData = async () => {
			try {
				const response = await fetch("/api/data");
				const data = await response.json();
				setAddressesData(data);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching addresses data:", err);
				setLoading(false);
			}
		};

		fetchPrimeBalance();
		getPrimeValue();
		fetchAddressesData();
	}, []);

	useEffect(() => {
		const totalPercentageStaked = (primeBalance / primeSupply) * 100;
		setTotalPercentageStaked(totalPercentageStaked);
	}, [primeBalance, primeSupply]);

	useEffect(() => {
		const totalValue = primeBalance * primeValue;
		setTotalStakedValueInUSD(totalValue);
	}, [primeBalance, primeValue]);

	const handleSearch = () => {
		router.push(`/address/${addressInput}`);
	};

	return (
		<div className="flex flex-col items-center min-h-screen mb-10">
			<div className="text-2xl md:text-3xl mt-[15vh] md:mt-[30vh] text-judge-gray-200">
				<SlideUp delay={0.5}>
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
				<SlideUp delay={1}>
					<p className="flex flex-col justify-center items-center md:flex-row mt-6 mb-8">
						This is about
						<span className="text-5xl font-bold md:text-6xl mx-2 text-gradient-transparent">
							<AnimatedNumber value={totalPercentageStaked} precision={2} />%
						</span>{" "}
						of the total circulating supply
					</p>
				</SlideUp>
				<SlideUp delay={1.5}>
					<AddressSearch
						addressInput={addressInput}
						setAddressInput={setAddressInput}
						handleSearch={handleSearch}
					/>
				</SlideUp>
			</div>
			{loading && (
				<SlideUp delay={2}>
					<div className="flex flex-col justify-center items-center text-md font-bold text-center mt-4">
						<p className="text-gradient-transparent mb-4">
							Loading more data...
						</p>
						<div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white-900"></div>
					</div>
				</SlideUp>
			)}
			{!loading && addressesData.length > 0 && showLeaderboard && (
				<SlideUp delay={0.5} duration={1}>
					<div className="w-full">
						<div className="mt-10">
							<Leaderboard addressesData={addressesData} />
						</div>
					</div>
				</SlideUp>
			)}
		</div>
	);
};

export default Home;
