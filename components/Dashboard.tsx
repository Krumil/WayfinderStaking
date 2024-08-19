"use client";

import React, { useEffect, useState } from "react";
import CardStack from "@/components/CardStack";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import AnimatedTitle from "@/components/AnimatedTitle";
import {
	promptSupply,
	fetchPrimeValue,
	formatNumberWithCommas,
} from "@/lib/utils";

interface AddressData {
	address: string;
	ensName: string | null;
}

interface DashboardProps {
	userAddresses: string[];
	userData: UserData | null;
	stakingRewards: number;
	addressList: AddressData[];
}

const Dashboard = ({
	userAddresses,
	userData,
	stakingRewards,
	addressList,
}: DashboardProps) => {
	const [fullyDiluitedValue, setFullyDiluitedValue] = useState<number>(1000);
	const [primePrice, setPrimePrice] = useState<number>(0);
	const [roi, setRoi] = useState<number>(0);
	const [userEarnedPromptTokens, setUserEarnedPromptTokens] = useState<number>(0);
	const [userEarnedPromptTokensInUSD, setUserEarnedPromptTokensInUSD] = useState<number>(0);
	const [userPercentage, setUserPercentage] = useState<string>("0");
	const [userPrimeCached, setUserPrimeCached] = useState<number>(0);

	const isMultipleAddresses = userAddresses.length > 1;

	useEffect(() => {
		const getPrimeValue = async () => {
			const value = await fetchPrimeValue();
			setPrimePrice(parseFloat(value));
		};

		getPrimeValue();
	}, []);

	useEffect(() => {
		if (!userData) return;

		const tokens = (userData.percentage / 100) * stakingRewards;
		setUserPrimeCached(userData.total_prime_cached / 1_000_000_000_000_000_000);
		setUserPercentage(userData.percentage.toPrecision(2));
		setUserEarnedPromptTokens(tokens);

		if (fullyDiluitedValue > 0) {
			const fullyDiluitedValueInUSD = fullyDiluitedValue * 1_000_000;
			const promptPrice = fullyDiluitedValueInUSD / promptSupply;
			const stakedValue = userPrimeCached * primePrice;
			const roiValue = ((tokens * promptPrice) / stakedValue) * 100;
			setUserEarnedPromptTokensInUSD(tokens * promptPrice);
			setRoi(roiValue);
		}
	}, [userData, stakingRewards, fullyDiluitedValue, primePrice, userPrimeCached]);

	const handleFdvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFullyDiluitedValue(parseFloat(e.target.value));
	};

	const formatPercentage = (percentage: string) => {
		const float = parseFloat(percentage);
		return float > 0.01 ? float.toFixed(2) : float.toPrecision(2);
	};

	function getOrdinalSymbol(number: number) {
		const j = number % 10,
			k = number % 100;
		if (j == 1 && k != 11) return "st";
		if (j == 2 && k != 12) return "nd";
		if (j == 3 && k != 13) return "rd";
		return "th";
	}

	const getAddressText = () => {
		return isMultipleAddresses ? "These addresses have" : "This address has";
	};

	const getEarningText = () => {
		return isMultipleAddresses ? "Combined, they are" : "This address is";
	};

	const stackCards = [
		{
			title: <AnimatedTitle addressList={addressList} linkedAddresses={userData?.secondary_addresses || []} />,
			content: (
				<div className="w-full rounded-lg shadow-sm text-xl md:text-2xl flex flex-col justify-between items-start">
					<div className="mb-4 md:my-5 w-full">
						<div className="w-full">
							{getAddressText()} staked a total of{" "}
							<span className="md:text-3xl text-gradient-transparent">
								<AnimatedNumber value={userPrimeCached || 0} />
							</span>{" "}
							$PRIME, giving a {isMultipleAddresses ? "combined " : ""}Contribution Score of{" "}
							<span className="md:text-3xl text-gradient-transparent">
								<AnimatedNumber value={userData?.total_score || 0} />
							</span>{" "}
						</div>
					</div>
					<p>
						{getEarningText()} earning{" "}
						<span className="md:text-3xl">
							{formatPercentage(userPercentage)}%{" "}
						</span>
						of the total score, which is{" "}
						<span className="md:text-3xl">
							<AnimatedNumber value={userEarnedPromptTokens} />
						</span>{" "}
						$PROMPT.
					</p>
					<div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-sm md:text-base bg-transparent mb-2 text-gradient-transparent">
						<div className="flex justify-end items-end text-3xl leading-none">
							<div>{userData?.position || 0}</div>
							<sup className="text-xs text-gradient-transparent self-start">
								{getOrdinalSymbol(userData?.position || 0)}
							</sup>
							<span className="text-sm">/ {userData?.total_users || 0}</span>
						</div>
					</div>
				</div>
			),
		},
		{
			title: <div>ROI</div>,
			content: (
				<div className="text-xl md:text-2xl">
					<div className="flex flex-col md:flex-row items-center md:items-start justify-between my-6">
						<div>Speculative FDV (in millions): </div>
						<input
							type="number"
							value={fullyDiluitedValue}
							onChange={handleFdvChange}
							className="input input-sm !z-50 mt-6 md:mt-0 !bg-hampton-200 text-md text-judge-gray-800 placeholder-judge-gray-600 w-4/12 md:w-3/12 text-center md:text-right"
						/>
					</div>
					<div>
						The {isMultipleAddresses ? "combined " : ""}
						<span className="text-3xl">
							{formatNumberWithCommas(userEarnedPromptTokens)}{" "}
						</span>
						tokens will be worth{" "}
						<span className="text-gradient-transparent text-3xl">
							<AnimatedNumber value={userEarnedPromptTokensInUSD} />
						</span>{" "}
						$USD, with an average ROI of{" "}
						<span className="text-gradient-transparent text-3xl">
							{roi.toFixed(2)}%
						</span>
					</div>
				</div>
			),
		},
		{
			title: <div>{isMultipleAddresses ? "Addresses Info" : "Address Info"}</div>,
			content: (
				<div className="text-base">
					<div className="flex flex-row items-center justify-between my-2">
						{isMultipleAddresses ? "Total Inactive" : "Inactive"} Referrals:
						<span>
							<AnimatedNumber value={userData?.extra.inactive_referrals || 0} />
						</span>
					</div>
					<div className="flex flex-row items-center justify-between my-2">
						{isMultipleAddresses ? "Total Users" : "Users"} Referred:{" "}
						<span>
							<AnimatedNumber value={userData?.users_referred || 0} />
						</span>
					</div>
					<div className="flex flex-row items-center justify-between my-2">
						{isMultipleAddresses ? "Total Prime" : "Prime"} Held Duration:{" "}
						<span>
							<AnimatedNumber
								value={userData ? userData.prime_held_duration / 86400 : 0}
							/>{" "}
							days
						</span>
					</div>
					<div className="flex flex-row items-center justify-between my-2">
						Longest Caching Time:{" "}
						<span>
							<AnimatedNumber value={userData?.longest_caching_time || 0} />{" "}
							days
						</span>
					</div>
					<div className="flex flex-row items-center justify-between my-2">
						{isMultipleAddresses ? "Total Echelon" : "Echelon"} Governance Participation:{" "}
						<span>
							<AnimatedNumber
								value={userData?.echelon_governance_participation || 0}
							/>
						</span>
					</div>
					<div className="flex flex-row items-center justify-between my-2">
						Held Prime Before Unlock:{" "}
						<span>
							{userData?.held_prime_before_unlock ? "Yes" : "No"}
						</span>
					</div>
					<div className="flex flex-row items-center justify-between my-2">
						Participated in Prime Unlock Vote:{" "}
						<span>
							{userData?.participated_in_prime_unlock_vote ? "Yes" : "No"}
						</span>
					</div>
					<div className="flex flex-row items-center justify-between my-2">
						Avatar Count:{" "}
						<span>
							<AnimatedNumber
								value={userData?.avatar_count || 0}
							/>
						</span>
					</div>
				</div>
			),
		},
	];

	return <div>{userData && <CardStack cards={stackCards} />}</div>;
};

export default Dashboard;