"use client";

import "daisyui/dist/full.css";
import AddressSearch from "@/components/AddressSearch";
import DistributionChart from "@/components/DistributionChart";
import DistributionInfo from "@/components/DistributionInfo";
import Leaderboard from "@/components/Leaderboard";
import SlideUp from "@/components/ui/SlideUp";
import useDeposits from "@/hooks/useDeposits";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { sortUserDeposits, fetchPrimeValue } from "../lib/utils";
import { getPrimeBalance } from "../lib/contract";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

ChartJS.register(ArcElement, Tooltip, Legend);

const DEFAULT_PRIME_SUPPLY = 1111111111;

const Home = () => {
	const { allDeposits, error } = useDeposits();
	const [addressInput, setAddressInput] = useState<string>("");
	const [primeBalance, setPrimeBalance] = useState<number>(0);
	const [primeSupply, setPrimeSupply] = useState<number>(DEFAULT_PRIME_SUPPLY);
	const [primeValue, setPrimeValue] = useState<number>(0);
	const [totalStakedValueInUSD, setTotalStakedValueInUSD] = useState<number>(0);
	const [averageWeightedStakingPeriod, setAverageWeightedStakingPeriod] = useState<number>(0);
	const sortedUserDeposits = sortUserDeposits(allDeposits);

	const router = useRouter();

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

		fetchPrimeBalance();

		const getPrimeValue = async () => {
			const value = await fetchPrimeValue();
			setPrimeValue(parseFloat(value));
		};

		getPrimeValue();
	}, []);

	useEffect(() => {
		const totalValue = primeBalance * primeValue;
		setTotalStakedValueInUSD(totalValue);
	}, [primeBalance, primeValue]);

	useEffect(() => {
		let totalWeightedStakingTime = 0;
		let totalStakedAmount = 0;
		let numberOfDeposits = 0;

		sortedUserDeposits.forEach(([user, deposits]) => {
			deposits.forEach(deposit => {
				const stakingTime = deposit.endTimestamp - deposit.createdTimestamp;
				const amount = parseFloat(deposit.amount);
				totalWeightedStakingTime += amount * stakingTime;
				totalStakedAmount += amount;
				numberOfDeposits++;
			});
		});

		const averageWeightedStakingPeriod = totalStakedAmount
			? totalWeightedStakingTime / (numberOfDeposits * totalStakedAmount * 60 * 60 * 24)
			: 0;
		setAverageWeightedStakingPeriod(averageWeightedStakingPeriod);
	}, [sortedUserDeposits]);

	const handleSearch = () => {
		router.push(`/address/${addressInput}`);
	};

	const totalPercentageStaked = (primeBalance / primeSupply) * 100;

	return (
		<div className='flex flex-col items-center min-h-screen mb-10'>
			{error && <p className='text-red-500'>{error}</p>}
			<div className='text-2xl md:text-3xl text-center mt-[15vh] md:mt-[30vh] text-judge-gray-200'>
				<SlideUp delay={0.5}>
					<p className='flex flex-col justify-center items-center md:flex-row '>
						There are currently{" "}
						<span className='text-5xl font-bold md:text-6xl mx-2 text-gradient-transparent'>
							<AnimatedNumber value={primeBalance} />
						</span>{" "}
						$PRIME staked
						<span className='text-2xl md:text-3xl mx-2 text-gradient-transparent font-bold '>
							(<AnimatedNumber value={totalStakedValueInUSD} /> $USD)
						</span>{" "}
					</p>
				</SlideUp>
				<SlideUp delay={1}>
					<p className='flex flex-col justify-center items-center md:flex-row mt-6 mb-8'>
						This is about
						<span className='text-5xl font-bold md:text-6xl mx-2 text-gradient-transparent'>
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
			{sortedUserDeposits.length === 0 && (
				<SlideUp delay={2}>
					<div className='flex flex-col justify-center items-center text-md font-bold text-center mt-4'>
						<p className='text-gradient-transparent mb-4'>Loading more data...</p>
						<div className='animate-spin rounded-full h-16 w-16 border-b-4 border-white-900'></div>
					</div>
				</SlideUp>
			)}
			{sortedUserDeposits.length > 0 && (
				<div className='w-full'>
					<div className='mt-10'>
						<Leaderboard userDeposits={sortedUserDeposits.slice(0, 10)} primeValue={primeValue} />
					</div>
					{Object.keys(allDeposits).length > 0 && (
						<>
							<DistributionInfo
								numberOfAddresses={sortedUserDeposits.length}
								averageWeightedStakingPeriod={averageWeightedStakingPeriod}
							/>
							{/* <SlideUp delay={1}>
								<DistributionChart pieData={pieData} />
							</SlideUp> */}
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default Home;
