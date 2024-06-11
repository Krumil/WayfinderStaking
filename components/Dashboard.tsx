"use client";

import React, { useEffect, useState } from "react";
import { getENSName } from "@/lib/contract"; // Ensure this function exists and is imported correctly
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import SlideUp from "@/components/ui/SlideUp";

interface DashboardProps {
	userAddress: string;
	userDeposits: Deposit[];
	totalDistributedTokens: number;
	allUsersTotalPoints: number;
}

const Dashboard = ({ userAddress, userDeposits, totalDistributedTokens, allUsersTotalPoints }: DashboardProps) => {
	const [error, setError] = useState<string | null>(null);
	const [ensName, setEnsName] = useState<string | null>(null);
	const [totalUserPoints, setTotalUserPoints] = useState<number>(0);
	const [userPercentage, setUserPercentage] = useState<string>("0");
	const [userTokens, setUserTokens] = useState<number>(0);
	const [userTokensInUSD, setUserTokensInUSD] = useState<number>(0);
	const [userTotalStakedTokens, setUserTotalStakedTokens] = useState<number>(0);
	const [fdv, setFdv] = useState<number>(1000);
	const [roi, setRoi] = useState<number>(0);

	useEffect(() => {
		const fetchEnsName = async () => {
			try {
				const name = await getENSName(userAddress);
				setEnsName(name || userAddress);
			} catch (err: any) {
				setError(`Error fetching ENS name: ${err.message}`);
			}
		};

		fetchEnsName();
	}, [userAddress]);

	useEffect(() => {
		const totalPoints = userDeposits.reduce((acc, deposit) => acc + deposit.points, 0);
		const percentage = totalPoints ? ((totalPoints / allUsersTotalPoints) * 100).toPrecision(15) : "0";
		const tokens = (totalPoints / allUsersTotalPoints) * totalDistributedTokens;
		const stakedTokens = userDeposits.reduce((acc, deposit) => acc + parseFloat(deposit.amount), 0);

		setTotalUserPoints(totalPoints);
		setUserPercentage(percentage);
		setUserTokens(tokens);
		setUserTotalStakedTokens(stakedTokens);

		if (fdv > 0) {
			const fdvInUSD = fdv * 1_000_000;
			const promptPrice = fdvInUSD / 1_000_000_000; // 1 billion tokens
			const roiValue = ((tokens * promptPrice) / stakedTokens) * 100;
			setUserTokensInUSD(tokens * promptPrice);
			setRoi(roiValue / 3);
		}
	}, [userDeposits, totalDistributedTokens, allUsersTotalPoints, fdv]);

	const handleFdvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFdv(parseFloat(e.target.value));
	};

	return (
		<div className='max-w-3xl px-4 md:mx-auto'>
			{error && <p className='text-red-500'>{error}</p>}
			{ensName && (
				<div className='bg-gradient-twitter-card rounded-lg shadow-sm text-2xl font-bold flex flex-col justify-center items-start my-auto p-4 md:p-8'>
					<SlideUp delay={0.1}>
						<p className='text-4xl md:text-6xl mb-2 md:mb-4 text-gradient-transparent'>{ensName}</p>
					</SlideUp>
					<SlideUp delay={0.2}>
						<p className='my-4 md:my-8'>
							You have staked{" "}
							<span className='text-gradient-transparent'>
								<AnimatedNumber value={userTotalStakedTokens} />
							</span>{" "}
							$PRIME, netting you{" "}
							<span className='text-gradient-transparent'>
								<AnimatedNumber value={totalUserPoints} />{" "}
							</span>{" "}
							points.
						</p>
					</SlideUp>
					<SlideUp delay={0.3}>
						<p>
							This is{" "}
							<span className='text-gradient-transparent'>{parseFloat(userPercentage).toFixed(5)}% </span>
							of the total points, earning you approximately{" "}
							<span className='text-gradient-transparent'>
								<AnimatedNumber value={userTokens} />
							</span>{" "}
							$PROMPT.
						</p>
					</SlideUp>
				</div>
			)}
			<div>
				{ensName && (
					<div>
						<SlideUp delay={0.4}>
							<div className='flex flex-row items-center justify-center my-8'>
								<label className='text-xl grow text-end'>With a FDV of</label>
								<input
									type='number'
									value={fdv}
									onChange={handleFdvChange}
									className='input input-sm mx-2 !bg-hampton-200 text-judge-gray-800 placeholder-judge-gray-600 w-3/12'
								/>
								<label className='text-xl grow'>millions</label>
							</div>
						</SlideUp>
						<SlideUp delay={0.5}>
							<p className='text-2xl'>
								Those tokens are worth approximately{" "}
								<span className='text-gradient-transparent'>
									<AnimatedNumber value={userTokensInUSD} />
								</span>{" "}
								$USD, with a ROI of <span className='text-gradient-transparent'>{roi.toFixed(2)}%</span>
							</p>
						</SlideUp>
					</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
