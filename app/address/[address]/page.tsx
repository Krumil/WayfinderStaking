"use client";

import React, { use, useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import { useParams } from "next/navigation";
import { getAddressFromENS, getENSNameFromAddress } from "@/lib/contract";
import { calculateTotalPoints, stakingRewards } from "@/lib/utils";
import useDeposits from "@/hooks/useDeposits";

const AddressPage = () => {
	const params = useParams<{ address: string }>();
	const { allDeposits, error } = useDeposits();
	const [userDeposits, setUserDeposits] = useState<Deposit[]>([]);
	const [address, setAddress] = useState<string | null>(null);
	const [ensName, setEnsName] = useState<string | null>(null);
	const [fetchedEnsName, setFetchedEnsName] = useState<Boolean>(false);

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
			}
		};

		fetchAddress();
	}, [params]);

	useEffect(() => {
		if (allDeposits && address) {
			setUserDeposits(allDeposits[address.toString()] || []);
		}
	}, [allDeposits, address]);

	const totalPoints = Object.values(allDeposits).reduce((acc, deposits) => acc + calculateTotalPoints(deposits), 0);

	return (
		<div>
			{error && <p className='text-red-500'>{error}</p>}
			{address && fetchedEnsName && totalPoints !== 0 && stakingRewards !== 0 ? (
				<div className='flex justify-center items-center h-screen'>
					<Dashboard
						userAddress={address}
						userDeposits={userDeposits}
						stakingRewards={stakingRewards}
						allUsersTotalPoints={totalPoints}
						ensName={ensName || address}
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
