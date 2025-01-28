"use client";

import Dashboard from "@/components/Dashboard";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader/Loader";
import { stakingRewards } from "@/lib/utils";
import { getAddressFromENS, getENSNameFromAddress, fetchENSList } from "@/lib/contract";
import { useParams } from "next/navigation";
import { useAddressesStore } from "@/stores/addresses";

interface Address {
	address: string;
	ensName: string | null;
}

interface ApiResponse {
	prime_amount_cached: number;
	position: number;
	total_users: number;
	addresses_processed: number;
	addresses_found: AddressInfo[];
	addresses_not_found: number;
}

interface AddressInfo {
	address: string;
	data: UserData;
}

const AddressPage = () => {
	const params = useParams<{ address: string }>();
	const [address, setAddress] = useState<Address | null>(null);
	const [fetchedAddress, setFetchedAddress] = useState<boolean>(false);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [totalUsers, setTotalUsers] = useState<number>(0);
	const { allAddressesData } = useAddressesStore();

	useEffect(() => {
		fetchENSList();
	}, []);

	useEffect(() => {
		const fetchGlobalData = async () => {
			try {
				const response = await fetch("/api/data/global");
				if (!response.ok) throw new Error('Failed to fetch global data');
				const data = await response.json();
				setTotalUsers(data.total_addresses);
			} catch (error) {
				console.error('Error fetching global data:', error);
			}
		};

		fetchGlobalData();
	}, []);

	useEffect(() => {
		const fetchAddress = async () => {
			const addressParam = decodeURIComponent(params.address)?.toLowerCase().trim();

			if (addressParam.includes(".eth")) {
				const hexAddress = await getAddressFromENS(addressParam);
				if (hexAddress) {
					setAddress({
						address: hexAddress.toLowerCase(),
						ensName: addressParam.toLowerCase(),
					});
				}
			} else {
				const ensName = await getENSNameFromAddress(addressParam);
				setAddress({
					address: addressParam.toLowerCase(),
					ensName: ensName.toLowerCase() === addressParam.toLowerCase() ? null : ensName.toLowerCase(),
				});
			}
			setFetchedAddress(true);
		};

		fetchAddress();
	}, [params.address]);

	useEffect(() => {
		if (!address) return;

		const fetchUserData = async () => {
			// Check cache first
			const cachedData = allAddressesData.find(item =>
				item.address.toLowerCase() === address.address.toLowerCase()
			);

			if (cachedData) {
				setUserData(cachedData.data);
				return;
			}

			try {
				const response = await fetch("/api/data/addresses", {
					method: "POST",
					body: JSON.stringify({ addresses: [address.address] }),
					headers: { "Content-Type": "application/json" },
				});

				if (!response.ok) throw new Error('Failed to fetch address data');

				const data: ApiResponse = await response.json();
				if (data.addresses_found.length > 0) {
					setUserData(data.addresses_found[0].data);
				}
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchUserData();
	}, [address, allAddressesData]);

	return (
		<div>
			{fetchedAddress &&
				stakingRewards !== 0 &&
				userData ? (
				<div className="flex flex-col h-screen">
					<Dashboard
						userAddresses={[address!.address]}
						userData={userData}
						stakingRewards={stakingRewards}
						addressList={[address!]}
						totalUsers={totalUsers}
					/>
				</div>
			) : (
				<div className="flex justify-center items-center h-screen">
					<Loader />
				</div>
			)}
		</div>
	);
};

export default AddressPage;