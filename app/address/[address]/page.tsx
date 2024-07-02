"use client";

import Dashboard from "@/components/Dashboard";
import React, { useEffect, useState } from "react";
// import useDeposits from "@/hooks/useDeposits";

import { stakingRewards } from "@/lib/utils";
import { getAddressFromENS, getENSNameFromAddress } from "@/lib/contract";
import { useParams } from "next/navigation";

const AddressPage = () => {
	const params = useParams<{ address: string }>();
	// const { allDeposits, error } = useDeposits();
	// const [userDeposits, setUserDeposits] = useState<Deposit[]>([]);
	const [address, setAddress] = useState<string | null>(null);
	const [ensName, setEnsName] = useState<string | null>(null);
	const [fetchedEnsName, setFetchedEnsName] = useState<Boolean>(false);
	const [totalScore, setTotalScore] = useState<number>(0);
	const [userData, setUserData] = useState<UserData | null>(null);

	useEffect(() => {
		const fetchAddress = async () => {
			const addressParam = params.address?.toLowerCase();
			if (addressParam && addressParam.includes(".eth")) {
				const hexAddress = await getAddressFromENS(addressParam);
				if (!hexAddress) {
					setAddress(null);
					return;
				}
				setAddress(hexAddress.toLowerCase());
				setEnsName(addressParam.toLowerCase());
				setFetchedEnsName(true);
			}

			if (addressParam && !addressParam.includes(".eth")) {
				const ensName = await getENSNameFromAddress(addressParam);
				setAddress(addressParam.toLowerCase());
				setEnsName(ensName.toLowerCase());
				setFetchedEnsName(true);
			}
		};

		const fetchTotalScore = async () => {
			const response = await fetch("/api/data/global");
			const data = await response.json();
			setTotalScore(data.total_score);
		};

		fetchTotalScore();
		fetchAddress();
	}, [address, params.address]);

	useEffect(() => {
		if (!address) {
			return;
		}
		const fetchUserData = async () => {
			const response = await fetch("/api/data", {
				method: "POST",
				body: JSON.stringify({ address: address }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			setUserData(data);
		};
		fetchUserData();
	}, [address]);

	// useEffect(() => {
	// 	if (allDeposits && address && ethers.isAddress(address)) {
	// 		setUserDeposits(allDeposits[address.toLowerCase()] || []);
	// 	}
	// }, [allDeposits, address]);

	return (
		<div>
			{address &&
			fetchedEnsName &&
			totalScore !== 0 &&
			stakingRewards !== 0 &&
			userData ? (
				<div className="flex flex-col h-screen">
					<Dashboard
						userAddress={address}
						userData={userData}
						// userDeposits={userDeposits}
						stakingRewards={stakingRewards}
						allUsersTotalScores={totalScore}
						ensName={ensName || address}
					/>
				</div>
			) : (
				<div className="flex justify-center items-center h-screen">
					<div className="animate-spin rounded-full h-32 w-32 border-b-4 border-white-900"></div>
				</div>
			)}
		</div>
	);
};

export default AddressPage;
