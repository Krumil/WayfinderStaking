"use client";

import "daisyui/dist/full.css";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ethers } from "ethers";
import { getPrimeBalance } from "../lib/contract";
import { calculateTotalPoints, sortUserDeposits, fetchPrimeValue } from "../lib/utils";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import SlideUp from "@/components/ui/SlideUp";
import AddressSearch from "@/components/AddressSearch";
import DistributionInfo from "@/components/DistributionInfo";
import DistributionChart from "@/components/DistributionChart";
import useDeposits from "@/hooks/useDeposits";
import Leaderboard from "@/components/Leaderboard";

ChartJS.register(ArcElement, Tooltip, Legend);

const DEFAULT_PRIME_SUPPLY = 1111111111;

const Home = () => {
	const { allDeposits, error } = useDeposits();
	const [addressInput, setAddressInput] = useState<string>("");
	const [primeBalance, setPrimeBalance] = useState<number>(0);
	const [primeSupply, setPrimeSupply] = useState<number>(DEFAULT_PRIME_SUPPLY);
	const [primeValue, setPrimeValue] = useState<number>(0);
	const [totalStakedValueInUSD, setTotalStakedValueInUSD] = useState<number>(0);
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
			setPrimeValue(value);
			console.log(value);
		};

		getPrimeValue();
	}, []);

	// useeffect to calculate the total value in $ of the staked tokens
	useEffect(() => {
		const totalValue = primeBalance * primeValue;
		setTotalStakedValueInUSD(totalValue);
	}, [primeBalance, primeValue]);

	const sortedUserDeposits = sortUserDeposits(allDeposits);
	const totalPoints = sortedUserDeposits.reduce((acc, [, deposits]) => acc + calculateTotalPoints(deposits), 0);
	const totalTokens = 1e9; // 1 billion tokens
	const totalDistributedTokens = 0.4 * totalTokens;

	const pieData = (() => {
		const data: [string, number][] = [];
		let others = 0;

		sortedUserDeposits.forEach(([user, deposits]) => {
			const userPoints = calculateTotalPoints(deposits);
			const userShare = (userPoints / totalPoints) * totalDistributedTokens;
			const percentage = (userShare / totalDistributedTokens) * 100;
			if (percentage < 1) {
				others += userShare;
			} else {
				data.push([user, userShare]);
			}
		});

		if (others > 0) {
			data.push(["Others", others]);
		}

		return data.map(([user, value]) => [
			user === "Others" ? user : `${user.slice(0, 4)}...${user.slice(-4)}`,
			value,
			user
		]);
	})();

	const handleSearch = () => {
		router.push(`/address/${addressInput}`);
	};

	const totalPercentageStaked = (primeBalance / primeSupply) * 100;
	const calculateValidAddress = !ethers.isAddress(addressInput);

	return (
		<div className='flex flex-col items-center min-h-screen'>
			{error && <p className='text-red-500'>{error}</p>}
			<div className='text-3xl  text-center mt-[20vh] md:mt-[30vh] text-judge-gray-200'>
				<SlideUp delay={0.1}>
					<p className='flex flex-col justify-center items-center md:flex-row '>
						There are currently{" "}
						<span className='text-5xl font-bold md:text-6xl mx-2 text-gradient-transparent'>
							<AnimatedNumber value={primeBalance} />
						</span>{" "}
						$PRIME staked
						<span className='text-2xl font-bold md:text-3xl mx-2 text-gradient-transparent'>
							(<AnimatedNumber value={totalStakedValueInUSD} /> $USD)
						</span>{" "}
					</p>
				</SlideUp>
				<SlideUp delay={1.5}>
					<p className='flex flex-col justify-center items-center md:flex-row mt-2 mb-8'>
						This is about
						<span className='text-5xl font-bold md:text-6xl mx-2 text-gradient-transparent'>
							<AnimatedNumber value={totalPercentageStaked} />%
						</span>{" "}
						of the total circulating supply
					</p>
				</SlideUp>
				<SlideUp delay={3}>
					<AddressSearch
						addressInput={addressInput}
						setAddressInput={setAddressInput}
						handleSearch={handleSearch}
						calculateValidAddress={calculateValidAddress}
					/>
				</SlideUp>
			</div>
			{sortedUserDeposits.length === 0 && (
				<SlideUp delay={3.5}>
					<div className='text-md font-bold text-center mt-4'>
						<p className='text-gradient-transparent'>Loading more data...</p>
					</div>
				</SlideUp>
			)}
			{sortedUserDeposits.length > 0 && (
				<div className='w-full'>
					<SlideUp delay={0.1}>
						<div className='my-10'>
							<Leaderboard userDeposits={sortedUserDeposits.slice(0, 10)} primeValue={primeValue} />
						</div>
					</SlideUp>
					{Object.keys(allDeposits).length > 0 && (
						<>
							<SlideUp delay={1}>
								<DistributionInfo numberOfAddresses={sortedUserDeposits.length} />
							</SlideUp>
							<SlideUp delay={1}>
								<DistributionChart pieData={pieData} />
							</SlideUp>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default Home;
