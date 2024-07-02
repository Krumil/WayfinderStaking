"use client";

import SlideUp from "@/components/ui/SlideUp";
import { useRouter } from "next/navigation";
import { getENSNameFromAddress } from "@/lib/contract";
import { formatNumberWithCommas } from "@/lib/utils";
import { useEffect, useState } from "react";
interface LeaderboardProps {
	addressesData: any[];
}

const Leaderboard = ({ addressesData }: LeaderboardProps) => {
	const router = useRouter();
	const [topAddresses, setTopAddresses] = useState<any[]>([]);

	const handleClick = (address: string) => {
		router.push(`/address/${address}`);
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

		const primeScore = scores.prime_score + baseScores.prime_score;
		const communityScore = scores.community_score + baseScores.community_score;
		const initializationScore =
			scores.initialization_score + baseScores.initialization_score;

		return primeScore + communityScore + initializationScore;
	};

	useEffect(() => {
		const fetchTopAddresses = async () => {
			// Create sorted list of addresses based on total score
			const sortedAddresses = addressesData.sort(
				(a, b) => calculateTotalScore(b.data) - calculateTotalScore(a.data)
			);
			const top10Addresses = sortedAddresses.slice(0, 10);

			// Fetch ENS names for all addresses concurrently
			const addressesWithENS = await Promise.all(
				top10Addresses.map(async (item) => {
					const ensName = await getENSNameFromAddress(item.address, true);
					return {
						...item,
						name: ensName || item.address,
					};
				})
			);

			setTopAddresses(addressesWithENS);
		};

		fetchTopAddresses();
	}, [addressesData]);

	return (
		<div className="p-4 max-w-4xl mx-auto">
			<h2 className="text-2xl font-bold flex justify-center mb-4">
				Top Stakers
			</h2>
			<div className="grid grid-cols-1 gap-4">
				{topAddresses.map((item, index) => (
					<SlideUp key={index} delay={index * 0.3 + 0.5}>
						<div
							className="p-4 border rounded-lg shadow-sm flex flex-row justify-between items-center cursor-pointer"
							onClick={() => handleClick(item.address)}
						>
							<div>
								<div className="text-2xl">{item.name}</div>
							</div>
							<div className="text-end text-xl font-bold">
								{formatNumberWithCommas(calculateTotalScore(item.data))} CS
							</div>
							{item.prime_amount_cached && (
								<div className="text-judge-gray-200 text-sm md:text-xl">
									{item.prime_amount_cached.toFixed(2).toLocaleString()} $PRIME
								</div>
							)}
						</div>
					</SlideUp>
				))}
			</div>
		</div>
	);
};

export default Leaderboard;
