"use client";

import React, { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import { useParams } from "next/navigation";
import useDeposits from "@/hooks/useDeposits";
import { calculateTotalPoints } from "@/lib/utils";

const AddressPage = () => {
	const params = useParams<{ address: string }>();
	const address = params.address?.toLowerCase(); // Ensure address is in lowercase
	const { allDeposits, error } = useDeposits();
	const [userDeposits, setUserDeposits] = useState<Deposit[]>([]);
	const [totalDistributedTokens, setTotalDistributedTokens] = useState<number>(0);

	useEffect(() => {
		const distributedTokens = 0.4 * 1_000_000_000;
		setTotalDistributedTokens(distributedTokens);
	}, []);

	useEffect(() => {
		if (allDeposits && address) {
			setUserDeposits(allDeposits[address] || []);
		}
	}, [allDeposits, address]);

	const totalPoints = Object.values(allDeposits).reduce((acc, deposits) => acc + calculateTotalPoints(deposits), 0);

	if (!address) {
		return <p>Address not found</p>;
	}

	return (
		<div>
			{error && <p className='text-red-500'>{error}</p>}
			{address && totalPoints !== 0 && totalDistributedTokens !== 0 ? (
				<div className='flex justify-center items-center h-screen'>
					<Dashboard
						userAddress={address}
						userDeposits={userDeposits}
						totalDistributedTokens={totalDistributedTokens}
						allUsersTotalPoints={totalPoints}
					/>
				</div>
			) : (
				<div className='flex justify-center items-center h-screen'>
					<div className='animate-spin rounded-full h-32 w-32 border-b-4 border-white-900'></div>
				</div>
			)}
		</div>
	);
};

export default AddressPage;
